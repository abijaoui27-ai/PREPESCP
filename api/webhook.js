export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const body = req.body
    console.log('WEBHOOK BODY:', JSON.stringify(body, null, 2))

    const conversationId = body.conversation_id || body.data?.conversation_id
    const transcript = body.transcript || body.data?.transcript

    console.log('conversation_id:', conversationId)
    console.log('transcript length:', transcript?.length)

    return res.status(200).json({ success: true, conversationId })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
