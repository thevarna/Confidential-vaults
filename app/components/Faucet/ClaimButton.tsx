import React from 'react';
import { Token } from './types';

interface ClaimButtonProps {
	loading: boolean;
	status: string;
	selectedToken: string;
	tokens: Token[];
	onClick: () => void;
	address: string; // Add this prop
}

const ClaimButton: React.FC<ClaimButtonProps> = ({ loading, status, selectedToken, tokens, onClick, address }) => {
	const selectedTokenValue = tokens.find((token) => token.symbol === selectedToken)?.value;

	const isDisabled = !selectedTokenValue || loading || !address;
	const buttonTokenText = tokens.map((token) => `${token.value + " " + token.symbol}`).join(', ');

	const buttonClass = `w-full py-4 rounded-b-lg font-semibold font-mono uppercase text-white 
		${isDisabled ? 'bg-zinc-900 text-zinc-500 cursor-not-allowed' : 'bg-primary-brand hover:bg-primary-brand/90'}`;

	let buttonText = 'Select Token';
	if (address && selectedTokenValue) {
		buttonText = loading ? status : `Claim ${buttonTokenText}`;
	} else if (!address) {
		buttonText = 'Enter Address';
	}

	return (
		<button className={buttonClass} onClick={onClick} disabled={isDisabled}>
			{buttonText}
		</button>
	);
};

export default ClaimButton;
