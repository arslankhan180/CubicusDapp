/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function getUser(id: any) {
  try {
    const querySnapshot = await getDoc(doc(db, "crossMint", id));
    if (querySnapshot.exists()) {
      return { ...querySnapshot.data(), id: querySnapshot.id };
    }
    return false;
  } catch (error) {
    console.log(error);
  }
}
