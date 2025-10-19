import { TEEClient, PlaintextType } from '@encifher-js/core';

// let client: TEEClient;

export const encryptAmount = async (address: string, amount: bigint, contractAddress: string) => {
	// if (!client) {
	// 	client = new TEEClient();
	
	// }
  const client = new TEEClient({ teeGatewayUrl: process.env.TEE_GATEWAY_URL || 'https://monad.encrypt.rpc.encifher.io' });
  await client.init();
	const handle = await client.encrypt(amount, PlaintextType.uint32)
	return {
		handles: [
			handle,
		],
		inputProof: (new Uint8Array(1)).fill(1),
	}
};

const getCiphertext = async (handle: bigint): Promise<string> => {
	return ""
};

export const decrypt32 = async (
	handle: bigint
): Promise<bigint> => {
	try {
    const response = await fetch('/api/decrypt', {
			method: 'POST',
			body: JSON.stringify({
				handle: handle.toString(),
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
		const decryptedValue = await response.json();
		console.log("decrypted value ", decryptedValue)
		return BigInt(decryptedValue)
	} catch (error) {
		console.error('Error decrypting', error);
		return BigInt("0");
	}
};
