function noFirstNameRule() {
  return `
RÈGLE IMPORTANTE SUR LE PRÉNOM :
Ne commence jamais le feedback par le prénom du candidat.
N'utilise jamais de prénom dans le feedback, même si un prénom apparaît dans la transcription.
Adresse-toi toujours au candidat avec “vous”.
`
}

function escpPremiumPrompt({ transcriptText, previousContext, prenomRule }) {
  return `Tu es un membre expérimenté du jury d'admission ESCP Business School pour le Programme Grande École / Master in Management. Tu évalues des candidats de classes préparatoires.

${prenomRule}

TRANSCRIPTION À ÉVALUER :
${transcriptText}

${previousContext}

MISSION : produire un feedback ESCP premium, très concret et utile. Le candidat doit comprendre précisément :
1. ce qui s'est passé pendant son oral ;
2. pourquoi le jury l'aurait bien ou mal perçu ;
3. quelles références ESCP il aurait dû utiliser ;
4. comment reformuler ses réponses au prochain entretien.

STYLE ATTENDU :
- Direct, exigeant, pédagogique, mais jamais humiliant.
- Pas de phrases génériques comme “renseignez-vous davantage sur l'ESCP”.
- À chaque fois que tu critiques un point, tu donnes juste après une recommandation concrète.
- Les références ESCP doivent apparaître un peu partout, quand elles sont utiles, pas seulement dans une section catalogue.
- Chaque grande section doit suivre naturellement cette logique :
  Diagnostic : ce qui s'est passé dans l'entretien, avec exemples.
  Recommandations : quoi dire, quelle référence ESCP mobiliser, comment faire le lien avec son profil.

FORMAT ESCP :
- Oral de personnalité centré sur le triangle : personnalité ↔ projet professionnel ↔ ESCP.
- Le questionnaire ESCP compte beaucoup : il guide le jury et donne une première impression.
- Le jury attend une connaissance incarnée : références précises reliées au candidat, pas une récitation.
- Note éliminatoire ESCP : 5/20. Moyenne admis : environ 13-14/20.

BASE ESCP À MOBILISER SELON LE PROFIL :
ADN : fondée en 1819, première école de commerce au monde, devise “It all starts here”, école pan-européenne, valeurs excellence / singularité / créativité / pluralité, management interculturel, diversité, humanisme, interdisciplinarité.
Campus : Paris pour réseau, culture, finance, conseil, luxe, médias, impact ; London pour finance, consulting, business international ; Berlin pour tech, innovation, startups, digital, sustainability ; Madrid pour marketing, entrepreneuriat, business development, real estate ; Turin pour industrie, corporate entrepreneurship, food, luxury marketing ; Warsaw pour Europe centrale, géopolitique, internationalisation.
Pre-Master : Paris ou Turin, fondamentaux en comptabilité, droit, économie, finance, marketing, statistiques, data analysis, méthodes quantitatives, psychologie et management, humanités, digital insights. Séminaires : Designing Tomorrow, Fresque du climat, Digital Spark, Designing Europe, Business Strategy Simulation, Soft Skills for Leaders.
MiM : parcours personnalisable, environ 70 spécialisations, jusqu'à trois spécialisations, rotation sur au moins deux campus, 2 à 5 pays, jusqu'à 5 diplômes possibles, 49 partenaires de doubles diplômes, 9 mois d'expérience professionnelle.
Finance : Corporate Finance, Advanced Corporate Finance, Market Finance, Investment Banking, Strategic Asset Management, Green CFO, Sustainable Finance, Financial and Sustainability Reporting for the CFO, Women in Finance Chair, BPCE Mutual and Cooperative Banking Chair, Master in Finance #1 FT 2024.
Conseil / stratégie : Business Consulting, Consulting Dynamics and Practices, International Business Consulting, Management Consulting Excellence, Strategic Consulting for Business Transformation, Stratégie et conseil, Business Strategy Simulation, employeurs Accenture, BCG, Deloitte, Wavestone, PwC, EY, KPMG.
IA / data / digital : Applied Data Science, Artificial Intelligence and Big Data Business Innovation, Artificial Intelligence and Robotics for Business, Digital Project Management, Digital Transformation: The Future of Work, Digital Transformation: Understand Contribute Manage, IoT, Competition and Innovation in High Tech, ESCP Tech Institute, AI and Decision Making, TRACIS, European Center for Digital Competitiveness, IoT Chair avec Schneider Electric.
Entrepreneuriat : Entrepreneurship, Corporate Entrepreneurship, Technology and Digital Economy, The Art and Science of Scaling Up, Social and Sustainable Entrepreneurship, Jean-Baptiste Say Institute, Blue Factory incubators, plus de 600 entreprises accompagnées, Innovation and Entrepreneurship Award, Blue Factory Demodays, Global Entrepreneurs Week, Start Me Up.
Luxe / marketing / mode : Luxury Marketing, Luxury Management Past Present and Future, Creativity Marketing Management, Consumer-centric Marketing, Go to Market, Marketing and Digital Strategy, Creativity Marketing Professorship avec L'Oréal, Turning Points Chair avec Cartier, GRAIL, IFM, Sotheby's, Runway.
Impact / social / environnement : Designing Tomorrow, Fresque du climat, Sustainability, Energy Transitions and Sustainability, Responsible Innovation in Africa, Sustainable Finance, ESCP Sustainability Institute, RESET, Noise, Fleur de Bitume, Solidarité France Népal, Rue des Enfants, ESCP Refugees Assistance.
Affaires publiques / Europe : Affaires publiques, Economics and Public Policy, Designing Europe au Parlement européen, ESCP Geopolitics Institute, CERALE, L'Économique ESCP.
Culture / sport / médias : Sport et Management, Management des industries culturelles et médiatiques, Art Maniac, Version Originale, CoMu, On'Air, Polyphony, Streams, ESCP'Ression, Regatta.
Profils hybrides : doubles diplômes CentraleSupélec, ENSAE, Mines Paris-PSL, Paris 1 Panthéon-Sorbonne, Institut Français de la Mode, Sotheby's Institute of Art, Ferrandi, CFJ.
Associations utiles : Fleur de Bitume, Solidarité France Népal, Rue des Enfants, Noise, Art Maniac, Version Originale, ESCP'Ression, Challenge, Junior Entreprise, ESCP HEC Finance Club, Start Me Up, Kryptosphère, L'Économique ESCP, Aware, Runway, Scep Invaders, On'Air, Polyphony, Streams, BDE, BDS, BUDSE, Skloub.

RÈGLES DE NOTATION :
- Très court / interrompu : 0 à 5.
- Partiel : maximum 11.
- Très faible : 6-8.
- Moyen : 10-11.
- Correct : 12-13.
- Très solide : 14-16.
- Excellent : 17+ seulement si discours incarné, projet clair, vraie connaissance ESCP, posture naturelle, liens forts personnalité-projet-école.

IMPORTANT SUR LA STRUCTURE :
Ne multiplie pas les axes. Regroupe tout ce qui concerne connaissance de l'école, triangle personnalité-projet-ESCP et fond du projet dans une grande section appelée “connaissance_ecole”. Cette section doit avoir :
- Diagnostic : ce que le candidat a montré ou pas.
- Recommandations : références ESCP adaptées à SON profil.
- Formulations possibles : 1 ou 2 phrases qu'il aurait pu dire.

Réponds uniquement en JSON brut valide, sans markdown ni backticks. Pour chaque section longue, écris en paragraphes avec les libellés “Diagnostic :” puis “Recommandations :”.
{
  "note": 0,
  "verdict_jury": "5 à 7 phrases sans prénom. Donne la note, l'impression générale, le niveau réel et le problème principal. Mentionne si le candidat manque surtout de structure, de profondeur, d'incarnation ou de références ESCP.",
  "presentation_initiale": "Diagnostic : analyse de l'accroche, de la structure, de la clarté, de l'incarnation et de la maturité. Recommandations : comment améliorer la présentation, quelles références ESCP intégrer dès l'introduction si pertinent.",
  "qualite_expression": "Diagnostic : fluidité, précision, naturel, vocabulaire, posture, capacité à répondre sans réciter. Recommandations : reformulations concrètes, tournures plus professionnelles, façon de gagner en impact oral.",
  "connaissance_ecole": "Diagnostic : regroupe connaissance ESCP + triangle personnalité-projet-école + solidité du projet. Dis ce que le candidat a cité, ce qui est superficiel, ce qui manque, et si le lien personnalité-projet-ESCP est naturel ou artificiel. Recommandations : donne des références ESCP adaptées au profil du candidat, avec campus, spécialisations, associations, doubles diplômes, séminaires ou Career Centre. Ajoute 1 à 2 formulations qu'il aurait pu dire à l'oral.",
  "dynamique_echange": "Diagnostic : écoute, rebond, gestion des relances, spontanéité, énergie, authenticité, capacité à porter l'échange. Recommandations : comment mieux dialoguer avec le jury et relier les relances à des exemples personnels ou à ESCP.",
  "exploitation_questionnaire": "Diagnostic : analyse si le candidat exploite les éléments du questionnaire. Recommandations : quels éléments du questionnaire doivent devenir des preuves de personnalité, projet ou adéquation ESCP. Si absent, indique quoi y mettre.",
  "question_finale": "Diagnostic : analyse de la question finale si elle existe. Recommandations : propose 2 questions finales intelligentes et personnalisées, liées à son profil et à ESCP.",
  "analyse_personnalisee": "Diagnostic : reviens sur 2-3 moments précis de la transcription. Recommandations : transforme ces moments en arguments plus forts, avec références ESCP si pertinent.",
  "comparaison_precedent": "Si premier entretien ESCP : indique que cette session sert de référence. Sinon compare avec le précédent feedback.",
  "axes_amelioration": "Plan d'action en 5 étapes : quoi apprendre, quoi reformuler, quelle référence ESCP ajouter, quel exemple personnel renforcer, comment s'entraîner.",
  "points_forts": "2 à 4 points forts réels et précis.",
  "points_faibles": "2 à 4 points faibles réels, précis, avec exemples et conséquences sur la note."
}`
}

function buildSchoolPrompt({ school, transcriptText, previousContext }) {
  const prenomRule = noFirstNameRule()

  if (school === 'ESSEC') {
    return `Tu es un membre expérimenté du jury d'admission de l'ESSEC Business School pour le Programme Grande École / Master in Management. Tu ignores le Global BBA.

${prenomRule}

TRANSCRIPTION À ÉVALUER :
${transcriptText}

${previousContext}

FORMAT ESSEC : entretien long, partie libre et mise en situation. Feedback direct, premium, non générique, adressé au candidat en le vouvoyant. Note : très court 0-5, partiel max 11, faible 6-8, moyen 10-11, correct 12-13, solide 14-16, excellent 17+.

Réponds uniquement en JSON brut valide :
{
  "note": 0,
  "verdict_jury": "5 à 7 phrases sans prénom.",
  "diagnostic_entretien": "Analyse longue de la présentation, expression, structure, maturité, authenticité et posture.",
  "analyse_mise_en_situation": "Analyse longue de la mise en situation et version améliorée.",
  "adequation_essec": "Analyse longue du lien profil-projet-ESSEC avec ressources précises.",
  "plan_de_progression": "Plan concret en 5 étapes.",
  "formulations_recommandees": "2 à 4 reformulations utiles.",
  "points_forts": "2 à 4 points forts précis.",
  "points_faibles": "2 à 4 points faibles précis.",
  "comparaison_precedent": "Comparaison si disponible."
}`
  }

  if (school === 'EM Lyon') {
    return `Tu es un membre expérimenté du jury d'admission de l'E.M Lyon Business School. Tu évalues des candidats de classes préparatoires.

${prenomRule}

TRANSCRIPTION À ÉVALUER :
${transcriptText}

${previousContext}

FORMAT E.M LYON : entretien avec présentation, cartes, puis entretien libre. Valeurs : Exigence, Responsabilité, Intégrité, Diversité, Solidarité. Feedback précis et direct. Note : très incomplet 0-5, partiel max 11, faible 6-8, moyen 10-11, correct 12-13, solide 14-16, excellent 17+.

Réponds uniquement en JSON brut valide :
{
  "note": 0,
  "verdict_jury": "3 à 5 phrases sans prénom.",
  "presentation_initiale": "Analyse de la présentation.",
  "qualite_expression": "Analyse de l'expression orale.",
  "connaissance_ecole": "Analyse de la connaissance de l'E.M Lyon.",
  "carte_personnalite": "Analyse si abordée, sinon Non évaluable.",
  "carte_experiences": "Analyse si abordée, sinon Non évaluable.",
  "carte_projets": "Analyse si abordée, sinon Non évaluable.",
  "carte_creativite": "Analyse si abordée, sinon Non évaluable.",
  "valeurs_emlyon": "Analyse des valeurs.",
  "echange_final": "Analyse de l'entretien libre si atteint.",
  "question_finale": "Analyse de la question finale.",
  "analyse_personnalisee": "Analyse personnalisée.",
  "comparaison_precedent": "Comparaison si disponible.",
  "axes_amelioration": "3 conseils concrets.",
  "points_forts": "2-3 points forts.",
  "points_faibles": "2-3 points faibles."
}`
  }

  return escpPremiumPrompt({ transcriptText, previousContext, prenomRule })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { student_id, school, transcript_text, save = true } = req.body || {}
    if (!student_id || !school || !transcript_text) return res.status(400).json({ error: 'student_id, school et transcript_text sont requis' })
    if (!['ESCP', 'EM Lyon', 'ESSEC'].includes(school)) return res.status(400).json({ error: 'school doit être ESCP, EM Lyon ou ESSEC' })

    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

    const prevRes = await fetch(`${SUPABASE_URL}/rest/v1/feedbacks?student_id=eq.${student_id}&order=created_at.desc&limit=1&select=*`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } })
    const prevData = await prevRes.json()
    const prevFeedback = prevData[0] || null
    const previousContext = prevFeedback ? `\nENTRETIEN PRÉCÉDENT :\n- École : ${prevFeedback.ecole || 'Non renseigné'}\n- Note : ${prevFeedback.note}/20\n- Points forts : ${prevFeedback.points_forts || 'Non renseigné'}\n- Points faibles : ${prevFeedback.points_faibles || 'Non renseigné'}\n- Axes : ${prevFeedback.axes_amelioration || prevFeedback.plan_de_progression || 'Non renseigné'}\n` : 'Premier entretien du candidat — pas de comparaison disponible.'

    const promptFeedback = buildSchoolPrompt({ school, transcriptText: transcript_text, previousContext })
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o', messages: [{ role: 'user', content: promptFeedback }], temperature: 0.25 })
    })
    const openaiData = await openaiRes.json()
    const raw = openaiData.choices?.[0]?.message?.content
    if (!raw) return res.status(500).json({ error: 'Réponse OpenAI vide', details: openaiData })
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const feedback = JSON.parse(clean)
    if (!save) return res.status(200).json({ success: true, feedback, saved: null })

    const sessionRes = await fetch(`${SUPABASE_URL}/rest/v1/sessions`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify({ student_id, conversation_id: `simulation_${school.replace(/\s/g, '_')}_${Date.now()}`, transcript: transcript_text })
    })
    const sessions = await sessionRes.json()
    const session_id = sessions[0]?.id

    const insertPayload = {
      session_id, student_id, ecole: school,
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
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
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
