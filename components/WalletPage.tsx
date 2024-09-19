/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState } from "react";
import { Context } from "./Context";
import { IoCopyOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import Input from "./Comp/Input";
import Button from "./Comp/Button";
import updateUser from "@/pages/api/updateUser";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebase";
import getUser from "@/pages/api/getUser";
import { useRouter } from "next/router";

export default function WalletPage() {
  const { user } = useContext(Context);
  const [showEVM, setShowEVM] = useState(false);
  const [showSol, setShowSol] = useState(false);
  const [pass, setPass] = useState<any>("");
  const [key, setKey] = useState<any>("");
  const [solKey, setSolKey] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleCopy = (text: string) => {
    try {
      navigator.clipboard?.writeText(text);
      toast.success("Copied!");
    } catch (error) {
      console.log(error);
    }
  };

  const getPrivate = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/getPrivateKey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          encryptedWallet: user?.wallet?.encryptedWallet,
          password: pass,
        }),
      });

      if (!response.ok) {
        setLoading(false);
        toast.error("Failed to create wallet");
      }
      const result = await response.json();
      setKey(result?.privateKey);
      setPass(null);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const createSol = async () => {
    try {
      await signInWithEmailAndPassword(auth, user?.email, pass);
      const firebaseUser = await getUser(user.uid);
      if (firebaseUser) {
        const response = await fetch("/api/createSolanaWallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pass }),
        });

        if (!response.ok) {
          toast.error("Failed to create wallet");
        }

        const result = await response.json();
        console.log("🚀 ~ createSol ~ result:", result);

        await updateUser({
          uid: user.uid,
          solWallet: result, // Add the new wallet to the wallets array
        });
        toast.success("Wallet Created");
        router.replace("/");
      }
    } catch (error: any) {
      const errorMessage =
        error.code === "auth/wrong-password"
          ? "Incorrect password"
          : error.code === "auth/network-request-failed"
          ? "Network error. Please try again."
          : error.code === "auth/user-not-found"
          ? "User not found"
          : error.code === "auth/invalid-credential"
          ? "Invalid credentials"
          : "An unexpected error occurred";

      toast.error(errorMessage);
    }
  };

  const decryptSolanaWallet = async () => {
    const response = await fetch("/api/decryptKey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        encryptedPrivateKey: user?.solWallet?.encryptedWallet,
        password: pass,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to decrypt wallet");
    }

    const data = await response.json();
    setSolKey(data.privateKey);
  };

  return (
    <div>
      <div className="w-full">
        <p className="text-2xl text-[#00510D] font-semibold">Wallets</p>
        <p className="text-sm text-[#67797F]">
          Embedded wallets with custom branding, best in class security
        </p>

        {!user?.solWallet && (
          <div className="mt-4">
            <div className="relative z-0 w-fit mb-5 group">
              <input
                type="password"
                name="pass"
                id="pass"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={pass}
                onChange={(e: any) => {
                  setPass(e.target.value);
                }}
              />
              <label
                htmlFor="pass"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Password
              </label>
            </div>
            <Button onClick={createSol}>Create Solana Wallet</Button>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="w-full flex justify-between bg-white rounded-lg py-4 gap-4 mt-4 px-6">
            <p className="text-[#00510D] text-sm font-semibold flex items-center gap-2">
              EVM{" "}
              {`${user?.wallet?.address.slice(
                0,
                8
              )}...${user?.wallet?.address.slice(
                -8,
                user?.wallet?.address.length
              )}`}{" "}
              <IoCopyOutline
                className="cursor-pointer"
                onClick={() => handleCopy(user?.wallet?.address)}
              />
            </p>
            <p
              className="text-blue-500 font-semibold cursor-pointer"
              onClick={() => {
                setShowEVM(!showEVM);
                setKey(null);
                setPass(null);
              }}
            >
              {showEVM ? "Hide" : "Show Private Key"}
            </p>
          </div>
          {showEVM && (
            <div className="w-full flex justify-between bg-white rounded-lg py-4 gap-4 px-6 max-md:flex-col">
              <div>
                <label className="text-black text-sm">
                  Enter You Account Password
                </label>
                <Input
                  onChange={(e) => setPass(e.target.value)}
                  value={pass}
                  type="password"
                  placeholder="Password"
                  required
                />
                {loading ? (
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 mt-2"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                ) : (
                  <Button onClick={getPrivate} className="mt-2">
                    Enter
                  </Button>
                )}
              </div>
              {key && (
                <p className="text-[#00510D] text-sm font-semibold flex items-center gap-2">
                  {`${key.slice(0, 8)}...${key.slice(-8, key.length)}`}{" "}
                  <IoCopyOutline
                    className="cursor-pointer"
                    onClick={() => handleCopy(key)}
                  />
                </p>
              )}
            </div>
          )}
        </div>

        {user?.solWallet && (
          <div className="flex flex-col gap-2">
            <div className="w-full flex justify-between bg-white rounded-lg py-4 gap-4 mt-4 px-6">
              <p className="text-[#00510D] text-sm font-semibold flex items-center gap-2">
                Sol{" "}
                {`${user?.solWallet?.address.slice(
                  0,
                  8
                )}...${user?.solWallet?.address.slice(
                  -8,
                  user?.solWallet?.address.length
                )}`}{" "}
                <IoCopyOutline
                  className="cursor-pointer"
                  onClick={() => handleCopy(user?.solWallet?.address)}
                />
              </p>
              <p
                className="text-blue-500 font-semibold cursor-pointer"
                onClick={() => {
                  setShowSol(!showSol);
                  setSolKey(null);
                  setPass(null);
                }}
              >
                {showSol ? "Hide" : "Show Private Key"}
              </p>
            </div>
            {showSol && (
              <div className="w-full flex justify-between bg-white rounded-lg py-4 gap-4 px-6 max-md:flex-col">
                <div>
                  <label className="text-black text-sm">
                    Enter You Account Password
                  </label>
                  <Input
                    onChange={(e) => setPass(e.target.value)}
                    value={pass}
                    type="password"
                    placeholder="Password"
                    required
                  />
                  {loading ? (
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 mt-2"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  ) : (
                    <Button onClick={decryptSolanaWallet} className="mt-2">
                      Enter
                    </Button>
                  )}
                </div>
                {solKey && (
                  <p className="text-[#00510D] text-sm font-semibold flex items-center gap-2">
                    {`${solKey.slice(0, 8)}...${solKey.slice(
                      -8,
                      solKey.length
                    )}`}{" "}
                    <IoCopyOutline
                      className="cursor-pointer"
                      onClick={() => handleCopy(solKey)}
                    />
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
