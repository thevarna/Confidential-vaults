"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { CustomConnectButton } from '../ConnectButton/ConnectButton';
import Logo from '../Logo/Logo';
import Menu from './Menu';
import { AddToNetworkButton } from '../AddToNetworkButton/AddToNetworkButton';
import { useEncifherNetwork } from '@/app/hooks/useEncifherNetwork';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuSm } from './Menu';

export default function Header() {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const buttonsRef = useRef<HTMLDivElement>(null);
	const menuVariants = {
		hidden: { x: "100%" },
		visible: { x: 0 },
		exit: { x: "100%", transition: { duration: 0.2, ease: "easeInOut" } },
	};
	const { isNetworkAdded, addEncifherNetworkConfig } = useEncifherNetwork();

	return (
		<header className='px-4 m-auto md:m-0 md:px-12 z-40'>
			<div className='m-auto py-[24px] md:py-[36px] flex justify-between gap-8 md:gap-2'>
				<Link href={'/'} className='flex items-center'>
					<Logo />
				</Link>
				<div className="md:hidden w-9 h-8 border-2 border-white/15 p-2 rounded-sm" onClick={() => setIsOpen(!isOpen)}>
					<Image src={isOpen ? "/cross.svg" : "/ham.svg"} width={10} height={10} alt="" className="w-full h-full" />
				</div>
				<div className='flex flex-row items-center gap-4 hidden md:flex'>
					<Menu />
					<CustomConnectButton isNetworkAdded={isNetworkAdded || false} />
					{/* {!isNetworkAdded && <AddToNetworkButton onAddNetwork={addEncifherNetworkConfig} />} */}
				</div>
				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial="hidden"
							animate="visible"
							exit="exit"
							variants={menuVariants}
							transition={{ duration: 0.5, ease: "easeInOut" }}
							className="w-screen h-screen absolute flex flex-col items-center gap-4 bg-black top-16 right-0 z-50"
							ref={menuRef}
						>
							<div
								className="absolute top-1/3 -translate-y-[30%] flex flex-col gap-4 justify-center"
								ref={buttonsRef}
								onClick={() => setIsOpen(false)}
							>
								<MenuSm />
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</header>
	);
}