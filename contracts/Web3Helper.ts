/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import { useContractInstance } from "./instance";
import addCollections from "@/pages/api/addCollections";
import { useRouter } from "next/router";
import addNfts from "@/pages/api/addNfts";
import addTokens from "@/pages/api/addtokens";

export function useWeb3Helper() {
  const router = useRouter();
  const collectionCreate = async (data: any, owner: string, id: string) => {
    try {
      const { Factory } = useContractInstance(data?.blockchain);
      const contract = await Factory();

      const create = await contract.createCollection(
        data?.collName,
        data?.collName,
        owner
      );
      const result = await create.wait();

      addCollections({
        uid: id,
        img: data?.img,
        collName: data?.collName,
        des: data?.des,
        website: data?.website,
        twitter: data?.twitter,
        discord: data?.discord,
        contractType: data?.contractType,
        nftPrice: data?.nftPrice,
        currency: data?.currency,
        paysFee: data?.paysFee,
        recipientAddress: data?.recipientAddress,
        active: data?.active,
        tab: data?.tab,
        blockchain: data?.blockchain,
        owner,
        collectionAddress: result?.events[2]?.args?.collection,
        txHash: result?.transactionHash,
        date: new Date(),
      });
      toast.success("Collection Created");
      router.replace(`/collections`);
    } catch (error: any) {
      toast.error(error);
      console.log(error);
    }
  };

  const tokenCreate = async (data: any, user: any) => {
    try {
      const { Factory } = useContractInstance(data?.blockchain);
      const contract = await Factory();
      const create = await contract.createToken(
        data?.name,
        data?.symbol,
        data?.totalSupply,
        user?.wallet?.address
      );
      const result = await create.wait();
      console.log("🚀 ~ tokenCreate ~ result:", result);

      addTokens({
        uid: user?.uid,
        img: data?.img,
        name: data?.name,
        symbol: data?.symbol,
        totalSupply: data?.totalSupply,
        des: data?.des,
        website: data?.website,
        twitter: data?.twitter,
        discord: data?.discord,
        blockchain: data?.blockchain,
        owner: user?.wallet?.address,
        tokenAddress: result?.events[0]?.address,
        txHash: result?.transactionHash,
        date: new Date(),
      });

      toast.success("Token Created");
    } catch (error) {
      console.log(error);
    }
  };

  const createSPL = async (data: any, user: any) => {
    const response = await fetch("/api/SPLToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data?.name,
        symbol: data?.symbol,
        totalSupply: data?.totalSupply,
        uri: data?.img,
        tokenOwner: user?.solWallet?.address,
      }),
    });

    if (!response.ok) {
      console.error("Failed to create SPL token");
    }

    const result = await response.json(); // Parse JSON response
    console.log("Response data:", result);
    addTokens({
      uid: user?.uid,
      img: data?.img,
      name: data?.name,
      symbol: data?.symbol,
      totalSupply: data?.totalSupply,
      des: data?.des,
      website: data?.website,
      twitter: data?.twitter,
      discord: data?.discord,
      blockchain: data?.blockchain,
      owner: "DDmxsRysq6NS8tA6nvm4TwFUCd4xkESdHVxU3yNYnrHy",
      tokenAddress: result?.mintAddress,
      txHash: result?.mintSignature,
      date: new Date(),
    });
  };

  const createSolCollection = async (data: any, owner: string, id: string) => {
    const response = await fetch("/api/splCreateCollection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collectionName: data?.collName,
        collectionSymbol: data?.collName,
        tokenOwner: owner,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log(`Collection created successfully: ${result.collectionMint}`);
      console.log(result.collectionMint); // Store the collection mint

      addCollections({
        uid: id,
        img: data?.img,
        collName: data?.collName,
        des: data?.des,
        website: data?.website,
        twitter: data?.twitter,
        discord: data?.discord,
        contractType: data?.contractType,
        nftPrice: data?.nftPrice,
        currency: data?.currency,
        paysFee: data?.paysFee,
        recipientAddress: data?.recipientAddress,
        active: data?.active,
        tab: data?.tab,
        blockchain: data?.blockchain,
        owner,
        collectionAddress: result?.collectionMint,
        txHash: result?.collectionSignature,
        date: new Date(),
      });
      toast.success("Collection Created");
      router.replace(`/collections`);
    } else {
      console.log(`Error: ${result.message}`);
    }
  };

  const mintNft = async (
    id: string,
    metadata: any,
    blockchain: string,
    owner: string,
    nftAddress: string,
    data: any
  ) => {
    try {
      const metaHash = `ipfs://${data?.metadatHash}`;
      const { NFT } = useContractInstance(blockchain);
      const contract = await NFT(nftAddress);
      const create = await contract.safeMint(owner, metaHash);
      const result = await create.wait();

      addNfts({
        uid: id,
        imgUrl: data?.imageUrl,
        metadataUrl: data?.metadataUrl,
        name: metadata?.name,
        des: metadata?.description,
        blockchain,
        owner,
        nftAddress,
        tokenId: Number(result?.events[0]?.args?.tokenId),
        txHash: result?.transactionHash,
        date: new Date(),
      });
      toast.success("NFT Minted");
      router.replace(
        `/collections/nfts?collection=${nftAddress}&&chain=${blockchain}`
      );
    } catch (error: any) {
      toast.error(error);
      console.log(error);
    }
  };

  const mintSolNft = async (
    id: string,
    metadata: any,
    blockchain: string,
    owner: string,
    nftAddress: string,
    data: any
  ) => {
    const response = await fetch("/api/splMintNft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collectionMintAddress: nftAddress,
        uris: [data?.imageUrl],
        tokenOwner: owner,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log(
        `NFTs minted successfully! Addresses: ${result.nftAddresses}`
      );
      addNfts({
        uid: id,
        imgUrl: data?.imageUrl,
        metadataUrl: data?.metadataUrl,
        name: metadata?.name,
        des: metadata?.description,
        blockchain,
        owner,
        nftAddress,
        tokenId: result?.nftAddresses,
        txHash: result?.nftSignatures,
        date: new Date(),
      });
      toast.success("NFT Minted");
      router.replace(
        `/collections/nfts?collection=${nftAddress}&&chain=${blockchain}`
      );
    } else {
      console.log(`Error: ${result.message}`);
    }
  };

  return {
    collectionCreate,
    tokenCreate,
    createSPL,
    createSolCollection,
    mintNft,
    mintSolNft,
  };
}
