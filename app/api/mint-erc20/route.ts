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
  captcha: string;
};

interface CustomSession extends Session {
  user: {
    name: string;
    email?: string;
    image?: string;
  };
}

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const clientIp = req.ip ?? (forwardedFor && forwardedFor.split(',')[0].trim()) ?? req.headers.get('host');

  if (!clientIp) {
    return new Response(
      JSON.stringify({ error: 'Could not determine client IP' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const session = await getServerSession({ req } as any);
  const typedSession = session as CustomSession;
  if (!typedSession || !typedSession.user?.name) {
    return new Response(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const username = typedSession.user.name;
  const currentTime = Date.now();

  const db = (await client.connect()).db('rate-limit').collection('monad');
  const user = await db.findOne({ ip: clientIp, username });

  const lastClaimTime = user?.lastClaimTime;
  if (lastClaimTime && currentTime - lastClaimTime < RATE_LIMIT_DURATION) {
    const minutesLeft = Math.ceil((RATE_LIMIT_DURATION - (currentTime - lastClaimTime)) / 60000);
    return new Response(
      JSON.stringify({ error: `Rate limit exceeded. Try again in ${minutesLeft} minute(s).` }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { address, value, selectedToken, networkUrl, captcha }: MintRequest = await req.json();
  console.log('Minting', address, value, selectedToken, networkUrl);

  const tokenAddress = assets.find((asset) => asset.symbol === selectedToken)?.address;
  if (!tokenAddress) {
    return new Response(
      JSON.stringify({ error: 'Invalid token' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const eAmountIn = await encryptAmount(
      tokenAddress,
      ethers.parseUnits("5", DECIMALS),
      tokenAddress
    );

    const contract = new ethers.Contract(tokenAddress, eERC20Abi, wallet);
    const provider = new ethers.JsonRpcProvider(networkUrl);
    const walletWithProvider = wallet.connect(provider);
    const refillWalletWithProvider = refillWallet.connect(provider);

    // const tx = await walletWithProvider.sendTransaction({
    //   to: tokenAddress,
    //   data: contract.interface.encodeFunctionData(
    //     'transfer(address,bytes32,bytes)',
    //     [address, eAmountIn.handles[0], eAmountIn.inputProof]
    //   ),
    // });
    // await tx.wait();

    const refillTx = await refillWalletWithProvider.sendTransaction({
      to: tokenAddress,
      data: contract.interface.encodeFunctionData(
        'mint(address,uint32)',
        [address, 5000000]
      ),
    });
    await refillTx.wait();

    if (user) {
      await db.updateOne(
        { ip: clientIp, username },
        {
          $set: {
            lastClaimTime: currentTime,
          },
        }
      );
    } else {
      await db.insertOne({
        ip: clientIp,
        username,
        lastClaimTime: currentTime,
      });
    }

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
