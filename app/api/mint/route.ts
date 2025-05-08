import { ethers } from 'ethers';

declare global {
  var rateLimitStore: Map<string, number> | undefined;
}

if (!global.rateLimitStore) {
  global.rateLimitStore = new Map<string, number>();
}
const rateLimitStore = global.rateLimitStore;
const RATE_LIMIT_DURATION = 60 * 60 * 1000;

const wallet = new ethers.Wallet(process.env.FAUCET_KEY as string);

type MintRequest = {
  address: string;
  value: string;
  networkUrl: string;
};

export async function POST(req: Request) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '';
  if (!clientIp) {
    return new Response(
      JSON.stringify({ error: 'Could not determine client IP' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const currentTime = Date.now();
  const lastClaimTime = rateLimitStore.get(clientIp);
  if (lastClaimTime && currentTime - lastClaimTime < RATE_LIMIT_DURATION) {
    const minutesLeft = Math.ceil((RATE_LIMIT_DURATION - (currentTime - lastClaimTime)) / 60000);
    return new Response(
      JSON.stringify({ error: `Rate limit exceeded for your IP. Try again in ${minutesLeft} minute(s).` }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { address, value, networkUrl }: MintRequest = await req.json();

  const provider = new ethers.JsonRpcProvider(networkUrl);
  const walletWithProvider = wallet.connect(provider);
  const tx = await walletWithProvider.sendTransaction({
    to: address,
    value: ethers.parseEther("0.05"),
  });
  await tx.wait();

  rateLimitStore.set(clientIp, currentTime);

  return new Response(JSON.stringify({ txid: tx.hash }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
