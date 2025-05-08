import { ethers } from "ethers";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  data: string;
  amount: string;
  value: string;
  gasUsed: string;
  blockNumber: number;
  timestamp: number;
  status: "Success" | "Failed";
  type: "PLACE_ORDER" | "WITHDRAW_TCB"
}

export interface TransactionFetcherConfig {
  providerUrl: string;
}

const DISBURSEMENT_TOPIC_HASH_EUSDT =
  "0x2d9872944dd7b4c730a8217ddf85e6d5f1263f81afaec4b7f7f641b69cb61388";
const DISBURSEMENT_TOPIC_HASH_EUSDC =
  "0x2d9872944dd7b4c730a8217ddf85e6d5f1263f81afaec4b7f7f641b69cb61388";

export class TransactionFetcher {
  private provider: ethers.JsonRpcProvider;

  constructor(config: TransactionFetcherConfig) {
    this.provider = new ethers.JsonRpcProvider(config.providerUrl);
  }

  /**
   * Fetches all transactions between a sender and a contract
   * @param contractAddress - The smart contract address
   * @param senderAddress - The sender's address
   * @param startBlock - Starting block number (default: 0)
   * @param endBlock - Ending block number (null for latest block)
   * @returns Promise<Transaction[]> Array of formatted transactions
   */
  public async getTransactions(
    contractAddress: string,
    senderAddress: string,
    startBlock: number = 0,
    endBlock: number | null = null
  ): Promise<Transaction[]> {
    try {
      // Input validation
      if (!ethers.isAddress(contractAddress) || !ethers.isAddress(senderAddress)) {
        throw new Error("Invalid Ethereum address provided");
      }

      // Get the latest block
      const latestBlock = await this.provider.getBlockNumber();

      // Set start block to be ~100 blocks ago (approximately 30 mins with 2s block time)
      const defaultStartBlock = Math.max(latestBlock - 100, 0);

      const finalStartBlock = startBlock === 0 ? defaultStartBlock : Math.max(startBlock, defaultStartBlock);
      const finalEndBlock = endBlock === null ? latestBlock : endBlock;

      // Create filter for the transactions
      const paddedAddress = ethers.zeroPadValue(senderAddress, 32);
      console.log("paddedAddress", paddedAddress);
      const filter = {
        address: contractAddress,
        topics: [
          null, // Match any event signature
          paddedAddress, // Filter for sender address
        ],
        fromBlock: finalStartBlock,
        toBlock: finalEndBlock,
      };

      // Get all matching logs
      const logs = await this.provider.getLogs(filter);
      console.log("Found logs:", logs.length);

      // Process and format transactions
      const formattedTransactions = await Promise.all(
        logs.map(async (log) => {
          const tx = await this.provider.getTransactionReceipt(log.transactionHash);
          if (!tx) {
            throw new Error(`Failed to fetch transaction data for hash: ${log.transactionHash}`);
          }

          const block = await this.provider.getBlock(tx.blockNumber);
          const data = await this.getTransactionData(tx.hash);

          // Check if this is a disbursement event
          const isDisbursement = tx.logs.some(
            (log) =>
              log.topics[0] === DISBURSEMENT_TOPIC_HASH_EUSDC ||
              log.topics[0] === DISBURSEMENT_TOPIC_HASH_EUSDT
          );

          // Get the amount from the relevant log
          const relevantLog = tx.logs.find(
            (log) =>
              log.topics[0] === DISBURSEMENT_TOPIC_HASH_EUSDC ||
              log.topics[0] === DISBURSEMENT_TOPIC_HASH_EUSDT &&
              log.topics[1] === paddedAddress // Make sure the log is for our sender
          );

          return {
            hash: tx.hash,
            from: tx.from,
            to: tx.to || "",
            data: data,
            amount: relevantLog?.data || "",
            value: "0",
            gasUsed: tx.gasUsed.toString(),
            blockNumber: tx.blockNumber,
            timestamp: block?.timestamp || 0,
            status: tx.status === 1 ? "Success" : "Failed",
            type: isDisbursement ? "WITHDRAW_TCB" : "PLACE_ORDER"
          } as Transaction;
        })
      );

      return formattedTransactions;
    } catch (error) {
      console.error("Error in getTransactions:", error);
      throw new Error(
        `Error fetching transactions: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Gets the value (in wei) for a specific transaction
   * @param txHash - Transaction hash
   * @returns Promise<bigint> Transaction value in wei
   */
  private async getTransactionData(txHash: string): Promise<string> {
    const tx = await this.provider.getTransaction(txHash);
    if (!tx) {
      throw new Error(`Transaction not found: ${txHash}`);
    }
    return tx.data;
  }

  /**
   * Get transaction details in batch
   * @param txHashes - Array of transaction hashes
   * @returns Promise<ethers.TransactionResponse[]> Array of transaction responses
   */
  public async getTransactionBatch(txHashes: string[]) {
    return await Promise.all(
      txHashes.map(async (hash) => {
        let txnResponse = await this.provider.getTransaction(hash);
        console.log(txnResponse);
      })
    );
  }
}
