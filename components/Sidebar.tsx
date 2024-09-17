import Image from "next/image";
import React, { useContext, useState } from "react";
import { RiExpandUpDownLine, RiHomeSmileLine } from "react-icons/ri";
import { IoCopyOutline } from "react-icons/io5";
import { CiImageOn, CiSettings, CiMail } from "react-icons/ci";
import { LuWallet2, LuChevronsLeftRight } from "react-icons/lu";
import { HiDotsVertical } from "react-icons/hi";
import { IoPricetagOutline } from "react-icons/io5";
import { BsFiletypeDoc } from "react-icons/bs";
import { useRouter } from "next/router";
import { MdOutlineLogout } from "react-icons/md";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { Context } from "./Context";
import { MdOutlineGeneratingTokens } from "react-icons/md";

export default function Sidebar() {
  const { user, setUser } = useContext(Context);
  const [active, setActive] = useState<string>("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const clearUserLocalStorage = () => {
    localStorage.removeItem("user");
  };

  const logout = async () => {
    try {
      signOut(auth)
        .then(() => {
          clearUserLocalStorage();
          setUser(null);
          router.replace("/signin");
          // Sign-out successful.
        })
        .catch((error) => {
          // An error happened.
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <button
        onClick={toggleSidebar}
        aria-controls="default-sidebar"
        type="button"
        className="absolute right-2 z-20 inline-flex items-center p-1 mt-2 ml-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={`max-md:fixed top-0 left-0 z-40 w-64 h-screen transition-transform transform bg-gray-50 dark:bg-gray-800 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 relative">
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-2">
                  <div>
                    <Image
                      alt=""
                      src={"https://cubicus.io/logo.svg"}
                      width={30}
                      height={30}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#00510D]">
                      Default Profile
                    </p>
                    <p className="text-xs flex gap-1 items-center text-[#67797F]">
                      <IoCopyOutline /> Project Id
                    </p>
                  </div>
                </div>
                <div>
                  <RiExpandUpDownLine color="#00510D" />
                </div>
              </div>
              <hr />
              <div
                className={`${
                  router.pathname === "/" ? "bg-[#F2F3F3]" : "bg-transparent"
                } rounded-lg px-3 py-2 hover:bg-[#F2F3F3] cursor-pointer`}
                onClick={() => {
                  // setActive("overview");
                  setSidebarOpen(false);
                  router.replace(`/`);
                }}
              >
                <p className="text-sm font-medium flex gap-2 items-center text-[#00510D]">
                  <RiHomeSmileLine
                    size={20}
                    color={`${router.pathname === "/" ? "#05b959" : ""}`}
                  />{" "}
                  Overview
                </p>
              </div>
              <div
                className={`${
                  router.pathname.includes("collection")
                    ? "bg-[#F2F3F3]"
                    : "bg-transparent"
                } rounded-lg px-3 py-2 hover:bg-[#F2F3F3] cursor-pointer`}
                onClick={() => {
                  //   setActive("collection");
                  setSidebarOpen(false);
                  router.replace(`/collections`);
                }}
              >
                <p className="text-sm font-medium flex gap-2 items-center text-[#00510D]">
                  <CiImageOn
                    size={20}
                    color={`${
                      router.pathname.includes("collection") ? "#05b959" : ""
                    }`}
                  />{" "}
                  Collections
                </p>
              </div>
              <div
                className={`${
                  router.pathname.includes("tokens")
                    ? "bg-[#F2F3F3]"
                    : "bg-transparent"
                } rounded-lg px-3 py-2 hover:bg-[#F2F3F3] cursor-pointer`}
                onClick={() => {
                  //   setActive("collection");
                  setSidebarOpen(false);
                  router.replace(`/tokens`);
                }}
              >
                <p className="text-sm font-medium flex gap-2 items-center text-[#00510D]">
                  <MdOutlineGeneratingTokens
                    size={20}
                    color={`${
                      router.pathname.includes("tokens") ? "#05b959" : ""
                    }`}
                  />{" "}
                  Tokens
                </p>
              </div>
              <div
                className={`${
                  router.pathname.includes("wallets")
                    ? "bg-[#F2F3F3]"
                    : "bg-transparent"
                } rounded-lg px-3 py-2 hover:bg-[#F2F3F3] cursor-pointer`}
                onClick={() => {
                  // setActive("wallets");
                  setSidebarOpen(false);
                  router.replace(`/wallets`);
                }}
              >
                <p className="text-sm font-medium flex gap-2 items-center text-[#00510D]">
                  <LuWallet2
                    size={20}
                    color={`${
                      router.pathname.includes("wallets") ? "#05b959" : ""
                    }`}
                  />{" "}
                  Wallets
                </p>
              </div>
              <hr />
              <div
                className={`${
                  active === "integrate" ? "bg-[#F2F3F3]" : "bg-transparent"
                } rounded-lg px-3 py-2 hover:bg-[#F2F3F3] cursor-pointer`}
                onClick={() => {
                  setActive("integrate");
                  setSidebarOpen(false);
                }}
              >
                <p className="text-sm font-medium flex gap-2 items-center text-[#00510D]">
                  <LuChevronsLeftRight
                    size={20}
                    color={`${active === "integrate" ? "#05b959" : ""}`}
                  />{" "}
                  Integrate
                </p>
              </div>
              <div
                className={`${
                  active === "settings" ? "bg-[#F2F3F3]" : "bg-transparent"
                } rounded-lg px-3 py-2 hover:bg-[#F2F3F3] cursor-pointer`}
                onClick={() => {
                  setActive("settings");
                  setSidebarOpen(false);
                }}
              >
                <p className="text-sm font-medium flex gap-2 items-center text-[#00510D]">
                  <CiSettings
                    size={20}
                    color={`${active === "settings" ? "#05b959" : ""}`}
                  />{" "}
                  Settings
                </p>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <div
                className={`${
                  active === "pricing" ? "bg-[#F2F3F3]" : "bg-transparent"
                } rounded-lg px-3 py-2 hover:bg-[#F2F3F3] cursor-pointer`}
                onClick={() => {
                  setActive("pricing");
                  setSidebarOpen(false);
                }}
              >
                <p className="text-sm font-medium flex gap-2 items-center text-[#00510D]">
                  <IoPricetagOutline
                    size={20}
                    color={`${active === "pricing" ? "#05b959" : ""}`}
                  />{" "}
                  Pricing
                </p>
              </div>
              <div
                className={`${
                  active === "doc" ? "bg-[#F2F3F3]" : "bg-transparent"
                } rounded-lg px-3 py-2 hover:bg-[#F2F3F3] cursor-pointer`}
                onClick={() => {
                  setActive("doc");
                  setSidebarOpen(false);
                }}
              >
                <p className="text-sm font-medium flex gap-2 items-center text-[#00510D]">
                  <BsFiletypeDoc
                    size={20}
                    color={`${active === "doc" ? "#05b959" : ""}`}
                  />{" "}
                  Documentation
                </p>
              </div>
              <div
                className={`${
                  active === "contact" ? "bg-[#F2F3F3]" : "bg-transparent"
                } rounded-lg px-3 py-2 hover:bg-[#F2F3F3] cursor-pointer`}
                onClick={() => {
                  setActive("contact");
                  setSidebarOpen(false);
                }}
              >
                <p className="text-sm font-medium flex gap-2 items-center text-[#00510D]">
                  <CiMail
                    size={20}
                    color={`${active === "contact" ? "#05b959" : ""}`}
                  />{" "}
                  Contact us
                </p>
              </div>
              <div
                className={`${
                  active === "contact" ? "bg-[#F2F3F3]" : "bg-transparent"
                } rounded-lg px-3 py-2 hover:bg-[#F2F3F3] cursor-pointer`}
                onClick={() => logout()}
              >
                <p className="text-sm font-medium flex gap-2 items-center text-[#00510D]">
                  <MdOutlineLogout
                    size={20}
                    color={`${active === "contact" ? "#05b959" : ""}`}
                  />{" "}
                  Logout
                </p>
              </div>
              <hr />
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-2">
                  <div>
                    <Image
                      alt=""
                      src={"https://cubicus.io/logo.svg"}
                      width={30}
                      height={30}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#00510D]">
                      {user?.displayName}
                    </p>
                    <p className="text-xs flex gap-1 items-center text-[#67797F]">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <div className="cursor-pointer">
                  <HiDotsVertical color="#00510D" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black opacity-50 sm:hidden"
        ></div>
      )}
    </div>
  );
}
