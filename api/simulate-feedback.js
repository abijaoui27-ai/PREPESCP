const AGENTS = {
  ESCP: 'agent_5301kn5frmakepgabf8ne1pw9kzr',
  'EM Lyon': 'agent_2801kqpz5c0pfexst78ct5ezs5tf',
  ESSEC: 'agent_6201kqyj4vwkerkt0faxgk2zn3ed'
}

function buildSchoolPrompt({ school, transcriptText, previousContext }) {
  if (school === 'ESSEC') {
    return `Tu es un membre expérimenté du jury d'admission de l'ESSEC Business School pour le Programme Grande École / Master in Management. Tu évalues des candidats de classes préparatoires. Tu ignores totalement le Global BBA.

TRANSCRIPTION À ÉVALUER :
${transcriptText}

${previousContext}

FORMAT ESSEC : entretien long, sans préparation, avec partie libre et souvent une mise en situation. Le jury évalue le potentiel de développement, la cohérence avec la culture ESSEC, la communication, l'ouverture, le leadership, l'engagement, la lucidité personnelle, l'éthique, l'esprit collectif, la décision dans le flou, le sens de l'exécution et l'imagination pragmatique.

BASE ESSEC À MOBILISER :
- ESSEC fondée en 1907, école pionnière, campus Cergy, La Défense, Singapour, Rabat.
- Grande École / MiM : parcours flexible, plus de 50 filières et chaires, stages, apprentissage, VIE/VIA, création d'entreprise, expériences associatives ou humanitaires.
- Premaster : prise de parole en public, Comprendre et changer le monde, Transformer les organisations par la Data et l'IA, Bootcamp entrepreneuriat 33h, SOLVE, expérience terrain, Going Pro, mission de conseil ou création d'entreprise.
- Doubles diplômes : CentraleSupélec, ENS Ulm, ENS Paris-Saclay, ENSAE, Saint-Cyr, École du Louvre, ICP philosophie ; international : Mannheim, Queensland, Queen's Smith, Guanghua Peking University, Seoul National University, IIM Ahmedabad, Bocconi, Keio, TEC Monterrey, Nanyang.
- IA/data/digital : Digital Disruption Chair, Accenture Strategic Business Analytics Chair, Business Analytics Methods Track, Digital Transformation and Digital Business Track, Information Strategy and Governance Chair.
- Entrepreneuriat : Entrepreneurship Track, ESSEC Ventures Incubator, Leading a Scale-up Chair, Leading a SME/SMI Track, Tech Innovation and Entrepreneurship.
- Finance : Finance Track, ESSEC-Amundi Chair, Shaping the Future of Finance Chair, ESSEC-ISUP Risk & Actuarial Track, Corporate Finance in Asia Track, Financial Markets in Asia Track.
- Conseil : Filière conseil en stratégie, CFO Conseil Finance Organisation, Chaire ESSEC du changement, Asian Strategy Consulting Project, Managing Plans and Projects.
- Impact/public/société : Innovation sociale, Talents de la transition écologique, Global Circular Economy Chair, ICP-ESSEC Entreprises et Bien commun, Management and Society, Affaires publiques, Géopolitique défense et leadership.
- Luxe/marketing : LVMH Chair, ESSEC Beauty Chair, Marketing Track, Grande Consommation, Media & Digital Track.

MÉTHODE MISE EN SITUATION À VALORISER : reformuler le problème, identifier les parties prenantes, repérer enjeux humains/éthiques/juridiques/réputationnels/économiques, proposer 2-3 options, choisir une décision claire, justifier, décrire l'exécution, anticiper court et long terme.

RÈGLES :
- Feedback direct, premium, pédagogique, adressé au candidat en le vouvoyant.
- Ne sois pas générique. Cite des moments ou formulations du candidat si utiles.
- Ne dis jamais seulement “renseignez-vous sur l'ESSEC” : donne directement les ressources adaptées.
- Moins de sections, mais des sections longues et utiles.
- Note : très court 0-5, partiel max 11, faible 6-8, moyen 10-11, correct 12-13, solide 14-16, excellent 17+.

Réponds uniquement en JSON brut valide, sans markdown ni backticks :
{
  "note": 0,
  "verdict_jury": "5 à 7 phrases : note, impression générale, niveau réel et enjeu principal de progression.",
  "diagnostic_entretien": "Analyse longue de la présentation, expression, structure, maturité, authenticité et posture. Cite 2-3 moments précis. Explique ce qui pénalise et ce qui peut être sauvé.",
  "analyse_mise_en_situation": "Analyse longue de la mise en situation : compréhension, parties prenantes, enjeux, options, décision, exécution. Donne une version améliorée de la réponse possible.",
  "adequation_essec": "Analyse longue du lien profil-projet-ESSEC. Recommande des ressources ESSEC précises adaptées au profil et explique comment les intégrer oralement.",
  "plan_de_progression": "Plan concret en 5 étapes avant le prochain oral : quoi travailler, comment, résultat visé.",
  "formulations_recommandees": "Reprends 2 à 4 formulations faibles ou maladroites du candidat et propose des versions plus fortes et admissibles.",
  "points_forts": "2 à 4 points forts précis.",
  "points_faibles": "2 à 4 points faibles précis avec exemples.",
  "comparaison_precedent": "Si premier entretien ESSEC : indique que cette session sert de référence. Sinon compare brièvement."
}`
  }

  if (school === 'EM Lyon') {
    return `Tu es un membre expérimenté du jury d'admission de l'E.M Lyon Business School. Tu évalues des candidats de classes préparatoires.

TRANSCRIPTION À ÉVALUER :
${transcriptText}

${previousContext}

FORMAT E.M LYON : entretien avec présentation, cartes, puis entretien libre. L'école cherche des profils early makers : spontanéité, authenticité, capacité à agir, créativité, cohérence, personnalité, projet et valeurs. Les valeurs à mobiliser sont Exigence, Responsabilité, Intégrité, Diversité, Solidarité.

RÈGLES :
- Feedback précis, humain, direct, adressé au candidat en le vouvoyant.
- Cite des moments précis de la transcription.
- Si les cartes ou l'entretien libre ne sont pas atteints, dis-le clairement.
- Note : très incomplet 0-5, partiel max 11, faible 6-8, moyen 10-11, correct 12-13, solide 14-16, excellent 17+.

Réponds uniquement en JSON brut valide, sans markdown ni backticks :
{
  "note": 0,
  "verdict_jury": "3 à 5 phrases avec la note et l'impression générale.",
  "presentation_initiale": "Analyse de la présentation, structure, incarnation, clarté.",
  "qualite_expression": "Analyse de l'expression orale, fluidité, précision, posture.",
  "connaissance_ecole": "Analyse de la connaissance de l'E.M Lyon et conseils concrets.",
  "carte_personnalite": "Analyse si la carte a été abordée, sinon Non évaluable.",
  "carte_experiences": "Analyse si la carte a été abordée, sinon Non évaluable.",
  "carte_projets": "Analyse si la carte a été abordée, sinon Non évaluable.",
  "carte_creativite": "Analyse si la carte a été abordée, sinon Non évaluable.",
  "valeurs_emlyon": "Analyse du lien avec Exigence, Responsabilité, Intégrité, Diversité, Solidarité.",
  "echange_final": "Analyse de l'entretien libre si atteint, sinon Non évaluable.",
  "question_finale": "Analyse de la question finale.",
  "analyse_personnalisee": "Analyse personnalisée avec 2-3 moments précis.",
  "comparaison_precedent": "Comparaison si disponible.",
  "axes_amelioration": "3 conseils concrets.",
  "points_forts": "2-3 points forts précis.",
  "points_faibles": "2-3 points faibles précis."
}`
  }

  return `Tu es un membre expérimenté du jury d'admission ESCP Business School. Tu évalues des candidats de classes préparatoires.

TRANSCRIPTION À ÉVALUER :
${transcriptText}

${previousContext}

FORMAT ESCP : entretien de personnalité. Le critère central est la capacité à tisser des liens naturels entre personnalité, projet professionnel et ESCP. Le feedback doit être précis, honnête, personnalisé et adressé au candidat en le vouvoyant.

RÈGLES :
- Cite des moments précis de la transcription.
- Note : très incomplet 0-5, partiel max 11, faible 6-8, moyen 10-11, correct 12-13, solide 14-16, excellent 17+.
- Ne sois pas générique : donne des conseils actionnables.

Réponds uniquement en JSON brut valide, sans markdown ni backticks :
{
  "note": 0,
  "verdict_jury": "3 à 5 phrases avec la note et l'impression générale.",
  "presentation_initiale": "Analyse de la présentation initiale.",
  "qualite_expression": "Analyse de l'expression orale.",
  "connaissance_ecole": "Analyse de la connaissance de l'ESCP.",
  "dynamique_echange": "Analyse de la dynamique de l'échange.",
  "triangle_liens": "Analyse des liens personnalité-projet-ESCP.",
  "fond_escp": "Analyse du fond, cohérence du parcours et motivation.",
  "exploitation_questionnaire": "Analyse de l'exploitation du questionnaire si pertinent.",
  "question_finale": "Analyse de la question finale.",
  "analyse_personnalisee": "Analyse personnalisée avec moments précis.",
  "comparaison_precedent": "Comparaison si disponible.",
  "axes_amelioration": "3 conseils concrets.",
  "points_forts": "2-3 points forts précis.",
  "points_faibles": "2-3 points faibles précis."
}`
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { student_id, school, transcript_text, save = true } = req.body || {}
    if (!student_id || !school || !transcript_text) {
      return res.status(400).json({ error: 'student_id, school et transcript_text sont requis' })
    }
    if (!['ESCP', 'EM Lyon', 'ESSEC'].includes(school)) {
      return res.status(400).json({ error: 'school doit être ESCP, EM Lyon ou ESSEC' })
    }

    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

    const prevRes = await fetch(
      `${SUPABASE_URL}/rest/v1/feedbacks?student_id=eq.${student_id}&order=created_at.desc&limit=1&select=*`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
    const prevData = await prevRes.json()
    const prevFeedback = prevData[0] || null

    const previousContext = prevFeedback ? `
ENTRETIEN PRÉCÉDENT :
- École : ${prevFeedback.ecole || 'Non renseigné'}
- Note : ${prevFeedback.note}/20
- Points forts : ${prevFeedback.points_forts || 'Non renseigné'}
- Points faibles : ${prevFeedback.points_faibles || 'Non renseigné'}
- Axes : ${prevFeedback.axes_amelioration || prevFeedback.plan_de_progression || 'Non renseigné'}
` : 'Premier entretien du candidat — pas de comparaison disponible.'

    const promptFeedback = buildSchoolPrompt({ school, transcriptText: transcript_text, previousContext })

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: promptFeedback }],
        temperature: 0.25
      })
    })

    const openaiData = await openaiRes.json()
    const raw = openaiData.choices?.[0]?.message?.content
    if (!raw) return res.status(500).json({ error: 'Réponse OpenAI vide', details: openaiData })

    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const feedback = JSON.parse(clean)

    if (!save) return res.status(200).json({ success: true, feedback, saved: null })

    const sessionRes = await fetch(`${SUPABASE_URL}/rest/v1/sessions`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({
        student_id,
        conversation_id: `simulation_${school.replace(/\s/g, '_')}_${Date.now()}`,
        transcript: transcript_text
      })
    })
    const sessions = await sessionRes.json()
    const session_id = sessions[0]?.id

    const insertPayload = {
      session_id,
      student_id,
      ecole: school,
      note: Number.isFinite(Number(feedback.note)) ? Number(feedback.note) : null,
      points_forts: feedback.points_forts || null,
      points_faibles: feedback.points_faibles || null,
      axes_amelioration: feedback.axes_amelioration || null,
      verdict_jury: feedback.verdict_jury || null,
      presentation_initiale: feedback.presentation_initiale || null,
      qualite_expression: feedback.qualite_expression || null,
      connaissance_ecole: feedback.connaissance_ecole || null,
      dynamique_echange: feedback.dynamique_echange || null,
      triangle_liens: feedback.triangle_liens || null,
      fond_escp: feedback.fond_escp || null,
      exploitation_questionnaire: feedback.exploitation_questionnaire || null,
      question_finale: feedback.question_finale || null,
      analyse_personnalisee: feedback.analyse_personnalisee || null,
      comparaison_precedent: feedback.comparaison_precedent || null,
      carte_personnalite: feedback.carte_personnalite || null,
      carte_experiences: feedback.carte_experiences || null,
      carte_projets: feedback.carte_projets || null,
      carte_creativite: feedback.carte_creativite || null,
      valeurs_emlyon: feedback.valeurs_emlyon || null,
      echange_final: feedback.echange_final || null,
      diagnostic_entretien: feedback.diagnostic_entretien || null,
      analyse_mise_en_situation: feedback.analyse_mise_en_situation || null,
      adequation_essec: feedback.adequation_essec || null,
      plan_de_progression: feedback.plan_de_progression || null,
      formulations_recommandees: feedback.formulations_recommandees || null
    }

    const fbRes = await fetch(`${SUPABASE_URL}/rest/v1/feedbacks`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(insertPayload)
    })

    const savedFeedback = await fbRes.json()
    if (!fbRes.ok) return res.status(500).json({ error: 'Erreur insertion Supabase', details: savedFeedback, feedback })

    return res.status(200).json({ success: true, feedback, saved: savedFeedback[0] })
  } catch (err) {
    console.error('Erreur simulate-feedback:', err)
    return res.status(500).json({ error: err.message })
  }
}
