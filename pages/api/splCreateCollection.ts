/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    clusterApiUrl,
    Connection,
    Keypair,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
  } from "@solana/web3.js";
  import {
    createInitializeMetadataPointerInstruction,
    createInitializeMintInstruction,
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
  import { NextApiRequest, NextApiResponse } from "next";
  
  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
      }
  
      const { collectionName, collectionSymbol, tokenOwner } = req.body;
  
      // Validate request body fields
      if (!collectionName || !collectionSymbol || !tokenOwner) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const PRIVATE_KEY = process.env.NEXT_PUBLIC_SOL_PRIVATE_KEY;
      if (!PRIVATE_KEY) {
        return res.status(400).json({ message: "Missing private key" });
      }
  
      const payer = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
      // Create Collection Mint
      const collectionMint = Keypair.generate();
      const collectionDecimals = 0;
  
      const collectionMetadata: TokenMetadata = {
        mint: collectionMint.publicKey,
        name: collectionName,
        symbol: collectionSymbol,
        uri: "", // Collection-level URI if needed
        additionalMetadata: [],
      };
  
      const collectionMintLen = getMintLen([ExtensionType.MetadataPointer]);
      const collectionMetadataLen =
        TYPE_SIZE + LENGTH_SIZE + pack(collectionMetadata).length;
  
      const collectionLamports =
        await connection.getMinimumBalanceForRentExemption(
          collectionMintLen + collectionMetadataLen
        );
  
      // Create transaction to set up collection mint
      const collectionTransaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: payer.publicKey,
          newAccountPubkey: collectionMint.publicKey,
          space: collectionMintLen,
          lamports: collectionLamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(
          collectionMint.publicKey,
          payer.publicKey,
          collectionMint.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(
          collectionMint.publicKey,
          collectionDecimals,
          payer.publicKey,
          null,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          mint: collectionMint.publicKey,
          metadata: collectionMint.publicKey,
          name: collectionMetadata.name,
          symbol: collectionMetadata.symbol,
          uri: collectionMetadata.uri,
          mintAuthority: payer.publicKey,
          updateAuthority: payer.publicKey,
        })
      );
  
      // Send transaction
      const collectionSignature = await sendAndConfirmTransaction(
        connection,
        collectionTransaction,
        [payer, collectionMint]
      );
  
      // Respond with the collection mint and signature
      res.status(200).json({
        message: "NFT collection created successfully",
        collectionMint: collectionMint.publicKey.toBase58(),
        collectionSignature,
      });
    } catch (error: any) {
      console.error("Error creating NFT collection:", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message || "Unknown error",
      });
    }
  }
  