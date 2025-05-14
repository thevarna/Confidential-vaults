import React, { useEffect, useState } from 'react';
import { useOrderPlacement } from '@/app/hooks/usePlaceOrder';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js'
import { EMINT, EUSDC_ACCOUNT, EXECUTOR, ORDER_MANAGER } from '@/lib/constants';
import { toast } from 'sonner';
import { defaultToast } from '@/utils/toastStyles';
import DecryptedBalance from '../DecryptedBalance/DecryptedBalance';
import { useAsync } from '@/app/hooks/useAsync';

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    userBalance: string;
    loadBalances: () => void;
};

const handleVisibilityToggle = (isVisible: boolean, setVisibility: React.Dispatch<React.SetStateAction<boolean>>) => {
    setVisibility(!isVisible);
    toast(isVisible ? 'Encrypting Balance' : 'Decrypting Balance', {
        ...defaultToast,
        position: 'bottom-center', // Center the toast notifications
    });
};

const DepositModal = ({ isOpen, onClose, userBalance, loadBalances }: DepositModalProps) => {
    if (!isOpen) return null;
    const [amount, setAmount] = useState<string>('1');
    const [hash, setTxHash] = useState<string>("");
    const [visibility, setVisibility] = useState(false);
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

    useEffect(() => {
        if (isOpen)
            loadBalances()
    }, [isOpen])

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
                    <h2 className="text-center text-lg font-mono mb-4">DEPOSIT INTO SOL-USDC</h2>

                    <label className="block text-sm mb-1 font-mono">AMOUNT</label>
                    <div className="flex items-center bg-primary-dark rounded px-4 py-2 mb-4">
                        <input
                            type="text"
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

                    <p className='text-[12px] text-[#797979] flex flex-row gap-1 items-center mb-2'>
                        {/* Available Balance: */}
                        <DecryptedBalance
                            isVisible={visibility}
                            balance={userBalance || "..."}
                            onToggle={() => handleVisibilityToggle(visibility, setVisibility)}
                        />
                    </p>

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
                        onClick={async () => {
                            if (hash || error) return;
                            if (Number(userBalance) == 0 || Number(userBalance) < Number(amount)) {
                                toast.error("Insufficent balance", {
                                    ...defaultToast,
                                    position: 'bottom-right'
                                });
                                return;
                            }
                            const txHash = await placeOrders(amount);
                            if (!txHash) return;
                            setTxHash(txHash);
                            setTimeout(() => loadBalances(), 500);
                            toast.custom(
                                (t) => (
                                    <div className="font-mono text-sm text-primary-brand-light bg-primary-brand/15 border border-primary-brand/25 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <p>Deposited {amount} USDC successfully!</p>
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
                        }}
                    >
                        {isLoading ? "Depositing..." : (!hash && error) ? "Error deposting" : hash ? "Deposit Complete" : "Deposit"}
                    </button>
                </div>
            </div>
        </div>
    );
}

interface VaultCardProps {
    token: string;
    apy: string;
    icon: string;
    strategy: string;
    risk: string;
}

const VaultCard: React.FC<VaultCardProps> = ({
    token,
    apy,
    icon,
    strategy,
    risk,
}) => {
    const [showModal, setShowModal] = useState(false);
    const { decryptedBalances, loadBalances } = useAsync();
    return (
        <div className="bg-black rounded-md overflow-hidden font-mono flex flex-col gap-2">
            {/* Card Header */}
            <div className="p-4 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-3">
                    <img src={icon} className='h-10 w-10 rounded-full' />
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
                        <img className="h-4 w-4 rounded-full" src="/drift.png" />
                        <span className="text-white text-xs">DRIFT</span>
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
                    <p className="text-white font-medium">${decryptedBalances[1] || "..."}</p>
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
            <DepositModal isOpen={showModal} onClose={() => setShowModal(false)} userBalance={decryptedBalances[0]} loadBalances={loadBalances} />
        </div>
    );
};

export default function VaultCards() {
    const vaults = [
        { token: 'USDC', apy: '8.4%', icon: '/usdc.svg', strategy: 'DELTA', risk: 'MEDIUM' },
        { token: 'USDT', apy: '8.4%', icon: '/usdt.svg', strategy: 'DELTA', risk: 'MEDIUM' },
        { token: 'USDT', apy: '8.4%', icon: '/usdt.svg', strategy: 'DELTA', risk: 'MEDIUM' },
    ];

    return (
        <div className="bg-primary-dark px-6 md:px-12 lg:px-24 py-8 w-full mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vaults.map((vault, index) => (
                    <VaultCard
                        key={index}
                        token={vault.token}
                        apy={vault.apy}
                        icon={vault.icon}
                        strategy={vault.strategy}
                        risk={vault.risk}
                    />
                ))}
            </div>
        </div>
    )
}