export type FaucetSuccessType = {
	isSuccessful: boolean;
	encifher_txid: string | undefined;
	error: string | undefined;
};

export type Token = {
	symbol: string;
	icon: string;
	value: string;
};
