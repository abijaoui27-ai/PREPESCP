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
    const agent_id = body.data?.agent_id

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

    // Récupérer le dernier feedback
    const prevRes = await fetch(
      `${SUPABASE_URL}/rest/v1/feedbacks?student_id=eq.${student_id}&order=created_at.desc&limit=1&select=*`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    )
    const prevData = await prevRes.json()
    const prevFeedback = prevData[0] || null

    const previousContext = prevFeedback ? `
ENTRETIEN PRÉCÉDENT (à utiliser pour la comparaison) :
- Note obtenue : ${prevFeedback.note}/20
- Points forts : ${prevFeedback.points_forts}
- Points faibles : ${prevFeedback.points_faibles}
- Axes d'amélioration donnés : ${prevFeedback.axes_amelioration}
` : "C'est le premier entretien du candidat — pas de comparaison disponible."

    const formattedTranscript = transcript
      .filter(t => t.message)
      .map(t => `${t.role === 'agent' ? 'Examinateur' : 'Candidat'}: ${t.message}`)
      .join('\n')

    // Détection de l'école
    const AGENT_ESCP = 'agent_5301kn5frmakepgabf8ne1pw9kzr'
    const AGENT_EMLYON = 'agent_2801kqpz5c0pfexst78ct5ezs5tf'


    let promptFeedback = ''
    let ecole = 'ESCP'

    if (agent_id === AGENT_EMLYON) {
      ecole = 'EM Lyon'
      const cartes = body.data?.conversation_initiation_client_data?.dynamic_variables
      promptFeedback = `Tu es un membre expérimenté du jury d'admission emlyon Business School. Tu évalues des candidats de classes préparatoires (19-20 ans).

TRANSCRIPTION DE L'ENTRETIEN :
${formattedTranscript}

${previousContext}

CARTES TIRÉES PAR LE CANDIDAT :
- Carte Personnalité : ${cartes?.carte_personnalite || 'Non renseigné'}
- Carte Expériences : ${cartes?.carte_experiences || 'Non renseigné'}
- Carte Projets : ${cartes?.carte_projets || 'Non renseigné'}
- Carte Créativité : ${cartes?.carte_creativite || 'Non renseigné'}

MISSION : Génère un feedback complet, précis, honnête et exigeant. L'entretien emlyon est coefficient 9 — c'est déterminant pour l'admission. Sois objectif : n'hésite pas à mettre de mauvaises notes si c'est mauvais, de bonnes notes si c'est vraiment bien, et des notes moyennes si c'est juste correct.

CE QUE RECHERCHE VRAIMENT LE JURY EMLYON :
L'emlyon cherche des "early makers" — des personnes qui agissent, créent, s'engagent avant même d'être diplômés. Le jury évalue :
- La spontanéité et l'authenticité — pas des réponses récitées
- La capacité à se raconter avec des anecdotes concrètes et personnelles
- Le storytelling — chaque réponse doit ramener à soi : parcours, valeurs, centres d'intérêt
- La réactivité face aux questions décalées de la carte Créativité
- La cohérence entre les 4 cartes — un fil conducteur qui se dégage
- La méthode STAR (Situation, Tâche, Action, Résultat) pour les cartes Expériences
- Les 5 valeurs emlyon : Exigence, Responsabilité, Intégrité, Diversité, Solidarité

Réponds UNIQUEMENT en JSON brut sans markdown, sans backticks :
{
  "note": <entier 0-20, objectif et calibré — moyenne des admis ~13>,
  "verdict_jury": "<2-3 phrases comme en délibération — ce que le jury dirait après que le candidat est sorti>",
  "presentation_initiale": "<Analyse : durée, structure, clarté, accroche, première impression — le candidat a-t-il tendu des perches ?>",
  "qualite_expression": "<Vocabulaire, hésitations, fautes éventuelles, fluidité, capacité à structurer ses réponses spontanément>",
  "carte_personnalite": "<Qualité de la réponse à la carte Personnalité — authenticité, argumentation, anecdote personnelle, lien avec les valeurs emlyon>",
  "carte_experiences": "<Qualité de la réponse à la carte Expériences — méthode STAR, apprentissages, lien avec le projet futur>",
  "carte_projets": "<Qualité de la réponse à la carte Projets — clarté du projet, cohérence avec emlyon, ambition réaliste>",
  "carte_creativite": "<Qualité de la réponse à la carte Créativité — originalité, spontanéité, prise de risque, amusement>",
  "valeurs_emlyon": "<Analyse des 5 valeurs détectées ou absentes : Exigence (se dépasser), Responsabilité (impact de ses actions), Intégrité (éthique), Diversité (accueillir la différence), Solidarité (générosité). Pour chacune : bien illustrée / présente / absente>",
  "echange_final": "<Qualité des 3-4 dernières minutes — sujets abordés, profondeur, question finale posée ou non>",
  "meilleur_moment": "<Le meilleur moment de l'entretien — décris la situation et pourquoi c'était fort, sans citer mot pour mot>",
  "pire_moment": "<Le pire moment — décris la situation et pourquoi ça a nui, sans citer mot pour mot>",
  "comparaison_precedent": "<Si premier entretien : 'Premier entretien emlyon — référence établie.' Sinon : comparaison précise avec l'entretien précédent — progression, régression, ce qui stagne>",
  "axes_amelioration": "<3 conseils ultra-concrets et actionnables spécifiques au format emlyon>",
  "points_forts": "<2-3 points forts précis>",
  "points_faibles": "<2-3 points faibles précis>"
}`

    } else {
      ecole = 'ESCP'
      const questionnaireContext = q ? `
QUESTIONNAIRE DE PERSONNALITÉ REMPLI PAR LE CANDIDAT :
- Centres d'intérêt & activités : ${q.centres_interet || 'Non renseigné'}
- Réalisation dont il est fier : ${q.fierte || 'Non renseigné'}
- Expérience du monde du travail : ${q.experience_travail || 'Non renseigné'}
- Expériences culturelles : ${q.experience_cultures || 'Non renseigné'}
- Expérience marquante : ${q.experience_marquante || 'Non renseigné'}
- Autres informations : ${q.autres_infos || 'Non renseigné'}
` : "Le candidat n'a pas rempli son questionnaire de personnalité."

      promptFeedback = `Tu es un membre expérimenté du jury d'admission ESCP Business School. Tu évalues des candidats de classes préparatoires (19-20 ans).

${questionnaireContext}

TRANSCRIPTION DE L'ENTRETIEN :
${formattedTranscript}

${previousContext}

MISSION : Génère un feedback complet, précis, honnête et exigeant. Note éliminatoire à l'ESCP : 5/20. La moyenne des candidats admis est autour de 13-14/20. Sois objectif : n'hésite pas à mettre de mauvaises notes si c'est mauvais, de bonnes notes si c'est vraiment bien.

CRITÈRE LE PLUS IMPORTANT — LE TRIANGLE :
Le critère numéro 1 est la capacité du candidat à tisser des liens naturels entre ces 3 pôles tout au long de l'entretien :
- PERSONNALITÉ (qui il est, ses valeurs, ce qui le motive)
- PROJET PROFESSIONNEL (ce qu'il veut faire, pourquoi, comment)
- ESCP (pourquoi cette école spécifiquement, ce qu'elle lui apporte, ce qu'il lui apporte)

Un bon candidat relie spontanément ces 3 pôles sans qu'on le lui demande. Ce n'est pas parce qu'un candidat répond à toutes les questions qu'il mérite une bonne note — c'est la profondeur et les liens qui comptent.

Réponds UNIQUEMENT en JSON brut sans markdown, sans backticks :
{
  "note": <entier 0-20>,
  "verdict_jury": "<3 phrases comme en délibération>",
  "presentation_initiale": "<Analyse de la présentation d'ouverture>",
  "qualite_expression": "<Vocabulaire, hésitations, clarté, fluidité>",
  "dynamique_echange": "<Le candidat porte-t-il l'échange ou le subit-il ?>",
  "triangle_liens": "<Analyse détaillée des liens Personnalité↔Projet↔ESCP>",
  "fond_escp": "<Cohérence du parcours, motivation réelle pour l'ESCP, ouverture, projet>",
  "exploitation_questionnaire": "<A-t-il valorisé ce qu'il avait écrit dans son questionnaire ?>",
  "meilleur_moment": "<Le meilleur moment — décris sans citer mot pour mot>",
  "pire_moment": "<Le pire moment — décris sans citer mot pour mot>",
  "question_finale": "<A-t-il posé une question ? Pertinente ou non ? Suggère une meilleure>",
  "comparaison_precedent": "<Comparaison avec l'entretien précédent ou premier entretien>",
  "axes_amelioration": "<3 conseils ultra-concrets>",
  "points_forts": "<2-3 points forts>",
  "points_faibles": "<2-3 points faibles>"
}`
    }

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: promptFeedback }],
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

    // Sauver le feedback avec tous les champs
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
        ecole,
        note: feedback.note,
        points_forts: feedback.points_forts,
        points_faibles: feedback.points_faibles,
        axes_amelioration: feedback.axes_amelioration,
        verdict_jury: feedback.verdict_jury,
        presentation_initiale: feedback.presentation_initiale,
        qualite_expression: feedback.qualite_expression,
        dynamique_echange: feedback.dynamique_echange || null,
        triangle_liens: feedback.triangle_liens || null,
        fond_escp: feedback.fond_escp || null,
        exploitation_questionnaire: feedback.exploitation_questionnaire || null,
        meilleur_moment: feedback.meilleur_moment,
        pire_moment: feedback.pire_moment,
        question_finale: feedback.question_finale || null,
        comparaison_precedent: feedback.comparaison_precedent,
        carte_personnalite: feedback.carte_personnalite || null,
        carte_experiences: feedback.carte_experiences || null,
        carte_projets: feedback.carte_projets || null,
        carte_creativite: feedback.carte_creativite || null,
        valeurs_emlyon: feedback.valeurs_emlyon || null,
        echange_final: feedback.echange_final || null
      })
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Erreur webhook:', err)
    return res.status(500).json({ error: err.message })
  }
}
