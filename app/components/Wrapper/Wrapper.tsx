"use client"
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CustomConnectButton from "../ConnectButton/ConnectButton";
import UnderlinedText from "../UnderlinedText/UnderlinedText";
import WidgetTitle from "../Title/Title";
import Button from "./Button";
import Dropdown from './Dropdown';
import AddressInput from './AddressInput';
import Checkbox from './Checkbox';
import { useAccount } from 'wagmi';
import { getBalance } from '@wagmi/core'
import { writeContract, waitForTransactionReceipt } from "wagmi/actions";
import { toast } from 'sonner';
import { config } from "@/lib/config";
import { defaultToast } from '@/utils/toastStyles';
import { parseEther } from "ethers";
import { encifherERC20Abi, eerc20WrapperAbi } from "@/lib/constants";
import { erc20Assets as tokens } from "@/utils/token";

const Title = () => (
    <motion.h1
        key='wrapper-title'
        exit={{ opacity: 0, y: -20 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className='max-w-3xl font-mono text-3xl antialiased text-center text-white uppercase cursor-default md:leading-tight font-regular md:text-6xl'
    >
        Deposit <UnderlinedText>plaintext</UnderlinedText> tokens <br /> to <UnderlinedText>encrypted ones.</UnderlinedText>
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
    const [checked, setChecked] = useState<boolean>(false);
    const [txHash, setTxHash] = useState<string>('');

    const { address: userAddress } = useAccount();

    const onSuccess = () => {
        toast.success('Swap successful!', {
            ...defaultToast,
            position: 'bottom-center', // Center the success toast
        });
    }

    const handleWrap = async () => {
        const tokenAddress: `0x${string}` = tokens.find((token) => token.symbol === selectedToken)?.address as `0x${string}`;
        const wrapperAddress: `0x${string}` = tokens.find((token) => token.symbol === selectedToken)?.wrapper as `0x${string}`;
        try {
            if (!tokenAddress || !wrapperAddress) throw new Error('Token not found!');
            if (!amount) throw new Error('Amount is required!');
            setLoading(true);
            const balance = await getBalance(config, {
                address: userAddress as `0x${string}`,
                token: tokenAddress,
            });
            if (balance.value < parseEther(amount)) throw new Error('Insufficient balance!');
            // wrap token
            setStatus('Taking approval...');
            let hash = await writeContract(config, {
                address: tokenAddress,
                abi: encifherERC20Abi,
                functionName: "approve",
                args: [wrapperAddress, Number(amount)],
            });
            let receipt = await waitForTransactionReceipt(config, { hash });
            if (!receipt.status) throw new Error('Transaction reverted!');

            setStatus('Wrapping tokens...');
            hash = await writeContract(config, {
                address: wrapperAddress,
                abi: eerc20WrapperAbi,
                functionName: "depositAndWrap",
                args: [userAddress, Number(amount)],
            });
            setStatus('Waiting for confirmation...');
            receipt = await waitForTransactionReceipt(config, { hash });
            setTxHash(hash);
            if (receipt.status) {
                onSuccess();
            } else {
                throw new Error('Transaction Reverted!');
            }
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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className='text-white bg-[#111111]/80 backdrop-blur-md min-w-[500px] max-w-[500px] m-auto rounded-lg border border-zinc-900 antialiased'
        >
            <WidgetTitle text={"Deposit tokens"} icon={"/wrap.svg"} />
            <div className='flex flex-col'>
                <div className='flex items-center justify-center gap-[20%] my-4'>
                    <Dropdown tokens={tokens} selectedToken={selectedToken} setSelectedToken={setSelectedToken} />
                    <input
                        type='text'
                        className='font-mono text-md text-right bg-transparent border-none focus:outline-none mr-5'
                        placeholder='0'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                {/* <Checkbox checked={checked} setChecked={setChecked} label={"Wrap privately"} /> */}
                <AnimatePresence>
                    {checked &&
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className='px-6 py-2 mb-4'>
                            <AddressInput address={address} setAddress={setAddress} placeholder={"Enter claimer address"} />
                        </motion.div>}
                </AnimatePresence>
                <Button
                    loading={loading}
                    status={status}
                    selectedToken={selectedToken}
                    onClick={handleWrap}
                    address={address}
                    amount={amount}
                    isChecked={checked}
                />
            </div>
        </motion.div>
    );
}

const Wrapper: React.FC = () => {
    const { isConnected } = useAccount();
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
                <AnimatePresence>{!isConnected && <Title />}</AnimatePresence>
                <div className='mt-12'>
                    <AnimatePresence>{isConnected ? <Body /> : <ConnectButtonWrapper />}</AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Wrapper;