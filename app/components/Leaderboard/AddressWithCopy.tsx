import { useState } from "react";
import Image from "next/image";
const AddressWithCopy = ({ address }: {address: string}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    
    // Revert back to original icon after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <h1>{`${address.slice(0, 4)}...${address.slice(-4)}`}</h1>
      <Image
        src={copied ? "/icon/tick.svg" : "/icon/copy.svg"}
        width={24}
        height={24}
        alt=""
        onClick={handleCopy}
        className={`cursor-pointer ${copied ? 'w-[20px] h-[20px]' : ''}`}
      />
    </div>
  );
};

export default AddressWithCopy;
