/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import Button from "./Comp/Button";
import { useRouter } from "next/router";
import CollectionTable from "./Tables/CollectionTable";
import getCollections from "@/pages/api/getCollections";
import { Context } from "./Context";

export default function NewCollections() {
  const { user } = useContext(Context);
  const [collections, setCollections] = useState<any[]>([]);

  const router = useRouter();

  const getAllCollections = async () => {
    try {
      const allCollections = await getCollections();
      if (Array.isArray(allCollections)) {
        // Filter collections based on the logged-in user's address
        const userCollections = allCollections.filter(
          (collection: any) => collection.uid === user?.uid
        );
        setCollections(userCollections);
      } else {
        // Handle the case where allCollections is undefined or not an array
        console.log("No collections found or invalid data format");
        setCollections([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      getAllCollections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="w-full">
      <p className="text-2xl text-[#00510D] font-semibold">Collections</p>
      <p className="text-sm text-[#67797F]">
        Create or import, and manage your smart contracts
      </p>
      {collections.length < 1 ? (
        <div className="w-full flex flex-col justify-center items-center bg-white rounded-lg py-4 h-[70vh] gap-4 mt-4">
          <Image src={"/svg/NFT.svg"} alt="" width={200} height={200} />
          <p className="text-[#00510D] text-2xl font-semibold">
            No collections
          </p>
          <p className="text-sm text-[#67797F]">
            Create your first collection with Cubicus Dapp
          </p>
          <Button onClick={() => router.replace(`/collections/newdetails`)}>
            New Collection
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <Button
            onClick={() => router.replace(`/collections/newdetails`)}
            className="mb-2"
          >
            New Collection
          </Button>
          <CollectionTable collections={collections} />
        </div>
      )}
    </div>
  );
}
