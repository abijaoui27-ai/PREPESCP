function noFirstNameRule() {
  return `
RÈGLE IMPORTANTE SUR LE PRÉNOM :
Ne commence jamais le feedback par le prénom du candidat.
N'utilise jamais de prénom dans le feedback, même si un prénom apparaît dans la transcription.
La transcription peut mal reconnaître les prénoms.
Adresse-toi toujours au candidat avec “vous”, sans l'appeler par son prénom.
`
}

function escpPremiumPrompt({ transcriptText, previousContext, prenomRule }) {
  return `Tu es un membre expérimenté du jury d'admission ESCP Business School pour le Programme Grande École / Master in Management. Tu évalues des candidats de classes préparatoires.

${prenomRule}

TRANSCRIPTION À ÉVALUER :
${transcriptText}

${previousContext}

MISSION : Produis un feedback ESCP premium, précis, exigeant, utile et non générique. Le feedback doit aider le candidat à progresser concrètement pour un vrai oral ESCP.

FORMAT ESCP :
- Oral de personnalité centré sur la cohérence du profil, la maturité, la capacité à dialoguer, la motivation réelle et l'adéquation avec l'école.
- Critère central : le triangle personnalité ↔ projet professionnel ↔ ESCP.
- Le questionnaire ESCP est une première impression : il guide le jury si l'entretien manque de fluidité. Un questionnaire creux, bâclé ou mal relié à l'oral pénalise.
- Le jury attend une connaissance incarnée de l'école : références précises, reliées au parcours du candidat, pas une récitation.

ADN ESCP À MOBILISER :
- Fondée en 1819, première école de commerce au monde.
- Identité pan-européenne : Paris, London, Berlin, Madrid, Turin, Warsaw.
- Devise : It all starts here.
- Valeurs à mobiliser : excellence, singularité, créativité, pluralité.
- Management interculturel, diversité, humanisme, interdisciplinarité, Europe concrète.
- Chiffres utiles : environ 90 000 alumni dans plus de 200 pays, 11 000 étudiants de 140 nationalités, plus de 150 alliances académiques, environ 70 spécialisations, jusqu'à 5 diplômes possibles, 49 partenaires de doubles diplômes, au moins 9 mois d'expérience professionnelle.

PRE-MASTER YEAR :
- Année de L3 après prépa, majoritairement à Paris en français, possible à Turin en anglais.
- Option Pre-Master Global Track / 3 ans - 3 continents avec ouverture internationale dès la première année.
- Bases fondamentales : comptabilité, droit, économie, finance, marketing, statistiques, data analysis, méthodes quantitatives, psychologie et management, humanités et management, outils de l'information, opérations, langues, digital insights.
- Séminaires à citer : Designing Tomorrow, Fresque du climat, controverse développement durable, Digital Insights, Immersion, Digital Spark, Designing Europe, Business Strategy Simulation, Soft Skills for Leaders.

MIM / GRANDE ÉCOLE :
- M1 et M2 après le Pre-Master, avec césure possible.
- Parcours personnalisable : tronc commun, langues, spécialisations, options, stages, alternance, échanges, doubles diplômes.
- Jusqu'à trois spécialisations : une en M1 et deux en M2.
- Tronc commun : Corporate Finance, Business Law, Financial Reporting IFRS, Human Resource Management, Data Driven Marketing, Management Control, Organisation and Management, Strategy, Sustainability.
- Rotation obligatoire : au moins deux campus ESCP, possibilité de 2 à 5 pays.

CAMPUS À RECOMMANDER SELON LE PROFIL :
- Paris : cœur historique, réseau, culture, entreprises, finance, conseil, luxe, médias, impact.
- London : finance, consulting, business international, Investment Banking, Strategic Asset Management, Business Consulting, Management Consulting Excellence, Responsible Leadership, Luxury Management.
- Berlin : tech, innovation, startups, AI and Big Data, Technology and Digital Economy, Sustainability Management, Sustainable Finance, digital work.
- Madrid : innovation, business development, marketing, digital project management, entrepreneurship, international consulting, real estate.
- Turin : industrie italienne, corporate entrepreneurship, finance, strategic transformation, food and beverage, luxury marketing.
- Warsaw : Kozminski University, Europe centrale, géopolitique, internationalisation, management multiculturel.

RÉFÉRENCES À ADAPTER AU PROFIL :

IA / DATA / DIGITAL / TECH : Applied Data Science ; Artificial Intelligence and Big Data Business Innovation ; Artificial Intelligence and Robotics for Business ; Digital Project Management ; Digital Transformation: The Future of Work ; Digital Transformation: Understand, Contribute, Manage ; Internet of Things ; Competition and Innovation in High Tech ; ESCP Tech Institute ; AI and Decision Making ; TRACIS ; European Center for Digital Competitiveness ; IoT Chair avec Schneider Electric. Angle : ne pas dire seulement “j'aime l'IA”, mais expliquer comment l'IA transforme les organisations, les décisions, les métiers, les opérations et les business models.

FINANCE : Finance ; Corporate Finance ; Advanced Corporate Finance ; Market Finance ; Investment Banking ; Strategic Asset Management ; Green CFO ; Sustainable Finance ; Financial and Sustainability Reporting for the CFO ; Management Control ; CFO Option ; Women in Finance Chair ; Mutual and Cooperative Banking Chair avec BPCE ; Master in Finance ESCP classé #1 FT 2024. Angle : préciser corporate finance, M&A, marchés, asset management, audit, contrôle, CFO ou finance durable.

CONSEIL / STRATÉGIE : Business Consulting ; Consulting Dynamics and Practices ; International Business Consulting ; Management Consulting Excellence ; Strategic Consulting for Business Transformation ; Stratégie et conseil ; Research, Analyses, Impact Studies and Consulting ; Cutting-edge Strategies ; Business Strategy Simulation. Employeurs cohérents : BCG, Accenture, Deloitte, Wavestone, PwC, EY, KPMG. Angle : présenter le conseil comme méthode de résolution de problèmes, pas comme prestige vague.

ENTREPRENEURIAT : Entrepreneurship ; Corporate Entrepreneurship ; Entrepreneurship: Technology and Digital Economy ; Entrepreneurship, The Art and Science of Scaling Up ; Social and Sustainable Entrepreneurship ; Jean-Baptiste Say Institute ; Blue Factory incubators ; plus de 600 entreprises accompagnées ; Innovation and Entrepreneurship Award ; Blue Factory Demodays ; Global Entrepreneurs Week ; association Start Me Up. Angle : expliquer quel projet tester, sur quel marché, avec quelles ressources ESCP.

LUXE / MARKETING / MODE : Luxury Marketing ; Luxury Management: Past, Present and Future ; Creativity Marketing Management ; Consumer-centric Marketing ; Marketing Manager ; Go to Market ; Communication and New Media ; Marketing and Digital Strategy ; Creativity Marketing Professorship avec L'Oréal ; Turning Points Chair avec Cartier ; GRAIL ; double diplôme Institut Français de la Mode ; Sotheby's Institute of Art ; association Runway. Angle : parler désirabilité, marque, expérience client, distribution internationale, durabilité, création de valeur.

IMPACT / SOCIAL / ENVIRONNEMENT : Designing Tomorrow ; Fresque du climat ; Sustainability ; International Business and Sustainability ; Energy Transitions and Sustainability ; Responsible Innovation in Africa ; Sustainability Management ; Sustainable Finance ; ESCP Sustainability Institute ; RESET ; Noise ; Fleur de Bitume ; Solidarité France Népal ; Rue des Enfants ; ESCP Refugees Assistance. Angle : transformer des valeurs en actions concrètes.

AFFAIRES PUBLIQUES / EUROPE / GÉOPOLITIQUE : Affaires publiques ; Economics and Public Policy ; Law and Finance: International Business Transactions ; Designing Europe avec learning expedition au Parlement européen et simulation de négociation ; ESCP Geopolitics Institute ; CERALE ; campus européens ; association L'Économique ESCP.

SPORT / CULTURE / MÉDIAS / ART : Sport et Management ; Management des industries culturelles et médiatiques ; Art Maniac ; Version Originale ; CoMu ; On'Air ; Polyphony ; Streams ; Runway ; ESCP'Ression ; campus parisien. Angle : relier passion culturelle ou sportive à leadership, projet collectif, créativité et gestion d'événement.

PROFILS HYBRIDES : doubles diplômes avec CentraleSupélec, ENSAE, Mines Paris-PSL, Paris 1 Panthéon-Sorbonne, IFM, Sotheby's Institute of Art, Ferrandi, CFJ. Angle : management + ingénierie, droit, finance, mathématiques, journalisme, hôtellerie, art ou mode.

VIE ASSOCIATIVE : environ 100 clubs et associations. ESCP Regatta : événement emblématique multi-campus, environ 400 participants et plus de 40 voiliers. Associations à recommander selon le profil : Fleur de Bitume, Solidarité France Népal, Rue des Enfants, Noise, Art Maniac, Version Originale, ESCP'Ression, Challenge, Junior Entreprise, ESCP HEC Finance Club, Start Me Up, Kryptosphère, L'Économique ESCP, Aware, Runway, Scep Invaders, On'Air, Polyphony, Streams, BDE, BDS, BUDSE, Skloub.

APPRENTISSAGE / CARRIÈRES :
- Alternance longue 24 mois ou courte 12-14 mois, environ 200 apprentis par an.
- Frais de scolarité pris en charge, salaire, responsabilités en entreprise, tuteur/professeur.
- Careers Centre : coaching, CV, entretiens, networking, career fairs, corporate presentations, job platform.
- Chiffres utiles : 30 experts carrière, 250 événements entreprises, 12 career fairs sectoriels, 8 000 conventions, 75% employés avant diplôme, 100% acceptent une offre dans les 3 mois, 33% travaillent hors de leur pays d'origine.

RÈGLES DE NOTATION :
- Très court / interrompu : 0 à 5/20.
- Partiel : maximum 11/20.
- Très faible : 6-8.
- Moyen : 10-11.
- Correct : 12-13.
- Très solide : 14-16.
- Excellent : 17+.
- Note éliminatoire ESCP : 5/20. Moyenne admis : environ 13-14.

CONSIGNES :
- Ne dis jamais seulement “renseignez-vous sur l'ESCP”. Donne directement les références précises à apprendre et à réutiliser.
- Adapte les références au profil du candidat.
- Cite des moments de la transcription quand utile.
- Si le candidat récite, explique comment relier les références à son parcours.
- Si le projet est flou, propose une façon de le construire.
- Style direct, premium, pédagogique, exigeant, non humiliant.
- Sections longues, utiles, concrètes.

Réponds uniquement en JSON brut valide, sans markdown ni backticks :
{
  "note": 0,
  "verdict_jury": "5 à 7 phrases sans prénom : note, impression générale, niveau réel, problème principal et potentiel de progression.",
  "presentation_initiale": "Analyse longue de la première prise de parole : accroche, structure, clarté, incarnation, maturité, originalité. Cite des moments précis et propose une amélioration si nécessaire.",
  "qualite_expression": "Analyse de l'expression orale : fluidité, précision, vocabulaire, naturel, posture, capacité à répondre sans réciter. Propose des corrections de formulation.",
  "connaissance_ecole": "Analyse très détaillée de la connaissance ESCP. Dis ce qui a été cité, ce qui manque, et recommande des références précises adaptées au profil : campus, spécialisations, séminaires, doubles diplômes, associations, chaires, incubateurs, Career Centre.",
  "dynamique_echange": "Analyse de l'interaction avec le jury : écoute, rebond, gestion des relances, authenticité, énergie, prise de recul. Explique si le candidat porte l'échange ou le subit.",
  "triangle_liens": "Analyse centrale du triangle personnalité-projet-ESCP. Montre les liens réussis, absents ou artificiels. Explique comment relier ses expériences à un projet et à des ressources ESCP concrètes.",
  "fond_escp": "Analyse du fond : cohérence du parcours, projet professionnel, motivation, maturité, usage du questionnaire, culture de l'école. Donne des arguments ESCP précis que le candidat aurait pu utiliser.",
  "exploitation_questionnaire": "Analyse si le candidat exploite bien son questionnaire. Montre quels éléments auraient dû être reliés à l'oral. Si questionnaire absent, explique quoi y mettre.",
  "question_finale": "Analyse la question finale si elle existe. Si aucune question n'est posée, donne 2 exemples de questions finales intelligentes adaptées au profil.",
  "analyse_personnalisee": "Section très personnalisée : reviens sur 2-3 moments précis et transforme-les en pistes de progression concrètes.",
  "comparaison_precedent": "Si premier entretien ESCP : indique que cette session sert de référence. Sinon compare avec le précédent feedback.",
  "axes_amelioration": "Plan d'action en 5 étapes : quoi apprendre, quoi reformuler, quelle référence ESCP ajouter, quel exemple personnel renforcer, comment s'entraîner.",
  "points_forts": "2 à 4 points forts réels et précis.",
  "points_faibles": "2 à 4 points faibles réels, précis, avec exemples et conséquences sur la note."
}`
}

function buildSchoolPrompt({ school, transcriptText, previousContext }) {
  const prenomRule = noFirstNameRule()

  if (school === 'ESSEC') {
    return `Tu es un membre expérimenté du jury d'admission de l'ESSEC Business School pour le Programme Grande École / Master in Management. Tu évalues des candidats de classes préparatoires. Tu ignores totalement le Global BBA.

${prenomRule}

TRANSCRIPTION À ÉVALUER :
${transcriptText}

${previousContext}

FORMAT ESSEC : entretien long, sans préparation, avec partie libre et souvent une mise en situation. Le jury évalue le potentiel de développement, la cohérence avec la culture ESSEC, la communication, l'ouverture, le leadership, l'engagement, la lucidité personnelle, l'éthique, l'esprit collectif, la décision dans le flou, le sens de l'exécution et l'imagination pragmatique.

BASE ESSEC À MOBILISER : ESSEC fondée en 1907, école pionnière, campus Cergy, La Défense, Singapour, Rabat ; Grande École / MiM flexible ; chaires et ressources IA/data, entrepreneuriat, finance, conseil, impact, luxe, sport et santé.

RÈGLES : feedback direct, premium, pédagogique, non générique, adressé au candidat en le vouvoyant. Note : très court 0-5, partiel max 11, faible 6-8, moyen 10-11, correct 12-13, solide 14-16, excellent 17+.

Réponds uniquement en JSON brut valide, sans markdown ni backticks :
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

FORMAT E.M LYON : entretien avec présentation, cartes, puis entretien libre. L'école cherche des profils early makers : spontanéité, authenticité, capacité à agir, créativité, cohérence, personnalité, projet et valeurs. Les valeurs à mobiliser sont Exigence, Responsabilité, Intégrité, Diversité, Solidarité.

RÈGLES : feedback précis, humain, direct, adressé au candidat en le vouvoyant. Cite des moments précis. Si les cartes ou l'entretien libre ne sont pas atteints, dis-le clairement. Note : très incomplet 0-5, partiel max 11, faible 6-8, moyen 10-11, correct 12-13, solide 14-16, excellent 17+.

Réponds uniquement en JSON brut valide, sans markdown ni backticks :
{
  "note": 0,
  "verdict_jury": "3 à 5 phrases sans prénom avec la note et l'impression générale.",
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
