import { NextRequest } from "next/server";
import * as anchor from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Keypair, Transaction, PublicKey, sendAndConfirmTransaction } from "@solana/web3.js";
import { EtokenIDL } from "@/app/idls";
import { EMINT, EXECUTOR } from "@/lib/constants";

type MintRequest = {
  address: string;
  value: string;
  selectedToken: string;
  networkUrl: string;
};

export const maxDuration = 300;
const payer = Keypair.fromSecretKey(Buffer.from(process.env.AUTHORITY!, 'base64'));

export async function POST(req: NextRequest) {

  const { address, value, selectedToken, networkUrl }: MintRequest = await req.json();
  console.log('Minting', address, value, selectedToken, networkUrl);
  const connection = new anchor.web3.Connection(networkUrl);
  const wallet = new NodeWallet(payer);
  const provider = new anchor.AnchorProvider(connection, wallet);

  const etokenProgram = new anchor.Program(EtokenIDL, provider);
  const signers = [payer];

  try {
    const userEusdcTokenAccount = Keypair.fromSeed(new PublicKey(address).toBuffer()); // This is just for demo purpose, ideally we would want to use PDAs
    const userTokenAccountInfo = await connection.getAccountInfo(userEusdcTokenAccount.publicKey);
    const tx = new Transaction();
    if (!userTokenAccountInfo) {
      try {
        const ix = await etokenProgram.methods.initializeAccount(new PublicKey(address)).accounts({
          tokenAccount: userEusdcTokenAccount.publicKey,
          mint: EMINT,
          payer: payer.publicKey,
        }).signers([userEusdcTokenAccount]).instruction();
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        tx.feePayer = payer.publicKey;
        tx.add(ix);
        tx.sign(userEusdcTokenAccount);
        signers.push(userEusdcTokenAccount);
      } catch (e) {
        console.error('Error initializing account', e);
        return;
      }
    }
    const amount = new anchor.BN(Number(value) * 10 ** 6);
    const ix = await etokenProgram.methods.mintTo(amount)
      .accounts({
        mint: EMINT,
        tokenAccount: userEusdcTokenAccount.publicKey,
        authority: payer.publicKey,
        executor: EXECUTOR,
      }).signers([payer]).instruction();
    tx.add(ix);
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = payer.publicKey;
    const txid = await sendAndConfirmTransaction(connection, tx, signers, { commitment: 'processed' });
    return new Response(
      JSON.stringify({ txid }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Mint error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
