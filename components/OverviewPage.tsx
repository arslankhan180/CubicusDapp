import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsCashCoin } from "react-icons/bs";
import { LuWallet2 } from "react-icons/lu";

export default function OverviewPage() {
  const data = [
    {
      img: "/svg/NFT.svg",
      title: "Collections",
      des: "Create and manage your smart contracts",
      link: "/collections",
      icon: null,
    },
    {
      img: null,
      title: "Tokens",
      des: "Create and manage your smart contracts",
      link: "/tokens",
      icon: <BsCashCoin size={100} color="#11E982" />,
    },
    {
      img: null,
      title: "Wallet",
      des: "Embedded wallets with custom branding, best in class security",
      link: "/wallets",
      icon: <LuWallet2 size={100} color="#11E982" />,
    },
  ];
  return (
    <div>
      <p className="text-2xl text-[#00510D] font-semibold">Overview</p>
      <div className="flex flex-wrap gap-4">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 pt-3"
          >
            <div className="flex justify-center">
            {item.img ? (
              <Image
                className="rounded-t-lg"
                src={item.img}
                alt={item.title}
                width={100}
                height={100}
              />
            ) : (
              item.icon // Render the icon if no image is present
            )}
            </div>
            <div className="p-5">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {item?.title}
              </h5>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {item?.des}
              </p>
              <Link
                href={item?.link}
                className="inline-flex items-center px-3 py-2 rounded-lg text-center text-white bg-[#05B959] text-sm font-semibold hover:bg-[#278272]"
              >
                View
                <svg
                  className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
