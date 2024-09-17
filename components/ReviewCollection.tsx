/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { TbWorld } from "react-icons/tb";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

export default function ReviewCollection({ data }: any) {
  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    toast.success("Address copied!");
  };
  return (
    <div className="max-w-[700px]">
      <p className="text-[#00150D] text-xl font-semibold  mb-4">
        Review your collection details
      </p>
      <p className="text-sm text-[#67797F]">
        Almost there! Take a final look and confirm your collection details
        before they get deployed to the blockchain.
      </p>
      <div className="mt-4 flex gap-4 max-lg:flex-col">
        <div className="flex flex-col h-full gap-2">
        <Image src={data?.img} alt="" width={256} height={256} className="rounded-lg max-w-[256px] max-h-[256px]" />
          <div className="flex flex-col justify-center h-full">
            <div className="flex justify-between items-center">
              <p className="text-[#00150D] font-semibold">
                {data?.collName ? data?.collName : "Collection Name"}
              </p>
              <div className="flex gap-2 items-center">
                <TbWorld
                  size={16}
                  color={`${data?.website ? "#05B96E" : ""}`}
                />
                <FaXTwitter
                  size={16}
                  color={`${data?.twitter ? "#05B96E" : ""}`}
                />
                <FaDiscord
                  size={16}
                  color={`${data?.discord ? "#05B96E" : ""}`}
                />
              </div>
            </div>
            <p className="text-[#67797F] text-sm">
              {data?.des ? data?.des : "Description"}
            </p>
          </div>
        </div>

        <div className="relative w-full">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 text-[#67797F] whitespace-nowrap"
                >
                  Blockchain
                </th>
                <td className="px-6 py-4 text-[#20343E]">{data?.blockchain}</td>
              </tr>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 text-[#67797F] whitespace-nowrap"
                >
                  Contract type
                </th>
                <td className="px-6 py-4 text-[#20343E]">ERC-721</td>
              </tr>
              <tr className="bg-white border-b dark:bg-gray-800">
                <th
                  scope="row"
                  className="px-6 py-4 text-[#67797F] whitespace-nowrap"
                >
                  Item price
                </th>
                <td className="px-6 py-4 text-[#20343E]">
                  {data?.nftPrice ? data?.nftPrice : "0"}
                </td>
              </tr>
              <tr className="bg-white border-b dark:bg-gray-800">
                <th
                  scope="row"
                  className="px-6 py-4 text-[#67797F] whitespace-nowrap"
                >
                  Recipient address
                </th>
                <td className="px-6 py-4 text-[#20343E] flex items-center gap-2">
                  <IoCopyOutline
                    className="cursor-pointer"
                    onClick={() => handleCopy(data?.recipientAddress)}
                  />{" "}
                  {data?.recipientAddress
                    ? data?.recipientAddress
                    : "0x123456789....."}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 p-6 bg-[#F8F9FB] rounded-md">
            <div className="flex items-center mb-4">
              <input
                id="default-checkbox"
                type="checkbox"
                value=""
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="default-checkbox"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                <span className="font-bold">Content policy:</span> This collection meets <Link href={'/'} className="text-[#05B96E]">Cubicus Dapp's content
                policy.</Link> I understand credits are not refundable once a
                collection is created.
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
