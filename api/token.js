export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: { 'xi-api-key': apiKey },
      }
    );
    const data = await response.json();
    // Construire le signed URL WebSocket
    const signedUrl = `wss://api.elevenlabs.io/v1/convai/conversation?token=${data.token}`;
    return res.status(200).json({ signed_url: signedUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
