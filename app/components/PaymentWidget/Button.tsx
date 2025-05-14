import React from 'react';

interface ButtonProps {
	loading: boolean;
	status: string;
	selectedToken: string;
	onClick: () => void;
	address: string;
	amount: string;
	balance: number;
}

const Button: React.FC<ButtonProps> = ({ loading, status, selectedToken, onClick, address, amount, balance }) => {
	const isDisabled = loading || !amount || !address || balance < Number(amount) || address.length !== 44 || amount === '0';
	const buttonTokenText = `Pay ${selectedToken}`;

	const buttonClass = `w-full py-4 rounded-b-lg font-semibold font-mono uppercase text-white 
		${isDisabled ? 'bg-zinc-900 text-zinc-500 cursor-not-allowed' : 'bg-primary-brand hover:bg-primary-brand/90'}`;

	let buttonText = 'Select Token';
	if (amount && address && balance >= Number(amount) && address.length === 44 && amount !== '0') {
		buttonText = loading ? status : `${buttonTokenText}`;
	} else if (!amount) {
		buttonText = 'Enter amount';
	} else if (!address) {
		buttonText = 'Enter address';
	} else if (balance < Number(amount)) {
		buttonText = 'Insufficient balance';
	} else if (address.length !== 44) {
		buttonText = 'Invalid address';
	} else if (amount === '0') {
		buttonText = 'Amount cannot be zero';
	}

	return (
		<button className={buttonClass} onClick={onClick} disabled={isDisabled}>
			{buttonText}
		</button>
	);
};

export default Button;
