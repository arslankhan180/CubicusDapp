/* eslint-disable @typescript-eslint/no-explicit-any */
import Replicate from 'replicate';

const handler = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }
  const { text } = req.body;

  try {
    const replicate = new Replicate({
      auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
        "bingbangboom-lab/flux-new-whimscape:2e8de10f217bc56da163a0204cf09f89995eaf643459014803fae79753183682",
        {
          input: {
            model: "dev",
            width: 856,
            height: 1156,
            // prompt: "a white-haired young woman wearing a flower crown, a very large fiery dragon, castle in the background, illustration in the style of WHMSCPE001",
            prompt: text,
            lora_scale: 1,
            num_outputs: 1,
            aspect_ratio: "1:1",
            output_format: "png",
            guidance_scale: 3.5,
            output_quality: 100,
            prompt_strength: 0.8,
            extra_lora_scale: 1,
            num_inference_steps: 25
          }
        }
      );
    // const output = await replicate.run(
    //   "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
    //   {
    //     input: {
    //       prompt: value,
    //       image_dimensions: "512x512",
    //       num_inference_steps: 12,
    //       num_outputs: 1,
    //       guideance_scale: 3.5,
    //       scheduler: "K_EULER",
    //     },
    //   },
    // );

    res.status(200).json(output);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default handler;