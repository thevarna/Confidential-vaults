import { useState, useEffect } from 'react';
import { config } from '@/lib/config';
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { encryptAmount } from '@/utils/fhevm';
import { parseUnits, toHex } from 'viem';
import { addresses, eERC20Abi, DECIMALS, orderManagerAbi } from '@/lib/constants';
import { useAccount } from 'wagmi';
import { PROCESSING_TOASTS } from '../components/SwapWidget/types';
import { toast } from 'sonner';
import { defaultToast } from '@/utils/toastStyles';
import { Asset } from '@/lib/types';
import { Eip1193Provider, ethers } from 'ethers';
import { simulatePlaceOrder } from '@/utils/api';

export const useSwap = ({ fromAsset, toAsset }: { fromAsset: Asset, toAsset: Asset }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [stateText, setStateText] = useState<'Taking token approval...' | 'Swap in progress...' | 'Waiting for confirmation...' | ''>('');
	const [txHash, setTxHash] = useState<string | null>(null);
	const [isTransactionSent, setIsTransactionSent] = useState(false);
	const { address, connector } = useAccount();

	const resetSwapState = () => {
		setIsLoading(false);
		setStateText('');
		setTxHash(null);
		setIsTransactionSent(false);
	};

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isLoading && isTransactionSent) {
			let index = 0;
			interval = setInterval(() => {
				toast(PROCESSING_TOASTS[index], {
					...defaultToast,
					position: 'bottom-center',
				});
				index = (index + 1) % PROCESSING_TOASTS.length;
			}, 3000);
		}
		return () => clearInterval(interval);
	}, [isLoading, isTransactionSent]);

	const swap = async (amountIn: string, amountOut: string, onSuccess: () => void) => {
		if (!address) return;
		if (!connector) return;
		try {
			setIsLoading(true);
			setStateText('Taking token approval...');

			const eAmountIn = await encryptAmount(address, parseUnits(amountIn, DECIMALS), fromAsset.address);
			const provider = new ethers.BrowserProvider(await connector.getProvider() as Eip1193Provider);
			// const orderManagerAddress = fromAsset.symbol === 'USDC' ? addresses.USDCUSDTOrderManager: addresses.USDTUSDCOrderManager;

			let orderManagerAddress = '';
			if( fromAsset.symbol === 'USDC') {
				if(toAsset.symbol === 'USDT') {
					orderManagerAddress = addresses.USDCUSDTOrderManager;
				} else {
					orderManagerAddress = addresses.USDCENCOrderManager;
				}
			}else if (fromAsset.symbol === 'USDT') {
				if(toAsset.symbol === 'USDC') {
					orderManagerAddress = addresses.USDTUSDCOrderManager;
				} else {
					orderManagerAddress = addresses.USDTENCOrderManager;
				}
			}else if (fromAsset.symbol === 'ENC') {
				if(toAsset.symbol === 'USDC') {
					orderManagerAddress = addresses.ENCUSDCOrderManager;
				} else {
					orderManagerAddress = addresses.ENCUSDTOrderManager;
				}
			} else {
				throw new Error('Invalid asset');
			}

			try {
				const hash = await writeContract(config, {
					address: fromAsset.address,
					abi: eERC20Abi,
					functionName: 'approve',
					args: [orderManagerAddress, toHex(eAmountIn.handles[0]), toHex(eAmountIn.inputProof)],
				});
				await provider.waitForTransaction(hash);
			} catch (error) {
				console.error('Approve failed', error);
				throw error;
			}
      console.log("fromAsset.symbol", fromAsset.symbol)
      // simulatePlaceOrder(fromAsset.symbol === 'USDC' ? 'USDC_TO_USDT' : 'USDT_TO_USDC'); // need to pass order manager type here

			setIsTransactionSent(true);
			setStateText('Swap in progress...');
			// const orderManagerContract = new ethers.Contract(addresses.orderManager, orderManagerAbi, signer);
			try {
				// const tx = await orderManagerContract.placeOrder((Math.floor(Date.now() / 1000) + 3600), eAmountIn.handles[0], eAmountIn.inputProof);
				// await tx.wait();
        simulatePlaceOrder(Number(amountIn), fromAsset.symbol === 'USDC' ? 'USDC_TO_USDT' : 'USDT_TO_USDC'); // need to pass order manager type here
        await new Promise(resolve => setTimeout(resolve, 2000));
				const hash = await writeContract(config, {
					address: orderManagerAddress as `0x${string}`,
					abi: orderManagerAbi,
					functionName: 'placeOrder',
					args: [(Math.floor(Date.now() / 1000) + 3600), toHex(eAmountIn.handles[0]), toHex(eAmountIn.inputProof)],
        });
				await provider.waitForTransaction(hash);
				setTxHash(hash);

        // Once the swap has been executed, check for the user in the database.
        // If the wallet address does not exist, the API endpoint is expected to create it.
        try {
          await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ wallet: address })
          });
        } catch (e) {
          console.error('Error saving user to database', e);
          // Do not fail the swap if saving the user fails.
        }
			} catch (error) {
				console.error(error);
				throw error;
			}
			setStateText('Waiting for confirmation...');
			onSuccess();
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			setIsLoading(false);
			setStateText('');
			setIsTransactionSent(false);
		}
	};

	return { swap, isLoading, stateText, txHash, resetSwapState, isTransactionSent };
};
