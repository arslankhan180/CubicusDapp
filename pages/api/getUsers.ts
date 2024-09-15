/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function getUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, "crossMint"));
    return querySnapshot.docs.map((i: any) => ({ ...i.data(), id: i.id }));
  } catch (error) {
    console.log(error);
  }
}
