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
- École : ${prevFeedback.ecole || 'Non renseigné'}
- Note obtenue : ${prevFeedback.note}/20
- Points forts : ${prevFeedback.points_forts || 'Non renseigné'}
- Points faibles : ${prevFeedback.points_faibles || 'Non renseigné'}
- Axes d'amélioration donnés : ${prevFeedback.axes_amelioration || prevFeedback.plan_de_progression || 'Non renseigné'}
` : "C'est le premier entretien du candidat — pas de comparaison disponible."

    const formattedTranscript = transcript
      .filter(t => t.message)
      .map(t => `${t.role === 'agent' ? 'Examinateur' : 'Candidat'}: ${t.message}`)
      .join('\n')

    const AGENT_ESCP = 'agent_5301kn5frmakepgabf8ne1pw9kzr'
    const AGENT_EMLYON = 'agent_2801kqpz5c0pfexst78ct5ezs5tf'
    const AGENT_ESSEC = 'agent_6201kqyj4vwkerkt0faxgk2zn3ed'

    let promptFeedback = ''
    let ecole = 'ESCP'

    const noFirstNameRule = `
RÈGLE IMPORTANTE SUR LE PRÉNOM :
Ne commence jamais le feedback par le prénom du candidat.
N'utilise jamais de prénom dans le feedback, même si un prénom apparaît dans la transcription.
La transcription peut mal reconnaître les prénoms.
Adresse-toi toujours au candidat avec “vous”, sans l'appeler par son prénom.
Exemples interdits :
- “Rami, votre entretien…”
- “Allan, vous avez…”
- “Sarah, votre prestation…”
Exemples attendus :
- “Votre entretien montre…”
- “Vous obtenez une note de…”
- “Sur cette prestation, le jury retient…”
`

    if (agent_id === AGENT_EMLYON) {
      ecole = 'EM Lyon'
      const cartes = body.data?.conversation_initiation_client_data?.dynamic_variables

      promptFeedback = `Tu es un membre expérimenté du jury d'admission emlyon Business School. Tu évalues des candidats de classes préparatoires (19-20 ans).

${noFirstNameRule}

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
  "verdict_jury": "<S'adresse directement au candidat en le vouvoyant, sans prénom. Ton humain et direct. 3-4 phrases. Si CAS 2 : préciser que la note ne couvre que les cartes. Si CAS 3 : indiquer entretien non noté.>",
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

    } else if (agent_id === AGENT_ESSEC) {
      ecole = 'ESSEC'

      promptFeedback = `Tu es un membre expérimenté du jury d'admission de l'ESSEC Business School pour le Programme Grande École / Master in Management. Tu évalues des candidats de classes préparatoires de 19-20 ans.

Tu ignores totalement le Global BBA. Tu ne dois jamais recommander le Global BBA, ni parler comme si le candidat postulait à ce programme.

${noFirstNameRule}

TRANSCRIPTION DE L'ENTRETIEN :
${formattedTranscript}

${previousContext}

FORMAT ESSEC À GARDER EN TÊTE :
- L'entretien ESSEC est long, généralement 30 à 45 minutes, sans préparation.
- Le jury cherche à évaluer le potentiel de développement du candidat et la cohérence entre son profil et la culture de l'ESSEC.
- Le jury est composé d'au moins deux personnes : professeur, membre de l'administration, diplômé, représentant du monde économique, étudiant en fin de cursus ou jeune diplômé.
- La partie libre permet au candidat de se présenter, d'expliquer ses motivations, de montrer ses qualités, ses actions passées, ses engagements et ses projets futurs.
- La partie structurée repose sur une ou plusieurs mises en situation inspirées de cas réels.
- La mise en situation ne teste pas une bonne réponse unique : elle évalue le raisonnement, le bon sens, les valeurs, la décision, la prise en compte des parties prenantes et la capacité à agir dans l'incertitude.
- L'entretien donne une seule note finale.

CE QUE LE JURY ESSEC ÉVALUE :
- Expression claire, structurée, naturelle.
- Curiosité réelle, ouverture au monde, capacité à relier ses expériences à des enjeux plus larges.
- Lucidité personnelle : comprendre ses choix, ses limites, ses moteurs, ses contradictions et ses apprentissages.
- Leadership concret : initiatives, engagements, responsabilités, capacité à entraîner ou servir un collectif.
- Réflexe éthique : intégrité, transparence, responsabilité, réputation, justice.
- Esprit collectif : prise en compte de l'équipe, de l'association, du client, de l'école, des parties prenantes.
- Décision dans le flou : capacité à trancher sans information parfaite.
- Sens de l'exécution : transformer une idée en plan d'action concret.
- Imagination pragmatique : créativité utile, réaliste, adaptée au contexte.
- Cohérence avec l'ESSEC : esprit pionnier, flexibilité du parcours, learning-by-doing, leadership responsable, excellence académique, ouverture internationale.

BASE DE CONNAISSANCE ESSEC À MOBILISER DANS LES CONSEILS :

ADN GÉNÉRAL :
- ESSEC fondée en 1907.
- École pionnière, école-monde aux racines françaises.
- Campus : Cergy, Paris-La Défense, Singapour, Rabat.
- Triple accréditation.
- Culture de flexibilité du parcours.
- Pédagogie par l'expérience.
- Leadership responsable.
- Excellence académique, humanisme, impact global.
- L'ESSEC valorise l'idée de construire son propre parcours et de devenir acteur de sa formation.

PROGRAMME GRANDE ÉCOLE / MIM :
- Parcours très flexible.
- Plus de 50 filières et chaires.
- Expériences professionnelles possibles : stage, apprentissage, VIE/VIA, CDD/CDI, création d'entreprise, expérience associative ou humanitaire.
- Expérience internationale obligatoire ou fortement valorisée, notamment via campus ESSEC Asia-Pacific, campus Afrique ou partenaires internationaux.
- L'étudiant doit être capable d'expliquer comment il utilisera cette flexibilité, pas seulement dire qu'elle l'intéresse.

PRE-MASTER / PREMIÈRE ANNÉE :
- Séminaire de prise de parole en public.
- Séminaire "Comprendre et changer le monde".
- Séminaire "Transformer les organisations par la Data et l'IA".
- Bootcamp entrepreneuriat en 33 heures.
- Séminaire SOLVE autour d'un cas d'entreprise réel.
- Expérience terrain.
- Going Pro : suivre le quotidien d'un diplômé.
- Expérience projet : mission de conseil ou création d'entreprise.

DOUBLES DIPLÔMES NATIONAUX :
- CentraleSupélec.
- ENS Ulm.
- ENS Paris-Saclay.
- ENSAE.
- Saint-Cyr.
- École du Louvre.
- Institut Catholique de Paris, philosophie.

DOUBLES DIPLÔMES INTERNATIONAUX :
- Mannheim.
- University of Queensland.
- Queen's Smith School of Business.
- Guanghua School of Management, Peking University.
- Seoul National University.
- IIM Ahmedabad.
- Bocconi.
- Keio Business School.
- TEC Monterrey.
- Nanyang Business School.

SPÉCIALISATIONS À RECOMMANDER SELON LE PROFIL :

Si le candidat parle d'IA, data, digital, automatisation, produit ou transformation :
- Digital Disruption Chair.
- Accenture Strategic Business Analytics Chair.
- Business Analytics Methods Track.
- Digital Transformation and Digital Business Track.
- Information Strategy and Governance Chair.
- Cours Digital Transformation.
- Cours Digital Humanism.
Angle à conseiller : ne pas seulement dire "j'aime l'IA", mais expliquer comment l'IA transforme les organisations, les métiers, les décisions, la relation client ou les opérations.

Si le candidat parle d'entrepreneuriat, startup, projet personnel, innovation :
- Entrepreneurship Track / Filière Entrepreneuriat.
- ESSEC Ventures Incubator.
- Leading a Scale-up Chair.
- Leading a SME/SMI Track.
- Tech, Innovation and Entrepreneurship.
- Bootcamp entrepreneuriat.
Angle à conseiller : expliquer quel projet il veut tester, auprès de qui, avec quelles ressources ESSEC, et pourquoi la pédagogie par l'action lui correspond.

Si le candidat parle de finance :
- Finance Track.
- ESSEC-Amundi Chair.
- Shaping the Future of Finance Chair.
- ESSEC-ISUP Risk & Actuarial Track.
- Corporate Finance in Asia Track.
- Financial Markets in Asia Track.
- Financial Statement Analysis.
- Strategic Cost Management.
Angle à conseiller : préciser finance d'entreprise, marchés, asset management, risque, audit, contrôle, transaction services, M&A ou finance internationale.

Si le candidat parle de conseil, stratégie, transformation :
- Filière conseil en stratégie.
- CFO : Conseil, Finance, Organisation.
- Chaire ESSEC du changement.
- Asian Strategy Consulting Project.
- Managing Plans and Projects.
- Strategic Cost Management.
Angle à conseiller : ne pas présenter le conseil comme un prestige vague, mais comme un moyen de résoudre des problèmes précis : croissance, transformation digitale, organisation, opérations, impact, gouvernance.

Si le candidat parle d'impact, public, société, environnement :
- Chaire Innovation sociale.
- Chaire Talents de la transition écologique.
- Global ESSEC Circular Economy Chair.
- Chaire ICP-ESSEC Entreprises et Bien commun.
- Management and Society Track.
- Filière affaires publiques.
- Filière géopolitique, défense et leadership.
Angle à conseiller : transformer les valeurs personnelles en champ d'action concret : transition écologique, gouvernance, politiques publiques, innovation sociale, économie circulaire, intérêt général.

Si le candidat parle de luxe, beauté, marketing, consommation :
- LVMH Chair - The Future of Luxury.
- ESSEC Beauty Chair.
- Marketing Track.
- Chaire Grande Consommation.
- Media & Digital Track.
Angle à conseiller : éviter "j'aime le luxe" ; parler de désirabilité, distribution, expérience client, durabilité, marque, internationalisation.

Si le candidat parle de sport, santé, food :
- ESSEC Sports Chair.
- Food Chair.
- Chaire Innovation et Santé.
Angle à conseiller : relier passion personnelle, secteur économique, enjeux de société et projet professionnel.

MÉTHODE ESSEC À CONSEILLER POUR LA MISE EN SITUATION :
1. Reformuler le problème en une phrase.
2. Identifier les parties prenantes.
3. Repérer les enjeux humains, éthiques, juridiques, réputationnels, économiques.
4. Proposer 2 ou 3 options.
5. Choisir une décision claire.
6. Justifier l'arbitrage.
7. Décrire la mise en œuvre concrète.
8. Anticiper les conséquences à court terme et à long terme.

MISSION :
Produis un feedback exceptionnel, précis, utile, non générique.

Le feedback doit avoir deux niveaux :
1. Diagnostic jury : ce qui va, ce qui ne va pas, pourquoi la note.
2. Coaching d'amélioration : quoi apprendre, quoi ajouter, quelles ressources ESSEC citer, comment reformuler ses arguments.

RÈGLES :
- Tu t'adresses directement au candidat en le vouvoyant.
- Tu cites ses propres mots si utile.
- Tu ne dis jamais simplement "renseignez-vous davantage sur l'ESSEC".
- Tu donnes directement les exemples ESSEC qu'il aurait dû mobiliser.
- Tu adaptes les ressources ESSEC à SON profil.
- Si le candidat parle d'IA, tu recommandes des ressources IA/data/digital.
- S'il parle finance, tu recommandes les ressources finance.
- S'il parle conseil, tu recommandes les ressources conseil/stratégie.
- S'il parle impact, tu recommandes les ressources impact/public/société.
- S'il parle luxe ou marketing, tu recommandes les ressources luxe/marketing.
- S'il ne parle pas clairement d'un projet, tu expliques comment construire un projet crédible à partir de ses expériences.

RÈGLES DE NOTATION :
- Entretien interrompu ou très court : 0 à 5/20.
- Entretien partiel : maximum 11/20.
- Très faible : 6-8/20.
- Moyen : 10-11/20.
- Correct / admissible : 12-13/20.
- Très solide : 14-16/20.
- Excellent : 17+/20.
- Une note 17+ exige : discours incarné, maturité, mise en situation bien structurée, vraie connaissance ESSEC, projet cohérent, capacité à dialoguer naturellement.

RÈGLES DE FORMAT :
- Réponds UNIQUEMENT en JSON brut valide, sans markdown, sans backticks.
- Tous les champs sont obligatoires.
- Ne crée pas de micro-sections.
- Chaque grande section doit être développée.
- Le feedback doit être moins éclaté, plus profond, plus utile.
- Ne répète pas la même idée dans plusieurs sections.
- Les grandes sections doivent faire au moins 8 à 12 lignes utiles chacune, sauf points forts/faibles et comparaison.
- Ton style doit être direct, premium, pédagogique, mais pas brutal gratuitement.

{
  "note": <entier 0-20>,
  "verdict_jury": "<5 à 7 phrases. Donne la note, l'impression générale, le niveau réel du candidat et le principal enjeu de progression. Ne commence jamais par un prénom. Ne répète pas tout le diagnostic ici.>",
  "diagnostic_entretien": "<Analyse longue de la présentation, de l'expression, de la structure, de la maturité, de l'authenticité et de la posture. Cite 2 ou 3 moments précis de l'entretien. Explique ce qui a pénalisé le candidat, ce qui peut être sauvé, et ce qu'il doit comprendre sur sa prestation globale.>",
  "analyse_mise_en_situation": "<Analyse longue de la mise en situation. Évalue la reformulation du problème, les parties prenantes, les enjeux humains, éthiques, réputationnels et économiques, les options proposées, la décision finale et le plan d'action. Donne ensuite une version améliorée de la réponse que le candidat aurait pu produire.>",
  "adequation_essec": "<Analyse longue du lien entre le profil du candidat, son projet et l'ESSEC. Ne reste jamais général. Recommande des chaires, filières, cours, expériences, campus, doubles diplômes ou dispositifs ESSEC précisément adaptés à son profil. Explique comment les intégrer oralement dans une réponse crédible.>",
  "plan_de_progression": "<Plan très concret en 5 étapes avant le prochain oral. Pour chaque étape : quoi travailler, comment le travailler, et quel résultat viser. Le plan doit être actionnable dès demain.>",
  "formulations_recommandees": "<Reprends 2 à 4 formulations maladroites, faibles, vagues ou inappropriées du candidat et propose une version orale beaucoup plus forte, crédible et admissible. Si le candidat a été vulgaire ou trop brutal, transforme en formulation professionnelle sans édulcorer le fond.>",
  "points_forts": "<2 à 4 points forts réels, précis, non génériques.>",
  "points_faibles": "<2 à 4 points faibles réels, précis, avec exemples.>",
  "comparaison_precedent": "<Si premier entretien ESSEC : indique que cette session sert de référence. Sinon compare brièvement avec le précédent entretien pertinent.>"
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

${noFirstNameRule}

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
  "verdict_jury": "<S'adresse directement au candidat en le vouvoyant, sans prénom. Ton humain et direct. 3-4 phrases. Peut être encourageant ou sévère.>",
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
        temperature: 0.25
      })
    })

    const openaiData = await openaiRes.json()
    const raw = openaiData.choices?.[0]?.message?.content || '{}'
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

        diagnostic_global: feedback.diagnostic_global || null,
        expression_clarte: feedback.expression_clarte || null,
        curiosite_ouverture: feedback.curiosite_ouverture || null,
        lucidite_personnelle: feedback.lucidite_personnelle || null,
        leadership_engagement: feedback.leadership_engagement || null,
        mise_en_situation: feedback.mise_en_situation || null,
        reflexe_ethique: feedback.reflexe_ethique || null,
        esprit_collectif: feedback.esprit_collectif || null,
        decision_dans_le_flou: feedback.decision_dans_le_flou || null,
        sens_de_l_execution: feedback.sens_de_l_execution || null,
        imagination_pragmatique: feedback.imagination_pragmatique || null,
        adequation_essec: feedback.adequation_essec || null,
        plan_de_progression: feedback.plan_de_progression || null,
        arguments_essec_a_ajouter: feedback.arguments_essec_a_ajouter || null,
        formulations_a_retravailler: feedback.formulations_a_retravailler || null,
        ressources_essec_recommandees: feedback.ressources_essec_recommandees || null,

        diagnostic_entretien: feedback.diagnostic_entretien || null,
        analyse_mise_en_situation: feedback.analyse_mise_en_situation || null,
        formulations_recommandees: feedback.formulations_recommandees || null
      })
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Erreur webhook:', err)
    return res.status(500).json({ error: err.message })
  }
}
