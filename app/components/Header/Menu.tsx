'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const routes: { name: string; route: string; icon: string; target?: string }[] = [
	// { name: 'Swap', route: '/', icon: '/icon/swap.svg', target: '' },
	// { name: 'Deposit', route: '/deposit', icon: '/icon/faucet.svg', target: '' },
	{ name: 'Vault', route: '/', icon: '/icon/coins.svg', target: ''},
	{ name: 'Payment', route: '/payment', icon: '/icon/payment.svg', target: '' },
	// { name: 'Balance', route: '/balance', icon: '/icon/faucet.svg', target: '' },
	{ name: 'Faucet', route: '/faucet', icon: '/icon/faucet.svg', target: '' },
	{ name: 'Assets', route: '/assets', icon: '/icon/coins.svg', target: '' },
	// { name: 'Lend/Borrow [Soon]', route: '', icon: '/icon/lend.svg', target: '' },
	// { name: 'Staking', route: '/staking', icon: '/icon/coins.svg', target: '' },
	// { name: 'Docs', route: 'https://docs.encifher.io/docs/intro', icon: '/icon/docs.svg', target: '_blank' },
	// { name: 'Leaderboard', route: '/leaderboard', icon: '/icon/leaderboard.svg' },
	// { name: 'Yapmonad', route: 'https://yapmonad.xyz', icon: '/icon/yap.svg' },
];

const Menu = () => {
	const pathname = usePathname();

	return (
		<div className='flex-row items-center hidden md:flex'>
			{routes.map((route, index) => (
				<Link
					href={route.route}
					target={route.target}
					key={index}
					className={`px-4 py-2 font-mono text-sm uppercase ${pathname === route.route
						? 'text-primary-brand-light bg-primary-brand/15 border-primary-brand/25'
						: 'text-white/60 bg-white/5 border-white/5 hover:bg-white/5'
						} border backdrop-blur-sm flex items-center transition-all duration-300 group`}
				>
					<Image src={route.icon} width={16} height={16} alt={`${route.name} icon`} className='mr-2 fill-white' />
					{route.name}
					{route.target === '_blank' && (
						<span className='ml-1 opacity-50 group-hover:opacity-100 transition-opacity duration-300'>
							<ArrowTopRight />
						</span>
					)}
				</Link>
			))}
		</div>
	);
};

export default Menu;

export const MenuSm = () => {
	const pathname = usePathname();

	return (
		<>
			{routes.map((route, index) => (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.1, duration: 0.5, ease: "easeInOut" }}
				>
					<Link
						href={route.route}
						target={route.target}
						key={index}
						className={`px-4 py-2 font-mono text-sm uppercase ${pathname === route.route
							? 'text-primary-brand-light bg-primary-brand/15 border-primary-brand/25'
							: 'text-white/60 bg-white/5 border-white/5 hover:bg-white/5'
							} border backdrop-blur-sm flex items-center transition-all duration-300 group`}
					>
						<Image src={route.icon} width={16} height={16} alt={`${route.name} icon`} className='mr-2' />
						{route.name}
						{route.target === '_blank' && (
							<span className='ml-1 opacity-50 group-hover:opacity-100 transition-opacity duration-300'>
								<ArrowTopRight />
							</span>
						)}
					</Link>
				</motion.div>
			))}
		</>
	)
}

const ArrowTopRight = () => (
	<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='size-4'>
		<path
			fillRule='evenodd'
			d='M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z'
			clipRule='evenodd'
		/>
	</svg>
);
