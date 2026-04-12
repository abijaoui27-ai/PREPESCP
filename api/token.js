export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ agent_id: agentId })
      }
    );
    const data = await response.json();
    console.log('ElevenLabs response:', JSON.stringify(data));
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
