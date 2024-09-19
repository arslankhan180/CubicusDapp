// api/createSolanaWallet.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import CryptoJS from 'crypto-js';

// Helper function to encrypt text using a password
function encrypt(text: string, password: string): string {
  return CryptoJS.AES.encrypt(text, password).toString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { password } = req.body;

      // Generate a new Solana wallet (keypair)
      const keypair = Keypair.generate();

      // Extract public and private keys
      const address = keypair.publicKey.toBase58();
      const privateKey = bs58.encode(keypair.secretKey); // Solana secret key (base58-encoded)

      // Encrypt the Solana private key using the provided password
      const encryptedWallet = encrypt(privateKey, password);

      // Respond with the public key and encrypted private key
      res.status(200).json({
        address,
        encryptedWallet,
      });
    } catch (error) {
      console.error('Error creating Solana wallet:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
