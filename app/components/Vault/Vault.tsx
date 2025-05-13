'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import UnderlinedText from '../UnderlinedText/UnderlinedText';
import { useWallet } from "@solana/wallet-adapter-react";
import CustomConnectButton from '../ConnectButton/ConnectButton';
import Portfolio from './Portfolio';
import VaultCards from './VaultCards';

const Title = () => (
	<motion.h1
		key='swap-title'
		exit={{ opacity: 0, y: -20 }}
		initial={{ opacity: 0, y: -20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.15, ease: 'easeOut' }}
		className='my-10 max-w-3xl font-mono text-3xl antialiased text-center text-white uppercase cursor-default md:leading-tight font-regular md:text-6xl'
	>
		Deposit to vaults <br /> <UnderlinedText>privately</UnderlinedText>
	</motion.h1>
);

const ConnectButtonWrapper = ({ isNetworkAdded }: { isNetworkAdded: boolean | null }) => (
	<motion.div
		key='connect-button'
		initial={{ opacity: 0, y: 10 }}
		animate={{ opacity: 1, y: 0 }}
		exit={{ opacity: 0, y: 10 }}
		transition={{ duration: 0.15 }}
	>
		<CustomConnectButton isNetworkAdded={isNetworkAdded} />
	</motion.div>
);

const LoadingState = () => (
	<motion.div key='loading' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='text-white font-mono text-xl'>
		Loading
	</motion.div>
);

const VaultWidget = () => {
	return (
		<div className='flex flex-col items-center justify-center w-full h-full mx-auto'>
			<Portfolio />
			<VaultCards />
		</div>
	);
}

export default function Vault() {
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
		<div className='flex flex-col items-center justify-between flex-1 px-4'>
			{/* <InfoButton /> */}
			<div className='z-10 flex flex-col items-center justify-between w-full'>
				<AnimatePresence>{!connected && <Title />}</AnimatePresence>
				<div>
					<AnimatePresence>{connected ? <VaultWidget />
						: <ConnectButtonWrapper isNetworkAdded={true} />}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
