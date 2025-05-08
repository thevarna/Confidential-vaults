import { MongoClient } from "mongodb";
require('dotenv').config();

// URL for fetching transaction data
// const API_URL = process.env.API_URL || "http://localhost:3000/api/transactions";
const API_URL = process.env.API_URL || "https://monad.encifher.io/api/transactions";
// URL for fetching all users (wallet addresses)
// const USERS_API_URL = process.env.USERS_API_URL || "http://localhost:3000/api/users";
const USERS_API_URL = process.env.USERS_API_URL || "https://monad.encifher.io/api/users";
// Network RPC URL to use when fetching transactions (adjust as needed)
const NETWORK_URL = process.env.NEXT_PUBLIC_MONAD_RPC_URL || "https://rpc-testnet.monadinfra.com/rpc/yGAGV1mWiVUsKTarAx1sSwfrqpSNY0yt";

// MongoDB settings (if you need to further update the DB in this script)
const MONGODB_URI = process.env.MONGODB_URI!;
const DATABASE_NAME = process.env.DB_NAME || "database";
const COLLECTION_NAME = "transactions";

// Function to update transactions for a single wallet by calling your /api/transactions endpoint
async function updateTransactionsForWallet(wallet: string) {
  const payload = {
    userAddress: wallet,
    networkUrl: NETWORK_URL,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update transactions for wallet ${wallet}: ${errorText}`);
      return;
    }

    const data = await response.json();
    console.log(`Transactions updated for wallet ${wallet}:`, data);
  } catch (error) {
    console.error(`Error updating transactions for wallet ${wallet}:`, error);
  }
}

async function fetchTransactionsAndUpdateDB() {
  try {
    const usersResponse = await fetch(USERS_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!usersResponse.ok) {
      const errorText = await usersResponse.text();
      console.error("Failed to fetch users:", errorText);
      return;
    }

    const usersJson = await usersResponse.json();
    const users = usersJson.users || [];

    for (const user of users) {
      console.log("user", user);
      const wallet = user.wallet;
      console.log("Updating transactions for wallet:", wallet);
      // await updateTransactionsForWallet(wallet);
    }
  } catch (error) {
    console.error("Error updating DB", error);
  }
}

fetchTransactionsAndUpdateDB();
setInterval(fetchTransactionsAndUpdateDB, 30000);
