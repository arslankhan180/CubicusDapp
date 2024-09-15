/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function getCollection(id: any) {
  try {
    const querySnapshot = await getDoc(doc(db, "Minted_NFTs", id));
    if (querySnapshot.exists()) {
      return { ...querySnapshot.data(), id: querySnapshot.id };
    }
    return false;
  } catch (error) {
    console.log(error);
  }
}
