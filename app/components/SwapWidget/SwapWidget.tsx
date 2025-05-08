import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { AssetDropdown } from './AssetDropdown';
import { Asset } from '@/lib/types';
import { DECIMALS } from '@/lib/constants';
import { SwapButton } from './SwapButton';
import { useAsync } from '../../hooks/useAsync';
import { toast } from 'sonner';
import { parseUnits } from 'viem';
import { defaultToast } from '@/utils/toastStyles';
import { useSwap } from '@/app/hooks/useSwap';
import { assets } from '@/utils/token';
// import { client } from '@/utils/pointy';
import { useAccount } from 'wagmi';
import DecryptedBalance from '../DecryptedBalance/DecryptedBalance';
import Popup from '../Popup/Popup';
import { addPointsForSwap } from '@/utils/stack';
import { sendTransaction, waitForTransactionReceipt } from '@wagmi/core'
import { config } from '@/lib/config';

export const SwapWidget: React.FC = () => {

	const revisedAssets = [assets[0], assets[1]];

	const [fromAsset, setFromAsset] = useState<Asset>(revisedAssets[0]);
	const [toAsset, setToAsset] = useState<Asset>(revisedAssets[1]);
	const [fromAmount, setFromAmount] = useState<string>('');
	const [toAmount, setToAmount] = useState<string>('');
	const [isRotated, setIsRotated] = useState<boolean>(false);
	const [fromDropdownOpen, setFromDropdownOpen] = useState<boolean>(false);
	const [toDropdownOpen, setToDropdownOpen] = useState<boolean>(false);
	const [visibility_t1, setVisibility_t1] = useState(false);
	const [visibility_t2, setVisibility_t2] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const { decryptedBalances, tokenPrices, loadBalances, fetchBalance } = useAsync();
	// const price = 1.003 // TODO: replace with tokenPrices[fromAsset.symbol + toAsset.symbol];
	const { swap, isLoading, stateText, txHash, resetSwapState } = useSwap({ fromAsset, toAsset });
	const { address } = useAccount();

	const handleReverse = () => {
		setFromAsset(toAsset);
		setToAsset(fromAsset);
		setFromAmount(toAmount);
		setToAmount(fromAmount);
		setIsRotated(!isRotated);
		resetSwapState();
	};

	const handleFromAmountChange = (value: string) => {
		if ((!Number(value) && Number(value) !== 0) || Number(value) < 0) return;
		setFromAmount(value);
		const price = fromAsset.symbol === revisedAssets[0].symbol ? tokenPrices[0] : tokenPrices[1]
		let amountOut = Number(value) * Number(price);
		setToAmount(amountOut ? amountOut.toFixed(3) : '');
		// set amount after 2 seconds
		// setTimeout(() => {
		// 	setToAmount(amountOut ? amountOut.toFixed(3) : '');
		// }, 2000);
		resetSwapState();
	};

	const handleToAmountChange = (value: string) => {
		setToAmount(value);
		const price = toAsset.symbol === revisedAssets[0].symbol ? tokenPrices[0] : tokenPrices[1]
		let amountIn = Number(value) * Number(price);
		setFromAmount(amountIn ? amountIn.toFixed(3) : '');
		resetSwapState();
	};

	useEffect(() => {
		handleFromAmountChange(fromAmount);
	}, [fromAsset, toAsset]);

	const handleFromAssetChange = (asset: Asset) => {
		if (asset.symbol !== toAsset.symbol) {
			setFromAsset(asset);
			setFromDropdownOpen(false);
			resetSwapState();
			// fetchPrice()
		}
	};

	const handleToAssetChange = (asset: Asset) => {
		if (asset.symbol !== fromAsset.symbol) {
			setToAsset(asset);
			setToDropdownOpen(false);
			resetSwapState();
			// fetchPrice()
		}
	};

	const handleVisibilityToggle = (isVisible: boolean, setVisibility: React.Dispatch<React.SetStateAction<boolean>>) => {
		setVisibility(!isVisible);
		toast(isVisible ? 'Encrypting Balance' : 'Decrypting Balance', {
			...defaultToast,
			position: 'bottom-center', // Center the toast notifications
		});
	};

	const handleSwap = async () => {
		if (!address) return;
		let swapCount = 0;
		try {
			if (!parseUnits(toAmount, DECIMALS))
				throw new Error('Insufficient amount!');
			const balance = await fetchBalance(fromAsset.address);
			if (!balance) return;
			if (parseUnits(balance, DECIMALS) < parseUnits(fromAmount, DECIMALS)) {
				throw new Error("Insufficient balance!");
			}

			const sendTx = await sendTransaction(config,{
				to: "0x1547ffb043f7c5bde7baf3a03d1342ccd8211a28",
				value: parseUnits("0.05", 18),
			})

			await waitForTransactionReceipt(config, {
				hash: sendTx
			})

			// const { activity } = await client.getActivityForUser(address)
			// swapCount = activity.filter((a: any) => a.eventLog.event.name === 'swap').length;
			await swap(fromAmount, toAmount, () => {
				toast.success('Swap successful!', {
					...defaultToast,
					position: 'bottom-center', // Center the success toast
				});
				// if (Number(fromAmount) >= 5) {
				// 	const event = swapCount === 49 ? 'swap_50' : 'swap';
				// 	client.logEvent({
				// 		event,
				// 		user: address,
				// 	})
				// }
				// addPointsForSwap(address);
				setIsOpen(true);
				loadBalances();
				setTimeout(() => {
					loadBalances();
				}, 5000);
				// fetchReserves(pool);
			});
		} catch (error: any) {
			let errorMessage = error.message || 'Swap failed!';
			if (errorMessage.includes('rejected')) errorMessage = 'User rejected swap request!';
			toast.error(errorMessage, {
				...defaultToast,
				position: 'bottom-right', // Center the error toast
			});
		}
	};



	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 10 }}
				transition={{ duration: 0.15 }}
				className='text-white bg-[#111111]/80 backdrop-blur-md w-screen md:w-full md:min-w-[500px] rounded-lg border border-zinc-900 antialiased'
			>
				<div className='px-6 py-2 flex justify-center text-xs text-white/50 font-mono uppercase bg-black/20 items-center gap-1'>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor' className='size-3 fill-primary-brand'>
						<path
							fillRule='evenodd'
							d='M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z'
							clipRule='evenodd'
						/>
					</svg>

					<div className=''>Encrypted Swap</div>
				</div>
				<div className='px-6 pl-10 py-8 flex flex-col'>
					<div className='flex flex-col md:flex-row justify-between gap-2 md:gap-0'>
						<input
							type='text'
							className='font-mono text-xl bg-transparent border-none focus:outline-none order-2 md:order-1'
							placeholder='0'
							value={fromAmount}
							onChange={(e) => handleFromAmountChange(e.target.value)}
						/>
						<div className='bg-white/5 rounded-lg w-auto order-1 md:order-2'>
							<AssetDropdown
								asset={fromAsset}
								isOpen={fromDropdownOpen}
								setIsOpen={setFromDropdownOpen}
								onAssetChange={handleFromAssetChange}
								disabledAsset={toAsset}
								assets={revisedAssets}
							/>
						</div>
					</div>
					<p className='text-[12px] text-[#797979] flex flex-row gap-1 items-center mt-2'>
						<DecryptedBalance
							isVisible={visibility_t1}
							balance={decryptedBalances[fromAsset.id] || '...'}
							onToggle={() => handleVisibilityToggle(visibility_t1, setVisibility_t1)}
						/>
					</p>
				</div>
				<div className='border-primary-brand border-2 w-full h-[4px] flex items-center justify-center'>
					<motion.button
						className='bg-primary-brand p-1 rounded-sm'
						onClick={handleReverse}
						animate={{ rotate: isRotated ? 180 : 0 }}
						transition={{ duration: 0.3 }}
					>
						<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
							<path d='M4.75 10.25H19.25L13.75 4.75' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'></path>
							<path d='M19.25 13.75H4.75L10.25 19.25' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'></path>
						</svg>
					</motion.button>
				</div>
				<div className={`px-6 pl-10 py-8 flex flex-col ${fromAmount && !toAmount && "animate-pulse text-black"}`}>
					<div className='flex flex-col md:flex-row justify-between gap-2 md:gap-0'>
						<input
							type='text'
							className='font-mono text-xl bg-transparent border-none focus:outline-none order-2 md:order-1'
							placeholder='0'
							value={toAmount}
							onChange={(e) => handleToAmountChange(e.target.value)}
						/>
						<div className='bg-white/5 rounded-lg w-auto order-1 md:order-2'>
							<AssetDropdown
								asset={toAsset}
								isOpen={toDropdownOpen}
								setIsOpen={setToDropdownOpen}
								onAssetChange={handleToAssetChange}
								disabledAsset={fromAsset}
								assets={revisedAssets}
							/>
						</div>
					</div>
					<p className='text-[12px] text-[#797979] flex flex-row gap-1 items-center mt-2'>
						<DecryptedBalance
							isVisible={visibility_t2}
							balance={decryptedBalances[toAsset.id] || '...'}
							onToggle={() => handleVisibilityToggle(visibility_t2, setVisibility_t2)}
						/>
					</p>
				</div>
				<div className='px-6 py-4 flex justify-between text-sm text-white/80 font-mono bg-black/20'>
					<div>
						 {fromAsset.symbol + " -> " + toAsset.symbol}
					 </div>
					<div className='cursor-not-allowed px-2 py-1 rounded-md text-xs text-white/60 hover:text-white/80 border border-white/5 hover:border-white/10'>
						View All
					</div>
			</div>
			<SwapButton fromAmount={fromAmount} toAmount={toAmount} onClick={handleSwap} isLoading={isLoading} stateText={stateText} txHash={txHash} />
			</motion.div>  
			{/* <p className='font-mono text-center text-white' > Thanks for visting! Encifher Swap is currently under maintenance. Please check back later. </p> */}
			{/* <Popup isOpen={isOpen} setIsOpen={setIsOpen} txHash={txHash} fromAmount={fromAmount} toAmount={toAmount} /> */}
		</>
	);
};
