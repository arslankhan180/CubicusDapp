// api/decryptSolanaWallet.ts
import { NextApiRequest, NextApiResponse } from 'next';
import CryptoJS from 'crypto-js';

// Helper function to decrypt text using a password
function decrypt(encryptedText: string, password: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedText, password);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  if (!decrypted) {
    throw new Error('Failed to decrypt');
  }
  return decrypted;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { encryptedPrivateKey, password } = req.body;

      // Decrypt the Solana private key using the provided password
      const privateKey = decrypt(encryptedPrivateKey, password);

      // Respond with the decrypted private key
      res.status(200).json({
        privateKey,
      });
    } catch (error) {
      console.error('Error decrypting Solana wallet:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
