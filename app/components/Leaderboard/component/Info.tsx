import { useState, useEffect } from "react";
import Info from "../../../../public/info1.svg";
import Image from "next/image";
import Link from "next/link";

export default function InfoButton() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasVisited = sessionStorage.getItem("hasVisited");

      if (!hasVisited) {
        if (window.location.pathname === "/leaderboard" || window.location.pathname === "/") {
          setIsOpen(true);
          sessionStorage.setItem("hasVisited", "true");
        }
      }

      const handleReload = () => {
        sessionStorage.removeItem("hasVisited");
      };

      window.addEventListener("beforeunload", handleReload);
      
      return () => {
        window.removeEventListener("beforeunload", handleReload);
      };
    }
  }, []);

  return (
    <>
      {typeof window !== "undefined" && window.location.pathname != "/" &&
      <button onClick={()=>setIsOpen(true)} >
        <Image src={Info} alt="Info" width={30} className="ml-2" />
        </button>}

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-[#5024FF26] backdrop-blur-[100px] font-thin p-6 text-lg text-white/80 border border-[#5024FF] border-opacity-50 p-4 w-[600px] h-[470px] min-w-fit text-left relative normal-case overflow-auto">
            <button
              className="absolute top-0 right-0 md:right-[1px] px-2 md:px-3 py-1 bg-white/10 text-white text-sm md:text-[18px] rounded-sm md:rounded-lg border-white/30 border-[1px] border-opacity-50"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-md md:text-[24px] font-mono font-bold mb-4">Welcome to Encifher</h2>
            <p className="text-[16px] font-mono mb-4">Lets together unlock the power of seamless, high-performance, confidential computation ⚡️</p>

            <h3 className="text-md md:text-[18px] font-mono font-semibold mb-2">How to use the protocol:</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 font-mono text-[16px]">
              <li>Claim encrypted USDC and MON tokens from the <a href="https://monad.encifher.io/faucet" className="text-[#5024FF] hover:underline">faucet</a></li>
              <li><Link href="/" className="text-[#5024FF] hover:underline" onClick={()=>setIsOpen(false)} >Swap</Link> USDC for ENC tokens</li>
              <li>Use ENC tokens to play <a href="https://yapmonad.xyz" className="text-[#5024FF] hover:underline">yapmonad.xyz</a> and compete for the highest score!</li>
              <li>Climb to the top of the leaderboard for exciting rewards</li>
            </ul>

            <p className="text-[16px] font-mono mb-4">Scores update weekly.</p>

            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="text-[18px] font-mono font-semibold mb-2">Boost your rewards:</h3>
              <p className="text-[16px] font-mono">Send encrypted payments through Encifher to three unique addresses to unlock a 10x booster.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
