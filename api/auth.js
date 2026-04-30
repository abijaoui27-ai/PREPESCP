export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, access_code } = req.body
  if (!email || !access_code) return res.status(400).json({ error: 'Email et code requis' })

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/students?email=eq.${email.toLowerCase()}&access_code=eq.${access_code.toUpperCase()}&select=*`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    )

    const students = await response.json()

    if (!students || students.length === 0) {
      return res.status(401).json({ error: 'Email ou code invalide' })
    }

    const student = students[0]

    if (student.credits <= 0) {
      return res.status(403).json({ error: 'Plus de sessions disponibles. Contactez votre professeur.' })
    }

    return res.status(200).json({
      success: true,
      student_id: student.id,
      credits: student.credits
    })

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
