import { useState, useEffect } from 'react';
// import { metamaskConfig } from '@/lib/config';
import { toast } from 'sonner';
import { errorToast, successToast } from '@/utils/toastStyles';
import { useSyncProviders } from '@/app/hooks/useSyncProvider';

export const useEncifherNetwork = () => {
	const [isNetworkAdded, setIsNetworkAdded] = useState<boolean | null>(null);
	const providers = useSyncProviders();
	const metamaskProvider = providers.find((provider) => provider.info.name === 'MetaMask');

	useEffect(() => {
		const checkNetwork = async () => {
			if (metamaskProvider?.provider) {
				try {
					await metamaskProvider?.provider.request({ method: 'eth_chainId' }).then(
						(chainId) => {
							// setIsNetworkAdded(chainId === metamaskConfig.params[0].chainId)
						}
					);
				} catch (error) {
					console.error('Error checking network:', error);
					setIsNetworkAdded(false);
				}
			} else {
				if (providers && providers.length === 0)
					setIsNetworkAdded(true);
				else
					console.error('Injected ethereum not found');
			}
		};

		checkNetwork();
	}, [isNetworkAdded, metamaskProvider]);

	const addEncifherNetworkConfig = async () => {
		try {
			if (metamaskProvider?.provider) {
				// await metamaskProvider?.provider.request(metamaskConfig).then(
					// () => setIsNetworkAdded(true)
				// )
				toast.success('Encifher network added to MetaMask successfully', successToast);
			} else {
				toast.error('Injected ethereum not found', errorToast);
			}
		} catch (err) {
			console.error('Error adding network:', err);
			toast.error('Failed to add Encifher network to your MetaMask', errorToast);
		}
	};

	return { isNetworkAdded, addEncifherNetworkConfig };
};
