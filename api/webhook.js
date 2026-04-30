export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const body = req.body
    console.log('Webhook reçu:', JSON.stringify(body))

    const conversationId = body.conversation_id || body.data?.conversation_id
    const transcript = body.transcript || body.data?.transcript

    if (!transcript || !conversationId) {
      return res.status(200).json({ message: 'Pas de transcription' })
    }

    const formattedTranscript = transcript
      .map(t => `${t.role === 'agent' ? 'Jean-Marc' : 'Candidat'}: ${t.message}`)
      .join('\n')

    // Appeler OpenAI pour générer le feedback
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{
          role: 'user',
          content: `Tu es un expert des oraux d'admission ESCP. Analyse cette transcription d'entretien et génère un feedback structuré.

TRANSCRIPTION :
${formattedTranscript}

Réponds UNIQUEMENT en JSON valide avec exactement ce format, sans markdown :
{
  "note": <nombre entier entre 0 et 20>,
  "points_forts": "<2-3 points forts concrets>",
  "points_faibles": "<2-3 points faibles concrets>",
  "axes_amelioration": "<2-3 conseils concrets et actionnables>"
}`
        }],
        temperature: 0.3
      })
    })

    const openaiData = await openaiRes.json()
    const feedbackText = openaiData.choices[0].message.content
    const feedback = JSON.parse(feedbackText)

    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

    // Chercher la session correspondante
    const sessionRes = await fetch(
      `${SUPABASE_URL}/rest/v1/sessions?conversation_id=eq.${conversationId}&select=*`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    )
    const sessions = await sessionRes.json()

    if (sessions && sessions.length > 0) {
      const session = sessions[0]
      await fetch(`${SUPABASE_URL}/rest/v1/feedbacks`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          session_id: session.id,
          student_id: session.student_id,
          note: feedback.note,
          points_forts: feedback.points_forts,
          points_faibles: feedback.points_faibles,
          axes_amelioration: feedback.axes_amelioration
        })
      })
    }

    return res.status(200).json({ success: true })

  } catch (err) {
    console.error('Webhook error:', err)
    return res.status(500).json({ error: err.message })
  }
}
