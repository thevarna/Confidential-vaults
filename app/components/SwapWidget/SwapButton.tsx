import React from 'react';
import { useAccount } from 'wagmi'

interface SwapButtonProps {
	fromAmount: string;
	toAmount: string;
	onClick: () => void;
	isLoading: boolean;
	stateText: string;
	txHash: string | null;
}

export const SwapButton: React.FC<SwapButtonProps> = ({ fromAmount, toAmount, onClick, isLoading, stateText, txHash }) => {
	const { chain } = useAccount();
	if (!fromAmount || !toAmount) {
		return (
			<button className='w-full py-4 rounded-b-lg font-medium font-mono bg-zinc-900 uppercase text-zinc-500' disabled>
				Enter Amount
			</button>
		);
	}

	if (txHash) {
		return (
			<a
				href={`${chain?.blockExplorers?.default?.url}/tx/${txHash}`}
				target='_blank'
				rel='noopener noreferrer'
				className='w-full py-4 rounded-b-lg font-medium text-white uppercase font-mono bg-primary-brand hover:bg-primary-brand/90 text-center block'
			>
				View on Explorer
			</a>
		);
	}

	const isDisabled = isLoading;

	return (
		<button
			className={`w-full py-4 rounded-b-lg font-semibold font-mono uppercase text-white bg-primary-brand
				${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-brand/90'}`}
			onClick={onClick}
			disabled={isDisabled}
		>
			{isLoading ? stateText : 'Swap securely'}
		</button>
	);
};
