// api/getPrivateKey.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { encryptedWallet, password } = req.body;

      // Decrypt the wallet using the provided password
      const wallet = await ethers.Wallet.fromEncryptedJson(encryptedWallet, password);

      // Respond with the private key
      res.status(200).json({
        address: wallet.address,
        privateKey: wallet.privateKey,
      });
    } catch (error) {
      console.error('Error decrypting wallet:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
