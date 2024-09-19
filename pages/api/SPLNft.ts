// /* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//     clusterApiUrl,
//     Connection,
//     Keypair,
//     PublicKey,
//     sendAndConfirmTransaction,
//     SystemProgram,
//     Transaction,
//   } from "@solana/web3.js";
//   import {
//     createInitializeMetadataPointerInstruction,
//     createInitializeMintInstruction,
//     createMintToInstruction,
//     ExtensionType,
//     getMintLen,
//     LENGTH_SIZE,
//     TOKEN_2022_PROGRAM_ID,
//     TYPE_SIZE,
//   } from "@solana/spl-token";
//   import {
//     createInitializeInstruction,
//     pack,
//     TokenMetadata,
//   } from "@solana/spl-token-metadata";
//   import bs58 from "bs58";
//   import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
//   import { NextApiRequest, NextApiResponse } from "next";
  
//   // Utility to create metadata for an NFT
//   async function createNFTMetadata(
//     connection: Connection,
//     mintPublicKey: PublicKey,
//     payer: Keypair,
//     name: string,
//     symbol: string,
//     uri: string
//   ) {
//     const metadata: TokenMetadata = {
//       mint: mintPublicKey,
//       name: name,
//       symbol: symbol,
//       uri: uri,
//       additionalMetadata: [],
//     };
  
//     const metadataInstruction = createInitializeInstruction({
//       programId: TOKEN_2022_PROGRAM_ID,
//       mint: mintPublicKey,
//       metadata: mintPublicKey,
//       name: metadata.name,
//       symbol: metadata.symbol,
//       uri: metadata.uri,
//       mintAuthority: payer.publicKey,
//       updateAuthority: payer.publicKey,
//     });
  
//     const metadataTransaction = new Transaction().add(metadataInstruction);
//     const metadataSignature = await sendAndConfirmTransaction(
//       connection,
//       metadataTransaction,
//       [payer]
//     );
  
//     return metadataSignature;
//   }
  
//   export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
//   ) {
//     try {
//       // Ensure the request method is POST for security
//       if (req.method !== "POST") {
//         return res.status(405).json({ message: "Method not allowed" });
//       }
  
//       const { collectionName, collectionSymbol, uris, tokenOwner } = req.body;
  
//       // Solana Private Key from environment variable
//       const PRIVATE_KEY = process.env.NEXT_PUBLIC_SOL_PRIVATE_KEY;
//       if (!PRIVATE_KEY) {
//         return res.status(400).json({ message: "Missing private key" });
//       }
  
//       const payer = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
  
//       const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
//       // Create Collection Mint
//       const collectionMint = Keypair.generate();
//       const collectionDecimals = 0;
  
//       const tokenOwnerPublicKey = new PublicKey(tokenOwner);
  
//       const collectionMetadata: TokenMetadata = {
//         mint: collectionMint.publicKey,
//         name: collectionName,
//         symbol: collectionSymbol,
//         uri: "", // Collection URI, typically a metadata file describing the collection
//         additionalMetadata: [],
//       };
  
//       const collectionMintLen = getMintLen([ExtensionType.MetadataPointer]);
//       const collectionMetadataLen =
//         TYPE_SIZE + LENGTH_SIZE + pack(collectionMetadata).length;
  
//       const collectionLamports = await connection.getMinimumBalanceForRentExemption(
//         collectionMintLen + collectionMetadataLen
//       );
  
//       const collectionTransaction = new Transaction().add(
//         SystemProgram.createAccount({
//           fromPubkey: payer.publicKey,
//           newAccountPubkey: collectionMint.publicKey,
//           space: collectionMintLen,
//           lamports: collectionLamports,
//           programId: TOKEN_2022_PROGRAM_ID,
//         }),
//         createInitializeMetadataPointerInstruction(
//           collectionMint.publicKey,
//           payer.publicKey,
//           collectionMint.publicKey,
//           TOKEN_2022_PROGRAM_ID
//         ),
//         createInitializeMintInstruction(
//           collectionMint.publicKey,
//           collectionDecimals,
//           payer.publicKey,
//           null,
//           TOKEN_2022_PROGRAM_ID
//         ),
//         createInitializeInstruction({
//           programId: TOKEN_2022_PROGRAM_ID,
//           mint: collectionMint.publicKey,
//           metadata: collectionMint.publicKey,
//           name: collectionMetadata.name,
//           symbol: collectionMetadata.symbol,
//           uri: collectionMetadata.uri,
//           mintAuthority: payer.publicKey,
//           updateAuthority: payer.publicKey,
//         })
//       );
  
//       const collectionSig = await sendAndConfirmTransaction(
//         connection,
//         collectionTransaction,
//         [payer, collectionMint]
//       );
  
//       const mintSignatures = [];
//       const nftAddresses = [];
  
//       // Mint individual NFTs in the collection
//       for (let i = 0; i < uris.length; i++) {
//         const nftMint = Keypair.generate();
  
//         // Metadata for individual NFT
//         const nftMetadata: TokenMetadata = {
//           mint: nftMint.publicKey,
//           name: `${collectionName} #${i + 1}`,
//           symbol: collectionSymbol,
//           uri: uris[i], // URI of individual NFT
//           additionalMetadata: [["collection", collectionMint.publicKey.toBase58()]],
//         };
  
//         const mintLen = getMintLen([ExtensionType.MetadataPointer]);
//         const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(nftMetadata).length;
  
//         const mintLamports = await connection.getMinimumBalanceForRentExemption(
//           mintLen + metadataLen
//         );
  
//         const mintTransaction = new Transaction().add(
//           SystemProgram.createAccount({
//             fromPubkey: payer.publicKey,
//             newAccountPubkey: nftMint.publicKey,
//             space: mintLen,
//             lamports: mintLamports,
//             programId: TOKEN_2022_PROGRAM_ID,
//           }),
//           createInitializeMetadataPointerInstruction(
//             nftMint.publicKey,
//             payer.publicKey,
//             nftMint.publicKey,
//             TOKEN_2022_PROGRAM_ID
//           ),
//           createInitializeMintInstruction(
//             nftMint.publicKey,
//             0, // NFTs have 0 decimals
//             payer.publicKey,
//             null,
//             TOKEN_2022_PROGRAM_ID
//           ),
//           createInitializeInstruction({
//             programId: TOKEN_2022_PROGRAM_ID,
//             mint: nftMint.publicKey,
//             metadata: nftMint.publicKey,
//             name: nftMetadata.name,
//             symbol: nftMetadata.symbol,
//             uri: nftMetadata.uri,
//             mintAuthority: payer.publicKey,
//             updateAuthority: payer.publicKey,
//           })
//         );
  
//         const mintSignature = await sendAndConfirmTransaction(
//           connection,
//           mintTransaction,
//           [payer, nftMint]
//         );
  
//         // Assign NFT to tokenOwner's account
//         const tokenOwnerAccount = await getOrCreateAssociatedTokenAccount(
//           connection,
//           payer,
//           nftMint.publicKey,
//           tokenOwnerPublicKey,
//           false,
//           undefined,
//           undefined,
//           TOKEN_2022_PROGRAM_ID
//         );
  
//         const mintToTx = new Transaction().add(
//           createMintToInstruction(
//             nftMint.publicKey,
//             tokenOwnerAccount.address,
//             payer.publicKey,
//             1, // Minting 1 NFT
//             [payer],
//             TOKEN_2022_PROGRAM_ID
//           )
//         );
  
//         await sendAndConfirmTransaction(connection, mintToTx, [payer, nftMint]);
  
//         mintSignatures.push(mintSignature);
//         nftAddresses.push(nftMint.publicKey.toBase58());
//       }
  
//       // Respond with collection and individual NFT mint signatures
//       res.status(200).json({
//         message: "NFT collection minted successfully",
//         collectionMint: collectionMint.publicKey.toBase58(),
//         collectionSignature: collectionSig,
//         nftSignatures: mintSignatures,
//         nftAddresses: nftAddresses,
//       });
//     } catch (error: any) {
//       console.error("Error minting NFT collection:", error);
//       res
//         .status(500)
//         .json({ message: "Internal Server Error", error: error.message });
//     }
//   }
  