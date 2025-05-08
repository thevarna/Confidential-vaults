'use client';
import { getDefaultConfig, Chain } from '@rainbow-me/rainbowkit'
import { base, baseSepolia, arbitrum, arbitrumSepolia } from 'viem/chains';

const baseSepoliaPrivate: Chain = {
   ...baseSepolia,
   rpcUrls: {
      default: {
         http: [process.env.NEXT_PUBLIC_BASE_SEPOLIA_URL || baseSepolia.rpcUrls.default.http[0]],
      },
   }
}

const monadTestnet: Chain = {
   id: 0x279f,
   name: 'Monad Testnet',
   nativeCurrency: {
      name: 'MON',
      symbol: 'MON',
      decimals: 18,
   },
   rpcUrls: {
      default: {
       http: [process.env.NEXT_PUBLIC_MONAD_RPC_URL || ''],
      },
   },
   blockExplorers: {
      default: {
         name: 'Monad Explorer',
       url: 'https://testnet.monadexplorer.com/',
      },
   },
};

export const config = getDefaultConfig({
   appName: 'Encifher Swap',
   projectId: 'cbabb06b3a049fce0e9231318d94998e',
   chains: [monadTestnet],
   // chains: [base, arbitrum, baseSepolia, arbitrumSepolia],
});

export const metamaskConfig = {
   method: "wallet_addEthereumChain",
   params: [
      {
         chainId: `0x279f`,
         chainName: monadTestnet.name,
       rpcUrls: [monadTestnet.rpcUrls?.default?.http[0]],
         nativeCurrency: monadTestnet.nativeCurrency,
       blockExplorerUrls: [monadTestnet.blockExplorers?.default?.url],
      },
   ],
};
