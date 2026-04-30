export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { student_id } = req.query
  if (!student_id) return res.status(400).json({ error: 'student_id requis' })

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/students?id=eq.${student_id}&select=credits`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    )
    const data = await response.json()
    return res.status(200).json({ credits: data[0]?.credits || 0 })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
