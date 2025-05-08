'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useEncifherNetwork } from '@/app/hooks/useEncifherNetwork';

export const AddToNetworkButton: React.FC<{ onAddNetwork: () => Promise<void> }> = ({ onAddNetwork }) => {
	const { isNetworkAdded } = useEncifherNetwork();
	const [key, setKey] = useState(0);

	useEffect(() => {
		// Force re-render when isNetworkAdded changes
		setKey((prevKey) => prevKey + 1);
	}, [isNetworkAdded]);

	const handleAddNetwork = async () => {
		await onAddNetwork();
		// Force re-render after network is added
		setKey((prevKey) => prevKey + 1);
	};

	if (isNetworkAdded === null) {
		return null; // or a loading indicator
	}

	return (
		<div className='flex flex-col gap-2' key={key}>
			<button
				onClick={handleAddNetwork}
				className='px-4 py-2 font-mono text-sm uppercase border text-secondary-brand-light bg-secondary-brand/15 border-secondary-brand/25 backdrop-blur-sm'
				disabled={isNetworkAdded}
			>
				<div className='flex flex-row items-center gap-2'>
					<Image src={'/metamask.svg'} width={16} height={16} alt='metamask fox' />
					{isNetworkAdded ? 'Network Added' : 'Import Network'}
				</div>
			</button>
		</div>
	);
};
