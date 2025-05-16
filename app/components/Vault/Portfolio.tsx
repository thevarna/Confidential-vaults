

export default function Portfolio() {
    return (
        <div className="font-mono w-screen px-6 md:px-12 lg:px-24 py-1">
            <div className="flex items-center gap-2 mb-8">
                <h2 className="text-white/70 text-2xl font-medium">PORTFOLIO</h2>
                {/* TODO: Add eye button */}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="col-span-1">
                    <p className="text-white/60 text-sm mb-1">DEPOSITED</p>
                    <p className="text-white text-xl">$10K</p>
                </div>

                <div className="col-span-1">
                    <p className="text-white/60 text-sm mb-1">MONTHLY YIELD</p>
                    <p className="text-white text-xl">$1,397</p>
                </div>

                <div className="col-span-1">
                    <p className="text-white/60 text-sm mb-1">DAILY YIELD</p>
                    <p className="text-white text-xl">0.1%</p>
                </div>

                <div className="col-span-1">
                    <p className="text-white/60 text-sm mb-1">AVG. APY</p>
                    <p className="text-white text-xl">9%</p>
                </div>

                <div className="col-span-1 ml-0 md:ml-auto text-left md:text-right">
                    <p className="text-white/60 text-sm mb-1">TVL</p>
                    <p className="text-white text-xl">$520.2M</p>
                </div>

                <div className="col-span-1 text-left md:text-right">
                    <p className="text-white/60 text-sm mb-1">VAULTS</p>
                    <p className="text-white text-xl">3</p>
                </div>
            </div>
        </div>
    )
}