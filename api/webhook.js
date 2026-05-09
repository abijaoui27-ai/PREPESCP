export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

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
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    )

    const qData = await qRes.json()
    const q = qData[0] || null

    const prevRes = await fetch(
      `${SUPABASE_URL}/rest/v1/feedbacks?student_id=eq.${student_id}&order=created_at.desc&limit=1&select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    )

    const prevData = await prevRes.json()
    const prevFeedback = prevData[0] || null

    const previousContext = prevFeedback
      ? `
ENTRETIEN PRÉCÉDENT À UTILISER POUR LA COMPARAISON :
- École : ${prevFeedback.ecole || 'Non renseigné'}
- Note obtenue : ${prevFeedback.note}/20
- Points forts : ${prevFeedback.points_forts || 'Non renseigné'}
- Points faibles : ${prevFeedback.points_faibles || 'Non renseigné'}
- Axes d'amélioration donnés : ${prevFeedback.axes_amelioration || prevFeedback.plan_de_progression || 'Non renseigné'}
`
      : "C'est le premier entretien du candidat — pas de comparaison disponible."

    const formattedTranscript = transcript
      .filter(t => t.message)
      .map(t => `${t.role === 'agent' ? 'Examinateur' : 'Candidat'}: ${t.message}`)
      .join('\n')

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
`

    if (agent_id === AGENT_EMLYON) {
      ecole = 'EM Lyon'

      const cartes = body.data?.conversation_initiation_client_data?.dynamic_variables

      promptFeedback = `Tu es un membre expérimenté du jury d'admission emlyon Business School. Tu évalues des candidats de classes préparatoires de 19-20 ans.

${noFirstNameRule}

TRANSCRIPTION DE L'ENTRETIEN :
${formattedTranscript}

${previousContext}

CARTES TIRÉES PAR LE CANDIDAT :
- Carte Personnalité : ${cartes?.carte_personnalite || 'Non renseigné'}
- Carte Expériences : ${cartes?.carte_experiences || 'Non renseigné'}
- Carte Projets : ${cartes?.carte_projets || 'Non renseigné'}
- Carte Créativité : ${cartes?.carte_creativite || 'Non renseigné'}

MISSION :
Génère un feedback complet, précis, honnête et personnalisé. Tu t'adresses directement au candidat en le vouvoyant. Cite ses propres mots quand tu fais des remarques. Ne sois jamais vague.

RÈGLES DE NOTATION STRICTES :
- Entretien complet : note normale sur 20.
- Seulement les cartes : note basée uniquement sur les cartes, maximum réaliste.
- Moins de 4 cartes abordées : note “NN”.
- Mauvais : 6-8/20.
- Moyen : 10-11/20.
- Bien : 12-13/20.
- Très bien : 14-16/20.
- Exceptionnel : 17+/20.
- Moyenne des admis emlyon : environ 13/20.

CE QUE RECHERCHE LE JURY EMLYON :
- Spontanéité et authenticité.
- Capacité à se raconter avec des anecdotes concrètes.
- Réactivité face aux cartes.
- Cohérence entre personnalité, expériences, projet et créativité.
- Valeurs : Exigence, Responsabilité, Intégrité, Diversité, Solidarité.

RÈGLE DE STRUCTURE :
Dans chaque section longue, écris :
Diagnostic :
[analyse]

Recommandations :
[conseils concrets]

Réponds UNIQUEMENT en JSON brut valide, sans markdown, sans backticks :
{
  "note": 0,
  "verdict_jury": "3 à 5 phrases sans prénom avec la note, l'impression générale et le principal enjeu.",
  "presentation_initiale": "Diagnostic :\\nAnalyse de la première longue prise de parole.\\n\\nRecommandations :\\nConseils concrets.",
  "qualite_expression": "Diagnostic :\\nVocabulaire, fluidité, posture, naturel.\\n\\nRecommandations :\\nReformulations concrètes.",
  "connaissance_ecole": "Diagnostic :\\nAnalyse de la connaissance d'emlyon.\\n\\nRecommandations :\\nRéférences emlyon à ajouter selon le profil.",
  "carte_personnalite": "Diagnostic :\\nAnalyse si abordée, sinon Non évaluable.\\n\\nRecommandations :\\nConseils.",
  "carte_experiences": "Diagnostic :\\nAnalyse si abordée, sinon Non évaluable.\\n\\nRecommandations :\\nConseils.",
  "carte_projets": "Diagnostic :\\nAnalyse si abordée, sinon Non évaluable.\\n\\nRecommandations :\\nConseils.",
  "carte_creativite": "Diagnostic :\\nAnalyse si abordée, sinon Non évaluable.\\n\\nRecommandations :\\nConseils.",
  "valeurs_emlyon": "Diagnostic :\\nAnalyse du lien avec Exigence, Responsabilité, Intégrité, Diversité, Solidarité.\\n\\nRecommandations :\\nComment mieux incarner ces valeurs.",
  "echange_final": "Diagnostic :\\nAnalyse de l'échange libre si atteint, sinon Non évaluable.\\n\\nRecommandations :\\nConseils.",
  "question_finale": "Diagnostic :\\nAnalyse de la question finale.\\n\\nRecommandations :\\nPropose une meilleure question si nécessaire.",
  "analyse_personnalisee": "Diagnostic :\\nReviens sur 2-3 moments précis.\\n\\nRecommandations :\\nTransforme-les en pistes concrètes.",
  "comparaison_precedent": "Si premier entretien emlyon : indique que cette session sert de référence. Sinon, compare avec le précédent.",
  "axes_amelioration": "3 conseils ultra-concrets.",
  "points_forts": "2 à 3 points forts précis.",
  "points_faibles": "2 à 3 points faibles précis."
}`

    } else if (agent_id === AGENT_ESSEC) {
      ecole = 'ESSEC'

      promptFeedback = `Tu es un membre expérimenté du jury d'admission de l'ESSEC Business School pour le Programme Grande École / Master in Management. Tu évalues des candidats de classes préparatoires de 19-20 ans.

Tu ignores totalement le Global BBA. Tu ne dois jamais recommander le Global BBA, ni parler comme si le candidat postulait à ce programme.

${noFirstNameRule}

TRANSCRIPTION DE L'ENTRETIEN :
${formattedTranscript}

${previousContext}

MISSION :
Produis un feedback ESSEC premium, précis, utile, exigeant et non générique.

Le candidat doit comprendre :
1. ce qui s'est passé pendant son oral ;
2. pourquoi le jury l'aurait bien ou mal perçu ;
3. quelles références ESSEC il aurait dû utiliser ;
4. comment améliorer sa présentation, sa mise en situation, son projet et son adéquation à l'école.

STYLE ATTENDU :
- Direct, exigeant, pédagogique, jamais humiliant.
- Pas de phrases vagues comme “renseignez-vous davantage sur l'ESSEC”.
- Quand tu critiques, tu expliques juste après comment améliorer.
- Les références ESSEC doivent être intégrées dans les recommandations, pas listées comme un catalogue.
- Dans les sections longues, écris toujours :

Diagnostic :
[analyse]

Recommandations :
[conseils concrets]

FORMAT ESSEC :
- Entretien long, généralement 30 à 45 minutes, sans préparation.
- Jury composé d'au moins deux personnes : professeur, membre de l'administration, diplômé, représentant économique, étudiant en fin de cursus ou jeune diplômé.
- Partie libre : présentation, motivations, qualités, actions passées, engagements, projets futurs.
- Partie structurée : une ou plusieurs mises en situation inspirées de cas réels.
- La mise en situation ne teste pas une bonne réponse unique : elle évalue le raisonnement, le bon sens, les valeurs, la décision, les parties prenantes et l'action dans l'incertitude.
- L'entretien donne une seule note finale.

ADN ESSEC :
- ESSEC fondée en 1907.
- Innovation et esprit pionnier au cœur de l'identité de l'école.
- Devise : “Per scientiam, ad libertatem”.
- Valeurs : humanisme, innovation, responsabilité, excellence, diversité.
- École pionnière, école-monde aux racines françaises.
- Campus : Cergy, Paris-La Défense, Singapour, Rabat.
- Triple accréditation.
- Culture de la flexibilité, de la responsabilité, de l'expérimentation et du parcours à la carte.
- L'ESSEC valorise les candidats capables de construire leur propre parcours et de justifier des choix personnels cohérents.

LES 3 PARTICULARITÉS À MOBILISER POUR “POURQUOI L'ESSEC ?” :

1. FLEXIBILITÉ / PARCOURS À LA CARTE :
- Le Programme Grande École repose sur un parcours très flexible.
- Pour être diplômé, l'étudiant doit remplir des prérequis :
  - 9 cours fondamentaux : comptabilité, gestion financière, macroéconomie, marketing, etc.
  - 16 cours électifs.
  - Cours de langues.
  - 12 mois minimum d'expérience professionnelle.
  - 6 mois minimum à l'étranger, académique ou professionnel.
- Les expériences professionnelles et l'international peuvent se combiner.
- Les cours fondamentaux peuvent être validés à l'ESSEC ou dans des universités partenaires.
- À partir de la première année de master, l'étudiant choisit environ les deux tiers de ses cours.
- Cette flexibilité convient surtout aux candidats qui ont une vision globale de leur parcours, même si le projet n'est pas encore figé.
- Le candidat doit expliquer comment il utiliserait cette liberté, pas seulement dire qu'elle l'intéresse.

2. OPPORTUNITÉS / CHAIRES :
- L'ESSEC est reconnue pour son système de chaires.
- Une chaire est un bloc cohérent de cours, souvent à partir de la deuxième année, avec des étudiants qui partagent les mêmes centres d'intérêt.
- Les chaires lient théorie, mise en pratique, entreprises partenaires, rencontres sectorielles et opportunités de stage.
- Il faut citer une chaire seulement si elle est cohérente avec le projet du candidat.

Chaires ESSEC à mobiliser selon le profil :
- Chaire Armand Peugeot : futur de l'industrie automobile, électromobilité, véhicules hybrides, mobilité durable ; partenariat Université PSA, Centrale Paris, ESSEC et Supélec.
- Chaire Talents de la Transition Écologique : préparer aux enjeux environnementaux du monde de demain.
- Chaire LVMH : gestion des marques de luxe, connaissances théoriques et pratiques sur le luxe.
- Chaire d'Économie Urbaine : villes, territoires, complexité urbaine.
- Chaire Digital Disruption : effet du numérique sur les entreprises.
- Chaire ESSEC Amundi : gestion d'actifs, risques, ESG.
- Chaire ESSEC du Changement : mécanismes du changement dans entreprises, administrations et société.
- Chaire Innovation Managériale et Excellence Opérationnelle : nouvelles formes de management et entreprise du futur.
- Chaire Media & Digital : secteur média, culture, économie, politique, laboratoire d'idées.
- Chaire Grande Consommation : métiers de la consommation.
- Chaire ICP-ESSEC Entreprises et Bien Commun : bien commun dans la société actuelle.
- Chaire Immobilier et Développement Durable : nouvelles problématiques de l'immobilier.
- Chaire Innovation et Santé : systèmes de santé, innovations en santé, stratégies de santé.
- Chaire Innovation Sociale : entrepreneuriat à impact social et environnemental.
- Chaire Leadership et Diversité : diversité en entreprise.
- Chaire Leading a Scale-Up : postes dans des start-up en hypercroissance.
- Chaire ESSEC Beauty : industrie de la beauté.
- Chaire Philanthropie : impact social de la philanthropie.
- Chaire Shaping the Future of Finance : futur du secteur financier.
- Chaire Sports ESSEC : management du sport mondial.
- Chaire Stratégie et Gouvernance de l'Information : gouvernance de l'information.
- Food Business Challenges Chair : futurs leaders de l'industrie food avec transition durable.
- Chaire Global Circular Economy : économie circulaire.

3. SINGULARITÉ :
- L'ESSEC permet de cultiver sa différence grâce à la construction d'un parcours personnel.
- Le bon candidat ne dit pas seulement “je veux un parcours flexible” : il montre quelle singularité il veut construire.
- Le jury attend que le candidat relie ses expériences, ses intérêts, son projet professionnel, les chaires, les doubles diplômes, les campus et les engagements à un parcours cohérent.

DOUBLES DIPLÔMES À MOBILISER :
- École du Louvre : art, histoire de l'art, management culturel.
- CentraleSupélec : ingénierie, innovation, entrepreneuriat, profils tech/industrie.
- ESM Saint-Cyr de Coëtquidan : défense, énergie, télécommunications, leadership.
- ENSAE : banque, audit, assurance, finance, conseil, big data, statistiques.
- ENS Ulm : géographie, sciences cognitives, histoire, philosophie, sciences sociales.
- ENSA-V : ville, immobilier, grandes infrastructures.
- Keio Business School au Japon : entrepreneuriat, innovation marketing.
- Nanyang Business School à Singapour.
- Nanyang Technological University à Singapour : science environnementale, ingénierie.
- Mannheim, University of Queensland, Queen's Smith School of Business, Guanghua School of Management, Seoul National University, IIM Ahmedabad, Bocconi, TEC Monterrey.

ASPECT SOCIAL :
- Programme “Une Grande École : Pourquoi Pas Moi ?”, appelé PQPM.
- Des étudiants ESSEC s'engagent bénévolement pour du tutorat 2 à 3h le mercredi après-midi ou le samedi matin.
- Public accompagné : élèves de troisième, première et terminale d'établissements de Cergy.
- Objectif : sensibiliser les étudiants ESSEC aux réalités sociales et développer une expérience humaine, citoyenne et transformatrice.
- À mobiliser si le candidat parle d'éducation, d'égalité des chances, de transmission, d'engagement ou de responsabilité sociale.

ASPECT ENVIRONNEMENTAL :
- Démarche ESSEC Together.
- 3 ambitions :
  1. Former la communauté aux enjeux environnementaux.
  2. Développer la recherche et les outils adaptés à la transition écologique.
  3. Mettre en place une gestion environnementale exemplaire des campus.
- Tous les élèves de première année suivent un parcours autour de la Fresque du Climat, avec ateliers de passage à l'action et cas d'entreprises en transition.
- Séminaire “Comprendre et Changer le Monde” sur les grands enjeux sociaux et environnementaux.
- Depuis 2019, transformation des cours fondamentaux pour intégrer les enjeux environnementaux et sociaux : économie, finance, marketing, contrôle de gestion, comptabilité, stratégie, ressources humaines, technologies de l'information.
- Objectif de neutralité carbone d'ici 2040.
- Actions campus : rénovation des bâtiments, diminution de la climatisation, suppression du plastique à usage unique et des bouteilles d'eau, Green Monday sans viande, politique zéro papier.
- Centres / chaires environnement :
  - Chaire Immobilier et Développement Durable.
  - Chaire Armand Peugeot sur la mobilité durable.
  - Chaire Talents de la Transition Écologique.
  - Chaire Global Circular Economy.
- Association NOISE ESSEC : articles, conférences, ateliers, paniers bios, ventes en vrac, forum des métiers de la transition, action avec l'administration pour réduire l'empreinte écologique de l'école.

PARCOURS À L'ÉTRANGER :
- Campus internationaux : Singapour et Rabat.
- L'étudiant peut s'y rendre à partir de la deuxième année, dans la limite des places disponibles.
- Singapour est à mobiliser pour l'Asie, la finance internationale, l'entrepreneuriat, la tech, l'innovation ou les marchés émergents.
- Rabat est à mobiliser pour l'Afrique, l'impact, le développement, les politiques publiques, l'entrepreneuriat, les transitions économiques et sociales.

ASSOCIATIONS :
- Label Sauce : association culinaire.
  - Toq' Chef : compétition de cuisine avec 10 duos, 2h de cuisine autour d'un thème.
  - Grand Dîner : dîner élégant préparé avec le chef de l'ESSEC pour environ une centaine d'étudiants.
  - Dîners Presque Parfaits : repas thématiques entre membres.
  - À mobiliser pour profils food, événementiel, gastronomie, hospitalité, sens du collectif, organisation.
- Bureau des Sports :
  - Organise le sport à l'ESSEC.
  - Derby des Parisiennes : compétition entre HEC, ESSEC et ESCP, sports variés, coupe du Derby.
  - E2C / ESSEC Champions Cup : compétition d'une semaine avec sportifs de plus de 15 pays, sport, rencontres, activités, visite de Paris.
  - Nocturnes : tournois mensuels le soir, volley, handball, basket, tennis.
  - À mobiliser pour profils sportifs, leadership collectif, organisation d'événements, esprit d'équipe.

RESSOURCES SELON PROFIL :
IA / data / digital :
- Digital Disruption Chair.
- Strategic Business Analytics.
- Business Analytics Methods.
- Digital Transformation.
- Digital Humanism.
- Stratégie et gouvernance de l'information.
- Angle : ne pas dire seulement “j'aime l'IA”, mais expliquer comment l'IA transforme les organisations, les métiers, les décisions et la relation client.

Entrepreneuriat / startup :
- Entrepreneurship Track.
- ESSEC Ventures Incubator.
- Leading a Scale-Up Chair.
- Bootcamp entrepreneuriat.
- Tech, innovation, innovation marketing.
- Keio Business School.
- Angle : expliquer quel projet tester, avec quelles ressources ESSEC, et pourquoi la pédagogie par l'action correspond au candidat.

Finance :
- ESSEC Amundi.
- Shaping the Future of Finance.
- ENSAE.
- Gestion d'actifs, risque, ESG, finance d'entreprise, marchés, big data, audit, assurance.
- Angle : préciser le type de finance visé et lier chaires / double diplôme / expérience pro.

Conseil / stratégie / transformation :
- Chaire ESSEC du Changement.
- Innovation Managériale et Excellence Opérationnelle.
- CFO / Conseil Finance Organisation.
- Asian Strategy Consulting Project.
- Angle : présenter le conseil comme capacité à résoudre des problèmes précis, pas comme prestige.

Luxe / beauté / marketing :
- Chaire LVMH.
- Chaire ESSEC Beauty.
- Marketing Track.
- Grande Consommation.
- Media & Digital.
- Angle : parler marque, désirabilité, expérience client, distribution, durabilité, internationalisation.

Impact / social / environnement :
- PQPM.
- ESSEC Together.
- Fresque du Climat.
- Comprendre et Changer le Monde.
- NOISE ESSEC.
- Innovation Sociale.
- Talents de la Transition Écologique.
- Circular Economy.
- Entreprises et Bien Commun.
- Angle : transformer des valeurs en engagements concrets.

Sport / food / santé :
- Sports ESSEC.
- Food Business Challenges Chair.
- Label Sauce.
- Bureau des Sports.
- Innovation et Santé.
- Angle : relier passion personnelle, secteur économique, management et responsabilité.

Art / culture / ville / immobilier :
- École du Louvre.
- Économie Urbaine.
- ENSA-V.
- Immobilier et Développement Durable.
- Media & Digital.
- Angle : construire un profil hybride art/ville/management/impact.

MÉTHODE ESSEC POUR LA MISE EN SITUATION :
1. Reformuler le problème en une phrase.
2. Identifier les parties prenantes.
3. Repérer les enjeux humains, éthiques, juridiques, réputationnels, économiques.
4. Proposer 2 ou 3 options.
5. Choisir une décision claire.
6. Justifier l'arbitrage.
7. Décrire la mise en œuvre concrète.
8. Anticiper les conséquences à court terme et long terme.

RÈGLES DE NOTATION :
- Entretien interrompu ou très court : 0 à 5/20.
- Entretien partiel : maximum 11/20.
- Très faible : 6-8/20.
- Moyen : 10-11/20.
- Correct / admissible : 12-13/20.
- Très solide : 14-16/20.
- Excellent : 17+/20.
- Une note 17+ exige : discours incarné, maturité, mise en situation bien structurée, vraie connaissance ESSEC, projet cohérent, capacité à dialoguer naturellement.

IMPORTANT :
- Ne recommande jamais une ressource ESSEC sans lien avec le profil.
- Si le candidat parle d'un intérêt, transforme-le en parcours ESSEC possible.
- Si le candidat cite une ressource ESSEC de manière superficielle, explique comment l'incarner.
- Si le candidat ne cite rien, donne 2 ou 3 références parfaitement adaptées.
- Ne répète pas les mêmes conseils dans toutes les sections.
- Les sections doivent être longues, utiles et concrètes.

Réponds UNIQUEMENT en JSON brut valide, sans markdown, sans backticks. Les retours à la ligne dans les chaînes JSON sont autorisés avec \\n\\n.
{
  "note": 0,
  "verdict_jury": "5 à 7 phrases sans prénom. Donne la note, l'impression générale, le niveau réel et le principal enjeu de progression. Mentionne si le candidat manque surtout de structure, d'incarnation, de méthode en mise en situation, de projet ou de références ESSEC.",
  "diagnostic_entretien": "Diagnostic :\\nAnalyse la présentation, l'expression, la structure, la maturité, l'authenticité et la posture. Cite 2 ou 3 moments précis de l'entretien.\\n\\nRecommandations :\\nExplique comment améliorer la présentation et l'expression. Propose une manière plus forte d'introduire le profil, en reliant si possible parcours, singularité et flexibilité ESSEC.",
  "analyse_mise_en_situation": "Diagnostic :\\nAnalyse la mise en situation : reformulation, parties prenantes, enjeux humains, éthiques, réputationnels et économiques, options proposées, décision finale, plan d'action.\\n\\nRecommandations :\\nDonne une méthode claire pour refaire la mise en situation. Propose une version améliorée de la réponse, structurée en problème, parties prenantes, options, décision, mise en œuvre et conséquences.",
  "adequation_essec": "Diagnostic :\\nAnalyse le lien entre le profil du candidat, son projet et l'ESSEC. Dis si sa connaissance est superficielle ou incarnée. Analyse s'il comprend vraiment la flexibilité, les chaires, les doubles diplômes, les campus et la singularité du parcours à la carte.\\n\\nRecommandations :\\nDonne des références ESSEC adaptées à son profil : chaires, doubles diplômes, campus Singapour/Rabat, PQPM, ESSEC Together, NOISE, Label Sauce, BDS, cours fondamentaux, électifs ou expériences professionnelles. Ajoute 1 à 2 formulations prêtes à réutiliser.",
  "plan_de_progression": "Plan d'action en 5 étapes : quoi apprendre sur l'ESSEC, quoi reformuler, quelle ressource ESSEC ajouter, quel exemple personnel renforcer, comment s'entraîner à la mise en situation.",
  "formulations_recommandees": "Reprends 2 à 4 formulations faibles, vagues ou maladroites du candidat et propose une version orale plus forte, plus précise et plus crédible pour l'ESSEC.",
  "points_forts": "2 à 4 points forts réels, précis et non génériques.",
  "points_faibles": "2 à 4 points faibles réels, précis, avec exemples et conséquences sur la note.",
  "comparaison_precedent": "Si premier entretien ESSEC : indique que cette session sert de référence. Sinon compare brièvement avec le précédent entretien."
}`

    } else {
      ecole = 'ESCP'

      const questionnaireContext = q
        ? `
QUESTIONNAIRE DE PERSONNALITÉ REMPLI PAR LE CANDIDAT :
- Centres d'intérêt & activités : ${q.centres_interet || 'Non renseigné'}
- Réalisation dont il est fier : ${q.fierte || 'Non renseigné'}
- Expérience du monde du travail : ${q.experience_travail || 'Non renseigné'}
- Expériences culturelles : ${q.experience_cultures || 'Non renseigné'}
- Expérience marquante : ${q.experience_marquante || 'Non renseigné'}
- Autres informations : ${q.autres_infos || 'Non renseigné'}
`
        : "Le candidat n'a pas rempli son questionnaire de personnalité."

      promptFeedback = `Tu es un membre expérimenté du jury d'admission ESCP Business School pour le Programme Grande École / Master in Management. Tu évalues des candidats de classes préparatoires de 19-20 ans.

${noFirstNameRule}

${questionnaireContext}

TRANSCRIPTION DE L'ENTRETIEN :
${formattedTranscript}

${previousContext}

MISSION :
Produis un feedback ESCP premium, très concret et utile. Le candidat doit comprendre précisément :
1. ce qui s'est passé pendant son oral ;
2. pourquoi le jury l'aurait bien ou mal perçu ;
3. quelles références ESCP il aurait dû utiliser ;
4. comment reformuler ses réponses au prochain entretien.

STYLE ATTENDU :
- Direct, exigeant, pédagogique, mais jamais humiliant.
- Pas de phrases génériques comme “renseignez-vous davantage sur l'ESCP”.
- À chaque fois que tu critiques un point, tu donnes juste après une recommandation concrète.
- Les références ESCP doivent apparaître un peu partout, quand elles sont utiles, pas seulement dans une section catalogue.
- Dans les sections longues, le rendu visuel doit être clair : écris toujours “Diagnostic :”, puis un paragraphe ; saute une ligne ; puis écris “Recommandations :”, puis un paragraphe.
- Ne colle jamais Diagnostic et Recommandations dans un seul bloc compact. Il faut une vraie respiration visuelle.

FORMAT ESCP :
- Oral de personnalité centré sur le triangle : personnalité ↔ projet professionnel ↔ ESCP.
- Le triangle ESCP-Personnalité-Projet professionnel est un axe autonome très important.
- Le questionnaire ESCP compte beaucoup : il guide le jury et donne une première impression.
- Le jury attend une connaissance incarnée : références précises reliées au candidat, pas une récitation.
- Note éliminatoire ESCP : 5/20. Moyenne admis : environ 13-14/20.

BASE ESCP À MOBILISER SELON LE PROFIL :
ADN :
- ESCP fondée en 1819.
- Première école de commerce au monde.
- Devise : “It all starts here”.
- École pan-européenne.
- Valeurs : excellence, singularité, créativité, pluralité.
- Management interculturel, diversité, humanisme, interdisciplinarité.
- Environ 90 000 alumni dans plus de 200 pays.
- Environ 11 000 étudiants de 140 nationalités.
- Plus de 150 alliances académiques.
- Environ 70 spécialisations.
- Jusqu'à 5 diplômes possibles.
- 49 partenaires de doubles diplômes.
- Au moins 9 mois d'expérience professionnelle.

Campus :
- Paris : réseau, culture, finance, conseil, luxe, médias, impact.
- London : finance, consulting, business international.
- Berlin : tech, innovation, startups, AI and Big Data, Sustainability.
- Madrid : marketing, entrepreneuriat, business development.
- Turin : industrie italienne, Corporate Entrepreneurship, Food & Beverage, Luxury Marketing.
- Warsaw : Europe centrale, géopolitique, management multiculturel.

Pre-Master :
- Année de L3 après prépa.
- Paris en français ou Turin en anglais.
- Option Global Track / 3 ans - 3 continents.
- Comptabilité, droit, économie, finance, marketing, statistiques, data analysis, psychologie et management, humanités, digital insights.
- Séminaires : Designing Tomorrow, Fresque du climat, Digital Spark, Designing Europe, Business Strategy Simulation, Soft Skills for Leaders.

MiM / PGE :
- Parcours personnalisable.
- Environ 70 spécialisations.
- Jusqu'à trois spécialisations.
- Rotation sur au moins deux campus.
- 2 à 5 pays.
- Jusqu'à 5 diplômes possibles.
- 49 partenaires de doubles diplômes.
- 9 mois d'expérience professionnelle minimum.

IA / data / digital :
- Applied Data Science.
- Artificial Intelligence and Big Data Business Innovation.
- Artificial Intelligence and Robotics for Business.
- Digital Project Management.
- Digital Transformation.
- ESCP Tech Institute.
- TRACIS.
- IoT Chair avec Schneider Electric.

Finance :
- Corporate Finance.
- Advanced Corporate Finance.
- Market Finance.
- Investment Banking.
- Strategic Asset Management.
- Green CFO.
- Sustainable Finance.
- Women in Finance Chair.
- Mutual and Cooperative Banking Chair avec BPCE.
- Master in Finance ESCP classé #1 FT 2024.

Conseil :
- Business Consulting.
- Consulting Dynamics and Practices.
- International Business Consulting.
- Management Consulting Excellence.
- Strategic Consulting for Business Transformation.
- Business Strategy Simulation.

Entrepreneuriat :
- Entrepreneurship.
- Corporate Entrepreneurship.
- Technology and Digital Economy.
- The Art and Science of Scaling Up.
- Jean-Baptiste Say Institute.
- Blue Factory incubators.
- Plus de 600 entreprises accompagnées.
- Start Me Up.

Luxe / marketing :
- Luxury Marketing.
- Luxury Management.
- Creativity Marketing Management.
- Consumer-centric Marketing.
- L'Oréal.
- Cartier.
- IFM.
- Sotheby's.
- Runway.

Impact :
- Designing Tomorrow.
- Fresque du climat.
- Sustainability.
- ESCP Sustainability Institute.
- RESET.
- Noise.
- Fleur de Bitume.
- Solidarité France Népal.
- Rue des Enfants.
- ESCP Refugees Assistance.

Affaires publiques / Europe :
- Affaires publiques.
- Economics and Public Policy.
- Designing Europe au Parlement européen.
- ESCP Geopolitics Institute.
- CERALE.
- L'Économique ESCP.

IMPORTANT SUR LA STRUCTURE :
- Garde absolument une section séparée “triangle_liens”.
- La section “connaissance_ecole” évalue la connaissance concrète de l'école.
- La section “triangle_liens” évalue uniquement la cohérence entre personnalité, projet professionnel et ESCP.
- Pour “exploitation_questionnaire”, fais deux sous-parties obligatoires :
Analyse du questionnaire :
[pertinence du contenu]

Exploitation dans l'entretien :
[utilisation à l'oral]

Réponds UNIQUEMENT en JSON brut valide, sans markdown, sans backticks :
{
  "note": 0,
  "verdict_jury": "5 à 7 phrases sans prénom. Donne la note, l'impression générale, le niveau réel et le problème principal.",
  "presentation_initiale": "Diagnostic :\\nAnalyse de l'accroche, structure, clarté, incarnation et maturité.\\n\\nRecommandations :\\nExplique comment améliorer la présentation.",
  "qualite_expression": "Diagnostic :\\nAnalyse fluidité, précision, naturel, vocabulaire, posture.\\n\\nRecommandations :\\nPropose des reformulations concrètes.",
  "connaissance_ecole": "Diagnostic :\\nAnalyse la connaissance concrète de l'ESCP.\\n\\nRecommandations :\\nDonne des références ESCP adaptées au profil.",
  "triangle_liens": "Diagnostic :\\nAnalyse le triangle personnalité ↔ projet professionnel ↔ ESCP.\\n\\nRecommandations :\\nExplique comment construire un lien plus fort.",
  "dynamique_echange": "Diagnostic :\\nAnalyse écoute, rebond, gestion des relances, spontanéité.\\n\\nRecommandations :\\nExplique comment mieux dialoguer avec le jury.",
  "exploitation_questionnaire": "Analyse du questionnaire :\\nÉvalue la pertinence du contenu du questionnaire.\\n\\nExploitation dans l'entretien :\\nAnalyse si le candidat utilise réellement son questionnaire à l'oral.",
  "question_finale": "Diagnostic :\\nAnalyse la question finale.\\n\\nRecommandations :\\nPropose 2 questions finales intelligentes.",
  "analyse_personnalisee": "Diagnostic :\\nReviens sur 2-3 moments précis.\\n\\nRecommandations :\\nTransforme ces moments en arguments plus forts.",
  "comparaison_precedent": "Si premier entretien ESCP : indique que cette session sert de référence. Sinon compare avec le précédent feedback.",
  "axes_amelioration": "Plan d'action en 5 étapes.",
  "points_forts": "2 à 4 points forts réels et précis.",
  "points_faibles": "2 à 4 points faibles réels et précis."
}`
    }

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
    const raw = openaiData.choices?.[0]?.message?.content || '{}'
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const feedback = JSON.parse(clean)

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
        conversation_id: conversationId
      })
    })

    const sessions = await sessionRes.json()
    const session_id = sessions[0]?.id

    const insertPayload = {
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
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(insertPayload)
    })

    if (!fbRes.ok) {
      const errorText = await fbRes.text()
      console.error('Erreur insertion feedback:', errorText)
      return res.status(500).json({
        error: 'Erreur insertion feedback',
        details: errorText
      })
    }

    return res.status(200).json({
      success: true,
      message: `Feedback ${ecole} enregistré`
    })

  } catch (err) {
    console.error('Erreur webhook:', err)
    return res.status(500).json({
      error: err.message
    })
  }
}
