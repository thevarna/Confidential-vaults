"use client"
import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi"
import { config } from "@/lib/config";
import { eERC20Abi, DECIMALS, encifherERC20Abi } from "@/lib/constants";
import { readContract } from "wagmi/actions";
import { decrypt32 } from "@/utils/fhevm";
import { formatUnits } from "viem";
import { assets } from "@/utils/token";
import { fetchUsdcUsdtPrice } from "@/utils/pool";

export function useAsync() {
    const publicClient = usePublicClient()
    const { address } = useAccount()
    const [decryptedBalances, setDecryptedBalances] = useState<string[]>([])
    const [tokenPrices, setTokenPrices] = useState<[string, string]>(['', ''])
    const [normalBalances, setNormalBalances] = useState<string[]>([])

    useEffect(() => {
      loadBalances()
      fetchPrice()
    }, [])

  const fetchPrice = async () => {
    const prices = await fetchUsdcUsdtPrice()
    setTokenPrices(prices)
  }

    const loadBalances = async () => {
        const balances = await Promise.all(assets.map(async (asset) => {
            return await fetchBalance(asset.address)
        })
        )
        setDecryptedBalances(balances as string[])

        const normalBalances = await Promise.all(assets.map(async (asset) => {
            return await fetchNormalBalances(asset.erc20address)
        })
        )
        setNormalBalances(normalBalances as string[])
    }

    const fetchBalance = async (tokenAddress: `0x${string}`) => {
        if (!publicClient) return;
        if (!address) return;
        try {
            const balance = await readContract(config, {
                address: tokenAddress,
                abi: eERC20Abi,
                functionName: "balanceOf",
                args: [address]
            }) as bigint;
          const decryptedBalance = await decrypt32(balance);
          return formatUnits(decryptedBalance, DECIMALS);
        } catch (e) {
          console.log('Error fetching balance', e);
          return "0";
        }
    }

    const fetchNormalBalances = async (tokenAddress: `0x${string}`) => {
        if (!publicClient) return;
        if (!address) return;
        let SHMON = '0x3a98250f98dd388c211206983453837c8365bdc1'
        let is_SHMON = tokenAddress === SHMON
        try {
            const balance = await readContract(config, {
                address: tokenAddress,
                abi: encifherERC20Abi,
                functionName: "balanceOf",
                args: [address]
            }) as bigint;
            return formatUnits(balance, is_SHMON ? 18 : 6);
        } catch (e) {
            console.log('Error fetching balance', e);
            return "0";
        }
    }

  return { decryptedBalances, loadBalances, fetchBalance, tokenPrices, fetchPrice, normalBalances }
}
