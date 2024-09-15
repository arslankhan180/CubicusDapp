// api/createWallet.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { password } = req.body;

      // Create a new wallet
      const wallet = ethers.Wallet.createRandom();
      
      // Encrypt the wallet using the provided password
      const encryptedWallet = await wallet.encrypt(password);

      // Respond with the encrypted wallet and address
      res.status(200).json({
        address: wallet.address,
        encryptedWallet,
      });
    } catch (error) {
      console.error('Error creating wallet:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
