/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import FormData from "form-data";

const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      const { image, metadata } = req.body;

      const imageResponse = await uploadToPinata(image, "image");
      const imageHash = imageResponse.IpfsHash;

      const updatedMetadata = {
        ...metadata,
        image: `https://ipfs.io/ipfs/${imageHash}`,
      };

      const metadataResponse = await uploadToPinata(
        JSON.stringify(updatedMetadata),
        "metadata"
      );

      res.status(200).json({
        imageUrl: `https://ipfs.io/ipfs/${imageHash}`,
        metadataUrl: `https://ipfs.io/ipfs/${metadataResponse.IpfsHash}`,
        imageHas: imageHash,
        metadatHash: metadataResponse.IpfsHash,
      });
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      res.status(500).json({ error: "Failed to upload to Pinata" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

async function uploadToPinata(content: any, type: any) {
  const formData = new FormData();

  if (type === "image") {
    // Attach image buffer
    formData.append("file", Buffer.from(content, "base64"), {
      filename: "nft-image.png",
      contentType: "image/png",
    });
  } else if (type === "metadata") {
    // Attach JSON metadata
    formData.append("file", Buffer.from(content), {
      filename: "metadata.json",
      contentType: "application/json",
    });
  }

  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  const response = await axios.post(url, formData, {
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": `multipart/form-data,`,
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
    },
  });

  return response.data;
}
