import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

type Token = {
	symbol: string;
	icon: string;
};

const Dropdown: React.FC<{
	tokens: Token[];
	selectedToken: string;
	setSelectedToken: (token: string) => void;
}> = ({ tokens, selectedToken, setSelectedToken }) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	return (
		<DropdownMenu.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
			<DropdownMenu.Trigger className='w-md px-9 py-3 font-mono text-sm text-white/60 flex items-center border border-[#121212] justify-between focus:outline-none'>
				<div className='flex items-center'>
					<Image
						src={tokens.find((token) => token.symbol === selectedToken)?.icon || '/eth.svg'}
						width={16}
						height={16}
						alt={selectedToken}
						className='mr-2'
					/>
					<span>{selectedToken}</span>
				</div>
				{/* <motion.svg width='24' height='24' fill='none' viewBox='0 0 24 24' animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
					<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M15.25 10.75L12 14.25L8.75 10.75'></path>
				</motion.svg> */}
			</DropdownMenu.Trigger>

			<AnimatePresence>
				{dropdownOpen && (
					<DropdownMenu.Portal forceMount>
						<DropdownMenu.Content asChild className='w-[500px]'>
							<motion.div
								className='mt-2 w-fit bg-black border border-zinc-900 rounded-md shadow-lg z-50'
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
							>
								{tokens
									.filter((token) => token.symbol !== selectedToken)
									.map((token) => (
										<DropdownMenu.Item
											key={token.symbol}
											className='block w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5'
											onClick={() => {
												setSelectedToken(token.symbol);
												setDropdownOpen(false);
											}}
										>
											<Image src={token.icon} width={16} height={16} alt={token.symbol} className='inline-block mr-2' />
											{token.symbol}
										</DropdownMenu.Item>
									))}
							</motion.div>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				)}
			</AnimatePresence>
		</DropdownMenu.Root>
	);
};

export default Dropdown;