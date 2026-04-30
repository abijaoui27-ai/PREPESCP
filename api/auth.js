import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, access_code } = req.body

  if (!email || !access_code) {
    return res.status(400).json({ error: 'Email et code requis' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  try {
    // Cherche l'étudiant
    const { data: student, error } = await supabase
      .from('students')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('access_code', access_code.toUpperCase())
      .single()

    if (error || !student) {
      return res.status(401).json({ error: 'Email ou code invalide' })
    }

    if (student.sessions_used >= student.sessions_max) {
      return res.status(403).json({ error: 'Plus de sessions disponibles' })
    }

    return res.status(200).json({
      success: true,
      student_id: student.id,
      sessions_used: student.sessions_used,
      sessions_max: student.sessions_max
    })

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
