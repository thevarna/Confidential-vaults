import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { AssetDropdown } from '../SwapWidget/AssetDropdown';
// import { Asset, assets } from '../SwapWidget/types';
import { SwapButton } from '../SwapWidget/SwapButton';
import { useAsync } from '../../hooks/useAsync';
import { toast } from 'sonner';
import { defaultToast } from '@/utils/toastStyles';
// import { EyeIcon, EyeOffIcon } from '../SwapWidget/Icons';
import { useStake } from '@/app/hooks/useStake';
import Image from 'next/image';
// import { StakeButton } from './StakeButton';

const DecryptedBalance: React.FC<{ isVisible: boolean; balance: string; onToggle: () => void }> = ({ isVisible, balance, onToggle }) => {
	return (
		<span className='flex flex-row items-center gap-2 text-white font-mono'>
			{/* <button onClick={onToggle}>{isVisible ? EyeIcon : EyeOffIcon}</button> */}
			{!isVisible ? <EncryptedBalancePlaceholder /> : <span className='text-white text-lg'>{balance}</span>}{' '}
		</span>
	);
};

const EncryptedBalancePlaceholder = () => {
	return <div className='flex flex-row items-center gap-2 text-lg text-white/50 uppercase'>*******</div>;
};

// const StakingContent = () => {
// 	const [asset1, setAsset1] = useState<Asset>(assets[0]);
// 	const [asset2, setAsset2] = useState<Asset>(assets[1]);
// 	const [amount1, setAmount1] = useState<string>('');
// 	const [amount2, setAmount2] = useState<string>('');
// 	const [asset1DropdownOpen, setAsset1DropdownOpen] = useState<boolean>(false);
// 	const [asset2DropdownOpen, setAsset2DropdownOpen] = useState<boolean>(false);
// 	const [visibility1, setVisibility1] = useState(false);
// 	const [visibility2, setVisibility2] = useState(false);
// 	const [feesTier, setFeesTier] = useState<number>(50);

// 	const { decryptedBalances, fetchBalances, price } = useAsync({ selectedTokenSend: asset1.symbol });
// 	const { stake, isLoading, stateText, txHash, resetStakeState } = useStake({ selectedTokenStake: asset1.symbol });

// 	const handleAsset1Change = (asset: Asset) => {
// 		if (asset.symbol !== asset2.symbol) {
// 			setAsset1(asset);
// 			setAsset1DropdownOpen(false);
// 			resetStakeState();
// 			updateAmount2(amount1);
// 		}
// 	};

// 	const handleAsset2Change = (asset: Asset) => {
// 		if (asset.symbol !== asset1.symbol) {
// 			setAsset2(asset);
// 			setAsset2DropdownOpen(false);
// 			resetStakeState();
// 			updateAmount1(amount2);
// 		}
// 	};

// 	const handleVisibilityToggle = (isVisible: boolean, setVisibility: React.Dispatch<React.SetStateAction<boolean>>) => {
// 		setVisibility(!isVisible);
// 		toast(isVisible ? 'Encrypting Balance' : 'Decrypting Balance', {
// 			...defaultToast,
// 			position: 'bottom-center',
// 		});
// 	};

// 	const handleStake = async () => {
// 		try {
// 			await stake(asset1.symbol, asset2.symbol, amount1, amount2, feesTier, () => {
// 				toast.success('Staking successful!', {
// 					...defaultToast,
// 					position: 'bottom-center',
// 				});
// 				fetchBalances();
// 			});
// 		} catch (error: any) {
// 			let errorMessage = error.message || 'Staking failed!';
// 			if (errorMessage.includes('rejected')) errorMessage = 'User rejected staking request!';
// 			toast.error(errorMessage, {
// 				...defaultToast,
// 				position: 'bottom-center',
// 			});
// 		}
// 	};

// 	const updateAmount1 = (value: string) => {
// 		setAmount1(value);
// 		const newAmount2 = Number(value) / Number(price);
// 		setAmount2(newAmount2 ? newAmount2.toFixed(6) : '');
// 	};

// 	const updateAmount2 = (value: string) => {
// 		setAmount2(value);
// 		const newAmount1 = Number(value) * Number(price);
// 		setAmount1(newAmount1 ? newAmount1.toFixed(6) : '');
// 	};

// 	useEffect(() => {
// 		fetchBalances();
// 	}, [asset1, asset2]);

// 	return (
// 		<motion.div
// 			initial={{ opacity: 0, y: 10 }}
// 			animate={{ opacity: 1, y: 0 }}
// 			exit={{ opacity: 0, y: 10 }}
// 			transition={{ duration: 0.15 }}
// 			className='text-white bg-[#111111]/80 backdrop-blur-md min-w-[500px] max-w-[500px] m-auto rounded-lg border border-zinc-900 antialiased'
// 		>
// 			<div className='px-6 py-2 flex justify-center text-xs text-white/50 font-mono uppercase bg-black/20 items-center gap-1'>
// 				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor' className='size-3 fill-primary-brand'>
// 					<path
// 						fillRule='evenodd'
// 						d='M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z'
// 						clipRule='evenodd'
// 					/>
// 				</svg>
// 				<div>Encrypted Staking</div>
// 			</div>
// 			<div className='px-6 py-4'>
// 				<p className='text-xs text-white/50 font-mono uppercase'> Select pair </p>
// 				<div className='w-full flex justify-between space-x-4 mt-4'>
// 					<div className='w-full bg-white/5 rounded-lg'>
// 						<AssetDropdown
// 							asset={asset1}
// 							isOpen={asset1DropdownOpen}
// 							setIsOpen={setAsset1DropdownOpen}
// 							onAssetChange={handleAsset1Change}
// 							disabledAsset={asset2}
// 							assets={assets}
// 						/>
// 					</div>
// 					<div className='w-full bg-white/5 rounded-lg'>
// 						<AssetDropdown
// 							asset={asset2}
// 							isOpen={asset2DropdownOpen}
// 							setIsOpen={setAsset2DropdownOpen}
// 							onAssetChange={handleAsset2Change}
// 							disabledAsset={asset1}
// 							assets={assets}
// 						/>
// 					</div>
// 				</div>
// 			</div>
// 			<div className='px-6 py-4 flex justify-between text-sm text-white/80 font-mono bg-black/20'>
// 				<div className='px-2 py-1 rounded-md text-xs text-white/60 hover:text-white/80 border border-white/5 hover:border-white/10 cursor-default'>
// 					Pool Price Range: <span className='text-primary-brand-light'>1 to ∞</span>
// 				</div>
// 				<div className='flex flex-row gap-2'>
// 					<div className='px-2 py-1 rounded-md text-xs border border-white/5 hover:border-white/10 cursor-default bg-primary-brand/10 hover:bg-primary-brand/20 text-primary-brand-light'>
// 						1% Fee Tier
// 					</div>
// 				</div>
// 			</div>
// 			<div className='px-6 pt-4 pb-2 flex flex-col'>
// 				<div className='focus-within:bg-white/5 bg-white/[0.02] rounded-lg px-6 py-4 transition-all duration-300'>
// 					<div className='flex justify-between'>
// 						<input
// 							type='text'
// 							className='font-mono text-xl bg-transparent border-none focus:outline-none'
// 							placeholder='0'
// 							value={amount1}
// 							onChange={(e) => updateAmount1(e.target.value)}
// 						/>
// 						<div className='flex flex-row gap-2 text-white/50 rounded-md bg-white/5 px-2 py-1 text-lg'>
// 							<Image src={asset1.icon} width={16} height={16} alt='Token icon' className='inline-block mr-2 text-white/50 fill-white/50' />
// 							<span className='font-mono text-sm'>{asset1.symbol}</span>
// 						</div>
// 					</div>
// 					<p className='text-[12px] text-[#797979] flex flex-row gap-1 items-center mt-2'>
// 						<DecryptedBalance
// 							isVisible={visibility1}
// 							balance={decryptedBalances.balance0}
// 							onToggle={() => handleVisibilityToggle(visibility1, setVisibility1)}
// 						/>
// 					</p>
// 				</div>
// 			</div>
// 			<div className='px-6 pt-2 pb-4 flex flex-col'>
// 				<div className='focus-within:bg-white/5 bg-white/[0.02] rounded-lg px-6 py-4 transition-all duration-300'>
// 					<div className='flex justify-between'>
// 						<input
// 							type='text'
// 							className='font-mono text-xl bg-transparent border-none focus:outline-none'
// 							placeholder='0'
// 							value={amount2}
// 							onChange={(e) => updateAmount2(e.target.value)}
// 						/>
// 						<div className='flex flex-row gap-2 text-white/50 rounded-md bg-white/5 px-2 py-1 text-lg'>
// 							<Image src={asset2.icon} width={16} height={16} alt='Token icon' className='inline-block mr-2' />
// 							<span className='font-mono text-sm'>{asset2.symbol}</span>
// 						</div>
// 					</div>
// 					<p className='text-[12px] text-[#797979] flex flex-row gap-1 items-center mt-2'>
// 						<DecryptedBalance
// 							isVisible={visibility2}
// 							balance={decryptedBalances.balance1}
// 							onToggle={() => handleVisibilityToggle(visibility2, setVisibility2)}
// 						/>
// 					</p>
// 				</div>
// 			</div>
// 			<div className='px-6 py-4 flex items-center justify-between text-sm text-white/80 font-mono bg-black/20'>
// 				<div className='px-2 py-1 rounded-md text-xs border border-white/5 hover:border-white/10 cursor-default bg-primary-brand/10 hover:bg-primary-brand/20 text-primary-brand-light'>
// 					2% Slippage
// 				</div>
// 			</div>
// 			<StakeButton amount1={amount1} amount2={amount2} onClick={handleStake} isLoading={isLoading} stateText={stateText} txHash={txHash} />
// 		</motion.div>
// 	);
// };

export default function Staking() {
	return (
		<div>
			{/* <StakingContent /> */}
		</div>
	);
}
