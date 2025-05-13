import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const AddressInput: React.FC<{
	address: string;
	setAddress: (address: string) => void;
}> = ({ address, setAddress }) => {
	const { publicKey } = useWallet();

	useEffect(() => {
		if (publicKey) {
			setAddress(publicKey.toBase58());
		}
	}, [publicKey, setAddress]);

	return (
		<input
			type='text'
			required
			id='address'
			value={address}
			placeholder='Enter your wallet address'
			onChange={(e) => setAddress(e.target.value)}
			className='font-mono text-sm bg-transparent border-none focus:outline-none w-full text-white placeholder-white/50'
		/>
	);
};

export default AddressInput;
