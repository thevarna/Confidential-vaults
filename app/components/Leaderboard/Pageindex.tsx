import Image from "next/image";
import React from "react";

const Pageindex = ({
  pageNum,
  currentPage,
  setCurrentPage,
}: {
  pageNum: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div className="flex flex-row gap-3 md:gap-6 text-[#71717A]">
      <button
        disabled={pageNum === 1}
        onClick={() => setCurrentPage((oldVal) => oldVal - 1)}
      >
        <Image src={"/icon/arrow-left.svg"} width={24} height={24} alt="" />
      </button>
      {Array.from({ length: Math.min(pageNum, 3) }, (_, i) => i + 1).map(
        (page) => (
          <span
            key={page}
            className={`bg-[#1A1A1A] rounded-sm cursor-pointer py-[8px] px-[14px] md:py-[12px] md:px-[20px] ${
              page == currentPage ? "border border-[#5024FF]" : ""
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </span>
        )
      )}
      {pageNum > 3 && (
        <span
          className={`bg-[#1A1A1A] rounded-sm py-[8px] px-[14px] md:py-[12px] md:px-[20px]`}
        >
          ...
        </span>
      )}
      {pageNum > 3 && (
        <span
          className={`bg-[#1A1A1A] rounded-sm py-[8px] px-[14px] md:py-[12px] md:px-[20px] ${
            pageNum == currentPage ? "border border-[#5024FF]" : ""
          }`}
        >
          {pageNum}
        </span>
      )}
      <button
        disabled={currentPage === pageNum}
        onClick={() => setCurrentPage((oldVal) => oldVal + 1)}
      >
        <Image src={"/icon/arrow-right.svg"} width={24} height={24} alt="" />
      </button>
    </div>
  );
};

export default Pageindex;
