import React, { useState } from 'react';
import { useOrderPlacement } from '@/app/hooks/usePlaceOrder';
import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js'
import { EMINT, EUSDC_ACCOUNT, EXECUTOR, ORDER_MANAGER } from '@/lib/constants';

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
};

const DepositModal = ({ isOpen, onClose }: DepositModalProps) => {
    if (!isOpen) return null;
    const [amount, setAmount] = useState<string>('10');
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const { placeOrders, isLoading, error } = useOrderPlacement({
        connection,
        publicKey,
        etokenMint: new PublicKey(EMINT),
        eusdcTokenAccount: new PublicKey(EUSDC_ACCOUNT),
        executor: new PublicKey(EXECUTOR),
        orderManager: new PublicKey(ORDER_MANAGER),
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-black border border-primary-brand/25 rounded-lg w-[400px] relative text-white">
                <div className='flex flex-col gap-3 p-6'>
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    >
                        ×
                    </button>
                    <h2 className="text-center text-lg font-mono mb-4">DEPOSIT INTO ETH-USDC</h2>

                    <label className="block text-sm mb-1 font-mono">AMOUNT</label>
                    <div className="flex items-center bg-primary-dark rounded px-4 py-2 mb-4">
                        <input
                            type="text"
                            defaultValue="10"
                            value={amount}
                            className="text-white bg-transparent w-full outline-none font-mono"
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <span className="text-xs text-gray-400 ml-2">USDC</span>
                    </div>

                    {/* <label className="block text-sm mb-1 font-mono">RECIPIENT ADDRESS</label>
                <input
                    type="text"
                    placeholder="0x..."
                    className="w-full bg-primary border border-gray-600 rounded px-3 py-2 mb-4 text-white font-mono"
                /> */}

                    <div className="flex items-center space-x-2 mb-4">
                        <input type="checkbox" defaultChecked className="bg-primary-brand/15" />
                        <label className="text-xs font-mono text-gray-300">
                            Encrypt deposit amount and yield
                        </label>
                    </div>
                </div>

                <div className="w-full rounded-b-md">
                    <button
                        className='rounded-b-md px-4 py-2 w-full font-mono text-sm uppercase border text-primary-brand-light bg-primary-brand/15 border-primary-brand/25 backdrop-blur-sm hover:bg-primary-brand/25 transition-all duration-300'
                        onClick={() => placeOrders(amount)}
                    >
                        {isLoading ? "Depositing..." : "Deposit"}
                    </button>
                </div>
            </div>
        </div>
    );
}

interface VaultCardProps {
    token: string;
    apy: string;
    tvl: string;
    strategy: string;
    risk: string;
}

const VaultCard: React.FC<VaultCardProps> = ({
    token,
    apy,
    tvl,
    strategy,
    risk,
}) => {
    const [showModal, setShowModal] = useState(false);
    return (
        <div className="bg-black rounded-md overflow-hidden font-mono flex flex-col gap-2">
            {/* Card Header */}
            <div className="p-4 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white rounded-full"></div>
                    <div className="text-left">
                        <h3 className="text-white font-medium text-lg">{token}</h3>
                        <p className="text-white/60 text-xs">AUTO-COMPOUNDED YIELD</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
            <Info className="h-4 w-4 text-white/60" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
            <Link className="h-4 w-4 text-indigo-400" />
          </Button> */}
                </div>
            </div>

            {/* Protocol */}
            <div className="px-4 py-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <p className="text-white/60 text-xs">PROTOCOL:</p>
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <span className="text-white text-xs">INFRARED</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid - Top Row */}
            <div className="grid grid-cols-2 border-b border-white/5 gap-2 py-1 px-2">
                <div className="p-4 border-r border-white/5 bg-primary-dark rounded-sm">
                    <p className="text-white/60 text-xs mb-1">APY</p>
                    <p className="text-white font-medium">{apy}</p>
                </div>
                <div className="p-4 bg-primary-dark rounded-sm">
                    <p className="text-white/60 text-xs mb-1">TVL</p>
                    <p className="text-white font-medium">{tvl}</p>
                </div>
            </div>

            {/* Stats Grid - Bottom Row */}
            <div className="grid grid-cols-2 border-b border-white/5 gap-2 py-1 px-2">
                <div className="p-4 border-r border-white/5 bg-primary-dark rounded-sm">
                    <p className="text-white/60 text-xs mb-1">STRATEGY</p>
                    <p className="text-white font-medium">{strategy}</p>
                </div>
                <div className="p-4 bg-primary-dark rounded-sm">
                    <p className="text-white/60 text-xs mb-1">RISK</p>
                    <p className="text-white font-medium">{risk}</p>
                </div>
            </div>

            {/* Deposit Button */}
            <div className="pt-3 w-full rounded-b-md">
                <button onClick={() => setShowModal(true)} className='rounded-b-md px-4 py-2 w-full font-mono text-sm uppercase border text-primary-brand-light bg-primary-brand/15 border-primary-brand/25 backdrop-blur-sm hover:bg-primary-brand/25 transition-all duration-300'>
                    Deposit
                </button>
            </div>
            <DepositModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default function VaultCards() {
    // const [showModal, setShowModal] = useState(false);
    const vaults = [
        { token: 'USDT', apy: '8.4%', tvl: '$4.2M', strategy: 'DELTA', risk: 'MEDIUM' },
        { token: 'USDC', apy: '8.4%', tvl: '$4.2M', strategy: 'DELTA', risk: 'MEDIUM' },
        { token: 'USDC', apy: '8.4%', tvl: '$4.2M', strategy: 'DELTA', risk: 'MEDIUM' },
    ];

    return (
        <div className="bg-primary-dark px-6 md:px-12 lg:px-24 py-8 w-full mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vaults.map((vault, index) => (
                    <VaultCard
                        key={index}
                        token={vault.token}
                        apy={vault.apy}
                        tvl={vault.tvl}
                        strategy={vault.strategy}
                        risk={vault.risk}
                    // setShowModal={setShowModal}
                    />
                ))}
            </div>
            {/* <DepositModal isOpen={showModal} onClose={() => setShowModal(false)} /> */}
        </div>
    )
}