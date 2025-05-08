export type Asset = {
	id: number;
	symbol: string;
	icon: string;
	address: `0x${string}`;
	erc20address: `0x${string}`;
};

export type Pool = {
	id: number;
	asset0: Asset;
	asset1: Asset;
	address: `0x${string}`;
}