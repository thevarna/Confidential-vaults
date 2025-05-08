import { Asset, Pool } from '@/lib/types';
import { assets } from './token';
import { createClient, gql } from 'urql';
import { cacheExchange, fetchExchange } from '@urql/core';
import { UNISWAP_USDCUSDT_POOLID } from '@/lib/constants';

export const pools: Pool[] = [
	{ id: 0, asset0: assets[0], asset1: assets[1], address: '0xf6867f8c1CECc3AC05406173D2568Bbd02734167' },
];

const sort = (symbols: [string, string]): [string, string] => {
	return symbols.sort((a, b) => a.localeCompare(b))
}

export const getPool = (assets: [Asset, Asset]): Pool => {
	const sorted = sort(assets.map(asset => asset?.symbol) as [string, string])
	const pool = pools.find(pool => {
		const asset0 = pool.asset0.symbol
		const asset1 = pool.asset1.symbol
		return sorted[0] === asset0 && sorted[1] === asset1
	})
	if (!pool) {
		return {
			id: -1,
			address: '0x',
			asset0: assets[0],
			asset1: assets[1]
		}
	}
	return pool
}

export const fetchPoolPrices = async (id: string): Promise<[string, string]> => {
	const client = createClient({
		url: `https://gateway.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_APIKEY}/subgraphs/id/FUbEPQw1oMghy39fwWBFY5fE6MXPXZQtjncQy2cXdrNS`,
		exchanges: [cacheExchange, fetchExchange],
	})
	const result = await client.query(gql`
	query LiquidityPoolAmount($id: String!) {
		liquidityPoolAmount(id: $id) {
			tokenPrices
		}
	}`, { id: id }).toPromise();
	if (result.error) {
		console.log('Error fetching pool prices', result.error)
		return ['', '']
	}
	const { tokenPrices } = result.data.liquidityPoolAmount
	return tokenPrices
}

export const fetchUsdcUsdtPrice = async (): Promise<[string, string]> => {
	return fetchPoolPrices(UNISWAP_USDCUSDT_POOLID)
}