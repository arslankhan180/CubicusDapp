/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from "react";

import Button from "./Comp/Button";
import { RxCross2 } from "react-icons/rx";
import CollectionInfo from "./CollectionInfo";
import ContractType from "./ContractType";
import PaymentSettings from "./PaymentSettings";
import ReviewCollection from "./ReviewCollection";
import { useWeb3Helper } from "@/contracts/Web3Helper";
import { useRouter } from "next/router";
import SelectBlockchain from "./SelectBlockchain";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/utils/firebase";
import { Context } from "./Context";

export default function NewDetails() {
  const { user } = useContext(Context);

  const router = useRouter();
  const MAX_STEP = 5;

  const { collectionCreate }: any = useWeb3Helper();

  const initialData = {
    img: "",
    collName: "",
    des: "",
    website: "",
    twitter: "",
    discord: "",
    contractType: "",
    nftPrice: "",
    currency: "POl",
    paysFee: "",
    recipientAddress: "",
    active: "POL",
    tab: "Buyer",
    blockchain: "",
  };

  const [data, setData] = useState(initialData);
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update the step from the query param when the component mounts
    const queryStep = Number(router.query.step) || 1;
    setStep(queryStep);
  }, [router.query.step]);

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

  const handleContractTypeChange = (selectedType: string) => {
    setData({
      ...data,
      contractType: selectedType, // update the contract type in the state
    });
  };

  const handleTabChange = (selectedTab: string) => {
    setData({
      ...data,
      tab: selectedTab,
    });
  };

  const handleChainChange = (selectedChain: string) => {
    setData({
      ...data,
      blockchain: selectedChain,
    });
  };

  const handleCurrencyChange = (selectedCurrency: string) => {
    setData({
      ...data,
      active: selectedCurrency,
      currency: selectedCurrency,
    });
  };

  const resetData = () => {
    setData(initialData); // Reset to the initial state shape
  };

  const goToNextStep = () => {
    if (step < MAX_STEP) {
      const nextStep = step + 1;
      router.push(`/collections/newdetails?step=${nextStep}`, undefined, {
        shallow: true,
      });
    } else {
      // Redirect to collections page if max step is reached
      router.replace("/collections");
      resetData();
    }
  };

  const goToPreviousStep = () => {
    const prevStep = step - 1;
    router.push(`/collections/newdetails?step=${prevStep}`, undefined, {
      shallow: true,
    });
  };

  const create = async () => {
    try {
      setLoading(true);
      await collectionCreate(data, user?.wallet?.address, user?.uid);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="h-full">
      <RxCross2
        className="fixed top-4 left-4 cursor-pointer"
        color="#00150D"
        onClick={() => {
          router.replace("/collections");
          resetData();
        }}
      />

      <div className="flex justify-center items-center h-full mt-6 pb-6 px-2 max-lg:justify-start max-lg:items-start overflow-scroll">
        {step === 1 && (
          <CollectionInfo
            data={data}
            handleChange={handleChange}
            handleUpload={handleUpload}
          />
        )}
        {step === 2 && <ContractType handleChange={handleContractTypeChange} />}
        {step === 3 && (
          <SelectBlockchain data={data} handleChange={handleChainChange} />
        )}
        {step === 4 && (
          <PaymentSettings
            data={data}
            handleChange={handleChange}
            handleTabChange={handleTabChange}
            handleCurrencyChange={handleCurrencyChange}
          />
        )}
        {step === 5 && <ReviewCollection data={data} />}
      </div>

      <div className="min-md:fixed bottom-0 w-full flex flex-col">
        <div className="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
          <div
            className={`bg-[#05B96E] h-1 rounded-full`}
            style={{ width: `${(step / 5) * 100}%` }}
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
              "Finish"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
