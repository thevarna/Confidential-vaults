"use client";
import React, { useEffect, useState } from "react";
import Searchbar from "./Searchbar";
import axios from "axios";
import AddressWithCopy from "./AddressWithCopy";
import Pageindex from "./Pageindex";
// import { useAccount } from "wagmi";
// import { client } from "@/utils/stackr";
// import InfoButton from "./component/Info";

type point = { rank: number; address: string; points: number };

const Leaderboard = () => {
  const [point, setPoint] = useState<point[]>([]);
  const [filteredPoints, setFilteredPoints] = useState<point[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pointsPerPage = 5;

  // const { address: userAddress } = useAccount();

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        "https://athena.stack.so/leaderboard/leaderboard-40a3-78225-7554?includeMetadata=true&includeIdentities=true"
      );
      const leaderboardData = response.data["leaderboard"].map((item: any) => ({
        rank: item.rank,
        address: item.walletAddress,
        points: item.totalPoints,
      }));
      setPoint(leaderboardData);
      setFilteredPoints(leaderboardData);
    };

    if (point.length === 0) {
      getData();
    }
  }, [point]);

  // Filter points by search term
  useEffect(() => {
    const filtered = point.filter((item) =>
      item.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPoints(filtered);
  }, [searchTerm, point]);

  const indexOfLastPoint = currentPage * pointsPerPage;
  const indexOfFirstPoint = indexOfLastPoint - pointsPerPage;
  const currentPoints = filteredPoints.slice(
    indexOfFirstPoint,
    indexOfLastPoint
  );

  const pageNum = Math.ceil(filteredPoints.length / pointsPerPage);

  // Check if the user's address is in the current page
  // const isUserInCurrentPage = currentPoints.some(
  //   (value) => value.address.toLowerCase() === userAddress?.toLowerCase()
  // );

  // Get the user's rank from the full list (not paginated)
  // const userRank = point.find(
  //   (value) => value.address.toLowerCase() === userAddress?.toLowerCase()
  // );

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-[400px] md:w-[700px] md:mt-10 font-mono">
      <div className="flex flex-row items-center text-white justify-between w-full gap-2 md:gap-0">
        <h1 className="flex flex-col md:flex-row justify-center items-center text-[20px] md:text-[24px] font-bold text-[#D0D0D0]">
          LEADERBOARD
          {/* <InfoButton /> */}
        </h1>
        <Searchbar setSearchTerm={setSearchTerm} />
      </div>
      <div className="md:border md:border-[#5024FF] md:border-opacity-[20%] md:p-[24px] w-full">
        <div className="flex flex-row justify-between items-center text-[#D0D0D0] text-[14px] md:text-[18px] font-bold uppercase bg-[#5024FF] bg-opacity-[8%] px-[20px] py-[8px] border-b border-[#5024FF] text-left ">
          <h1 className="w-[40%]">Rank</h1>
          <h1 className="w-[50%]">Address</h1>
          <h1 className="flex flex-row w-[20%]  text-right">Points <div className="w-[25px]">
            {/* <InfoButton/> */}
          </div>
          </h1>
        </div>

        <div className="flex flex-col gap-2 text-[#71717A] text-[14px] md:text-[18px] mt-2">
          {currentPoints.map((value, index) => (
            <div
              className={`flex flex-row items-center justify-between px-[20px] py-[10px] `}
              key={index}
            >
              <h1 className="flex w-[40%] text-center items-start">
                {/* <span
                  className={`${
                    value.address.toLowerCase() === userAddress?.toLowerCase()
                      ? "bg-[#5024FF] bg-opacity-50" // Highlight user's row in purple
                      : "bg-[#1A1A1A]"
                  } rounded-sm py-[8px] px-[14px] md:py-[12px] md:px-[20px] `}
                >
                  {value.rank}
                </span> */}
              </h1>
              <div className="w-[60%]">
                <AddressWithCopy address={value.address} />
              </div>
              <h1 className="w-[20%] text-right">
                {value.points.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </h1>
            </div>
          ))}

          {/* If user is not in current page, display user's rank at the bottom */}
          {/* {!isUserInCurrentPage && userRank && (
            <div className="flex flex-row items-center justify-between px-[20px] py-[10px]">
              <h1 className="flex w-[40%] text-center items-start">
                <span className="rounded-sm py-[8px] px-[14px] md:py-[12px] md:px-[20px] bg-[#5024FF] bg-opacity-50">
                  {userRank.rank}
                </span>
              </h1>
              <div className="w-[60%]">
                <AddressWithCopy address={userRank.address} />
              </div>
              <h1 className="w-[20%] text-right">
                {userRank.points.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </h1>
            </div>
          )} */}
        </div>
      </div>

      {/* Pagination component */}
      {pageNum !== 1 && (
        <Pageindex
          pageNum={pageNum}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};

export default Leaderboard;
