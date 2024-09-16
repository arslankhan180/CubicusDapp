import React, { ChangeEvent } from "react";
import Input from "./Comp/Input";
import TextArea from "./Comp/TextArea";
import { TbWorld } from "react-icons/tb";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import Image from "next/image";

interface CollectionInfoProps {
  data: {
    img: string;
    collName: string;
    des: string;
    website: string;
    twitter: string;
    discord: string;
  };
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function CollectionInfo({
  data,
  handleChange,
  handleUpload,
}: CollectionInfoProps) {
  return (
    <div>
      <p className="text-[#00150D] text-xl font-semibold">
        Enter collection information
      </p>
      <p className="text-sm text-[#67797F] font-medium">
        This information will be used to review your collection before
        launching, and will be used as a preview in different UI surfaces.
        <br /> You can edit it later.
      </p>
      <div className="mt-4 flex gap-4">
        <div className="flex flex-col gap-4">
          <p className="text-[#00150D] text-sm font-bold">Collection Name</p>
          <Input
            placeholder="e.g. Genesis Membership Pass"
            type="text"
            name="collName"
            value={data.collName}
            onChange={handleChange}
          />
          <p className="text-[#00150D] text-sm font-bold">Description</p>
          <TextArea
            placeholder="e.g. Your gateway into web3"
            name="des"
            value={data.des}
            onChange={handleChange}
          />
          <p className="text-[#00150D] text-sm font-bold">
            Website{" "}
            <span className="text-[#67797F] font-medium">(Optional)</span>
          </p>
          <Input
            placeholder="https://www.yourwebsite.com"
            type="text"
            name="website"
            value={data.website}
            onChange={handleChange}
          />
          <div className="flex items-center gap-4 w-full">
            <div className="flex flex-col gap-4 w-full">
              <p className="text-[#00150D] text-sm font-bold">
                Twitter{" "}
                <span className="text-[#67797F] font-medium">(Optional)</span>
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
                <span className="text-[#67797F] font-medium">(Optional)</span>
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
        <div className="flex flex-col h-full gap-2">
          {data?.img ? (
            <Image src={data?.img} alt="" width={256} height={256} className="rounded-lg max-w-[256px] max-h-[256px]" />
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
                  Image (jpg, png, webp, gif) or video (mp4, avi) up to 2MB.
                </p>
              </label>
            </div>
          )}
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
      </div>
    </div>
  );
}
