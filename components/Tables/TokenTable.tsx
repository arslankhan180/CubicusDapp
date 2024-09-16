/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { IoCopyOutline } from "react-icons/io5";
import Button from "../Comp/Button";
import Image from "next/image";
import { toast } from "react-toastify";

export default function TokenTable({ collections }: any) {

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };
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
                Token Address
              </th>
              <th scope="col" className="px-6 py-3">
                Total Supply
              </th>
              <th scope="col" className="px-6 py-3">
                Blockchain
              </th>
              {/* <th scope="col" className="px-6 py-3">
                Creation Date
              </th> */}
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {collections?.length > 0 ? (
              collections?.map((item: any, idx: any) => (
                <tr
                  key={idx}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <div className="flex gap-2 items-center w-max">
                      <Image alt="" src={item?.img} width={50} height={50} />
                      <div className="flex flex-col">
                        <p>{item?.name}</p>
                        <p>{item?.symbol}</p>
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4 flex items-center gap-2 cursor-pointer">
                    {item?.tokenAddress} <IoCopyOutline onClick={() => handleCopy(item?.tokenAddress)} />
                  </td>
                  <td className="px-6 py-4">{item?.totalSupply}</td>
                  <td className="px-6 py-4">{item?.blockchain}</td>
                  {/* <td className="px-6 py-4">
                    {item?.date ? formatDate(item.date) : "N/A"}
                  </td> */}
                  <td className="px-6 py-4 flex gap-2">
                    <Button
                      className="text-white"
                      // onClick={() =>
                      //   router.replace(
                      //     `/collections/nfts?collection=${item?.collectionAddress}&&chain=${item?.blockchain}`
                      //   )
                      // }
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  No collections found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* <div className="flex flex-row justify-between items-center">
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">1</span>{" "}
          to{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            10
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            100
          </span>{" "}
          Entries
        </span>
        <div className="inline-flex mt-2 xs:mt-0 gap-2 bg-white shadow-sm px-2 rounded-lg">
          <button className="flex items-center justify-center h-8 text-sm font-medium text-gray-500 bg-white-500 rounded-lg">
            <FaArrowLeft />
          </button>
          <p className="flex items-center justify-center px-3 h-8 text-sm font-medium bg-green-100 text-[#00510D] rounded-lg">
            1
          </p>
          <button className="flex items-center justify-center h-8 text-sm font-medium text-gray-500 bg-white-500 rounded-lg">
            <FaArrowRight />
          </button>
        </div>
      </div> */}
    </div>
  );
}
