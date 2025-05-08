import React from 'react';

const FaucetHeader: React.FC = () => (
	<div className='px-6 py-2 flex justify-center text-xs text-white/50 font-mono uppercase bg-black/20 items-center gap-1'>
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor' className='size-3 fill-primary-brand'>
			<path
				fillRule='evenodd'
				d='M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z'
				clipRule='evenodd'
			/>
		</svg>
		<div>Encrypted Faucet</div>
	</div>
);

export default FaucetHeader;
