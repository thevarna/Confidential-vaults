'use client'
import Table from "./Table"
import { useAsync } from "@/app/hooks/useAsync"
import { assets } from "@/utils/token"
import { JsonRpcProvider, parseUnits } from "ethers"
import { useEffect, useState } from "react"
// import { useAccount } from "wagmi"
import Image from "next/image"
// import { writeContract } from "wagmi/actions"
import { config } from "@/lib/config"
import { eerc20WrapperAbi, encifherERC20Abi } from "@/lib/constants"
import { toast } from "sonner"
import { ChevronRightIcon } from "@heroicons/react/24/outline"

const headers = ["Token name", "Price", "Amount", "USD value", "Encrypt"]

export default function ERC20Table() {
    const { tokenPrices, normalBalances } = useAsync()
    const [monValue, setMonValue] = useState("0")
    // Global state to ensure only one wrapping tx is processed at a time.
    const [txInProgress, setTxInProgress] = useState(false)

    const tokens: Record<string, { address: string; wrapper: string }> = {
        "USDC": {
            address: "0x32b998Fbb790FeBdfcf52a9bA7dfaDB7d244986a",
            wrapper: "0x2DdcacdB3fB815F39F993CAa633E8de43661407B",
        },
        "ENC": {
            address: "0xc68e6743c5a1eEdFa3cED431859608e85A316434",
            wrapper: "0x5A3921F932cbC78914151F17290f577bC4302184",
        },
        "SHMON": {
            address: "0x3a98250f98dd388c211206983453837c8365bdc1",
            wrapper: "0x82c45f9530F94031EFb82522E6B26bfbCAa1bC0e",
        }
    }

    // const { address: userAddress } = useAccount()
    const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_MONAD_RPC_URL)

    // useEffect(() => {
    //     if (!userAddress) return
    //     provider.getBalance(userAddress).then((balance) => {
    //         setMonValue((Number(balance) / 1e18).toFixed(3))
    //     })
    // }, [userAddress])

    // EncryptCell now receives the global txInProgress state and its setter.
    type EncryptCellProps = {
        tokenSymbol: string;
        txInProgress: boolean;
        setTxInProgress: React.Dispatch<React.SetStateAction<boolean>>;
    }

    const EncryptCell = ({ tokenSymbol, txInProgress, setTxInProgress }: EncryptCellProps) => {
        const [value, setValue] = useState("")
        if (!tokens[tokenSymbol]) return null

        // const { chain } = useAccount();

        const tokenAddress = tokens[tokenSymbol].address
        const wrapperAddress = tokens[tokenSymbol].wrapper

        const handleEncrypt = async () => {
            if (txInProgress) return
            setTxInProgress(true)
            console.log(`Encrypting ${value} of ${tokenSymbol}`)
            const is_shmon = tokenSymbol === "SHMON"
            toast.success(`Successfully wrapped ${value} ${tokenSymbol}`)

            try {
                try {
                    // let hash = await writeContract(config, {
                    //     address: tokenAddress as `0x${string}`,
                    //     abi: encifherERC20Abi,
                    //     functionName: 'approve',
                    //     args: [wrapperAddress, parseUnits(value, is_shmon ? 18 : 6)],
                    // })
                    // await provider.waitForTransaction(hash)
                    // console.log("Approved")
                } catch (error) {
                    console.error('Approve failed', error)
                }
                try {

                    // if (is_shmon) {
                    //     let hash = await writeContract(config, {
                    //         address: tokenAddress as `0x${string}`,
                    //         abi: encifherERC20Abi,
                    //         functionName: 'transfer',
                    //         args: [wrapperAddress, (parseUnits(value, 18) - parseUnits(value, 6)).toString()],
                    //     })
                    //     await provider.waitForTransaction(hash)
                    // }

                    // let hash = await writeContract(config, {
                    //     address: wrapperAddress as `0x${string}`,
                    //     abi: eerc20WrapperAbi,
                    //     functionName: 'depositAndWrap',
                    //     args: [userAddress, parseUnits(value, 6)],
                    // })
                    // await provider.waitForTransaction(hash)
                    // toast.custom(
                    //     (t) => (
                    //         <div className="font-mono text-sm text-primary-brand-light bg-primary-brand/15 border border-primary-brand/25 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                    //             <div className="flex items-center">
                    //                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    //                 </svg>
                    //                 <p>All tokens wrapped successfully</p>
                    //             </div>
                    //             <p className="mt-1 text-xs">
                    //                 Transaction ID: {hash.slice(0, 5)}...{hash.slice(-3)}
                    //             </p>
                    //             <button
                    //                 onClick={() => window.open(`${chain?.blockExplorers?.default?.url}/tx/${hash}`, '_blank')}
                    //                 className="mt-2 bg-primary-brand/20 text-primary-brand-light px-3 py-1 rounded text-xs hover:bg-primary-brand/30 transition-colors duration-200"
                    //             >
                    //                 View on Explorer
                    //             </button>
                    //         </div>
                    //     ),
                    //     { duration: 5000 }
                    // );
                    console.log("Wrapped")
                } catch (error) {
                    console.error('Wrap failed', error)
                }
            } finally {
                setTxInProgress(false)
            }
        }

        return (
            <div
                className="
        flex flex-row items-center 
        bg-black border border-white/10 rounded-lg 
        pl-4 pr-2 py-2 backdrop-blur-sm
        hover:border-white/20
        w-max
      "
            >
                <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={txInProgress}
                    placeholder="Amount"
                    className="
          bg-transparent text-white font-mono 
          placeholder-white/50 focus:outline-none w-[100px]
        "
                />
                <button
                    onClick={handleEncrypt}
                    disabled={txInProgress}
                    className="ml-2 flex-shrink-0"
                >
                    <ChevronRightIcon
                        className={`w-5 h-5 ${txInProgress ? "animate-spin text-white/50" : "text-primary-brand-light"
                            }`}
                    />
                </button>
            </div>
        )
    }

    const rows = [
        ...assets.map((asset, i) => ([
            (
                <div className="flex items-center justify-center gap-2" key={i}>
                    <img src={asset.icon} alt={asset.symbol} className="w-5 h-5" />
                    <span>{asset.symbol}</span>
                </div>
            ),
            tokenPrices[i] ? `$${Number(tokenPrices[i]).toFixed(3)}` : "N/A",
            normalBalances[i] ? Number(normalBalances[i]).toFixed(3) : "N/A",
            tokenPrices[i] && normalBalances[i]
                ? `$${(Number(tokenPrices[i]) * Number(normalBalances[i])).toFixed(3)}`
                : "N/A",
            <div className="flex items-center justify-center gap-2" key={`encrypt-${i}`}>
                <EncryptCell
                    tokenSymbol={asset.symbol}
                    txInProgress={txInProgress}
                    setTxInProgress={setTxInProgress}
                />
            </div>
        ])),
        // Additional row for MON
        [
            (
                <div className="flex items-center justify-center gap-2" key="mon">
                    <Image
                        src="https://testnet.monadexplorer.com/images/token/monad.svg"
                        alt="MON"
                        width={5}
                        height={5}
                        className="w-5 h-5"
                    />
                    <span>MON</span>
                </div>
            ),
            "-",
            monValue,
            `$${monValue}`,
            <div className="flex items-center justify-center gap-2" key="encrypt-mon">
                <EncryptCell
                    tokenSymbol="MON"
                    txInProgress={txInProgress}
                    setTxInProgress={setTxInProgress}
                />
            </div>
        ]
    ]

    return (
        <Table title="Assets" headers={headers} rows={rows} />
    )
}
