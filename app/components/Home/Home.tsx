'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import UnderlinedText from '../UnderlinedText/UnderlinedText';
import { useAccount } from 'wagmi';
import CustomConnectButton from '../ConnectButton/ConnectButton';
// import { useEncifherNetwork } from '@/app/hooks/useEncifherNetwork';
// import InfoButton from '../Leaderboard/component/Info';

const Title = () => (
	<motion.h1
		key='swap-title'
		exit={{ opacity: 0, y: -20 }}
		initial={{ opacity: 0, y: -20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.15, ease: 'easeOut' }}
		className='max-w-3xl font-mono text-3xl antialiased text-center text-white uppercase cursor-default md:leading-tight font-regular md:text-6xl'
	>
		Swap<UnderlinedText> securely</UnderlinedText> with <br /> END-TO-END <UnderlinedText>privacy</UnderlinedText>
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

export default function Home() {
	const { isConnected } = useAccount();
	// const { isNetworkAdded } = useEncifherNetwork();
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
			{/* <InfoButton /> */}
			<div className='z-10 flex flex-col items-center justify-between w-full'>
				<AnimatePresence>{!isConnected && <Title />}</AnimatePresence>
				<div className='mt-12'>
					<AnimatePresence>{isConnected ? <>
					<div className='flex items-center justify-center text-white/50 font-mono text-sm pt-3'>We take 0.05 MON fee for each swap</div>
					</> : <ConnectButtonWrapper isNetworkAdded={true} />}</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
