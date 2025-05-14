'use client';

import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export const CustomConnectButton: React.FC<{ isNetworkAdded: boolean | null }> = () => {
	const { connected, disconnect, publicKey } = useWallet();
	const { setVisible } = useWalletModal();
	const { connection } = useConnection();
	const [balance, setBalance] = useState<string>("0");

	useEffect(() => {
		const fetchBalance = async () => {
			if (publicKey) {
				try {
					const lamports = await connection.getBalance(publicKey);
					setBalance((lamports / 1e9).toFixed(4)); // convert lamports to SOL
				} catch (err) {
					console.error("Failed to get balance:", err);
				}
			}
		};

		fetchBalance();
	}, [publicKey, connected]);

	const handleConnect = async () => {
		if (connected) {
			await disconnect();
			console.log("Wallet Disconnected");
		} else {
			setVisible(true);
		}
	};

	return (
		connected && publicKey ? (
			<>
				<button className="disabled px-4 py-2 font-mono text-sm uppercase border text-primary-brand-light bg-primary-brand/15 border-primary-brand/25 backdrop-blur-sm hover:bg-primary-brand/25 transition-all duration-300">
					{balance} SOL
				</button>
				<button
					onClick={handleConnect}
					className='px-4 py-2 font-mono text-sm uppercase border text-primary-brand-light bg-primary-brand/15 border-primary-brand/25 backdrop-blur-sm hover:bg-primary-brand/25 transition-all duration-300'
				>
					{publicKey.toBase58().slice(0, 4) + '...' + publicKey.toBase58().slice(-4)}
				</button>
			</>
		) : (
			<button onClick={handleConnect} className='px-4 py-2 font-mono text-sm uppercase border text-primary-brand-light bg-primary-brand/15 border-primary-brand/25 backdrop-blur-sm hover:bg-primary-brand/25 transition-all duration-300'>
				Connect Wallet
			</button>
		));
};

export default CustomConnectButton;
