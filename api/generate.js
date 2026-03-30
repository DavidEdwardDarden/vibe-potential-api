export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
 
  try {
    const { prompt } = req.body;
    const falKey = process.env.FAL_KEY;
 
    const response = await fetch('https://fal.run/fal-ai/flux/dev', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        image_size: 'landscape_16_9',
        num_images: 1,
        enable_safety_checker: true
      })
    });
 
    const data = await response.json();
    const imageUrl = data.images?.[0]?.url;
 
    return res.status(200).json({ url: imageUrl });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
 
 
