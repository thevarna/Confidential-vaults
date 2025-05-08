import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Create a MongoClient instance using the MONGODB_URI env variable.
const client = new MongoClient(process.env.MONGODB_URI!);
const DATABASE_NAME = process.env.DB_NAME || "database";
const USERS_COLLECTION = "users";

export async function POST(req: Request) {
  try {
    const { wallet } = await req.json();

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Connect to the database.
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(USERS_COLLECTION);

    // Check if user exists.
    const existingUser = await collection.findOne({ wallet });

    if (!existingUser) {
      // Insert a new user document.
      const result = await collection.insertOne({
        wallet,
        createdAt: new Date(),
      });
      return NextResponse.json({
        success: true,
        message: "User created",
        id: result.insertedId,
      });
    } else {
      // User already exists, no further action required.
      return NextResponse.json({
        success: true,
        message: "User already exists",
      });
    }
  } catch (error: any) {
    console.error("Error in users endpoint:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Connect to the database.
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(USERS_COLLECTION);

    // Fetch all users.
    const users = await collection.find({}).toArray();

    // Return the users.
    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Error in GET users endpoint:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
