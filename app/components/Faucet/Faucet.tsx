'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { defaultToast } from '@/utils/toastStyles';
import AddressInput from './AddressInput';
import ClaimButton from './ClaimButton';
import FaucetHeader from './FaucetHeader';
import { Token, FaucetSuccessType } from './types';
import CustomConnectButton from '../ConnectButton/ConnectButton';
import UnderlinedText from '../UnderlinedText/UnderlinedText';
import { useSession, signIn } from 'next-auth/react';
import { useWallet } from '@solana/wallet-adapter-react';

const Title = () => (
  <motion.h1
    key="faucet-title"
    exit={{ opacity: 0, y: -20 }}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.15, ease: 'easeOut' }}
    className="max-w-3xl font-mono text-3xl antialiased text-center text-white uppercase cursor-default md:leading-tight font-regular md:text-6xl"
  >
    Claim <UnderlinedText>testnet</UnderlinedText> tokens <br /> for <UnderlinedText>testing</UnderlinedText>
  </motion.h1>
);

const ConnectButtonWrapper = () => (
  <motion.div
    key="connect-button"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ duration: 0.15 }}
  >
    <CustomConnectButton isNetworkAdded={true} />
  </motion.div>
);

const LoadingState = () => (
  <motion.div
    key="loading"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="text-white font-mono text-xl"
  >
    Loading...
  </motion.div>
);

const tokens: Token[] = [
  { symbol: 'USDC', icon: '/usdc.svg', value: '5' },
];

const FaucetContent: React.FC = () => {
  // const { data: session, status: sessionStatus } = useSession();
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState(tokens[0].symbol);
  const [status, setStatus] = useState('');
  const [success, setSuccess] = useState<FaucetSuccessType>({
    isSuccessful: false,
    encifher_txid: undefined,
    error: undefined,
  });

  // // Handle session loading state
  // if (sessionStatus === 'loading') {
  //   return <LoadingState />;
  // }

  // // If the user is not authenticated, prompt for sign-in
  // if (!session) {
  //   return (
  //     <div className="flex flex-col w-full h-full items-center justify-center">
  //       <p className="mb-4 font-mono text-white">Please sign in with Twitter to access the faucet.</p>
  //       <button
  //         onClick={() => signIn('twitter')}
  //         className=" text-white font-mono bg-primary-brand hover:bg-primary-brand/90 px-4 py-2 rounded-lg shadow-lg"
  //       >
  //         Sign in with Twitter
  //       </button>
  //     </div>
  //   );
  // }

  // Mint tokens and handle errors
  const mint = async () => {
    setLoading(true);
    try {
      let tx_id = '';
      for (const token of tokens) {
        setStatus(`Claiming ${token.symbol}`);
        const toastId = toast.loading(`Claiming ${token.symbol}`, defaultToast);
        const suffix = '-erc20';
        const resp = await fetch(`/api/mint${suffix}`, {
          method: 'POST',
          body: JSON.stringify({
            address,
            value: token.value,
            selectedToken: token.symbol,
            networkUrl: process.env.NEXT_PUBLIC_RPC_URL!,
          }),
        });

        if (!resp.ok) {
          const errorData = await resp.json();
          toast.dismiss(toastId);
          toast.error(`Error claiming ${token.symbol}: ${errorData.error}`, defaultToast);
          throw new Error(errorData.error);
        }

        const data = await resp.json();
        tx_id = data.txid;
        toast.dismiss(toastId);
        toast.success(`Successfully claimed ${token.symbol}`, defaultToast);
      }

      // client.logEvent({ event: 'faucet_claim', user: address });
      setSuccess({ isSuccessful: true, encifher_txid: tx_id, error: undefined });
      setLoading(false);
      toast.custom(
        (t) => (
          <div className="font-mono text-sm text-primary-brand-light bg-primary-brand/15 border border-primary-brand/25 backdrop-blur-sm p-4 rounded-lg shadow-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>All tokens claimed successfully</p>
            </div>
            <p className="mt-1 text-xs">
              Transaction ID: {tx_id.slice(0, 5)}...{tx_id.slice(-3)}
            </p>
            <button
              onClick={() => window.open(`https://solscan.io/tx/${tx_id}?cluster=devnet`, '_blank')}
              className="mt-2 bg-primary-brand/20 text-primary-brand-light px-3 py-1 rounded text-xs hover:bg-primary-brand/30 transition-colors duration-200"
            >
              View on Explorer
            </button>
          </div>
        ),
        { duration: 5000 }
      );
    } catch (error) {
      setSuccess({
        isSuccessful: false,
        encifher_txid: undefined,
        error: error instanceof Error ? error.message : 'Something went wrong',
      });
      setLoading(false);
      toast.dismiss();
      toast.error(`Error: ${error instanceof Error ? error.message : 'Something went wrong'}`, defaultToast);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.15 }}
      className="text-white bg-[#111111]/80 backdrop-blur-md w-screen md:w-[500px] m-auto rounded-lg border border-zinc-900 antialiased"
    >
      <FaucetHeader />
      <div className="flex flex-col">
        <div className="px-6 py-4">
          {/* <span className="text-xs text-white/40 font-mono">{session.user?.name}</span> */}
          <AddressInput address={address} setAddress={setAddress} />
        </div>
        <div className="px-6 py-4 flex justify-between bg-black/20">
          <div className="text-xs text-white/40 font-mono">
            <span>
              The faucet will automatically claim&nbsp;
              {tokens.map((token) => token.symbol).join(', ')} for you
            </span>
          </div>
        </div>
        <ClaimButton
          loading={loading}
          status={status}
          selectedToken={selectedToken}
          tokens={tokens}
          onClick={mint}
          address={address} // Add this prop
        />
      </div>
    </motion.div>
    // <p className='font-mono text-center text-white' > Thanks for visting! Encifher Swap is currently under maintenance. Please check back later. </p>
  );
};

const Faucet: React.FC = () => {
  const { connected } = useWallet();
  const [isConnectionReady, setIsConnectionReady] = useState(false);

  useEffect(() => {
    setIsConnectionReady(true);
  }, []);

  if (!isConnectionReady) {
    return (
      <div className="flex flex-col items-center justify-between flex-1 px-4 py-16">
        <div className="z-10 flex flex-col items-center justify-between w-full">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between flex-1 px-4 py-16">
      <div className="z-10 flex flex-col items-center justify-between w-full">
        <AnimatePresence>{!connected && <Title />}</AnimatePresence>
        <div className="mt-12">
          <AnimatePresence>{connected ? <FaucetContent /> : <ConnectButtonWrapper />}</AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Faucet;
