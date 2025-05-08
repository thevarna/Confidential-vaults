import React from 'react';

interface ButtonProps {
	loading: boolean;
	status: string;
	selectedToken: string;
	onClick: () => void;
	address: string;
	amount: string;
	isChecked: boolean;
}

const Button: React.FC<ButtonProps> = ({ loading, status, selectedToken, onClick, address, amount, isChecked }) => {
	const isDisabled = loading || !amount || (isChecked && !address);
	const buttonTokenText = `Deposit ${selectedToken}`;

	const buttonClass = `w-full py-4 rounded-b-lg font-semibold font-mono uppercase text-white 
		${isDisabled ? 'bg-zinc-900 text-zinc-500 cursor-not-allowed' : 'bg-primary-brand hover:bg-primary-brand/90'}`;

	let buttonText = 'Select Token';
	if (isChecked ? amount && address : amount) {
		buttonText = loading ? status : `${buttonTokenText}`;
	} else if (!amount) {
		buttonText = 'Enter amount';
	} else if (isChecked && !address) {
		buttonText = 'Enter claimer address';
	}

	return (
		<button className={buttonClass} onClick={onClick} disabled={isDisabled}>
			{buttonText}
		</button>
	);
};

export default Button;
