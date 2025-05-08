import React, { useState, useEffect } from 'react';
import { config } from '@/lib/config';
import { encryptAmount } from '@/utils/fhevm';
import { parseUnits, toHex } from 'viem';
import { eERC20Abi, DECIMALS } from '@/lib/constants';
import { useAccount } from 'wagmi';
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { toast } from 'sonner';
import { defaultToast } from '@/utils/toastStyles';

interface StakeButtonProps {
	amount1: string;
	amount2: string;
	onClick: () => void;
	isLoading: boolean;
	stateText: string;
	txHash: string | null;
}

// export const StakeButton: React.FC<StakeButtonProps> = ({ amount1, amount2, onClick, isLoading, stateText, txHash }) => {
// 	const [isStakingInProgress, setIsStakingInProgress] = useState(false);
// 	const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(false);
// 	const [isStakingComplete, setIsStakingComplete] = useState(false);
// 	const { address } = useAccount();

	// useEffect(() => {
	// 	// Clear staking state if amounts change
	// 	setIsStakingComplete(false);
	// 	setIsWaitingForConfirmation(false);
	// }, [amount1, amount2]);

	// const handleMockStaking = async () => {
	// 	if (!address) return;

	// 	try {
	// 		setIsStakingInProgress(true);
	// 		const mockStakeAmount = '0.001';
	// 		const eAmount = await encryptAmount(address, parseUnits(mockStakeAmount, DECIMALS), usdcAddress);
	// 		const stakingPoolAddress = '0x0000000000000000000000000000000000000000'; // Mock staking pool address

	// 		const hash = await writeContract(config, {
	// 			address: usdcAddress,
	// 			abi: eERC20Abi,
	// 			functionName: 'transfer',
	// 			args: [stakingPoolAddress, toHex(eAmount.handles[0]), toHex(eAmount.inputProof)],
	// 		});

	// 		toast.success('Transaction signed. Waiting for confirmation.', defaultToast);
	// 		setIsWaitingForConfirmation(true);

	// 		const receipt = await waitForTransactionReceipt(config, { hash });
	// 		if (receipt.status) {
	// 			toast.success('Staking successful!', defaultToast);
	// 			setIsStakingComplete(true);
	// 		} else {
	// 			throw new Error('Staking transaction failed');
	// 		}
	// 	} catch (error) {
	// 		console.error('Staking error:', error);
	// 		toast.error('Staking process failed', defaultToast);
	// 	} finally {
	// 		setIsStakingInProgress(false);
	// 		setIsWaitingForConfirmation(false);
	// 	}
	// };

	// if (!amount1 || !amount2) {
	// 	return (
	// 		<button className='w-full py-4 rounded-b-lg font-medium font-mono bg-zinc-900 uppercase text-zinc-500' disabled>
	// 			Enter Staking Amounts
	// 		</button>
	// 	);
	// }

	// if (txHash) {
	// 	return (
	// 		<a
	// 			href={`https://explorer.encifher.io/tx/${txHash}`}
	// 			target='_blank'
	// 			rel='noopener noreferrer'
	// 			className='w-full py-4 rounded-b-lg font-medium text-white uppercase font-mono bg-primary-brand hover:bg-primary-brand/90 text-center block'
	// 		>
	// 			View Staking Transaction
	// 		</a>
	// 	);
	// }

	// const isDisabled = isLoading || isStakingInProgress || isWaitingForConfirmation;

	// if (isStakingComplete) {
	// 	return (
	// 		<a
	// 			href={`https://explorer.encifher.io/tx/${txHash}`}
	// 			target='_blank'
	// 			rel='noopener noreferrer'
	// 			className='w-full py-4 rounded-b-lg font-semibold font-mono uppercase text-white bg-primary-brand hover:bg-primary-brand/90 text-center block'
	// 		>
	// 			Success, View on Explorer.
	// 		</a>
	// 	);
	// }

// 	return (
// 		<button
// 			className={`w-full py-4 rounded-b-lg font-semibold font-mono uppercase text-white bg-primary-brand 
// 				${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-brand/90'}`}
// 			onClick={isDisabled ? undefined : handleMockStaking}
// 			disabled={isDisabled}
// 		>
// 			{isLoading || isStakingInProgress || isWaitingForConfirmation ? (
// 				<span className='flex items-center justify-center'>
// 					<svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
// 						<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
// 						<path
// 							className='opacity-75'
// 							fill='currentColor'
// 							d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
// 						></path>
// 					</svg>
// 					{isLoading ? stateText : isWaitingForConfirmation ? 'Waiting for Confirmation...' : 'Initiating Staking...'}
// 				</span>
// 			) : (
// 				'Stake Securely'
// 			)}
// 		</button>
// 	);
// };
