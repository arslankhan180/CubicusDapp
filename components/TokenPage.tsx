/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Button from "./Comp/Button";
import { Context } from "./Context";
import TokenTable from "./Tables/TokenTable";
import { BsCashCoin } from "react-icons/bs";
import getTokens from "@/pages/api/getTokens";

export default function TokenPage() {
  const { user } = useContext(Context);
  const [collections, setCollections] = useState<any[]>([]);
  const router = useRouter();

  const getAllTokens = async () => {
    try {
      const allTokens = await getTokens();
      if (Array.isArray(allTokens)) {
        const userCollections = allTokens.filter(
          (collection: any) =>
            collection.owner.toLowerCase() ===
            user?.wallet?.address.toLowerCase()
        );
        setCollections(userCollections);
      } else {
        console.log("No collections found or invalid data format");
        setCollections([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.uid) {
        getAllTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="w-full">
      <p className="text-2xl text-[#00510D] font-semibold">Tokens</p>
      <p className="text-sm text-[#67797F]">
        Create and manage your smart contracts
      </p>
      {collections.length < 1 ? (
        <div className="w-full flex flex-col justify-center items-center bg-white rounded-lg py-4 h-[70vh] gap-4 mt-4">
          {/* <Image src={"/svg/NFT.svg"} alt="" width={200} height={200} /> */}
          <BsCashCoin size={200} color="#11E982" />
          <p className="text-[#00510D] text-2xl font-semibold">No Tokens</p>
          <p className="text-sm text-[#67797F]">
            Create your first token with Cubicus Dapp
          </p>
          <Button onClick={() => router.replace(`/collections/newdetails`)}>
            New Token
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <Button
            onClick={() => router.replace(`/tokens/newtoken`)}
            className="mb-2"
          >
            New Token
          </Button>
          <TokenTable collections={collections} />
        </div>
      )}
    </div>
  );
}
