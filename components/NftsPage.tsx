/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import NftsTable from "./Tables/NftsTable";
import { Context } from "./Context";
import { useRouter } from "next/router";
import Button from "./Comp/Button";
import getAllNfts from "@/pages/api/getAllNfts";

export default function NftsPage() {
  const { user } = useContext(Context);
  const [nfts, setNfts] = useState<any[]>([]);
  const [collectionAddress, setCollectionAddress] = useState<string | null>(
    null
  );
  const [chainName, setChainName] = useState<string | null>(null);

  const router = useRouter();

  const getAllNft = async () => {
    try {
      const allNfts = await getAllNfts();
      if (Array.isArray(allNfts)) {
        // Filter collections based on the logged-in user's address
        const userNfts = allNfts.filter(
          (nft: any) =>
            nft.owner.toLowerCase() ===
            user?.wallet?.address.toLowerCase()
        );
        setNfts(userNfts);
      } else {
        // Handle the case where allCollections is undefined or not an array
        console.log("No collections found or invalid data format");
        setNfts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      getAllNft();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (router) {
      // Access the query parameter
      const { collection, chain } = router.query;

      if (collection && chain) {
        // Set the collection address state
        setCollectionAddress(collection as string);
        setChainName(chain as string);
      }
    }
  }, [router, router.query]);

  return (
    <div>
      <p className="text-2xl text-[#00510D] font-semibold mb-4">NFT'S</p>
      <Button
        className="text-white mb-2"
        onClick={() =>
          router.replace(
            `/collections/mint?collection=${collectionAddress}&&chain=${chainName}`
          )
        }
      >
        Mint
      </Button>
      <NftsTable nfts={nfts} />
    </div>
  );
}
