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
    // Ensure the request method is POST for security
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { name, symbol, totalSupply, uri, tokenOwner } = req.body;

    // Solana Private Key from environment variable
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_SOL_PRIVATE_KEY;
    if (!PRIVATE_KEY) {
      return res.status(400).json({ message: "Missing private key" });
    }

    const payer = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));

    const mint = Keypair.generate();
    const decimals = 9;

    const tokenOwnerPublicKey = new PublicKey(tokenOwner);

    // Metadata for the token
    const metadata: TokenMetadata = {
      mint: mint.publicKey,
      name: name,
      symbol: symbol,
      uri: uri,
      additionalMetadata: [["new-field", "new-value"]],
    };

    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const mintK = mint.publicKey;

    const mintLamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataLen
    );

    const mintTransaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: mintK,
        space: mintLen,
        lamports: mintLamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeMetadataPointerInstruction(
        mintK,
        payer.publicKey,
        mintK,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeMintInstruction(
        mintK,
        decimals,
        payer.publicKey,
        null,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        mint: mintK,
        metadata: mintK,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        mintAuthority: payer.publicKey,
        updateAuthority: payer.publicKey,
      })
    );

    const sig = await sendAndConfirmTransaction(connection, mintTransaction, [
      payer,
      mint,
    ]);

    // Get the token account of the fromWallet address, and if it does not exist, create it
    const tokenOwnerAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mintK,
      tokenOwnerPublicKey,
      false,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );

    const mintTx = new Transaction().add(
      createMintToInstruction(
        mintK,
        tokenOwnerAccount.address,
        payer.publicKey,
        totalSupply * 10 ** decimals,
        [payer],
        TOKEN_2022_PROGRAM_ID
      )
    );

    const sig2 = await sendAndConfirmTransaction(connection, mintTx, [
      payer,
      mint,
    ]);

    // Respond with transaction signatures
    res.status(200).json({
      message: "Token minted successfully",
      mintAddress: mint.publicKey.toBase58(),
      createSignature: sig,
      mintSignature: sig2,
      tokenOwnerAccount: tokenOwnerAccount.address.toBase58(),
    });
  } catch (error: any) {
    console.error("Error minting token:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
