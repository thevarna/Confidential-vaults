import { ethers } from 'ethers';
import { DECIMALS, eERC20Abi } from '@/lib/constants';
import { encryptAmount } from '@/utils/fhevm';
import { assets } from '@/utils/token';
import { MongoClient } from 'mongodb';
import { NextRequest } from 'next/server';
import axios from 'axios';
import { getServerSession, Session } from 'next-auth';

const client = new MongoClient(process.env.MONGODB_URI!);

const RATE_LIMIT_DURATION = 12 * 60 * 60 * 1000; // 6 hours in milliseconds

const wallet = new ethers.Wallet(process.env.FAUCET_KEY as string);

const refillWallet = new ethers.Wallet(process.env.REFILL_PRIVATE_KEY as string);

type MintRequest = {
  address: string;
  value: string;
  selectedToken: string;
  networkUrl: string;
};

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const { address, value, selectedToken, networkUrl }: MintRequest = await req.json();
  console.log('Minting', address, value, selectedToken, networkUrl);

  const tokenAddress = '0xE5E9d55AfF5aAafCE98A62e01f0D7901d4E1aeCF'

  try {
    const contract = new ethers.Contract(tokenAddress, eERC20Abi, wallet);
    const provider = new ethers.JsonRpcProvider(networkUrl);
    const walletWithProvider = wallet.connect(provider);
    const refillWalletWithProvider = refillWallet.connect(provider);

    const refillTx = await refillWalletWithProvider.sendTransaction({
      to: tokenAddress,
      data: contract.interface.encodeFunctionData(
        'mint(address,uint32)',
        [address, ethers.parseUnits(value, 6)]
      ),
    });
    await refillTx.wait();

    return new Response(
      JSON.stringify({ txid: refillTx.hash }),
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
