/* eslint-disable @typescript-eslint/no-explicit-any */
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/utils/firebase";

export default async function addUser(data: any) {
  try {
    // Check if data and uid are valid
    if (!data || !data.uid) {
      throw new Error("Invalid data or missing uid");
    }

    // Proceed with adding the document
    await setDoc(doc(db, "crossMint", data.uid), data);
    return { ...data, id: data.uid };
  } catch (error) {
    console.error("Error adding doc:", error);
    return null; // Optionally return null or handle error accordingly
  }
}
