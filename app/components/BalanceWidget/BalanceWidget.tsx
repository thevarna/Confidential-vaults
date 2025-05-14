"use client"
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { AnimatePresence, motion } from "framer-motion";
import CustomConnectButton from "../ConnectButton/ConnectButton";
import UnderlinedText from "../UnderlinedText/UnderlinedText";
import WidgetTitle from "../Title/Title";
import DecryptedBalance from "../DecryptedBalance/DecryptedBalance";
import { UnwrapButton, DecryptButton } from "./Button";
import { useAsync } from "@/app/hooks/useAsync";
import { assets } from "@/utils/token";
import { useWallet } from "@solana/wallet-adapter-react";

const Title = () => (
    <motion.h1
        key='wrapper-title'
        exit={{ opacity: 0, y: -20 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className='max-w-3xl font-mono text-3xl antialiased text-center text-white uppercase cursor-default md:leading-tight font-regular md:text-6xl'
    >
        Check your <UnderlinedText>encrypted</UnderlinedText> tokens balance.<br />
    </motion.h1>
);

const ConnectButtonWrapper = () => (
    <motion.div
        key='connect-button'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.15 }}
    >
        <CustomConnectButton isNetworkAdded={true} />
    </motion.div>
);

const Body = () => {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState<boolean[]>([]);
    const { decryptedBalances, fetchBalance } = useAsync();

    const handleToggle = (index: number) => {
        setIsVisible((prev) => {
            const copy = [...prev];
            copy[index] = !copy[index];
            return copy;
        });
        fetchBalance(assets[index].address);
    }

    const decryptAll = async () => {
        setLoading(true);
        setStatus('Decrypting...');
        await Promise.all(assets.map(async (asset) => {
            await fetchBalance(asset.address);
        }));
        setStatus('Decrypted'); 
        setLoading(false);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className='text-white bg-[#111111]/80 backdrop-blur-md min-w-[500px] max-w-[500px] m-auto rounded-lg border border-zinc-900 antialiased'
        >
            <WidgetTitle text={"Balances"} icon={"/balance.svg"} />
            <div className="flex flex-col font-mono gap-4 m-4">
                {
                    assets.map((asset, index) => {
                        return (
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center justify-center">
                                    <Image
                                        src={asset.icon}
                                        width={16}
                                        height={16}
                                        alt={asset.symbol}
                                        className='mr-2'
                                    />
                                    <span>{asset.symbol}</span>
                                </div>
                                <div className="min-w-[22%]">
                                    <DecryptedBalance
                                        isVisible={isVisible[index] || false}
                                        balance={decryptedBalances[index] || '...'}
                                        onToggle={() => handleToggle(index)}
                                    />
                                </div>
                                <UnwrapButton
                                    loading={loading}
                                    onClick={() => null}
                                />
                            </div>
                        )
                    })
                }
            </div>
            <DecryptButton
                loading={loading}
                status={status}
                onClick={decryptAll}
            />
        </motion.div>
    );
};

const LoadingState = () => (
    <motion.div key='loading' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='text-white font-mono text-xl'>
        Loading
    </motion.div>
);

const BalanceWidget: React.FC = () => {
    const { connected } = useWallet();
    const [isConnectionReady, setIsConnectionReady] = useState(false);

    useEffect(() => {
        setIsConnectionReady(true);
    }, []);

    if (!isConnectionReady) {
        return (
            <div className='flex flex-col items-center justify-between flex-1 px-4 py-16'>
                <div className='z-10 flex flex-col items-center justify-between w-full'>
                    <LoadingState />
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center justify-between flex-1 px-4 py-16'>
            <div className='z-10 flex flex-col items-center justify-between w-full'>
                <AnimatePresence>{!connected && <Title />}</AnimatePresence>
                <div className='mt-12'>
                    <AnimatePresence>{connected ? <Body /> : <ConnectButtonWrapper />}</AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default BalanceWidget;