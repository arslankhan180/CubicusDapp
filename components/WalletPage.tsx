/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState } from "react";
import { Context } from "./Context";
import { IoCopyOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import Input from "./Input";
import Button from "./Button";

export default function WalletPage() {
  const { user } = useContext(Context);
  const [show, setShow] = useState(false);
  const [pass, setPass] = useState<any>("");
  const [key, setKey] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
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
  return (
    <div>
      <div className="w-full">
        <p className="text-2xl text-[#00510D] font-semibold">Wallets</p>
        <p className="text-sm text-[#67797F]">
          Embedded wallets with custom branding, best in class security
        </p>

        <div className="flex flex-col gap-2">
          <div className="w-full flex justify-between bg-white rounded-lg py-4 gap-4 mt-4 px-6">
            <p className="text-[#00510D] text-sm font-semibold flex items-center gap-2">
              {user?.wallet?.address}{" "}
              <IoCopyOutline
                className="cursor-pointer"
                onClick={() => handleCopy(user?.wallet?.address)}
              />
            </p>
            <p
              className="text-blue-500 font-semibold cursor-pointer"
              onClick={() => {
                setShow(!show);
                setKey(null);
                setPass(null);
              }}
            >
              {show ? "Hide" : "Show Private Key"}
            </p>
          </div>
          {show && (
            <div className="w-full flex justify-between bg-white rounded-lg py-4 gap-4 px-6">
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
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                  {key}{" "}
                  <IoCopyOutline
                    className="cursor-pointer"
                    onClick={() => handleCopy(key)}
                  />
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
