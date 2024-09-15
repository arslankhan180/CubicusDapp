/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

export default async function addNfts(data: any) {
  try {
    // Ensure that the data contains the uid, which identifies the user
    if (!data || !data.uid) {
      throw new Error("Invalid data or missing uid");
    }

    // Reference to the user's 'NFT_Collections' subcollection
    const collectionsRef = collection(db, "Minted_NFTs");

    // Add a new document to the 'NFT_Collections' subcollection
    const docRef = await addDoc(collectionsRef, data);

    // Return the document ID and the rest of the data
    return { ...data, id: docRef.id };
  } catch (error) {
    console.error("Error adding collection:", error);
    return null;  // Return null in case of an error
  }
}
