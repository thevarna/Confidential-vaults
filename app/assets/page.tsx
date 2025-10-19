'use client';
import AssetTable from "../components/Tables/AssetTable";
import { motion, AnimatePresence } from "framer-motion";
import UnderlinedText from "../components/UnderlinedText/UnderlinedText";
// import { useAccount } from "wagmi";
import CustomConnectButton from "../components/ConnectButton/ConnectButton";
import ERC20Table from "../components/Tables/ERC20Table";
import { useWallet } from "@solana/wallet-adapter-react";



const Title = () => (
    <motion.h1
        key='faucet-title'
        exit={{ opacity: 0, y: -20 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className='max-w-3xl font-mono text-3xl antialiased text-center text-white uppercase cursor-default md:leading-tight font-regular md:text-6xl'
    >
        View your <UnderlinedText>assets</UnderlinedText> and <br /> <UnderlinedText>transaction</UnderlinedText> history
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

export default function Page() {
    const { connected } = useWallet();
    return <>
        {connected ? (
            <div className="max-h-screen flex flex-col items-center justify-start w-full gap-5">
                <ERC20Table />
                <AssetTable />
            </div>) : (
            <div className='flex flex-col items-center justify-between flex-1 px-4 py-16'>
                <div className='z-10 flex flex-col items-center justify-between w-full'>
                    <AnimatePresence>
                        <Title />
                    </AnimatePresence>
                    <div className='mt-12'>
                        <AnimatePresence>
                            <ConnectButtonWrapper />
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        )
        };
    </>

}
