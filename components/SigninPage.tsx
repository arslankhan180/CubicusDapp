/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import getUser from "@/pages/api/getUser";
import { auth } from "@/utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "./Context";
import { useRouter } from "next/router";

export default function SigninPage({ setActive }: any) {
  const { setUser } = useContext(Context);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    pass: "",
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { user } = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.pass
      );

      const firebaseUser = await getUser(user.uid);
      if (firebaseUser) {
        setUser({ ...firebaseUser, id: firebaseUser.id });
        router.replace("/");
        setLoading(false);
      }
    } catch (error: any) {
      console.error(error.code);
      console.error(error.message);
      setLoading(false);

      const errorMessage =
        error.code === "auth/wrong-password"
          ? "Incorrect password"
          : error.code === "auth/network-request-failed"
          ? "Network error. Please try again."
          : error.code === "auth/user-not-found"
          ? "User not found"
          : error.code === "auth/invalid-credential"
          ? "Invalid credentials"
          : "An unexpected error occurred";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="px-4 h-screen w-screen flex justify-center items-center">
      <div className="">
        <p className="text-[#00510D] text-3xl font-bold uppercase text-center mb-2">
          Cubicus Dapp
        </p>
        <p className="text-black font-bold text-2xl mb-4 text-center">Signin</p>
        <form className="max-w-md mx-auto" onSubmit={onSubmit}>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="email"
              id="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              required
              value={data?.email}
              onChange={(e: any) => setData({ ...data, email: e.target.value })}
            />
            <label
              htmlFor="email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email address
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="pass"
              id="pass"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              required
              value={data?.pass}
              onChange={(e: any) => setData({ ...data, pass: e.target.value })}
            />
            <label
              htmlFor="pass"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>
          </div>

          {loading ? (
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          )}
        </form>
        <p className="text-black mt-2 text-center">
          If you don't have an account{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => setActive("register")}
          >
            Click here
          </span>
        </p>
      </div>
    </div>
  );
}
