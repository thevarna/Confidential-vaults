import { ethers } from "ethers";
import {
  TransactionFetcher,
  TransactionFetcherConfig,
} from "./TransactionFetcher";
import { DECIMALS, orderManagerAbi } from "@/lib/constants";
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

type TxnHistoryRequest = {
  userAddress: string;
  networkUrl: string;
};

type UserTxnData = {
  amount: string;
  from: string;
  to: string;
  timestamp: number;
  hash: string;
};

export const maxDuration = 300;
const USDC_ENC_ORDER_MANAGER_ADDRESS: string = process.env
  .NEXT_PUBLIC_USDC_ENC_ORDER_MANAGER_ADDRESS as string;
const ENC_USDC_ORDER_MANAGER_ADDRESS: string = process.env
  .NEXT_PUBLIC_ENC_USDC_ORDER_MANAGER_ADDRESS as string;
const EENC_WRAPPER: string = process.env.NEXT_PUBLIC_EENC_WRAPPER_ADDRESS as string;
const EUSDC_WRAPPER: string = process.env.NEXT_PUBLIC_EUSDC_WRAPPER_ADDRESS as string;
const RELAYER_ADDRESS_USDC_ENC: string = process.env.NEXT_PUBLIC_USDC_ENC_RELAYER_ADDRESS as string;
const RELAYER_ADDRESS_ENC_USDC: string = process.env.NEXT_PUBLIC_ENC_USDC_RELAYER_ADDRESS as string;

const decrypt = async (handle: string) => {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/decrypt`, {
      method: "POST",
      body: JSON.stringify({ handle }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(await response.text());
    const decryptedValue = await response.json();
    return decryptedValue;
  } catch (error) {
    console.error("Error decrypting", error);
    return "0";
  }
};

const MONGODB_URI = process.env.MONGODB_URI!;
const DATABASE_NAME = process.env.DB_NAME || "database";
const COLLECTION_NAME = "transactions";

const client = new MongoClient(MONGODB_URI);

/**
 * Helper to merge two arrays of transactions without duplicating items.
 * Uses the transaction hash as the unique key.
 */
const mergeTransactions = (
  existing: UserTxnData[],
  incoming: UserTxnData[]
): UserTxnData[] => {
  // Create a unique key combining hash and from address
  const getUniqueKey = (tx: UserTxnData) => `${tx.hash}-${tx.from}`;

  const txMap = new Map<string, UserTxnData>();
  existing.forEach((tx) => txMap.set(getUniqueKey(tx), tx));
  incoming.forEach((tx) => txMap.set(getUniqueKey(tx), tx));
  return Array.from(txMap.values()).sort((a, b) => b.timestamp - a.timestamp);
};

// Utility to normalize Ethereum addresses to lowercase
const normalizeAddress = (address: string) =>
  address?.toLowerCase().trim();

export async function POST(req: Request) {
  const { userAddress, networkUrl }: TxnHistoryRequest = await req.json();
  console.log("[DEBUG] Received request", { userAddress, networkUrl });

  try {
    const config: TransactionFetcherConfig = { providerUrl: networkUrl };
    const iface = new ethers.Interface(orderManagerAbi);
    const senderAddress = userAddress;
    const fetcher = new TransactionFetcher(config);

    // Fetch transactions for various contracts
    const usdcEncTransactions = await fetcher.getTransactions(
      USDC_ENC_ORDER_MANAGER_ADDRESS,
      senderAddress,
      0,
      null
    );
    const encUsdcTransactions = await fetcher.getTransactions(
      ENC_USDC_ORDER_MANAGER_ADDRESS,
      senderAddress,
      0,
      null
    );
    const eencWrapperTransactions = await fetcher.getTransactions(
      EENC_WRAPPER,
      RELAYER_ADDRESS_ENC_USDC,
      0,
      null
    );
    const eusdcWrapperTransactions = await fetcher.getTransactions(
      EUSDC_WRAPPER,
      RELAYER_ADDRESS_USDC_ENC,
      0,
      null
    );

    const allTransactions = [
      ...usdcEncTransactions,
      ...encUsdcTransactions,
      ...eusdcWrapperTransactions,
      ...eencWrapperTransactions,
    ];
    console.log("[DEBUG] Total transactions fetched:", allTransactions.length);

    // Filter transactions by status and by target addresses (normalize address comparisons)
    const sortedTransactions = allTransactions
      .filter((txn) => txn.status === "Success")
      .filter(
        (txn) =>
          // Original order manager transactions
          (txn.to === USDC_ENC_ORDER_MANAGER_ADDRESS ||
            txn.to === ENC_USDC_ORDER_MANAGER_ADDRESS ||
            txn.to === EUSDC_WRAPPER ||
            txn.to === EENC_WRAPPER) ||
          // Relayer transactions
          (txn.from === RELAYER_ADDRESS_USDC_ENC ||
            txn.from === RELAYER_ADDRESS_ENC_USDC)
      )
      .sort((txn1, txn2) => txn2.blockNumber - txn1.blockNumber);

    console.log("[DEBUG] Sorted transactions count:", sortedTransactions.length);

    let txnData: UserTxnData[] = [];
    for (let i = 0; i < sortedTransactions.length; i++) {
      const txn = sortedTransactions[i];
      console.log("[DEBUG] Processing txn", { hash: txn.hash, type: txn.type });
      let userTxnData: UserTxnData;
      if (txn.type === "PLACE_ORDER") {
        const decoded = iface.parseTransaction({ data: txn.data });
        const handle = BigInt(decoded?.args[1]);
        const amount = await decrypt(handle.toString());
        console.log("[DEBUG] Decrypted amount for PLACE_ORDER", { hash: txn.hash, decrypted: amount });
        userTxnData = {
          amount: ethers.formatUnits(amount, DECIMALS),
          from: txn.from,
          to: txn.to,
          timestamp: txn.timestamp,
          hash: txn.hash,
        };
        txnData.push(userTxnData);
      } else {
        // For non-place orders (swap etc)
        const amount = await decrypt(BigInt(txn.amount)?.toString());
        console.log("[DEBUG] Decrypted amount for txn", { hash: txn.hash, decrypted: amount });
        userTxnData = {
          amount: ethers.formatUnits(amount, DECIMALS),
          from: txn.from,
          to: txn.to,
          timestamp: txn.timestamp,
          hash: txn.hash,
        };
        txnData.push(userTxnData);
      }
    }
    console.log("[DEBUG] Prepared txnData array with", txnData.length, "entries");

    if (!txnData || txnData.length === 0) {
      console.log("No new transaction data to update. Skipping update.");
      return NextResponse.json({ txnData, message: "No new transactions" });
    }

    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const existingDoc = await collection.findOne({ wallet: userAddress });
    console.log("[DEBUG] Existing document:", existingDoc);

    let updatedTxnData: UserTxnData[];
    if (existingDoc) {
      // Merge new transactions into existing ones so that older data isn't lost.
      updatedTxnData = mergeTransactions(existingDoc.txnData || [], txnData);
      if (JSON.stringify(existingDoc.txnData) === JSON.stringify(updatedTxnData)) {
        console.log("Transaction data unchanged after merging. Skipping update.");
        return NextResponse.json({
          txnData: updatedTxnData,
          message: "No updates required"
        });
      }
    } else {
      // If no document is found, use the new transaction data
      updatedTxnData = txnData;
    }

    const updateResult = await collection.updateOne(
      { wallet: userAddress },
      { $set: { wallet: userAddress, txnData: updatedTxnData, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log("[DEBUG] Database update result:", updateResult);

    return NextResponse.json({ txnData: updatedTxnData });
  } catch (error: any) {
    console.error("[ERROR] in POST /api/transactions", { error: error.message });
    throw new Error(error.message);
  }
}
