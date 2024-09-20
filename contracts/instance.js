/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from "ethers";
import NFTMARKETPLACE_ABI from "./FactoryABI.json";
import NFT_ABI from "./NFTABI.json";

export function useContractInstance(blockchain) {
  const rpcUrls = {
    MATIC: "https://rpc.ankr.com/polygon_amoy",
    ETH: "https://1rpc.io/sepolia",
    BNB: "https://bsc-testnet-rpc.publicnode.com",
    FTM: "https://bsc-testnet-rpc.publicnode.com",
    U2U: "https://rpc-nebulas-testnet.uniultra.xyz",
  };

  const contractAddresses = {
    MATIC: "0x8bfd099363c2EC5a386DeC6071b9724A472cc9B0",
    ETH: "0xB2064cdc65B9A01fd87DcBbd2BB24E3e018A0330",
    BNB: "0xBnbContractAddress",
    FTM: "0xBnbContractAddress",
    U2U: ""
  };

  const provider = new ethers.providers.JsonRpcProvider(rpcUrls[blockchain]);
  const signer = new ethers.Wallet(
    process.env.NEXT_PUBLIC_PRIVATE_KEY,
    provider
  );

  const Factory = async () => {
    const contractAddress = contractAddresses[blockchain];
    const marketplaceContract = new ethers.Contract(
      contractAddress,
      NFTMARKETPLACE_ABI,
      signer
    );
    return marketplaceContract;
  };

  const NFT = async (nftAddress) => {
    const nftContract = new ethers.Contract(nftAddress, NFT_ABI, signer);
    return nftContract;
  };

  return { Factory, NFT, provider };
}
