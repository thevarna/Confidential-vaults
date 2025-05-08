import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

interface TransactionDocument {
  _id: string;
  txnData: any;
  updatedAt: Date;
  wallet?: string;
}

const client = new MongoClient(process.env.MONGODB_URI!);
const DATABASE_NAME = process.env.DB_NAME || "database";
const COLLECTION_NAME = "transactions";

export async function GET(req: Request) {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME) as import("mongodb").Collection<TransactionDocument>;
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get("wallet");

    if (wallet) {
      const document = await collection.findOne({ wallet });
      if (!document) {
        return NextResponse.json({ wallet, txnData: [] });
      }
      return NextResponse.json({ wallet, txnData: document.txnData });
    } else {
      const document = await collection.findOne({ _id: "latest" });
      if (!document) {
        return NextResponse.json({ txnData: [] });
      }
      return NextResponse.json({ txnData: document.txnData });
    }
  } catch (error: any) {
    console.error("Error reading transactions from MongoDB:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
