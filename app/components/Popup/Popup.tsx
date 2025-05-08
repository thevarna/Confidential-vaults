import React from 'react';
import Image from 'next/image';
import { useAccount } from 'wagmi';

interface PopupProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    txHash: string | null;
    fromAmount: string;
    toAmount: string;
}

export default function Popup({ isOpen, setIsOpen, txHash, fromAmount, toAmount }: PopupProps) {
    const { chain } = useAccount();
    return (
        isOpen && <>
            <div className="fixed inset-0 flex justify-center items-center z-20 w-[33%] h-[78%] m-auto text-white font-mono">
                <div className="flex flex-col items-center justify-around rounded-lg shadow-lg relative h-full w-full bg-black">
                    <div className='flex justify-between items-center w-full h-[12.5%] px-2'>
                        <p className='px-5 text-md'>ENCIFHER SWAP</p>
                        <button className='px-5' onClick={() => setIsOpen(false)}>X</button>
                    </div>
                    <div className='top-0 h-[1px] w-full bg-[#111111]'></div>
                    <div className='w-full h-[80%] flex flex-col justify-around gap-3 items-center py-8'>
                        <div className='h-[80%] w-full flex mb-3 flex-col items-center justify-between'>
                            <div className='flex items-center justify-center'>
                                <Image width="100" height="10" src="/ok.svg" alt='' />
                            </div>
                            <div className='p-4 pt-10 text-center'>SWAP COMPLETED SUCCESSFULLY
                                <div className='p-4 text-center text-[#9c9d9c]'>
                                    Transaction completed. You can view it on the&nbsp;
                                    <a
                                        className='text-primary-brand-light underline hover:cursor-pointer'
                                        href={`${chain?.blockExplorers?.default?.url}/tx/${txHash}`}
                                        target='_blank'
                                    >
                                        Block Explorer
                                    </a> and&nbsp;
                                    <a
                                        className='text-primary-brand-light underline hover:cursor-pointer'
                                        href={`https://dashboard.tenderly.co/tx/base-sepolia/${txHash}`}
                                        target='_blank'
                                    >
                                        Tenderly
                                    </a> for details.
                                </div>
                            </div>
                        </div>
                        <div className='w-[90%] h-[25%] bg-white rounded-md bg-[#0e0d0c] flex items-center justify-around p-2'>
                            <div className='w-[20%] flex items-center justify-center'>
                                <Image width="40" height="10" src="/check.svg" alt='' />
                            </div>
                            <div className='w-[80%] flex flex-col gap-2 items-start'>
                                Swap Via Uniswap
                                <p className='text-[#9c9d9c]'>{toAmount} USDT for {fromAmount} USDC on Base</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-[99%] h-[8%] bg-white rounded-b-lg mb-[2px]'>
                        <button className='w-full h-full text-black' onClick={() => setIsOpen(false)}>
                            SWAP AGAIN
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
