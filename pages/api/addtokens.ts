/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

export default async function addTokens(data: any) {
  try {
    // Ensure that the data contains the uid, which identifies the user
    if (!data || !data.uid) {
      throw new Error("Invalid data or missing uid");
    }
    const tokenRef = collection(db, "Tokens");

    const docRef = await addDoc(tokenRef, data);

    return { ...data, id: docRef.id };
  } catch (error) {
    console.error("Error adding token:", error);
    return null;  // Return null in case of an error
  }
}
