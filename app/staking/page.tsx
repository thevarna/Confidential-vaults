'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import CustomConnectButton from '../components/ConnectButton/ConnectButton';
import UnderlinedText from '../components/UnderlinedText/UnderlinedText';
import Staking from '../components/Staking/Staking';

const Title = () => (
	<motion.h1
		key='staking-title'
		exit={{ opacity: 0, y: -20 }}
		initial={{ opacity: 0, y: -20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.15, ease: 'easeOut' }}
		className='max-w-3xl font-mono text-3xl antialiased text-center text-white uppercase cursor-default md:leading-tight font-regular md:text-6xl'
	>
		Stake your <UnderlinedText>tokens</UnderlinedText> <br /> and earn <UnderlinedText>rewards</UnderlinedText>
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

export default function Page() {
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
					<AnimatePresence>{isConnected ? <Staking /> : <ConnectButtonWrapper />}</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
