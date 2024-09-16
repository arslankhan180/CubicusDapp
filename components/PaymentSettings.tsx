import React, { ChangeEvent, useState } from "react";
import Input from "./Comp/Input";
import { FaAngleDown } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
import { CiCircleQuestion } from "react-icons/ci";

interface CollectionInfoProps {
  data: {
    collName: string;
    des: string;
    website: string;
    twitter: string;
    discord: string;
    nftPrice: string;
    recipientAddress: string;
    active: string;
    tab: string;
    blockchain: string;
  };
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleTabChange: (selectedTab: string) => void;
  handleCurrencyChange: (selectedCurrency: string) => void;
}

export default function PaymentSettings({
  data,
  handleChange,
  handleTabChange,
  handleCurrencyChange,
}: CollectionInfoProps) {
  const [open, setOpen] = useState<boolean>(false);
  //   const [active, setActive] = useState("POL");
  //   const [tab, setTab] = useState("Buyer");
  return (
    <div className="max-w-[500px]">
      <p className="text-[#00150D] text-xl font-semibold text-center mb-4">
        Payment settings
      </p>
      <p className="text-sm text-[#67797F] text-center">
        You can always change this later
      </p>
      <div className="mt-6">
        <div className="flex gap-4 relative">
          <div className="flex flex-col gap-2">
            <p className="text-[#00150D] text-sm font-bold">NFT Price</p>
            <Input
              placeholder="1"
              name="nftPrice"
              value={data?.nftPrice}
              onChange={handleChange}
            />
          </div>
          <div className="w-full" onClick={() => setOpen(!open)}>
            <div className="flex flex-col gap-2">
              <p className="text-[#00150D] text-sm font-bold flex items-center gap-2">
                Currency <CiCircleQuestion />
              </p>
              <p className="text-[#00150D] text-sm w-full border border-[#e5e7eb] rounded-lg px-4 py-2 bg-transparent flex gap-2 items-center justify-between cursor-pointer">
                {data?.blockchain} <FaAngleDown />
              </p>
            </div>
          </div>
          <div className="absolute bottom-[-80px] right-0 mt-2 w-full bg-white shadow-lg rounded-md">
            {open && (
              <div className="flex flex-col p-2">
                <p
                  className="text-sm text-[#67797F] hover:bg-[#F2F3F3] rounded-md px-2 py-1 cursor-pointer flex gap-2 justify-between items-center"
                  onClick={() => handleCurrencyChange(data?.blockchain)}
                >
                  {data?.blockchain} {data?.active === data?.blockchain && <FaCheck color="#05B96E" />}
                </p>
                <p
                  className="text-sm text-[#67797F] hover:bg-[#F2F3F3] rounded-md px-2 py-1 cursor-pointer flex gap-2 justify-between items-center"
                  onClick={() => handleCurrencyChange("USDC")}
                >
                  USDC {data?.active === "USDC" && <FaCheck color="#05B96E" />}
                </p>
              </div>
            )}
          </div>
          <div className="border border-[#e5e7eb] rounded-lg flex self-end">
            <p className="bg-[#F2F3F7] px-4 py-2 text-[#67797F] rounded-l-lg whitespace-nowrap">
              = 4.1
            </p>
            <div className="w-[1px] border "></div>
            <p className="bg-[#F8F9FB] px-4 py-2 text-[#67797F] rounded-r-lg">
              USD
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-[#00150D] text-sm font-bold flex items-center gap-2">
            Who pays the fees? <CiCircleQuestion />
          </p>
          <div className="flex flex-grow -mb-px tab p-[0.25rem] space-x-[0.125rem] rounded-[0.5rem] bg-[#F8F9FB] justify-center w-full">
            <p
              className={`${
                data?.tab === "Buyer"
                  ? "border-[#E6EEF1] bg-white border border-solid"
                  : " "
              } text-[#59797F] tab-item cursor-pointer flex flex-row w-full justify-center items-center text-sm px-[1rem] py-[0.5rem] rounded-[0.5rem] hover:bg-[#E6EEF1]`}
              onClick={() => handleTabChange("Buyer")}
            >
              Buyer
            </p>
            <p
              className={`${
                data?.tab === "You"
                  ? "border-[#E6EEF1] bg-white border border-solid"
                  : " "
              } text-[#59797F] tab-item cursor-pointer flex flex-row w-full justify-center items-center text-sm px-[1rem] py-[0.5rem] rounded-[0.5rem] hover:bg-[#E6EEF1]`}
              onClick={() => handleTabChange("You")}
            >
              You
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-[#00150D] text-sm font-bold flex items-center gap-2">
            Recipient address
          </p>
          <Input
            placeholder="0x4DA21707a86F29033F26c0adBd70E9D...."
            name="recipientAddress"
            value={data?.recipientAddress}
            onChange={handleChange}
          />
          <p className="text-[#67797F] text-xs">
            Enter the address where you want to receive the revenue from the
            sales of the NFTs. Funds may take a few days to arrive.
          </p>
        </div>
      </div>
    </div>
  );
}
