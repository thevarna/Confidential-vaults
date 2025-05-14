'use client'
import { useEffect, useState } from "react"
import Table from "./Table"
import { assets } from "@/utils/token"
// import { useAccount } from "wagmi"
import { useAsync } from "@/app/hooks/useAsync"
import { addresses } from "@/lib/constants"

const headers = ["Token name", "Price", "Amount", "Type", "Time", (<img src="/etherscan.svg" className="w-full h-6" />)]

type Tx = {
    tokenId: number,
    name: string,
    icon: string,
    amount: number,
    isReceive: boolean,
    time: string,
    hash: string
}

export default function TxTable() {
    const [transactions, setTransactions] = useState<Tx[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    // const { address, chain } = useAccount();
    // const { tokenPrices } = useAsync()

    // useEffect(() => {
    //     const fetchTransactions = async () => {
    //         try {
    //             setLoading(true)
              // if (!address) {
              //   setLoading(false)
              //   return
              // }
              // const response = await fetch(`/api/fetchTransaction?wallet=${address}`)
              //   if (!response.ok) throw new Error(await response.text())
              // const data = await response.json()

              // const txnArray = Array.isArray(data.txnData)
              //   ? data.txnData
              //   : data.txnData && Array.isArray(data.txnData.txnData)
              //     ? data.txnData.txnData
              //     : []

              // const processed = txnArray
              //   .map((tx: any) => {
              //     let id = -1;

              //     // Map transactions based on the contract address.
              //     // Assume ENC transactions come from any of these addresses.
              //     if (
              //       tx.to === addresses.USDCENCOrderManager ||
              //       tx.to === addresses.ENCUSDCOrderManager ||
              //       tx.to === addresses.ENCUSDTOrderManager ||
              //       tx.to === addresses.eENCWrapper
              //     ) {
              //       id = 0;
              //     } else if (
              //       tx.to === addresses.USDCUSDTOrderManager ||
              //       tx.to === addresses.eUSDCWrapper
              //     ) {
              //       id = 1;
              //     }

              //     if (id === -1) return null;

              //     const asset = assets[id];
              //     return {
              //       tokenId: id,
              //       name: asset?.symbol || "Unknown",
              //       icon: asset?.icon || "",
              //       amount: Number(tx.amount),
              //       isReceive: tx.from !== address,
              //       time: new Date(tx.timestamp * 1000).toLocaleString(),
              //       hash: tx.hash
              //     };
              //   })
              //   .filter(Boolean);

              // setTransactions(processed)
              //   setLoading(false)
    //         } catch (error) {
    //             console.error(error)
    //             setLoading(false)
    //         }
    //     }
    //     fetchTransactions()
    // }, [address])

    return (
        <Table title="Transactions" headers={headers} rows={
            [...transactions?.map((tx) => ([
                (<div className="flex items-center justify-center gap-2">
                    <img src={tx?.icon} alt={tx?.name} className="w-5 h-5" />
                    <span>{tx?.name}</span>
                </div>),
                // tokenPrices[tx?.tokenId] ? `$${Number(tokenPrices[tx?.tokenId])?.toFixed(3)}` : "N/A",
                tx?.amount ? Number(tx?.amount)?.toFixed(3) : "N/A",
                (<div className="flex items-center justify-center gap-2">
                    <img src={tx?.isReceive ? "/greenarrow.svg" : "/redarrow.svg"} alt="arrow" className="w-2 h-2" />
                    <span>{tx?.isReceive ? "Receive" : "Send"}</span>
                </div>),
                tx?.time,
                <img src="/forward.svg" className="w-full h-5 hover:cursor-pointer" onClick={() => {
                    // window.open(`${chain?.blockExplorers?.default?.url}/tx/${tx?.hash}`, "_blank")
                }
                } />
            ]))]
        } rowsLoading={loading} />
    )
}
