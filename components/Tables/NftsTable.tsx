/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import React from "react";
import Link from "next/link";

export default function NftsTable({ nfts }: any) {
  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg scrollStyle">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Collection Address
              </th>
              <th scope="col" className="px-6 py-3">
                Blockchain
              </th>
              <th scope="col" className="px-6 py-3">
                Token ID
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {nfts?.length > 0 ? (
              nfts?.map((item: any, idx: any) => (
                <tr
                  key={idx}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="flex gap-2 items-center w-max">
                      <Image alt="" src={item?.imgUrl} width={50} height={50} />
                      {item?.name}
                    </div>
                  </th>
                  <td className="px-6 py-4 cursor-pointer">
                    <div className="flex justify-center items-center h-full">
                      {item?.nftAddress}
                    </div>
                  </td>
                  <td className="px-6 py-4">{item?.blockchain}</td>
                  <td className="px-6 py-4">{item?.tokenId}</td>
                  <td className="px-6 py-4">
                    <Link
                      target="_blank"
                      href={`https://testnets.opensea.io/assets/${
                        item?.blockchain === "ETH"
                          ? "sepolia"
                          : item?.blockchain === "MATIC"
                          ? "amoy"
                          : ""
                      }/${item?.nftAddress}/${item?.tokenId}`}
                      className="px-4 py-3 rounded-lg bg-[#05B959] font-semibold hover:bg-[#278272] text-white text-xs whitespace-nowrap"
                    >
                      View on OpenSea
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  No Nft's found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
