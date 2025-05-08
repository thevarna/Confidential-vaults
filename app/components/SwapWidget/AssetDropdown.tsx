import Image from 'next/image';
import { Asset } from '@/lib/types';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';

interface AssetDropdownProps {
	asset: Asset;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	onAssetChange: (asset: Asset) => void;
	disabledAsset: Asset;
	assets: Asset[];
}

export const AssetDropdown: React.FC<AssetDropdownProps> = ({ asset, isOpen, setIsOpen, onAssetChange, disabledAsset, assets }) => {
	return (
		<DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenu.Trigger className='px-4 py-2 font-mono text-sm text-white/60 hover:text-white hover:bg-white/5 border-white/5 hover:border-white/50 flex items-center focus:outline-none focus:ring-2 focus:ring-primary-brand/50 w-full justify-between'>
				<div className='flex items-center'>
					<Image src={asset.icon} width={16} height={16} alt='Token icon' className='mr-2' />
					<span>{asset.symbol}</span>
				</div>
				<div>
					<motion.svg width='24' height='24' fill='none' viewBox='0 0 24 24' animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
						<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M15.25 10.75L12 14.25L8.75 10.75'></path>
					</motion.svg>
				</div>
			</DropdownMenu.Trigger>

			<AnimatePresence>
				{isOpen && (
					<DropdownMenu.Portal forceMount>
						<DropdownMenu.Content asChild>
							<motion.div
								className='mt-2 w-full bg-black border border-zinc-900 rounded-md shadow-lg z-50'
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
							>
								{assets.map((assetOption) => (
									<DropdownMenu.Item
										key={assetOption.symbol}
										className={`block w-full text-left px-4 py-2 text-sm ${
                      assetOption.symbol === disabledAsset.symbol ? 'text-gray-500 cursor-not-allowed hidden' : 'text-white hover:bg-white/5'
										} focus:outline-none focus:ring-2 focus:ring-primary-brand/50`}
										onClick={() => onAssetChange(assetOption)}
                    disabled={assetOption.symbol === disabledAsset.symbol}
									>
										<Image src={assetOption.icon} width={16} height={16} alt='Token icon' className='inline-block mr-2' />
										{assetOption.symbol}
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
