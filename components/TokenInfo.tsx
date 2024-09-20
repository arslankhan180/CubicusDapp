/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import Input from "./Comp/Input";
import TextArea from "./Comp/TextArea";
import { TbWorld } from "react-icons/tb";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import Image from "next/image";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/utils/firebase";
import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/router";
import Button from "./Comp/Button";
import { Context } from "./Context";
import SelectBlockchain from "./SelectBlockchain";
import { useWeb3Helper } from "@/contracts/Web3Helper";

export default function TokenInfo() {
  const { user } = useContext(Context);

  const { tokenCreate, createSPL } = useWeb3Helper();

  const router = useRouter();
  const MAX_STEP = 2;
  const [step, setStep] = useState<number>(1);
  const initialData = {
    img: "",
    name: "",
    symbol: "",
    totalSupply: "",
    des: "",
    website: "",
    twitter: "",
    discord: "",
    blockchain: "",
  };

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value, // dynamically update the state based on the input's name attribute
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      console.error("Please select an image file.");
      return;
    }

    const fileRef = ref(storage, file.name);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    setData((pre: any) => ({ ...pre, img: url }));
  };

  const handleChainChange = (selectedChain: string) => {
    setData({
      ...data,
      blockchain: selectedChain,
    });
  };

  const resetData = () => {
    setData(initialData); // Reset to the initial state shape
  };
  const goToNextStep = () => {
    if (step < MAX_STEP) {
      const nextStep = step + 1;
      router.push(`/tokens/newtoken?step=${nextStep}`, undefined, {
        shallow: true,
      });
    } else {
      router.replace("/tokens");
      resetData();
    }
  };

  const goToPreviousStep = () => {
    const prevStep = step - 1;
    router.push(`/tokens/newtoken?step=${prevStep}`, undefined, {
      shallow: true,
    });
  };

  const create = async () => {
    try {
      setLoading(true);
      if (data?.blockchain === "SOL") {
        await createSPL(data, user);
        setLoading(false);
      } else {
        await tokenCreate(data, user);
        setLoading(false);
      }
      router.replace("/tokens");
      resetData();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryStep = Number(router.query.step) || 1;
    setStep(queryStep);
  }, [router.query.step]);

  return (
    <div className="h-screen p-2 bg-white">
      <RxCross2
        className="fixed top-4 left-4 cursor-pointer"
        color="#00150D"
        onClick={() => {
          router.replace("/tokens");
          resetData();
        }}
      />
      <div className="flex justify-center items-center h-full mt-6 pb-6 px-2 max-lg:justify-start max-lg:items-start overflow-scroll scrollStyle">
        <div className="max-w-[800px]">
          {step === 1 && (
            <div className="">
              <p className="text-[#00150D] text-xl font-semibold">
                Enter Token Information
              </p>
              <p className="text-sm text-[#67797F] font-medium">
                This information will be used to review your collection before
                launching, and will be used as a preview in different UI
                surfaces.
                <br /> You can edit it later.
              </p>
              <div className="mt-4 flex gap-4 max-lg:flex-col">
                <div className="flex flex-col gap-4 w-1/2">
                  <p className="text-[#00150D] text-sm font-bold">Token Name</p>
                  <Input
                    placeholder="Name"
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                  />
                  <p className="text-[#00150D] text-sm font-bold">
                    Token Symbol
                  </p>
                  <Input
                    placeholder="Symbol"
                    type="text"
                    name="symbol"
                    value={data.symbol}
                    onChange={handleChange}
                  />
                  <p className="text-[#00150D] text-sm font-bold">
                    Total Supply
                  </p>
                  <Input
                    placeholder="100000"
                    type="number"
                    name="totalSupply"
                    value={data.totalSupply}
                    onChange={handleChange}
                  />
                  <p className="text-[#00150D] text-sm font-bold">
                    Description
                  </p>
                  <TextArea
                    placeholder="Description"
                    name="des"
                    value={data.des}
                    onChange={handleChange}
                  />
                  <p className="text-[#00150D] text-sm font-bold">
                    Website{" "}
                    <span className="text-[#67797F] font-medium">
                      (Optional)
                    </span>
                  </p>
                  <Input
                    placeholder="https://www.yourwebsite.com"
                    type="text"
                    name="website"
                    value={data.website}
                    onChange={handleChange}
                  />
                  {/* <div className="flex items-center gap-4 w-full">
                  <div className="flex flex-col gap-4 w-full">
                    <p className="text-[#00150D] text-sm font-bold">
                      Twitter{" "}
                      <span className="text-[#67797F] font-medium">
                        (Optional)
                      </span>
                    </p>
                    <Input
                      placeholder="twitter"
                      type="text"
                      name="twitter"
                      value={data.twitter}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <p className="text-[#00150D] text-sm font-bold">
                      Discord{" "}
                      <span className="text-[#67797F] font-medium">
                        (Optional)
                      </span>
                    </p>
                    <Input
                      placeholder="discord"
                      type="text"
                      name="discord"
                      value={data.discord}
                      onChange={handleChange}
                    />
                  </div>
                </div> */}
                </div>
                <div className="flex flex-col h-full gap-2 w-1/2">
                  {data?.img ? (
                    <Image
                      src={data?.img}
                      alt=""
                      width={256}
                      height={256}
                      className="rounded-lg max-w-[256px] max-h-[256px]"
                    />
                  ) : (
                    <div className="border border-dashed border-[#05B96E] w-[256px] h-[256px] p-4 rounded-lg bg-[#F1FCFE] flex flex-col justify-center items-center cursor-pointer">
                      <label className="flex flex-col justify-center items-center w-full h-full cursor-pointer">
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          className="hidden"
                          onChange={handleUpload}
                        />
                        <p className="text-[#05B96E] text-sm font-bold">
                          Choose files or drag & drop
                        </p>
                        <p className="text-[#67797F] text-xs text-center">
                          Image (jpg, png, webp, gif) up to 2MB.
                        </p>
                      </label>
                    </div>
                  )}
                  <div className="flex flex-col justify-center h-full">
                    <div className="flex justify-between items-center">
                      <p className="text-[#00150D] font-semibold">
                        {data?.name ? data?.name : "Collection Name"}
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
                      {data?.symbol ? data?.symbol : "Symbol"}
                    </p>
                    <p className="text-[#67797F] text-sm">
                      {data?.des ? data?.des : "Description"}
                    </p>

                    <div className="flex items-center gap-4 w-full mt-2">
                      <div className="flex flex-col gap-4 w-full">
                        <p className="text-[#00150D] text-sm font-bold">
                          Twitter{" "}
                          <span className="text-[#67797F] font-medium">
                            (Optional)
                          </span>
                        </p>
                        <Input
                          placeholder="twitter"
                          type="text"
                          name="twitter"
                          value={data.twitter}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="flex flex-col gap-4 w-full">
                        <p className="text-[#00150D] text-sm font-bold">
                          Discord{" "}
                          <span className="text-[#67797F] font-medium">
                            (Optional)
                          </span>
                        </p>
                        <Input
                          placeholder="discord"
                          type="text"
                          name="discord"
                          value={data.discord}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <SelectBlockchain data={data} handleChange={handleChainChange} />
          )}
        </div>
      </div>

      <div className="min-md:fixed bottom-0 w-full flex flex-col">
        <div className="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
          <div
            className={`bg-[#05B96E] h-1 rounded-full`}
            style={{ width: `${(step / 2) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between gap-2 px-4 py-2">
          <button
            className="border px-4 py-2 rounded-lg text-[#67797F] font-bold"
            onClick={goToPreviousStep}
            disabled={step === 1}
          >
            Back
          </button>

          <Button
            onClick={() => {
              step === MAX_STEP ? create() : goToNextStep();
            }}
          >
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
            ) : step < MAX_STEP ? (
              "Next"
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
