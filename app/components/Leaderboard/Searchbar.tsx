import Image from "next/image";
import React, { useState } from "react";

const Searchbar = ({ setSearchTerm }: { setSearchTerm: (term: string) => void }) => {
  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setSearchTerm(e.target.value);  // Update search term in Leaderboard
  };

  return (
    <div className="flex flex-row w-[160px] md:w-[300px] border-[#5024FF] border rounded-md font-mono">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        className="w-full text-[#71717A] bg-[#1A1A1A] p-2 font-bold rounded-lg px-6 outline-none text-[14px] md:text-[16px]"
        placeholder="Search"
      />
      <button className="bg-[#5024FF] px-4">
        <Image src={"/search.svg"} width={18} height={18} alt="search" />
      </button>
    </div>
  );
};

export default Searchbar;
