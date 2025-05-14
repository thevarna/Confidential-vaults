"use client"
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CustomConnectButton from "../ConnectButton/ConnectButton";
import UnderlinedText from "../UnderlinedText/UnderlinedText";
import WidgetTitle from "../Title/Title";
import Button from "./Button";
import Dropdown from './Dropdown';
import AddressInput from './EncryptedAddressInput';
import { toast } from 'sonner';
import { defaultToast } from '@/utils/toastStyles';
import { PlaintextType, TEEClient } from "@encifher-js/core";
import { useConnection, useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useAsync } from "@/app/hooks/useAsync";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { EtokenIDL } from "@/app/idls";
import { EMINT, EXECUTOR } from "@/lib/constants";

const Title = () => (
    <motion.h1
        key='wrapper-title'
        exit={{ opacity: 0, y: -20 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className='max-w-3xl font-mono text-3xl antialiased text-center text-white uppercase cursor-default md:leading-tight font-regular md:text-6xl'
    >
        Pay  <UnderlinedText> Privately  </UnderlinedText>  Without <br /> <UnderlinedText> revealing </UnderlinedText> amount
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

const LoadingState = () => (
    <motion.div key='loading' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='text-white font-mono text-xl'>
        Loading
    </motion.div>
);

const Body = () => {
    const [selectedToken, setSelectedToken] = useState('USDC');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    // const [txHash, setTxHash] = useState<string>('');
    const { decryptedBalances, loadBalances } = useAsync();
    const { connected, publicKey, signTransaction } = useWallet();
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    const tokens = [
        { symbol: 'USDC', icon: '/usdc.svg', address: '0x32b998Fbb790FeBdfcf52a9bA7dfaDB7d244986a', wrapper: '0x2DdcacdB3fB815F39F993CAa633E8de43661407B', eerc20: '0x45BfbF0DD5975B909bA1fC1B684F76C82c271493', anonTransferAddress: '0x1D8896a79e2cE372B00Cf2bAD397bc43A53aEbE1' },
        // { symbol: 'shMON', icon: '/shmon.webp', address: '0x0C3B8ef98da02B0Fd1fA5720B8D7972902e41f29', wrapper: '0x9AEAd30f84CEC98a69c9cB4Fb147df328C897Eea', eerc20: '0xE5E9d55AfF5aAafCE98A62e01f0D7901d4E1aeCF', anonTransferAddress: '0x1D8896a79e2cE372B00Cf2bAD397bc43A53aEbE1' },
        // { symbol: 'USDT', icon: '/usdt.svg', address: '0x0C3B8ef98da02B0Fd1fA5720B8D7972902e41f29', eerc20: '0xc95fdBDa0f194c79d35B8542ADDb390C12d6EeA3', wrapper: '0x9AEAd30f84CEC98a69c9cB4Fb147df328C897Eea', anonTransferAddress: '0x1D8896a79e2cE372B00Cf2bAD397bc43A53aEbE1' },
    ];

    const etokenProgram = new Program(
        EtokenIDL,
        new AnchorProvider(connection, wallet!, { preflightCommitment: 'processed' })
    );

    const onSuccess = (txHash: string) => {
        loadBalances();
        toast.custom(
            (t) => (
                <div className="font-mono text-sm text-primary-brand-light bg-primary-brand/15 border border-primary-brand/25 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p>Payment successful!</p>
                    </div>
                    <p className="mt-1 text-xs">
                        Transaction ID: {txHash?.slice(0, 5)}...{txHash?.slice(-3)}
                    </p>
                    <button
                        onClick={() => window.open(`https://solscan.io/tx/${txHash}?cluster=devnet`, '_blank')}
                        className="mt-2 bg-primary-brand/20 text-primary-brand-light px-3 py-1 rounded text-xs hover:bg-primary-brand/30 transition-colors duration-200"
                    >
                        View on Explorer
                    </button>
                </div>
            ),
            { duration: 5000 }
        );
    }

    const handlePay = async () => {
        if (!connected || !publicKey) return;
        try {
            setLoading(true);
            setStatus('Payment in progress...');

            const parsedAmount = Number(amount) * 10 ** 6;
            const client = new TEEClient({ teeGatewayUrl: process.env.NEXT_PUBLIC_TEE_GATEWAY_URL! });
            await client.init();
            const encryptedAmount = await client.encrypt(parsedAmount, PlaintextType.uint64);
            const senderTokenAccount = Keypair.fromSeed(publicKey?.toBuffer());
            const receiverTokenAccount = Keypair.fromSeed(new PublicKey(address).toBuffer());
            const receiverInfo = await connection.getAccountInfo(receiverTokenAccount.publicKey);

            const tx = new Transaction();
            if (!receiverInfo) {
                const ix = await etokenProgram.methods.initializeAccount(
                    new PublicKey(address)
                ).accounts({
                    tokenAccount: receiverTokenAccount.publicKey,
                    mint: EMINT,
                    payer: publicKey,
                }).signers([receiverTokenAccount]).instruction();
                tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
                tx.feePayer = publicKey;
                tx.add(ix);
            }

            const ix = await etokenProgram.methods.etransfer({
                handle: new BN(encryptedAmount),
                proof: Buffer.from([0])
            }).accounts({
                from: senderTokenAccount.publicKey,
                to: receiverTokenAccount.publicKey,
                authority: publicKey,
                executor: EXECUTOR,
            }).instruction();
            tx.add(ix);
            tx.feePayer = publicKey;
            tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            //@ts-ignore
            const signedTx = await signTransaction(tx);
            if (!receiverInfo)
                signedTx.partialSign(receiverTokenAccount);
            const txid = await connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: true });
            onSuccess(txid);
            setLoading(false);
        }
        catch (e: any) {
            console.error(e);
            toast.error(e.message, {
                ...defaultToast,
                position: 'bottom-right',
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {/* <MonaldakAnimation /> */}
            {/* <p className='font-mono text-center text-white' > Thanks for visting! Encifher Payments is currently under maintenance. Please check back later. </p> */}

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className='text-white bg-[#111111]/80 backdrop-blur-md w-screen md:w-[500px] m-auto rounded-lg border border-zinc-900 antialiased'
            >
                <WidgetTitle text={"ENCIFHER PAYMENTS"} icon={"/cash.svg"} />
                <div className='flex flex-col bg-black'>
                    <div className='flex items-center justify-center gap-1 md:gap-[8%] mt-4'>
                        <Dropdown tokens={tokens} selectedToken={selectedToken} setSelectedToken={setSelectedToken} />
                        <input
                            type='number'
                            className='font-mono text-sm text-white placeholder-white/50 text-left bg-[#121212] border-none focus:outline-none py-4 pl-1 pr-0 md:pl-6 md:pr-[80px] appearance-none'
                            placeholder={Number(decryptedBalances[0]) < Number(amount) || Number(decryptedBalances[0]) == 0 ? `Insufficient balance` : `Enter amount`}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className='flex items-center justify-end text-sm text-white/50 font-mono my-3 mx-6'>
                        Balance:<span className="text-white" >${decryptedBalances[0] || '...'}</span>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className='px-6 py-2 mb-4'>
                        <AddressInput address={address} setAddress={setAddress} placeholder={"Enter receiver address"} />
                    </motion.div>
                    <Button
                        loading={loading}
                        status={status}
                        selectedToken={selectedToken}
                        onClick={handlePay}
                        address={address}
                        amount={amount}
                        balance={Number(decryptedBalances[0])}
                    />
                </div>

            </motion.div>
        </>
    );
}

const PaymentWidget: React.FC = () => {
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
};

export default PaymentWidget;