import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import { AddToNetworkButton } from '../AddToNetworkButton/AddToNetworkButton';
// import CustomConnectButton from '../ConnectButton/ConnectButton';

interface MobileMenuProps {
	isOpen: boolean;
	onClose: () => void;
	routes: { name: string; route: string }[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, routes }) => {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-20 flex flex-col items-center justify-center p-4 space-y-4 bg-black bg-opacity-90 md:hidden'>
			<button className='absolute p-2 text-white top-4 right-4' onClick={onClose}>
				<Image src={'/close.png'} width={30} height={30} alt='close menu' />
			</button>
			{routes.map((route, index) => (
				<Link href={route.route} target='_blank' key={index} className='text-xl font-light text-white'>
					{route.name}
				</Link>
			))}

			{/* <CustomConnectButton /> */}
		</div>
	);
};
