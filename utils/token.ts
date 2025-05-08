import { Asset } from "@/lib/types";
import { addresses } from "@/lib/constants";

export const assets: Asset[] = [
	{ id: 0, symbol: 'USDC', icon: '/usdc.svg', address: addresses.eUSDC, erc20address: addresses.USDC },
	// { id: 1, symbol: 'USDT', icon: '/usdt.svg', address: addresses.eUSDT },
	{ id: 1, symbol: 'ENC', icon: '/enc.svg', address: addresses.eENC, erc20address: addresses.ENC },
	{ id: 2, symbol: 'SHMON', icon: '/shmon.webp', address: '0xE5E9d55AfF5aAafCE98A62e01f0D7901d4E1aeCF', erc20address: '0x3a98250f98dd388c211206983453837c8365bdc1' }
];

export const erc20Assets = [
	{
		id: 0, symbol: 'USDC',
		icon: '/usdc.svg', address: addresses.USDC,
		wrapper: addresses.eUSDCWrapper,
		eerc20: addresses.eUSDC,
		anonTransferAddress: ''
	},
	// {
	// 	id: 1,
	// 	symbol: 'USDT',
	// 	icon: '/usdt.svg',
	// 	address: addresses.USDT,
	// 	eerc20: addresses.eUSDT,
	// 	wrapper: addresses.eUSDTWrapper,
	// 	anonTransferAddress: ''
	// },

	{
		id: 1,
		symbol: 'ENC',
		icon: '/enc.svg',
		address: addresses.ENC,
		eerc20: addresses.eENC,
		wrapper: addresses.eENCWrapper,
		anonTransferAddress: ''
	}
]