/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import React from "react";

export default function SelectBlockchain({ data, handleChange }: any) {

  const chains = [
    {
      name: "Ethereum",
      symbol: "ETH",
      img: "/images/ethLogo.png",
    },
    {
      name: "Binance Smart Chain",
      symbol: "BNB",
      img: "/images/bnbLogo.png",
    },
    {
      name: "Polygon",
      symbol: "MATIC",
      img: "/images/maticLogo.png",
    },
    {
      name: "Optimism",
      symbol: "OP",
      img: "/images/opLogo.png",
    },
    {
      name: "Base",
      symbol: "BASE",
      img: "/images/baseLogo.png",
    },
    {
      name: "Fantom",
      symbol: "FTM",
      img: "/images/ftmLogo.png",
    },
    {
      name: "Solana",
      symbol: "SOL",
      img: "/images/solana.png",
    },
    {
      name: "Internet Computer",
      symbol: "ICP",
      img: "/images/icp.png",
    },
    {
      name: "Ton Token",
      symbol: "TON",
      img: "/images/ton.png",
    },
  ];

  const handleChainChange = (selectedChain: string) => {
    handleChange(selectedChain);
  };

  return (
    <div>
      <p className="text-[#00150D] text-xl font-semibold text-center">Choose a Chain</p>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {chains.map((item, idx) => (
          <div
            key={idx}
            className={`flex gap-4 p-6 items-center rounded-lg cursor-pointer hover:border-[#233236] ${
                data?.blockchain === item.symbol ? "border border-[#05B96E]" : "border"
            }`}
            onClick={() => handleChainChange(item.symbol)}
          >
            <div>
              <Image alt="" src={item?.img} width={50} height={50} className="rounded-full" />
            </div>
            <div>
              <p className="text-[#233236] font-bold">{item?.name}</p>
              <p className="text-[#59797F] text-sm">{item?.symbol}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
