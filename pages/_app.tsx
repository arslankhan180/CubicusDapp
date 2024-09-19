/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from "@/components/Context";
import "@/styles/globals.css";
import { auth, db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getUser from "./api/getUser";

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const getUserLocalStorage = () => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) return router.replace("/login");
      const firebaseUser = await getUser(user?.uid);
      const dbUser = await getDoc(doc(db, "crossMint", user?.uid));
      setUser({ ...firebaseUser, ...dbUser.data(), id: user?.uid });
    });
  };

  useEffect(() => {
    getUserLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  return (
    <>
        <Context.Provider value={{ user, setUser }}>
          <Component {...pageProps} />
          <ToastContainer />
        </Context.Provider>
    </>
  );
}
