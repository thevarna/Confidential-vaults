"use client"
import { useEffect, useState } from "react";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { decrypt32 } from "@/utils/fhevm";
// import { fetchUsdcUsdtPrice } from "@/utils/pool";
import { EUSDC_ACCOUNT } from "@/lib/constants";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { EtokenIDL } from "../idls";

export function useAsync() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [decryptedBalances, setDecryptedBalances] = useState<string[]>([])
  const [tokenPrices, setTokenPrices] = useState<[string, string]>(['', ''])
  const [normalBalances, setNormalBalances] = useState<string[]>([])

  const etokenProgram = new anchor.Program(
    EtokenIDL as anchor.Idl,
    new anchor.AnchorProvider(connection, wallet!, { preflightCommitment: 'processed' })
  );

  useEffect(() => {
    loadBalances()
    // fetchPrice()
  }, [])

  // const fetchPrice = async () => {
  //   const prices = await fetchUsdcUsdtPrice()
  //   setTokenPrices(prices)
  // }

  const loadBalances = async () => {
    if(!publicKey) return;
    const userAccount = Keypair.fromSeed(publicKey.toBuffer());
    const userBalance = await fetchBalance(userAccount.publicKey);
    const vaultTvl = await fetchBalance(new PublicKey(EUSDC_ACCOUNT));
    setDecryptedBalances([userBalance?.toString(), vaultTvl?.toString()])

    // const normalBalances = await Promise.all(assets.map(async (asset) => {
    //   return await fetchNormalBalances(asset.erc20address)
    // })
    // )
    // setNormalBalances(normalBalances as string[])
  }

  const fetchBalance = async (account: PublicKey) => {
    try {
      const accountInfo = await connection.getAccountInfo(account);
      if (!accountInfo) return 0;
      //@ts-ignore
      const accountData = etokenProgram.account.tokenAccount.coder.accounts.decode("tokenAccount", accountInfo.data);
      const decryptedBalance = await decrypt32(accountData?.amount?.handle?.toString());
      return Number(decryptedBalance) / 10 ** 6;
    } catch (e) {
      console.log('Error fetching balance', e);
      return 0;
    }
  }

  return { decryptedBalances, loadBalances, fetchBalance }
  // return { decryptedBalances, loadBalances, fetchBalance, tokenPrices, fetchPrice, normalBalances }
}
