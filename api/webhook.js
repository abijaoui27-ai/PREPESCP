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

    const qRes = await fetch(
      `${SUPABASE_URL}/rest/v1/questionnaires?student_id=eq.${student_id}&select=*&limit=1`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    )
    const qData = await qRes.json()
    const q = qData[0] || null

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

MISSION : Génère un feedback complet, précis, honnête et personnalisé. Tu t'adresses directement au candidat en le vouvoyant. Cite ses propres mots quand tu fais des remarques — ne sois pas vague.

RÈGLES DE NOTATION STRICTES — LIS ATTENTIVEMENT :

Analyse d'abord la transcription pour déterminer dans quel cas tu te trouves :

CAS 1 — ENTRETIEN COMPLET : Les 4 cartes ont été abordées ET l'entretien libre a eu lieu.
→ Note normale sur 20, calibrée sur la vraie moyenne emlyon (~13/20).

CAS 2 — SEULEMENT LES CARTES : Les 4 cartes ont été abordées mais l'entretien libre n'a pas eu lieu.
→ Note basée uniquement sur ce qui a été fait (présentation + cartes).
→ Dans le verdict, indiquer clairement : "Cette note a été calculée uniquement sur la partie cartes — l'entretien libre n'a pas été atteint. Elle n'est pas représentative d'un vrai entretien emlyon complet."
→ La section "echange_final" doit indiquer "Non évaluable — entretien libre non atteint."

CAS 3 — ENTRETIEN TRÈS INCOMPLET : Moins de 4 cartes abordées, ou entretien volontairement arrêté très tôt.
→ note : "NN"
→ Dans le verdict : "Entretien non noté — moins de 4 cartes abordées. Un entretien emlyon ne peut pas être évalué dans ces conditions."
→ Toutes les sections non évaluables doivent indiquer "Non évaluable."

RÈGLES DE NOTATION POUR CAS 1 ET 2 :
- Mauvais → 6-8/20
- Moyen → 10-11/20
- Bien → 12-13/20
- Très bien → 14-16/20
- Exceptionnel → 17+/20
- Moyenne des admis emlyon ~13/20

POUR CHAQUE SECTION : après ton analyse, donne un conseil concret et personnalisé. Si une section n'a pas pu être évaluée, indique "Non évaluable."

CE QUE RECHERCHE VRAIMENT LE JURY EMLYON :
- La spontanéité et l'authenticité — pas des réponses récitées
- La capacité à se raconter avec des anecdotes concrètes
- La réactivité face aux questions décalées de la carte Créativité
- La cohérence entre les 4 cartes
- Les 5 valeurs emlyon : Exigence, Responsabilité, Intégrité, Diversité, Solidarité
- La connaissance réelle de l'école : spécialisations, valeurs, programmes, alumni, professeurs

Réponds UNIQUEMENT en JSON brut sans markdown, sans backticks :
{
  "note": <entier 0-20 ou la chaîne "NN">,
  "verdict_jury": "<S'adresse directement au candidat en le vouvoyant. Ton humain et direct. 3-4 phrases. Si CAS 2 : préciser que la note ne couvre que les cartes. Si CAS 3 : indiquer entretien non noté.>",
  "presentation_initiale": "<Analyse uniquement la première longue prise de parole. Durée, structure, originalité. Cite un extrait si nécessaire. Conseil.>",
  "qualite_expression": "<Vocabulaire, fluidité, hésitations. Objectif. Cite des exemples si erreurs. Conseil.>",
  "connaissance_ecole": "<A-t-il montré qu'il connaît vraiment emlyon ? Cherche : spécialisation, programme, prof, valeur, alumni. Cite ce qu'il a dit. Conseil.>",
  "carte_personnalite": "<Si abordée : qualité, authenticité, profondeur. Cite un extrait. Conseil. Si non abordée : 'Non évaluable.'>",
  "carte_experiences": "<Si abordée : apprentissages, lien projet. Cite un extrait. Conseil. Si non abordée : 'Non évaluable.'>",
  "carte_projets": "<Si abordée : clarté, cohérence avec emlyon. Cite un extrait. Conseil. Si non abordée : 'Non évaluable.'>",
  "carte_creativite": "<Si abordée : originalité, spontanéité, prise de risque. Cite un extrait. Conseil. Si non abordée : 'Non évaluable.'>",
  "valeurs_emlyon": "<Les 5 valeurs : Exigence, Responsabilité, Intégrité, Diversité, Solidarité. Exemple concret pour chacune. Conseil. Si entretien trop court : évalue uniquement ce qui a été dit.>",
  "echange_final": "<Si atteint : qualité, profondeur, motivation emlyon. Conseil. Si non atteint : 'Non évaluable — entretien libre non atteint.'>",
  "question_finale": "<A-t-il posé une question ? Pertinente ? Cite-la. Conseil. Si non : 'Aucune question posée. Conseil : Préparez toujours une question finale.'>",
  "analyse_personnalisee": "<Section libre. Reviens sur 2-3 moments précis. Cite exactement ce que le candidat a dit entre guillemets. Explique pourquoi fort ou problématique. Pistes concrètes.>",
  "comparaison_precedent": "<Si premier entretien : 'C'est votre premier entretien emlyon — cette session servira de référence.' Sinon : comparaison précise.>",
  "axes_amelioration": "<3 conseils ultra-concrets. Si CAS 2 : le premier conseil doit être de faire l'entretien complet. Si CAS 3 : le premier conseil doit être d'aller au bout.>",
  "points_forts": "<2-3 points forts réels. Si CAS 3 : 'Non évaluable sur un entretien aussi court.'>",
  "points_faibles": "<2-3 points faibles honnêtes avec exemples. Si CAS 3 : 'Non évaluable.'>"
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

MISSION : Génère un feedback complet, précis, honnête et personnalisé. Tu t'adresses directement au candidat en le vouvoyant. Cite ses propres mots quand tu fais des remarques.

RÈGLES DE NOTATION STRICTES :
- Entretien trop court ou candidat ayant raccroché → note max 5/20, "Entretien non évaluable"
- Entretien partiel → note max 11/20
- Entretien complet mais mauvais → 6-8/20
- Entretien complet moyen → 10-11/20
- Entretien complet bien → 12-13/20
- Entretien complet très bien → 14-16/20
- Exceptionnel → 17+/20
- Note éliminatoire ESCP : 5/20. Moyenne admis : ~13-14/20

POUR CHAQUE SECTION : après ton analyse, donne un conseil concret personnalisé. Si non évaluable car incomplet, indique-le clairement.

CRITÈRE N°1 — LE TRIANGLE :
La capacité à tisser naturellement des liens entre :
- PERSONNALITÉ (qui il est, ses valeurs, ce qui le motive)
- PROJET PROFESSIONNEL (ce qu'il veut faire, pourquoi, comment)
- ESCP (pourquoi cette école, ce qu'elle lui apporte, ce qu'il lui apporte)

Réponds UNIQUEMENT en JSON brut sans markdown, sans backticks :
{
  "note": <entier 0-20>,
  "verdict_jury": "<S'adresse directement au candidat en le vouvoyant. Ton humain et direct. 3-4 phrases. Peut être encourageant ou sévère.>",
  "presentation_initiale": "<Analyse uniquement la première longue prise de parole. Durée, structure, originalité. Cite un extrait si nécessaire. Conseil.>",
  "qualite_expression": "<Vocabulaire, fluidité, hésitations. Objectif. Cite des exemples si erreurs. Conseil.>",
  "connaissance_ecole": "<A-t-il montré qu'il connaît vraiment l'ESCP ? Cherche : spécialisation, programme, prof, partenariat, alumni. Cite ce qu'il a dit. Conseil.>",
  "dynamique_echange": "<Le candidat porte-t-il l'échange ou le subit-il ? Exemples concrets. Conseil.>",
  "triangle_liens": "<Analyse détaillée des liens Personnalité↔Projet↔ESCP. Moments précis. Conseil.>",
  "fond_escp": "<Cohérence du parcours, motivation réelle, profondeur du projet. Extraits. Conseil.>",
  "exploitation_questionnaire": "<A-t-il valorisé son questionnaire ? Liens naturels ? Exemples. Conseil. Si questionnaire vide : 'Le candidat n'a pas rempli son questionnaire. Conseil : le remplir avant le prochain entretien.'>",
  "question_finale": "<A-t-il posé une question ? Pertinente, originale ? Cite-la. Conseil. Si non : 'Aucune question posée. Conseil : Préparez toujours une question finale.'>",
  "analyse_personnalisee": "<Section libre. Reviens sur 2-3 moments précis. Cite exactement ce que le candidat a dit entre guillemets. Explique pourquoi fort ou problématique. Pistes concrètes.>",
  "comparaison_precedent": "<Si premier entretien : 'C'est votre premier entretien ESCP — cette session servira de référence.' Sinon : comparaison précise.>",
  "axes_amelioration": "<3 conseils ultra-concrets adaptés au profil spécifique.>",
  "points_forts": "<2-3 points forts réels et précis.>",
  "points_faibles": "<2-3 points faibles honnêtes avec exemples.>"
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
        connaissance_ecole: feedback.connaissance_ecole || null,
        dynamique_echange: feedback.dynamique_echange || null,
        triangle_liens: feedback.triangle_liens || null,
        fond_escp: feedback.fond_escp || null,
        exploitation_questionnaire: feedback.exploitation_questionnaire || null,
        question_finale: feedback.question_finale || null,
        analyse_personnalisee: feedback.analyse_personnalisee || null,
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
