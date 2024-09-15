/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import Input from "./Input";
import TextArea from "./TextArea";
import Image from "next/image";
import Button from "./Button";
import { useRouter } from "next/router";
import { Context } from "./Context";
import { useWeb3Helper } from "@/contracts/Web3Helper";

export default function MintPage() {
  const { user } = useContext(Context);
  const { mintNft }: any = useWeb3Helper();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [collectionAddress, setCollectionAddress] = useState<string | null>(
    null
  );
  const [chainName, setChainName] = useState<string | null>(null);

  const router = useRouter();
  const [metadata, setMetadata] = useState({
    name: "",
    description: "",
    attributes: [],
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const base64String = reader.result.toString().split(",")[1];
          setImage(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMetadataChange = (e: any) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch("/api/upload-nft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image, metadata }),
      });
      const data = await response.json();

      if (response.ok) {
        await mintNft(
          user?.uid,
          metadata,
          chainName,
          user?.wallet?.address,
          collectionAddress,
          data
        );
      } else {
        console.log(`Error: ${data.error}`);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error uploading NFT:", error);
      console.log("Upload failed");
    }
  };

  useEffect(() => {
    if (router) {
      const { collection, chain } = router.query;

      if (collection && chain) {
        setCollectionAddress(collection as string);
        setChainName(chain as string);
      }
    }
  }, [router, router.query]);

  return (
    <div>
      <p className="text-2xl text-[#00510D] font-semibold mb-4">Mint NFT</p>
      <div className="mt-4 flex gap-4 h-[60vh] justify-center items-center">
        <div className="flex gap-4">
          <div className="flex flex-col gap-4">
            <p className="text-[#00150D] text-sm font-bold">NFT Name</p>
            <Input
              placeholder="e.g. Genesis Membership Pass"
              type="text"
              name="name"
              value={metadata.name}
              onChange={handleMetadataChange}
            />
            <p className="text-[#00150D] text-sm font-bold">Description</p>
            <TextArea
              placeholder="e.g. Your gateway into web3"
              name="description"
              value={metadata.description}
              onChange={handleMetadataChange}
            />
          </div>
          <div className="flex flex-col h-full gap-2">
            {image ? (
              <Image
                src={`data:image/png;base64,${image}`}
                alt=""
                width={256}
                height={256}
                className="rounded-lg max-w-[256px] max-h-[256px]"
              />
            ) : (
              <>
                <div className="border border-dashed border-[#05B96E] w-[256px] h-[256px] p-4 rounded-lg bg-[#F1FCFE] flex flex-col justify-center items-center cursor-pointer">
                  <label className="flex flex-col justify-center items-center w-full h-full cursor-pointer">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <p className="text-[#05B96E] text-sm font-bold">
                      Choose files or drag & drop
                    </p>
                    <p className="text-[#67797F] text-xs text-center">
                      Image (jpg, png, webp, gif) up to 1MB.
                    </p>
                  </label>
                </div>
                <div className="flex flex-col justify-center h-full">
                  <div className="flex justify-between items-center">
                    <p className="text-[#00150D] font-semibold">
                      {metadata?.name ? metadata?.name : "Collection Name"}
                    </p>
                  </div>
                  <p className="text-[#67797F] text-sm">
                    {metadata?.description
                      ? metadata?.description
                      : "Description"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
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
          <Button onClick={handleSubmit}>Mint NFT</Button>
        )}
      </div>
    </div>
  );
}
