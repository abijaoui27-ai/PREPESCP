export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

  // GET — récupérer le questionnaire
  if (req.method === 'GET') {
    const { student_id } = req.query
    if (!student_id) return res.status(400).json({ error: 'student_id requis' })

    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/questionnaires?student_id=eq.${student_id}&select=*&limit=1`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    )
    const data = await r.json()
    return res.status(200).json(data[0] || null)
  }

  // POST — créer ou mettre à jour
  if (req.method === 'POST') {
    const { student_id, centres_interet, fierte, experience_travail, experience_cultures, experience_marquante, autres_infos } = req.body
    if (!student_id) return res.status(400).json({ error: 'student_id requis' })

    // Vérifier si existe déjà
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/questionnaires?student_id=eq.${student_id}&select=id&limit=1`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    )
    const existing = await checkRes.json()

    const payload = { centres_interet, fierte, experience_travail, experience_cultures, experience_marquante, autres_infos, updated_at: new Date().toISOString() }

    if (existing && existing.length > 0) {
      // Update
      await fetch(`${SUPABASE_URL}/rest/v1/questionnaires?student_id=eq.${student_id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      })
    } else {
      // Insert
      await fetch(`${SUPABASE_URL}/rest/v1/questionnaires`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ student_id, ...payload })
      })
    }

    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
