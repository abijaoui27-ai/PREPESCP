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

    if (!transcript || !conversationId || !student_id) {
      return res.status(200).json({ message: 'Données manquantes' })
    }

    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

    // Récupérer le questionnaire
    const qRes = await fetch(
      `${SUPABASE_URL}/rest/v1/questionnaires?student_id=eq.${student_id}&select=*&limit=1`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    )
    const qData = await qRes.json()
    const q = qData[0] || null

    // Récupérer le dernier feedback pour comparaison
    const prevRes = await fetch(
      `${SUPABASE_URL}/rest/v1/feedbacks?student_id=eq.${student_id}&order=created_at.desc&limit=1&select=*`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    )
    const prevData = await prevRes.json()
    const prevFeedback = prevData[0] || null

    const questionnaireContext = q ? `
QUESTIONNAIRE DE PERSONNALITÉ REMPLI PAR LE CANDIDAT :
- Centres d'intérêt & activités : ${q.centres_interet || 'Non renseigné'}
- Réalisation dont il est fier : ${q.fierte || 'Non renseigné'}
- Expérience du monde du travail : ${q.experience_travail || 'Non renseigné'}
- Expériences culturelles : ${q.experience_cultures || 'Non renseigné'}
- Expérience marquante : ${q.experience_marquante || 'Non renseigné'}
- Autres informations : ${q.autres_infos || 'Non renseigné'}
` : "Le candidat n'a pas rempli son questionnaire de personnalité."

    const previousContext = prevFeedback ? `
ENTRETIEN PRÉCÉDENT (à utiliser pour la comparaison) :
- Note obtenue : ${prevFeedback.note}/20
- Points forts : ${prevFeedback.points_forts}
- Points faibles : ${prevFeedback.points_faibles}
- Axes d'amélioration donnés : ${prevFeedback.axes_amelioration}
` : "C'est le premier entretien du candidat — pas de comparaison disponible."

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
          content: `Tu es un membre expérimenté du jury d'admission ESCP Business School. Tu évalues des candidats de classes préparatoires (19-20 ans) pour leur entretien de personnalité de 20 minutes.

${questionnaireContext}

${previousContext}

TRANSCRIPTION COMPLÈTE DE L'ENTRETIEN :
${formattedTranscript}

---

MISSION : Génère un feedback complet, précis, honnête et exigeant. Tu as accès à TOUT : la transcription mot pour mot, le questionnaire, l'historique. Utilise tout ça. Ne sois jamais complaisant — un feedback vague ne sert à rien. Note éliminatoire à l'ESCP : 5/20. La moyenne des candidats admis est autour de 13-14/20.

CRITÈRE LE PLUS IMPORTANT — LE TRIANGLE :
Le critère numéro 1 est la capacité du candidat à tisser des liens naturels entre ces 3 pôles tout au long de l'entretien :
- PERSONNALITÉ (qui il est, ses valeurs, ce qui le motive)
- PROJET PROFESSIONNEL (ce qu'il veut faire, pourquoi, comment)
- ESCP (pourquoi cette école spécifiquement, ce qu'elle lui apporte, ce qu'il lui apporte)

Un bon candidat relie spontanément ces 3 pôles sans qu'on le lui demande. Exemple : "Je suis quelqu'un de curieux (perso) → c'est pour ça que la recherche m'attire (projet) → et l'ESCP avec son réseau de chercheurs européens est l'endroit idéal pour ça (ESCP)". Ce n'est pas parce qu'un candidat répond à toutes les questions qu'il mérite une bonne note — c'est la profondeur et les liens qui comptent.

Réponds UNIQUEMENT en JSON brut sans markdown, sans backticks, sans aucune mise en forme :
{
  "note": <entier 0-20, sois précis et calibré — pas d'hésitation à mettre 4 si c'est mauvais, ni 17 si c'est vraiment excellent>,
  "verdict_jury": "<3 phrases comme en salle de délibération — ce que le jury dirait de ce candidat après qu'il soit sorti. Direct, honnête, humain>",
  "presentation_initiale": "<Analyse de la présentation d'ouverture : durée (trop courte/longue/bien), structure (claire ou brouillonne), accroche (marquante ou banale), première impression>",
  "qualite_expression": "<Analyse précise : vocabulaire (riche/pauvre/scolaire), hésitations fréquentes, tics de langage, clarté, fluidité, niveau de langue>",
  "dynamique_echange": "<Le candidat porte-t-il l'échange ou le subit-il ? Gère-t-il bien la déstabilisation ? Y a-t-il un vrai feeling ou c'est mécanique ? Cite des moments précis>",
  "triangle_liens": "<CRITIQUE — Analyse détaillée des liens Personnalité↔Projet↔ESCP : les a-t-il faits spontanément ? Cite les bons liens s'il y en a, ou explique ce qui manquait. C'est le critère principal de la note>",
  "fond_escp": "<Analyse du fond : cohérence du parcours, motivation réelle pour l'ESCP (connaît-il vraiment l'école ?), ouverture intellectuelle, crédibilité du projet pro>",
  "exploitation_questionnaire": "<A-t-il valorisé à l'oral ce qu'il avait écrit dans son questionnaire ? Quels éléments sont restés inexploités et auraient pu renforcer sa candidature ?>",
  "meilleur_moment": "<Le meilleur échange ou réponse de l'entretien — cite les mots exacts du candidat et explique pourquoi c'était fort>",
  "pire_moment": "<Le pire échange ou réponse — cite les mots exacts et explique pourquoi ça a nui, et comment il aurait dû répondre>",
  "question_finale": "<A-t-il posé une question au jury ? Était-elle pertinente ou banale ? Propose une meilleure question qu'il aurait pu poser>",
  "comparaison_precedent": "<Si c'est le premier entretien : 'Premier entretien — référence de départ établie.' Sinon : comparaison précise avec l'entretien précédent — ce qui a progressé, ce qui stagne, ce qui a régressé>",
  "axes_amelioration": "<3 conseils ultra-concrets et actionnables — pas 'travaillez votre projet' mais 'préparez une réponse de 2 minutes qui relie votre passion X à votre projet Y et à l'ESCP via Z'>"
}`
        }],
        temperature: 0.3
      })
    })

    const openaiData = await openaiRes.json()
    const raw = openaiData.choices[0].message.content
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const feedback = JSON.parse(clean)

    // Créer la session
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

    // Sauver le feedback complet
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
        axes_amelioration: feedback.axes_amelioration,
        verdict_jury: feedback.verdict_jury,
        presentation_initiale: feedback.presentation_initiale,
        qualite_expression: feedback.qualite_expression,
        dynamique_echange: feedback.dynamique_echange,
        triangle_liens: feedback.triangle_liens,
        fond_escp: feedback.fond_escp,
        exploitation_questionnaire: feedback.exploitation_questionnaire,
        meilleur_moment: feedback.meilleur_moment,
        pire_moment: feedback.pire_moment,
        question_finale: feedback.question_finale,
        comparaison_precedent: feedback.comparaison_precedent
      })
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Erreur webhook:', err)
    return res.status(500).json({ error: err.message })
  }
}
