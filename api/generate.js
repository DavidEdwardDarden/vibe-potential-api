export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { prompt, mode } = req.body;
    const falKey = process.env.FAL_KEY;

    // Flow mode uses wide panoramic, static uses 16:9
    const imageSize = mode === 'flow' ? 'landscape_16_9' : 'landscape_16_9';
    
    // For flow mode, wrap the prompt to encourage seamless tiling
    const finalPrompt = mode === 'flow'
      ? `${prompt}, seamless tileable panoramic landscape, left edge and right edge match perfectly for infinite loop, consistent lighting and color palette throughout, wide cinematic vista`
      : prompt;

    const response = await fetch('https://fal.run/fal-ai/flux/dev', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: finalPrompt,
        image_size: imageSize,
        num_images: 1,
        enable_safety_checker: true,
        num_inference_steps: 28
      })
    });

    const data = await response.json();
    const imageUrl = data.images?.[0]?.url;

    return res.status(200).json({ url: imageUrl });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
