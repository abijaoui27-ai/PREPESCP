window.ESSEC_DATA = {
  lessons: [
    {id:'intro', icon:'🎯', title:'Stratégie générale ESSEC', tag:'Méthode concours', sections:[
      {h:'Ce que l’épreuve cherche à mesurer', p:'Les tests ESSEC ne sont pas des exercices scolaires classiques. Ils évaluent la vitesse de raisonnement, la rigueur, la compréhension verbale, la capacité à décider sous contrainte et le potentiel managérial. Le piège principal est de vouloir tout terminer : il faut plutôt maximiser les bonnes réponses sans s’exposer aux pénalités.'},
      {h:'Règle d’or', p:'Ne bloque jamais plus de 45 à 70 secondes sur une question. Si le pattern n’apparaît pas rapidement, passe. Une réponse au hasard peut coûter des points : mieux vaut laisser blanc quand tu n’as aucune intuition.'},
      {h:'Méthode 3 passes', p:'Passe 1 : questions évidentes. Passe 2 : questions où tu as identifié un début de méthode. Passe 3 : questions longues uniquement s’il reste du temps. Cette stratégie colle à l’esprit des tests : rythme, précision, lucidité.'}
    ]},
    {id:'num', icon:'🔢', title:'Séries numériques', tag:'Raisonnement', sections:[
      {h:'Objectif', p:'Trouver la loi cachée qui relie les nombres. Les séries ESSEC mélangent souvent additions, soustractions, multiplications, alternances et suites entrelacées.'},
      {h:'Méthode rapide', p:'1) Regarde les différences. 2) Regarde les différences des différences. 3) Sépare les rangs impairs/pairs. 4) Teste ×2, ×3, ÷2, +/− constant. 5) Cherche une alternance du type +a, −b, +a, −b.'},
      {h:'Suites entrelacées', p:'Exemple : 48, 8, 35, 7, 24, ?. Il faut lire deux séries : 48→35→24 et 8→7→6. Réponse : 6.'},
      {h:'Signaux à repérer', p:'Si les nombres montent et descendent fortement, pense alternance. Si un nombre sur deux semble cohérent, sépare pairs/impairs. Si les écarts augmentent, regarde +1, +2, +3 ou ×2.'}
    ]},
    {id:'letters', icon:'🔤', title:'Séries de lettres', tag:'Raisonnement verbal', sections:[
      {h:'Principe', p:'Convertis les lettres en positions : A=1, B=2, C=3… Z=26. Puis cherche une suite, une alternance ou des initiales.'},
      {h:'Types fréquents', p:'Suites simples : A, C, E, G. Suites alternées : M, V, N, W, O, X. Groupes répétés : BCDZ, BCDY, BCDX. Initiales : U, D, T, Q… pour Un, Deux, Trois, Quatre.'},
      {h:'Méthode', p:'Écris les positions au brouillon mentalement. Regarde si chaque colonne évolue séparément. Dans les groupes de 3 ou 4 lettres, chaque position peut avoir sa propre logique.'}
    ]},
    {id:'quant', icon:'📐', title:'Raisonnement quantitatif', tag:'Calcul logique', sections:[
      {h:'Objectif', p:'Résoudre de petits problèmes mathématiques sans calculatrice. Ce ne sont pas des maths longues : ce sont des tests de traduction rapide et de logique.'},
      {h:'Thèmes essentiels', p:'Probabilités simples, proportions, travail à plusieurs, distance/vitesse/prix, intérêts, surfaces, suites géométriques, pièges de formulation.'},
      {h:'Réflexes', p:'Pour un travail à deux : les vitesses s’additionnent. Pour une probabilité indépendante : on multiplie. Pour un coût de trajet : distance / consommation × prix. Pour une surface : regarde le facteur multiplicatif.'},
      {h:'Pièges classiques', p:'Doubler le deuxième ne rend pas premier. Un nénuphar qui double chaque jour fait gagner un seul jour s’il y en a deux. Un dernier jour peut suffire dans les problèmes d’escargot.'}
    ]},
    {id:'deduct', icon:'🧠', title:'Raisonnement déductif', tag:'Logique', sections:[
      {h:'Base', p:'Tu dois distinguer ce qui est certain, faux ou indécidable. La tentation est d’ajouter des informations non données : ne le fais jamais.'},
      {h:'Implication', p:'A → B ne veut pas dire B → A. Exemple : tous les bruns aiment le chocolat ne signifie pas que tous ceux qui aiment le chocolat sont bruns.'},
      {h:'Contraposée', p:'A → B équivaut à non-B → non-A. Mais elle n’équivaut pas à B → A.'},
      {h:'Quantificateurs', p:'La négation de “tous les A sont B” est : “il existe au moins un A qui n’est pas B”. La négation de “certains A sont B” est : “aucun A n’est B”.'}
    ]},
    {id:'verbal', icon:'📖', title:'Vocabulaire & analogies', tag:'Tests verbaux', sections:[
      {h:'Synonymes / antonymes', p:'La bonne réponse est souvent le sens le plus précis, pas le mot vaguement proche. Il faut apprendre les mots rares et reconnaître leur registre.'},
      {h:'Analogies', p:'Cherche le rapport exact entre deux mots : outil/utilisateur, créateur/création, matière/action, contenant/limite, nuisance/victime, intensité, règle/violation.'},
      {h:'Méthode analogie', p:'Formule une phrase courte : “le boxeur utilise les gants”. Puis cherche la paire qui permet la même phrase : “le bactériologiste utilise le microscope”.'}
    ]},
    {id:'geo', icon:'◇', title:'Raisonnement géométrique', tag:'Visuel', sections:[
      {h:'Principe', p:'Observer une transformation entre figures : rotation, symétrie, ajout/suppression, déplacement, alternance noir/blanc, nombre d’éléments.'},
      {h:'Méthode', p:'Ne regarde pas tout à la fois. Choisis un seul élément et suis-le. Puis vérifie avec les autres. Si les formes changent, compte les côtés, les zones noires, les intersections.'},
      {h:'Dominos et grilles', p:'Les dominos demandent souvent une logique horizontale ou verticale : sommes, écarts, alternance haut/bas. Les matrices visuelles demandent souvent une règle par ligne ou colonne.'}
    ]},
    {id:'management', icon:'💼', title:'Compétences managériales', tag:'Situations', sections:[
      {h:'Ce qui est évalué', p:'Décider dans un cas concret : prioriser, communiquer, organiser, gérer une équipe, traiter un conflit, répondre à un mail ou arbitrer une stratégie.'},
      {h:'Réponse attendue', p:'Une bonne réponse est concrète, réaliste, mesurée, orientée action. Évite les réponses vagues ou morales. Il faut proposer une démarche praticable.'},
      {h:'Framework utile', p:'Diagnostic → objectif → action → justification → limite/risque. En situation de crise : sécuriser, informer, prioriser, déléguer, suivre.'}
    ]}
  ],
  questions: [
    {c:'num', d:1, q:'31, 38, 45, ?, 59, 66', o:['50','51','52','53'], a:2, e:'La suite augmente de 7 : 31, 38, 45, 52, 59, 66.'},
    {c:'num', d:1, q:'22, 27, 26, 31, 29, ?, 31, 36', o:['32','33','34','35'], a:2, e:'Alternance +5, -1, +5, -2, +5, -3 : 29 + 5 = 34.'},
    {c:'num', d:2, q:'48, 8, 35, 7, 24, ?', o:['5','6','17','19'], a:1, e:'Deux suites : 48→35→24 et 8→7→6.'},
    {c:'num', d:1, q:'3, 30, 6, 60, 9, 90, ?', o:['10','11','12','120'], a:2, e:'Deux suites : 3,6,9,12 et 30,60,90.'},
    {c:'num', d:2, q:'6, 8, 12, 20, ?', o:['28','32','36','40'], a:2, e:'Écarts 2,4,8 puis 16. Donc 20+16=36.'},
    {c:'num', d:2, q:'90, 80, 71, 63, 56, ?', o:['48','49','50','52'], a:2, e:'On soustrait 10,9,8,7 puis 6 : 56-6=50.'},
    {c:'num', d:2, q:'7, 13, 24, 45, ?', o:['72','82','86','90'], a:2, e:'×2−1, ×2−2, ×2−3, puis ×2−4 : 86.'},
    {c:'num', d:1, q:'22, 33, 44, 55, 66, ?', o:['72','77','88','99'], a:1, e:'Suite de raison +11 : 77.'},
    {c:'num', d:2, q:'5, 10, 25, 50, 125, 250, ?', o:['500','625','750','1000'], a:1, e:'Alternance ×2 puis ×2,5. 250×2,5=625.'},
    {c:'num', d:2, q:'81, 1, 75, 3, 69, 5, ?', o:['61','63','65','67'], a:1, e:'Deux suites : 81,75,69,63 et 1,3,5.'},
    {c:'letters', d:1, q:'U - D - T - Q - C - S - S - H - ?', o:['D','N','O','T'], a:1, e:'Initiales de Un, Deux, Trois, Quatre, Cinq, Six, Sept, Huit, Neuf.'},
    {c:'letters', d:1, q:'B C D Z / B C D Y / B C D ?', o:['W','X','Y','Z'], a:1, e:'BCD reste fixe, la dernière lettre descend : Z, Y, X.'},
    {c:'letters', d:2, q:'M V N W O X P Y Q ?', o:['R','Z','S','T'], a:1, e:'Deux suites alternées : M,N,O,P,Q et V,W,X,Y,Z.'},
    {c:'letters', d:2, q:'A D H K O ?', o:['Q','R','S','T'], a:2, e:'Écarts +3,+4,+3,+4. O + 4 = S.'},
    {c:'letters', d:2, q:'B D G K ?', o:['M','N','O','P'], a:3, e:'Écarts +2,+3,+4 puis +5 : K→P.'},
    {c:'letters', d:2, q:'I E A / J F B / K ? ?', o:['G C','H C','G D','H D'], a:0, e:'Chaque colonne avance de 1 : I,J,K ; E,F,G ; A,B,C.'},
    {c:'letters', d:2, q:'A E I B F ? ? ?', o:['J C G','K C G','J D H','K D H'], a:0, e:'Colonnes : A,B,C ; E,F,G ; I,J. On complète J C G.'},
    {c:'letters', d:2, q:'O L P / Q L R / S T L / ?', o:['U V W','U V L','V W L','U W L'], a:1, e:'Suite de lettres avec L récurrent : après S T L viennent U V L.'},
    {c:'quant', d:1, q:'Un nénuphar double chaque jour et couvre un étang en 100 jours. Deux nénuphars couvrent l’étang en :', o:['50 jours','75 jours','99 jours','100 jours'], a:2, e:'Deux nénuphars donnent un jour d’avance : 99 jours.'},
    {c:'quant', d:1, q:'Vous doublez le 2e dans une course. Vous êtes :', o:['1er','2e','3e','4e'], a:1, e:'Tu prends la place du 2e, donc tu es 2e.'},
    {c:'quant', d:1, q:'Une boîte contient 4 rouges et 3 blanches, une autre 5 rouges et 2 blanches. Probabilité de tirer deux blanches ?', o:['6/49','5/49','5/14','6/7'], a:0, e:'3/7 × 2/7 = 6/49.'},
    {c:'quant', d:2, q:'A fait un travail en X heures, B en Y heures. Ensemble en K heures, ils font :', o:['K(X+Y)/XY','XY/K','X+Y/K','KXY/(X+Y)'], a:0, e:'Leur vitesse commune est 1/X + 1/Y = (X+Y)/XY. En K heures : K(X+Y)/XY.'},
    {c:'quant', d:1, q:'La somme 1 + 1/2 + 1/4 + 1/8 + ... vaut :', o:['1,5','2','2,5','3'], a:1, e:'Suite géométrique de raison 1/2 : somme = 1/(1-1/2)=2.'},
    {c:'quant', d:1, q:'Si la base d’un triangle est ×4 et la hauteur ÷2, la surface est :', o:['divisée par 2','inchangée','multipliée par 2','multipliée par 4'], a:2, e:'Aire = 1/2 bh. Facteur total : 4 × 1/2 = 2.'},
    {c:'quant', d:2, q:'Un trajet fait X km. La voiture fait Y km/L. Essence : t €/L. Coût ?', o:['tXY','tX/Y','X/tY','XY/t'], a:1, e:'Litres consommés : X/Y. Coût : tX/Y.'},
    {c:'quant', d:2, q:'Une somme d’un nombre à 2 chiffres et d’un nombre à 3 chiffres donne un nombre à 4 chiffres. On peut conclure que :', o:['le premier chiffre est 1','le nombre à 2 chiffres commence par 9','les deux commencent par ≥5','erreur'], a:0, e:'Maximum 99+999=1098 : le nombre à 4 chiffres commence forcément par 1.'},
    {c:'deduct', d:1, q:'Tous les bruns aiment le chocolat. Tous les enfants aiment les bonbons. Alain est brun. Conclusion :', o:['Alain aime chocolat et bonbons','Alain n’aime pas les bonbons','Alain est blond','On ne sait pas'], a:0, e:'Brun → chocolat ; enfant → bonbons. La conclusion correcte est les deux.'},
    {c:'deduct', d:1, q:'Il est faux que toutes les personnes grandes sont maigres. Équivalent :', o:['Toutes les grandes sont maigres','Aucune grande n’est maigre','Il existe une grande non maigre','Il existe une petite maigre'], a:2, e:'Négation de “tous A sont B” = “au moins un A n’est pas B”.'},
    {c:'deduct', d:2, q:'Si je peux dire rouge, alors j’ai trouvé bleu. Forme équivalente de “si pas bleu, alors pas rouge” ?', o:['rouge → bleu','bleu → rouge','pas rouge → pas bleu','rouge → pas bleu'], a:0, e:'C’est la contraposée : non bleu → non rouge équivaut à rouge → bleu.'},
    {c:'deduct', d:2, q:'Tous les curieux sont avides. Certains gourmands sont curieux. Conclusion certaine :', o:['Certains gourmands sont avides','Tous les gourmands sont avides','Aucun curieux n’est gourmand','Tous les avides sont gourmands'], a:0, e:'Les gourmands qui sont curieux sont aussi avides.'},
    {c:'deduct', d:2, q:'Si rouge → carré et carré → grand. Pierre est rouge. Conclusion :', o:['Pierre est carré seulement','Pierre est grand seulement','Pierre est carré et grand','Rien'], a:2, e:'Chaîne logique : rouge → carré → grand.'},
    {c:'deduct', d:2, q:'Anne fait plus de km que Kim. Fabrice fait plus qu’Anne. Qui fait le moins ?', o:['Anne','Fabrice','Kim','Impossible'], a:2, e:'Fabrice > Anne > Kim.'},
    {c:'verbal', d:1, q:'PROHIBER signifie :', o:['interdire','montrer','cacher','bloquer'], a:0, e:'Prohiber = interdire officiellement.'},
    {c:'verbal', d:1, q:'JADIS signifie :', o:['parfois','récemment','autrefois','souvent'], a:2, e:'Jadis = autrefois.'},
    {c:'verbal', d:1, q:'LUBIE signifie :', o:['charme','caprice','illusion','vision'], a:1, e:'Une lubie est une idée fantaisiste, un caprice.'},
    {c:'verbal', d:2, q:'INTERPOLER signifie :', o:['inverser','intercaler','transgresser','interpeller'], a:1, e:'Interpoler = insérer/intercaler.'},
    {c:'verbal', d:2, q:'CONSOMPTION signifie :', o:['péché','ennui','difficulté','dépérissement'], a:3, e:'Consomption = dépérissement progressif.'},
    {c:'verbal', d:2, q:'MITE est à VÊTEMENT comme :', o:['œuf à larve','tailleur à robe','trou à réparation','calomnie à réputation'], a:3, e:'La mite abîme le vêtement ; la calomnie abîme la réputation.'},
    {c:'verbal', d:2, q:'BOXEUR est à GANTS comme :', o:['nageur à eau','librairie à vitrine','homme d’affaires à honoraires','bactériologiste à microscope'], a:3, e:'Rapport utilisateur/outil.'},
    {c:'verbal', d:2, q:'ÉTAT est à FRONTIÈRE comme :', o:['nation à état','drapeau à loyauté','planète à satellite','propriété à clôture'], a:3, e:'La frontière délimite l’État ; la clôture délimite la propriété.'},
    {c:'geo', d:1, q:'Dans une série géométrique, le premier réflexe est de regarder :', o:['la couleur seulement','le nombre, la position et la rotation','la taille du texte','la longueur de l’énoncé'], a:1, e:'Les règles visuelles portent souvent sur nombre, position, orientation, couleur.'},
    {c:'geo', d:1, q:'Dans une matrice 3×3, la règle se cherche souvent :', o:['par ligne ou colonne','uniquement en diagonale','au hasard','sur le titre'], a:0, e:'Les matrices visuelles utilisent généralement une règle par ligne ou colonne.'},
    {c:'geo', d:2, q:'Si une flèche tourne de 90° à chaque étape, après ↑ puis → puis ↓ vient :', o:['↑','→','←','↓'], a:2, e:'Rotation horaire : haut, droite, bas, gauche.'},
    {c:'geo', d:2, q:'Si une forme noire se déplace d’une case vers la droite à chaque étape, la bonne stratégie est :', o:['suivre cette forme seulement','compter les mots','ignorer la position','répondre vite'], a:0, e:'En visuel, isole un élément puis suis sa trajectoire.'},
    {c:'management', d:1, q:'Un partenaire propose une campagne risquée après un échec précédent. Première réaction managériale ?', o:['Accepter immédiatement','Refuser sans discuter','Clarifier objectif, public, risque et test pilote','Laisser l’équipe décider seule'], a:2, e:'Bonne décision : cadrer, tester, réduire le risque.'},
    {c:'management', d:2, q:'Deux bénévoles se disputent sur la stratégie de communication. Que faire ?', o:['Trancher sans écouter','Organiser un court échange avec critères objectifs','Ignorer','Annuler le projet'], a:1, e:'Un bon manager écoute puis arbitre avec des critères.'},
    {c:'management', d:2, q:'Une urgence bouleverse un planning événementiel. Priorité ?', o:['Poster sur Instagram','Sécuriser les personnes et redistribuer les tâches critiques','Chercher un nouveau logo','Reporter sans analyser'], a:1, e:'En crise : sécurité, priorités, délégation, communication.'},
    {c:'management', d:1, q:'Une réponse managériale courte doit surtout être :', o:['vague et prudente','concrète, réaliste, justifiée','très longue','humoristique'], a:1, e:'L’ESSEC évalue la décision praticable et argumentée.'},
    {c:'management', d:2, q:'Pour récolter des fonds efficacement, la meilleure démarche est :', o:['envoyer un mail générique','cibler des partenaires alignés et proposer une contrepartie claire','attendre les dons','changer de sujet'], a:1, e:'Fundraising = ciblage, proposition de valeur, crédibilité.'}
  ]
};
