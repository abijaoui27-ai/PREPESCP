export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  }

  const { action } = req.query

  try {
    // GET — liste tous les étudiants avec stats
    if (req.method === 'GET' && action === 'students') {
      const studentsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/students?select=*&order=created_at.desc`,
        { headers }
      )
      const students = await studentsRes.json()

      // Pour chaque étudiant, récupérer le nombre de feedbacks et la dernière note
      const enriched = await Promise.all(students.map(async (s) => {
        const fbRes = await fetch(
          `${SUPABASE_URL}/rest/v1/feedbacks?student_id=eq.${s.id}&select=note,ecole,created_at&order=created_at.desc`,
          { headers }
        )
        const feedbacks = await fbRes.json()
        return {
          ...s,
          total_entretiens: feedbacks.length,
          derniere_note: feedbacks[0]?.note || null,
          derniere_ecole: feedbacks[0]?.ecole || null,
          dernier_entretien: feedbacks[0]?.created_at || null
        }
      }))

      return res.status(200).json(enriched)
    }

    // GET — stats globales
    if (req.method === 'GET' && action === 'stats') {
      const fbRes = await fetch(
        `${SUPABASE_URL}/rest/v1/feedbacks?select=note,ecole`,
        { headers }
      )
      const feedbacks = await fbRes.json()

      const total = feedbacks.length
      const escp = feedbacks.filter(f => f.ecole === 'ESCP' || !f.ecole).length
      const emlyon = feedbacks.filter(f => f.ecole === 'EM Lyon').length
      const notes = feedbacks.filter(f => f.note).map(f => f.note)
      const moyenne = notes.length ? (notes.reduce((a, b) => a + b, 0) / notes.length).toFixed(1) : null

      const studentsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/students?select=id`,
        { headers }
      )
      const students = await studentsRes.json()

      return res.status(200).json({
        total_entretiens: total,
        total_etudiants: students.length,
        escp,
        emlyon,
        moyenne_notes: moyenne
      })
    }

    // POST — ajouter un étudiant
    if (req.method === 'POST' && action === 'add_student') {
      const { email, access_code, credits } = req.body
      if (!email || !access_code) return res.status(400).json({ error: 'Email et code requis' })

      const addRes = await fetch(`${SUPABASE_URL}/rest/v1/students`, {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'return=representation' },
        body: JSON.stringify({ email, access_code, credits: credits || 1 })
      })
      const data = await addRes.json()
      return res.status(200).json(data[0])
    }

    // POST — modifier les crédits
    if (req.method === 'POST' && action === 'update_credits') {
      const { student_id, credits } = req.body
      await fetch(`${SUPABASE_URL}/rest/v1/students?id=eq.${student_id}`, {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ credits })
      })
      return res.status(200).json({ success: true })
    }

    // POST — reset device
    if (req.method === 'POST' && action === 'reset_device') {
      const { student_id } = req.body
      await fetch(`${SUPABASE_URL}/rest/v1/students?id=eq.${student_id}`, {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ device_id: null })
      })
      return res.status(200).json({ success: true })
    }

    // POST — supprimer un étudiant
    if (req.method === 'POST' && action === 'delete_student') {
      const { student_id } = req.body
      await fetch(`${SUPABASE_URL}/rest/v1/feedbacks?student_id=eq.${student_id}`, {
        method: 'DELETE', headers
      })
      await fetch(`${SUPABASE_URL}/rest/v1/sessions?student_id=eq.${student_id}`, {
        method: 'DELETE', headers
      })
      await fetch(`${SUPABASE_URL}/rest/v1/questionnaires?student_id=eq.${student_id}`, {
        method: 'DELETE', headers
      })
      await fetch(`${SUPABASE_URL}/rest/v1/students?id=eq.${student_id}`, {
        method: 'DELETE', headers
      })
      return res.status(200).json({ success: true })
    }

    // POST — modifier le code d'accès
    if (req.method === 'POST' && action === 'update_code') {
      const { student_id, access_code } = req.body
      await fetch(`${SUPABASE_URL}/rest/v1/students?id=eq.${student_id}`, {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ access_code })
      })
      return res.status(200).json({ success: true })
    }

    return res.status(400).json({ error: 'Action non reconnue' })

  } catch (err) {
    console.error('Admin error:', err)
    return res.status(500).json({ error: err.message })
  }
}
