// import localFont from "next/font/local";
import { Context } from "@/components/Context";
import DefaultLayout from "@/layouts/default";
import { useContext } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const { user } = useContext(Context);

  const getKey = async () => {
    try {
      const response = await fetch('/api/getPrivateKey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedWallet: user?.wallet?.encryptedWallet, password: "12345678" }),
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve private key');
      }

      const { address, privateKey } = await response.json();
      console.log('Wallet address:', address);
      console.log('Private key:', privateKey);

      // Handle success (e.g., display private key or address)
      toast.success('Private key retrieved successfully');
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <DefaultLayout>
      <div>
        <p className="text-black" onClick={getKey}>
          Overview
        </p>
      </div>
    </DefaultLayout>
  );
}
