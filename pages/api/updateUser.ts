/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

export default async function updateUser(data: any) {
  try {
    await updateDoc(doc(db, "crossMint", data.uid), data);
  } catch (error) {
    console.error("Error adding doc:", error);
  }
}
