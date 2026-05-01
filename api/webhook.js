export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const body = req.body
    const conversationId = body.data?.conversation_id
    const transcript = body.data?.transcript
    const student_id = body.data?.conversation_initiation_client_data?.dynamic_variables?.student_id

    console.log('conversation_id:', conversationId)
    console.log('student_id:', student_id)
    console.log('transcript length:', transcript?.length)

    if (!transcript || !conversationId) {
      return res.status(200).json({ message: 'Pas de transcription' })
    }

    if (!student_id) {
      return res.status(200).json({ message: 'Pas de student_id' })
    }

    const formattedTranscript = transcript
      .filter(t => t.message)
      .map(t => `${t.role === 'agent' ? 'Jean-Marc' : 'Candidat'}: ${t.message}`)
      .join('\n')

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
          content: `Tu es un expert des oraux d'admission ESCP. Analyse cette transcription et génère un feedback.\n\nTRANSCRIPTION :\n${formattedTranscript}\n\nRéponds UNIQUEMENT en JSON valide sans markdown :\n{\n  "note": <entier 0-20>,\n  "points_forts": "<2-3 points forts>",\n  "points_faibles": "<2-3 points faibles>",\n  "axes_amelioration": "<2-3 conseils actionnables>"\n}`
        }],
        temperature: 0.3
      })
    })

    const openaiData = await openaiRes.json()
    const feedback = JSON.parse(openaiData.choices[0].message.content)

    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

    const sessionRes = await fetch(`${SUPABASE_URL}/rest/v1/sessions`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ student_id, conversation_id: conversationId })
    })
    const sessions = await sessionRes.json()
    const session_id = sessions[0]?.id

    await fetch(`${SUPABASE_URL}/rest/v1/feedbacks`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        session_id,
        student_id,
        note: feedback.note,
        points_forts: feedback.points_forts,
        points_faibles: feedback.points_faibles,
        axes_amelioration: feedback.axes_amelioration
      })
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Erreur webhook:', err)
    return res.status(500).json({ error: err.message })
  }
}
