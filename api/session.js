export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

  // POST — créer une session vide avec student_id
  if (req.method === 'POST') {
    const { student_id } = req.body
    if (!student_id) return res.status(400).json({ error: 'student_id manquant' })

    const r = await fetch(`${SUPABASE_URL}/rest/v1/sessions`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ student_id, conversation_id: null })
    })

    const data = await r.json()
    if (!r.ok) return res.status(500).json({ error: data })
    return res.status(200).json({ session_id: data[0].id })
  }

  // PATCH — mettre à jour la session avec le conversation_id
  if (req.method === 'PATCH') {
    const { session_id, conversation_id } = req.body
    if (!session_id || !conversation_id) {
      return res.status(400).json({ error: 'session_id ou conversation_id manquant' })
    }

    const r = await fetch(`${SUPABASE_URL}/rest/v1/sessions?id=eq.${session_id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ conversation_id })
    })

    if (!r.ok) return res.status(500).json({ error: 'Erreur mise à jour' })
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
