"use client"
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CustomConnectButton from "../ConnectButton/ConnectButton";
import UnderlinedText from "../UnderlinedText/UnderlinedText";
import WidgetTitle from "../Title/Title";
import Button from "./Button";
import Dropdown from './Dropdown';
import AddressInput from './EncryptedAddressInput';
import Checkbox from './Checkbox';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { getBalance } from '@wagmi/core'
import { writeContract, waitForTransactionReceipt } from "wagmi/actions";
import { toast } from 'sonner';
import { config } from "@/lib/config";
import { defaultToast } from '@/utils/toastStyles';
import { BrowserProvider, getDefaultProvider, JsonRpcProvider, parseEther, parseUnits, TransactionReceipt } from "ethers";
import { eerc20WrapperAbi, encifherERC20Abi, anonTransferAbi, eERC20Abi } from "@/lib/constants";
// import { encryptPvtPaymentAmount } from "@/utils/fhevm";
import { toHex } from "viem";
// import {fhenixjs} from 'fhenixjs';
// import { FhenixClient } from 'fhenixjs';
import { ethers } from "ethers";
import { PlaintextType, TEEClient } from "@encifher-js/core";
import { encryptAmount } from "@/utils/fhevm";
import { decrypt32 } from "@/utils/fhevm";
import { readContract } from "wagmi/actions";
import { addPointsForPayment } from "@/utils/stack";
import MonaldakAnimation from "../MonaldakAnimation";

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
    const [checked, setChecked] = useState<boolean>(false);
    const [txHash, setTxHash] = useState<string>('');
    const [balance, setBalance] = useState<number>(0);

    const { address: userAddress } = useAccount();
    const { provider } = new JsonRpcProvider(process.env.NEXT_PUBLIC_MONAD_RPC_URL)
    // const client = new FhenixClient({provider});
    const tokens = [
        { symbol: 'USDC', icon: '/usdc.svg', address: '0x32b998Fbb790FeBdfcf52a9bA7dfaDB7d244986a', wrapper: '0x2DdcacdB3fB815F39F993CAa633E8de43661407B', eerc20: '0x45BfbF0DD5975B909bA1fC1B684F76C82c271493', anonTransferAddress: '0x1D8896a79e2cE372B00Cf2bAD397bc43A53aEbE1' },
        { symbol: 'shMON', icon: '/shmon.webp', address: '0x0C3B8ef98da02B0Fd1fA5720B8D7972902e41f29', wrapper: '0x9AEAd30f84CEC98a69c9cB4Fb147df328C897Eea', eerc20: '0xE5E9d55AfF5aAafCE98A62e01f0D7901d4E1aeCF', anonTransferAddress: '0x1D8896a79e2cE372B00Cf2bAD397bc43A53aEbE1' },
        // { symbol: 'USDT', icon: '/usdt.svg', address: '0x0C3B8ef98da02B0Fd1fA5720B8D7972902e41f29', eerc20: '0xc95fdBDa0f194c79d35B8542ADDb390C12d6EeA3', wrapper: '0x9AEAd30f84CEC98a69c9cB4Fb147df328C897Eea', anonTransferAddress: '0x1D8896a79e2cE372B00Cf2bAD397bc43A53aEbE1' },
    ];

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const tokenAddress: `0x${string}` = tokens.find((token) => token.symbol === selectedToken)?.eerc20 as `0x${string}`;
                const balance: bigint = await readContract(config, {
                    address: tokenAddress,
                    abi: encifherERC20Abi,
                    functionName: 'balanceOf',
                    args: [userAddress],
                }) as bigint;

                console.log("Balance: ", Number(await decrypt32(balance)) / 1e6);

                setBalance(Number(await decrypt32(balance)) / 1e6);


            } catch (err) {
                console.error(err);
            }
        };

        fetchBalance();
    }, [userAddress, selectedToken]);

    const onSuccess = () => {
        toast.success('Payment successful!', {
            ...defaultToast,
            position: 'bottom-center', // Center the success toast
        });
    }

    const handleWrap = async () => {
        const tokenAddress: `0x${string}` = tokens.find((token) => token.symbol === selectedToken)?.address as `0x${string}`;
        const wrapperAddress: `0x${string}` = tokens.find((token) => token.symbol === selectedToken)?.wrapper as `0x${string}`;
        const encryptedTokenAddress: `0x${string}` = tokens.find((token) => token.symbol === selectedToken)?.eerc20 as `0x${string}`;
        const anonTransferAddress: `0x${string}` = tokens.find((token) => token.symbol === selectedToken)?.anonTransferAddress as `0x${string}`;

        const client = new TEEClient({ teeGatewayUrl: 'https://monad.encrypt.rpc.encifher.io' });
        await client.init();

        console.log("Address : ", userAddress);
        try {
            setLoading(true);

            setStatus('Payment in progress...');
            const erc20Contract = new ethers.Contract(tokenAddress, encifherERC20Abi, provider);
            const encryptedERC20Contract = new ethers.Contract(encryptedTokenAddress, eERC20Abi, provider);
            const wrapperContract = new ethers.Contract(wrapperAddress, eerc20WrapperAbi, provider);
            const anonTransferContract = new ethers.Contract(anonTransferAddress, anonTransferAbi, provider);

            // try {
            //     let hash = await writeContract(config, {
            //         address: tokenAddress,
            //         abi: encifherERC20Abi,
            //         functionName: 'mint',
            //         args: [userAddress, parseUnits(amount, 7)],
            //     })
            //      await provider.waitForTransaction(hash);
            // }
            // catch (error) {
            //     console.error('Approve failed', error);
            // }

            // try {
            //     let hash = await writeContract(config, {
            //         address: tokenAddress,
            //         abi: encifherERC20Abi,
            //         functionName: 'approve',
            //         args: [wrapperAddress, parseUnits(amount, 6)],
            //     })

            //     const res = await provider.waitForTransaction(hash);
            //     console.log(res);
            //     console.log("Approved");
            // } catch (error) {
            //     console.error('Approve failed', error);
            // }

            // try {
            //     let hash = await writeContract(config, {
            //         address: wrapperAddress,
            //         abi: eerc20WrapperAbi,
            //         functionName: 'depositAndWrap',
            //         args: [userAddress, parseUnits(amount, 6)],
            //     })

            //     await provider.waitForTransaction(hash);
            //     console.log("Wrapped");
            // } catch (error) {
            //     console.error('Wrap failed', error);
            // }

            const encAmount = await client.encrypt(parseUnits(amount, 6), PlaintextType.uint32);
            const encAddress = await client.encrypt(address, PlaintextType.address);
            const proof = (new Uint8Array(8924)).fill(3)

            const encAmountHex = '0x' + Buffer.from(encAmount).toString('hex');
            const encAddressHex = '0x' + Buffer.from(encAddress).toString('hex');
            const proofHex = '0x' + Buffer.from(proof).toString('hex');

            console.log("Encrypted Amount: ", encAmountHex);
            console.log("Encrypted Address: ", encAddressHex);

            let hash = await writeContract(config, {
                address: encryptedTokenAddress,
                abi: eERC20Abi,
                functionName: 'transfer',
                args: [address, encAmountHex, proofHex],
            })

            await provider.waitForTransaction(hash);
            console.log("Transferred");
            // addPointsForPayment(userAddress as string);

            onSuccess();

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
            <MonaldakAnimation />
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
                            placeholder={balance < Number(amount) || balance == 0 ? `Insufficient balance` : `Enter amount`}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className='flex items-center justify-end text-sm text-white/50 font-mono mt-2 mx-6'>
                        Balance:<span className="text-white" >${balance}</span>
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
                        onClick={handleWrap}
                        address={address}
                        amount={amount}
                        balance={balance}
                    />
                </div>

            </motion.div>
        </>
    );
}

const PaymentWidget: React.FC = () => {
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

export default PaymentWidget;