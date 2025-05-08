'use client';

import React, { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { toast } from 'sonner';
import { defaultToast } from '@/utils/toastStyles';

export const CustomConnectButton: React.FC<{ isNetworkAdded: boolean | null }> = ({ isNetworkAdded }) => {
	const [key, setKey] = useState(0);

	useEffect(() => {
		setKey((prevKey) => prevKey + 1);
	}, [isNetworkAdded]);

	const handleConnect = (openConnectModal: () => void) => {
		console.log(isNetworkAdded);
		if (!isNetworkAdded) {
			toast.error('Please add Encifher Network to your wallet', defaultToast);
			return;
		}
		openConnectModal();
	};

	return (
		<ConnectButton.Custom key={key}>
			{({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
				const ready = mounted && authenticationStatus !== 'loading';
				const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

				return (
					<div
						{...(!ready && {
							'aria-hidden': true,
							style: {
								opacity: 0,
								pointerEvents: 'none',
								userSelect: 'none',
							},
						})}
					>
						{(() => {
							if (!connected) {
								return (
									<button
										// onClick={() => handleConnect(openConnectModal)}
										onClick={openConnectModal}
										className='px-4 py-2 font-mono text-sm uppercase border text-primary-brand-light bg-primary-brand/15 border-primary-brand/25 backdrop-blur-sm hover:bg-primary-brand/25 transition-all duration-300'
									>
										Connect Wallet
									</button>
								);
							}
							if (chain && chain.unsupported) {
								return (
									<button
										onClick={openChainModal}
										className='px-4 py-2 font-mono text-sm uppercase border text-primary-brand-light bg-primary-brand/15 border-primary-brand/25 backdrop-blur-sm hover:bg-primary-brand/25 transition-all duration-300'
									>
										Wrong network
									</button>
								);
							}
							return (
								<div className='flex flex-row gap-2'>

									<button
										onClick={openChainModal}
										className='flex flex-row items-center gap-2 px-4 py-2 font-mono text-sm border text-primary-brand-light bg-primary-brand/15 border-primary-brand/25 backdrop-blur-sm hover:bg-primary-brand/25'
									>
										{/* <Image src={'/eth.svg'} width={16} height={16} alt='logo' /> */}
										<button
											style={{ display: 'flex', alignItems: 'center' }}
											type="button"
										>
											{chain.hasIcon && (
												<div
													style={{
														background: chain.iconBackground,
														width: 15,
														height: 15,
														borderRadius: 999,
														overflow: 'hidden',
														marginRight: 4,
													}}
												>
													{chain.iconUrl && (
														<img
															alt={chain.name ?? 'Chain icon'}
															src={chain.iconUrl}
															style={{ width: 15, height: 15 }}
														/>
													)}
												</div>
											)}
											{/* {chain.name} */}
										</button>
										{account.displayBalance ? ` ${account.displayBalance}` : ''}

									</button>
									<button
										onClick={openAccountModal}
										className='px-4 py-2 font-mono text-sm uppercase border text-primary-brand-light bg-primary-brand/15 border-primary-brand/25 backdrop-blur-sm hover:bg-primary-brand/25 transition-all duration-300'
									>
										{account.displayName}
									</button>
								</div>
							);
						})()}
					</div>
				);
			}}
		</ConnectButton.Custom>
	);
};

export default CustomConnectButton;
