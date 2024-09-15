import Image from "next/image";
import React, { useState } from "react";

interface ContractTypeProps {
  handleChange: (selectedType: string) => void;
}

export default function ContractType({ handleChange }: ContractTypeProps) {
  const [select, setSelect] = useState<string | null>(null);
  const type = [
    {
      key: "create",
      img: "/svg/createContract.svg",
      title: "Create a new contract",
      des: "I want Cubicus Dapp to deploy a new NFT collection contract for me",
    },
    {
      key: "import",
      img: "/svg/importContract.svg",
      title: "Import an existing contract",
      des: "I want to use Cubicus Dapp APIs with my existing NFT collection contract",
    },
  ];

  const handleSelection = (selectedType: string) => {
    setSelect(selectedType);
    handleChange(selectedType); // Call the parent handler with the selected type
  };

  return (
    <div>
      <p className="text-[#00150D] text-xl font-semibold">
        Create or import your collection contract
      </p>
      <div className="flex flex-col gap-4 mt-4">
        {type.map((item, idx) => (
          <div
            key={idx}
            className={`flex gap-4 p-6 items-center rounded-lg cursor-pointer hover:border-[#233236] ${
              select === item.key ? "border border-[#05B96E]" : "border"
            }`}
            onClick={() => handleSelection(item.key)}
          >
            <div>
              <Image alt="" src={item?.img} width={60} height={60} />
            </div>
            <div>
              <p className="text-[#233236] font-bold">{item?.title}</p>
              <p className="text-[#59797F] text-sm">{item?.des}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#67797F] text-center mt-6">Trying to register a marketplace instead? <span className="text-xs text-[#36B37E] cursor-pointer">Contact us</span></p>
    </div>
  );
}
