export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const body = req.body
    console.log('Webhook reçu:', JSON.stringify(body))

    // Récupérer la transcription et l'agent_id
    const conversationId = body.conversation_id || body.data?.conversation_id
    const transcript = body.transcript || body.data?.transcript
    const agentId = body.agent_id || body.data?.agent_id

    if (!transcript || !conversationId) {
      return res.status(200).json({ message: 'Pas de transcription' })
    }

    // Formater la transcription
    const formattedTranscript = transcript
      .map(t => `${t.role === 'agent' ? 'Jean-Marc' : 'Candidat'}: ${t.message}`)
      .join('\n')

    // Appeler Claude pour générer le feedback
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Tu es un expert des oraux d'admission ESCP. Analyse cette transcription d'entretien et génère un feedback structuré.

TRANSCRIPTION :
${formattedTranscript}

Réponds UNIQUEMENT en JSON valide avec exactement ce format :
{
  "note": <nombre entier entre 0 et 20>,
  "points_forts": "<2-3 points forts concrets>",
  "points_faibles": "<2-3 points faibles concrets>",
  "axes_amelioration": "<2-3 conseils concrets et actionnables>"
}`
        }]
      })
    })

    const claudeData = await claudeRes.json()
    const feedbackText = claudeData.content[0].text
    const feedback = JSON.parse(feedbackText)

    // Chercher l'étudiant par conversation_id dans sessions
    // ou directement stocker avec conversation_id pour lier plus tard
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

      // Stocker le feedback
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
    } else {
      // Stocker sans session liée pour l'instant
      await fetch(`${SUPABASE_URL}/rest/v1/feedbacks`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
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
