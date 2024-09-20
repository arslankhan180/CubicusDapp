import { NextApiRequest, NextApiResponse } from "next";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.NEXT_PUBLIC_OPENAI_SECRET_KEY,
// });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { prompt } = req.body;

    // Validate the prompt
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    try {
      const dalleResponse = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_SECRET_KEY}`,
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: `Create a simple, professional, and relatable blog banner image that represents: "${prompt}". The image should be clear, not abstract, and suitable for a professional blog post. Avoid text in the image. Focus on symbolic or metaphorical representations that align with the title's theme.The image should work well as a background with text overlay.`,
            n: 1,
            size: "1024x1024",
          }),
        }
      );

      if (!dalleResponse.ok) {
        const error = await dalleResponse.json();
        console.error("Error generating image:", error);
        return res.json({ error: "Failed to generate image" });
      }
      const dalleData = await dalleResponse.json();
      const imageUrl = dalleData.data[0].url;
      return res.json({ imageUrl: imageUrl });
      //     const response = await openai.images.generate({
      //         model: "dall-e-3",
      //         prompt: prompt,
      //         n: 1,
      //         size: "1024x1024",
      //       });
      //     //  const image_url = response.data[0].url;

      //   const imageUrl = response.data[0]?.url; // Get the URL of the generated image
      //   if (imageUrl) {
      //     return res.status(200).json({ url: imageUrl });
      //   } else {
      //     return res
      //       .status(500)
      //       .json({ error: "No image URL returned from OpenAI." });
      //   }
    } catch (error) {
      console.error("Error:", error); // Log the entire error object for debugging

      // Check for specific error messages
      if (error instanceof Error) {
        if (error.message.includes("Billing hard limit has been reached")) {
          return res.status(403).json({
            error: "Billing limit reached. Please check your account.",
          });
        }
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(500).json({ error: "An unexpected error occurred." });
      }
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
