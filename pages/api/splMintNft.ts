/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    clusterApiUrl,
    Connection,
    Keypair,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
  } from "@solana/web3.js";
  import {
    createInitializeMetadataPointerInstruction,
    createInitializeMintInstruction,
    createMintToInstruction,
    ExtensionType,
    getMintLen,
    LENGTH_SIZE,
    TOKEN_2022_PROGRAM_ID,
    TYPE_SIZE,
  } from "@solana/spl-token";
  import {
    createInitializeInstruction,
    pack,
    TokenMetadata,
  } from "@solana/spl-token-metadata";
  import bs58 from "bs58";
  import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
  import { NextApiRequest, NextApiResponse } from "next";
  
  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
      }
  
      const { collectionMintAddress, uris, tokenOwner } = req.body;
  
      // Validate request body fields
      if (!collectionMintAddress || !uris || !tokenOwner) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      if (!uris || uris.length === 0) {
        return res.status(400).json({ message: "URIs for NFTs are required" });
      }
  
      const PRIVATE_KEY = process.env.NEXT_PUBLIC_SOL_PRIVATE_KEY;
      if (!PRIVATE_KEY) {
        return res.status(400).json({ message: "Missing private key" });
      }
  
      const payer = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
      const tokenOwnerPublicKey = new PublicKey(tokenOwner);
    //   const collectionMint = new PublicKey(collectionMintAddress);
  
      const mintSignatures = [];
      const nftAddresses = [];
  
      // Mint individual NFTs in the collection
      for (let i = 0; i < uris.length; i++) {
        const nftMint = Keypair.generate();
  
        // Validate each URI
        if (!uris[i]) {
          console.error(`Invalid URI at index ${i}`);
          return res.status(400).json({
            message: `Invalid URI at index ${i}`,
          });
        }
  
        // Metadata for individual NFT
        const nftMetadata: TokenMetadata = {
          mint: nftMint.publicKey,
          name: `NFT #${i + 1}`,
          symbol: "", // Optional: specify symbol if needed
          uri: uris[i], // URI of individual NFT
          additionalMetadata: [
            ["collection", collectionMintAddress],
          ],
        };
  
        // Validate NFT metadata
        if (!nftMetadata.name || !nftMetadata.uri) {
          console.error(`Invalid metadata for NFT at index ${i}`);
          return res.status(400).json({
            message: `Invalid metadata for NFT at index ${i}`,
          });
        }
  
        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(nftMetadata).length;
  
        const mintLamports = await connection.getMinimumBalanceForRentExemption(
          mintLen + metadataLen
        );
  
        const mintTransaction = new Transaction().add(
          SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: nftMint.publicKey,
            space: mintLen,
            lamports: mintLamports,
            programId: TOKEN_2022_PROGRAM_ID,
          }),
          createInitializeMetadataPointerInstruction(
            nftMint.publicKey,
            payer.publicKey,
            nftMint.publicKey,
            TOKEN_2022_PROGRAM_ID
          ),
          createInitializeMintInstruction(
            nftMint.publicKey,
            0, // NFTs have 0 decimals
            payer.publicKey,
            null,
            TOKEN_2022_PROGRAM_ID
          ),
          createInitializeInstruction({
            programId: TOKEN_2022_PROGRAM_ID,
            mint: nftMint.publicKey,
            metadata: nftMint.publicKey,
            name: nftMetadata.name,
            symbol: nftMetadata.symbol,
            uri: nftMetadata.uri,
            mintAuthority: payer.publicKey,
            updateAuthority: payer.publicKey,
          })
        );
  
        const mintSignature = await sendAndConfirmTransaction(
          connection,
          mintTransaction,
          [payer, nftMint]
        );
  
        // Assign NFT to tokenOwner's account
        const tokenOwnerAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          payer,
          nftMint.publicKey,
          tokenOwnerPublicKey,
          false,
          undefined,
          undefined,
          TOKEN_2022_PROGRAM_ID
        );
  
        const mintToTx = new Transaction().add(
          createMintToInstruction(
            nftMint.publicKey,
            tokenOwnerAccount.address,
            payer.publicKey,
            1, // Minting 1 NFT
            [],
            TOKEN_2022_PROGRAM_ID
          )
        );
  
        await sendAndConfirmTransaction(connection, mintToTx, [payer]);
  
        mintSignatures.push(mintSignature);
        nftAddresses.push(nftMint.publicKey.toBase58());
      }
  
      // Respond with individual NFT mint signatures
      res.status(200).json({
        message: "NFTs minted successfully",
        nftSignatures: mintSignatures,
        nftAddresses: nftAddresses,
      });
    } catch (error: any) {
      console.error("Error minting NFTs:", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message || "Unknown error",
      });
    }
  }
  