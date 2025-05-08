import { ReactNode } from "react"

interface TableProps {
    title: string,
    headers: ReactNode[],
    rows: ReactNode[][],
    rowsLoading?: boolean
}

export default function Table({ title, headers, rows, rowsLoading }: TableProps) {
    return (
        <div className="flex flex-col items-start max-h-[50vh] w-full mx-4 px-0 md:px-6 py-2 gap-5 z-10 overflow-y-hidden">
            <h1 className="text-xl md:text-2xl text-white font-mono uppercase">{title}</h1>
            <div className="flex flex-col w-full border border-white/10 rounded-[4px] text-sm font-mono grow overflow-y-auto">
                <div className="flex items-center w-full text-white/60 py-4 sticky top-0 bg-black z-20 border-b-[1px] border-b-white/10">
                    {headers.map((header, i) => (
                        <div key={i} className="flex-1 text-center">{header}</div>
                    ))}
                </div>
                <div className="relative w-full grow min-h-[12vh] max-h-[36vh]">
                    {
                        !rowsLoading ? rows.map((row, i) => (
                            <div key={i} className="flex items-center w-full text-white/60 py-4">
                                {row.map((cell, j) => (
                                    <div key={j} className="flex-1 text-center">{cell}</div>
                                ))}
                            </div>
                        )) :
                            <div
                                className="absolute top-1/3 left-1/2 w-10 h-10 border-2 border-transparent 
                                border-t-primary-brand border-solid rounded-full animate-spin">
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}
