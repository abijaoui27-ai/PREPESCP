window.ESSEC_SPATIAL = {
  courses: [
    {
      id: 'symboles', icon: '🔣', title: 'Séries et symboles', subtitle: 'Suite de base, rangs et boucles',
      parts: [
        ['Principe', 'Une série de symboles fonctionne comme un alphabet artificiel. Il faut repérer la position de chaque symbole dans une série de base, puis appliquer une progression : +1, +2, +3, alternance, rangs pairs/impairs, ou boucle.'],
        ['Méthode', 'Remplace immédiatement les symboles par des numéros. Si la base contient 9 symboles, note-les 1 à 9. Une fois la conversion faite, le problème devient une série numérique classique.'],
        ['Pièges', 'La série peut se répéter après le dernier symbole. Certains symboles sont très proches. Il faut aussi tester la lecture verticale, diagonale, ou en rangs pairs/impairs.']
      ],
      example: 'Base A B C D E F G H I. Suite A C E G ? → progression +2, réponse I. Suite B D F H ? → après H, on boucle, réponse A.'
    },
    {
      id: 'graphiques', icon: '◩', title: 'Séries graphiques', subtitle: 'Déplacements et transformations',
      parts: [
        ['Principe', 'Une série graphique demande d’isoler chaque élément : rond, carré, trait, lettre, couleur, nombre. Pour chaque élément, on demande : se déplace-t-il ? se transforme-t-il ? ou les deux ?'],
        ['Méthode', 'Suis un seul élément à la fois. Note sa position, sa couleur, sa taille, son orientation. Ensuite seulement, vérifie si les autres éléments suivent la même logique ou une logique opposée.'],
        ['Pièges', 'Effet passe-muraille : l’élément sort d’un côté et revient de l’autre. Effet ping-pong : il repart en sens inverse à l’extrémité. Effet masque : deux éléments se superposent.']
      ],
      example: 'Un rond blanc tourne antihoraire, un rond noir horaire, une étoile reste fixe. Si les deux ronds arrivent au même endroit, il peut y avoir un effet masque.'
    },
    {
      id: 'intrus', icon: '☒', title: 'Intrus graphiques', subtitle: 'Ensembles et critère commun',
      parts: [
        ['Principe', 'Un intrus graphique se résout en cherchant la règle commune à quatre figures. La bonne règle doit être objective : nombre de côtés, intersections, orientation, position, couleur liée à la forme.'],
        ['Méthode', 'Teste dans l’ordre : dénombrement, position, orientation, relation entre éléments, symétrie, puis rotation. Ne te fie pas à une impression visuelle.'],
        ['Pièges', 'Une figure peut respecter plusieurs critères et échouer sur un seul. Les critères trop subjectifs comme “plus jolie” ou “plus ouverte” sont à éliminer.']
      ],
      example: 'Quatre figures ont 4 côtés et une seule en a 3 : l’intrus est celle à 3 côtés. Autre cas : toutes ont 5 intersections sauf une.'
    },
    {
      id: 'rotations', icon: '⟳', title: 'Rotations et symétries', subtitle: 'Manipulation mentale rapide',
      parts: [
        ['Principe', 'Les rotations classiques sont 45°, 90°, 180° et 270°. Une rotation 90° horaire équivaut à 270° antihoraire. Une rotation 180° ne dépend pas du sens.'],
        ['Méthode', 'Choisis un repère dans la figure : une pointe, une lettre, un angle noir. Suis uniquement ce repère après chaque transformation.'],
        ['Pièges', 'Rotation et symétrie ne sont pas interchangeables. SV + SH équivaut à une rotation 180°, mais une symétrie placée entre deux rotations peut empêcher une simplification directe.']
      ],
      example: 'SV + SH = rotation 180°. Mais RH90 puis SV puis RAH90 ne s’annule pas automatiquement.'
    },
    {
      id: 'patrons', icon: '⬚', title: 'Patrons, cubes et volumes', subtitle: 'Pliage mental',
      parts: [
        ['Principe', 'Pour les patrons de cubes, il faut partir du patron, choisir une face de référence, puis replier mentalement. Il faut éviter de déplier le cube car plusieurs patrons sont possibles.'],
        ['Méthode', 'Deux faces collées dans le patron sont voisines. Deux faces séparées par une case dans une ligne peuvent être opposées. Vérifie l’orientation des lettres ou symboles.'],
        ['Pièges', 'Une proposition peut avoir les bonnes faces mais une mauvaise orientation. Les lettres et flèches sont très utiles pour éliminer vite.']
      ],
      example: 'Si D et F ne sont pas contigus dans le patron, tout cube qui montre D et F côte à côte est éliminé.'
    },
    {
      id: 'cubes', icon: '▦', title: 'Empilements de cubes', subtitle: 'Comptage et rotations 3D',
      parts: [
        ['Principe', 'Pour compter un empilement, la méthode la plus fiable est de compter par colonnes et hauteurs. La perspective visuelle seule induit souvent en erreur.'],
        ['Méthode', 'Dessine mentalement une grille au sol et note la hauteur de chaque pile. Pour compléter un grand cube, calcule n³ puis retire les cubes déjà présents.'],
        ['Pièges', 'Les cubes cachés existent parfois. Pour les faces communes, seuls les contacts par face comptent, pas les contacts par arête ou sommet.']
      ],
      example: 'Grand cube 3×3×3 = 27 cubes. Si l’assemblage initial contient 7 cubes, il faut 20 cubes pour compléter.'
    }
  ],
  exercises: [
    ['symboles','facile','Base A B C D E F G H I. Quelle suite complète : A C E G ?',['H','I','A','F'],1,'Progression de +2 rangs dans la base.'],
    ['symboles','facile','Base A B C D E F G H I. Quelle suite complète : B D F H ?',['A','B','I','C'],0,'Après H, la base recommence : +2 donne A.'],
    ['symboles','standard','Base A B C D E F G H I. Suite : A B D G B G ?',['A','B','C','I'],1,'Progression +1,+2,+3,+4,+5 avec boucle.'],
    ['symboles','standard','Une suite de symboles donne les positions 1,2,3,5,8,?. Quelle position suit ?',['10','11','13','16'],2,'Suite de Fibonacci : 3+5=8 puis 5+8=13.'],
    ['symboles','concours','Dans une série de 8 symboles répétée, on observe H A B C D E F G. Quel est le principe ?',['ordre normal commençant à H','ordre inversé','alternance +2','intrus'],0,'La série de base est lue en boucle en commençant par H.'],
    ['graphiques','facile','Dans une grille, un carré noir se déplace d’une case vers la droite à chaque étape. Il sort par la droite. Que peut-il faire dans une logique passe-muraille ?',['disparaître','revenir à gauche','changer de couleur','rester fixe'],1,'Effet passe-muraille : il réapparaît du côté opposé.'],
    ['graphiques','facile','Un rond arrive à l’extrémité puis repart en sens inverse. C’est un effet :',['masque','ping-pong','miroir','cube'],1,'L’effet ping-pong correspond au changement de sens à l’extrémité.'],
    ['graphiques','standard','Un rond blanc avance antihoraire, un rond noir horaire. Ils arrivent sur la même position. Que peut-on observer ?',['effet masque','division','opposition','permutation impossible'],0,'Deux éléments superposés peuvent donner un effet masque.'],
    ['graphiques','standard','Une série contient triangle, carré, pentagone. La forme suivante attendue est :',['triangle','hexagone','heptagone','cercle'],1,'Le nombre de côtés augmente de 1 : 3,4,5,6.'],
    ['graphiques','concours','Une figure contient a,d,g et des ronds blancs qui diminuent de 1 tandis que les noirs augmentent de 1. La prochaine lettre est :',['h','i','j','k'],2,'Suite alphabétique +3 : a,d,g,j.'],
    ['intrus','facile','Quel critère tester en premier dans un intrus graphique ?',['couleur uniquement','dénombrement objectif','goût esthétique','taille approximative'],1,'Le dénombrement est souvent le critère le plus fiable.'],
    ['intrus','facile','Quatre figures ont 4 côtés et une figure en a 3. L’intrus est :',['celle à 3 côtés','une figure blanche','la plus grande','la première'],0,'La caractéristique commune est le nombre de côtés.'],
    ['intrus','standard','Quatre figures ont 5 intersections et une seule en a 4. Quel critère donne l’intrus ?',['nombre d’intersections','couleur','rotation','symétrie'],0,'Les intersections sont un critère fréquent.'],
    ['intrus','standard','Si quatre figures sont obtenues par rotation d’une figure A, l’intrus est :',['celle non superposable par rotation','celle tournée à 90°','celle à 180°','celle à 270°'],0,'L’intrus est la seule qui ne se superpose pas par rotation.'],
    ['rotations','facile','Une rotation de 90° horaire équivaut à :',['90° antihoraire','180°','270° antihoraire','45° horaire'],2,'90° horaire = 270° antihoraire.'],
    ['rotations','facile','Une symétrie verticale agit comme :',['un miroir gauche-droite','un reflet dans l’eau','une rotation de 90°','un zoom'],0,'La symétrie verticale est un miroir gauche-droite.'],
    ['rotations','standard','SV suivie de SH équivaut à :',['rotation 90°','rotation 180°','aucun changement','symétrie verticale'],1,'Symétrie verticale + horizontale = rotation 180°.'],
    ['rotations','standard','Après une rotation de 90°, une structure verticale devient :',['verticale','horizontale','invisible','plus grande'],1,'90° transforme vertical en horizontal.'],
    ['patrons','facile','Dans un patron de cube, deux faces séparées par une case en ligne droite deviennent :',['contiguës','opposées','identiques','invisibles'],1,'Elles sont opposées sur le cube.'],
    ['patrons','facile','La meilleure stratégie face à un patron est de :',['déplier le cube','choisir une face repère et plier mentalement','répondre au hasard','compter les lettres'],1,'On part du patron, pas du cube.'],
    ['patrons','standard','Deux faces consécutives sur un patron de cube sont :',['opposées','contiguës','toujours invisibles','identiques'],1,'Deux cases adjacentes du patron deviennent faces voisines.'],
    ['patrons','standard','Dans les patrons avec lettres, il faut surtout vérifier :',['l’orientation des lettres','la couleur du fond','le nombre de voyelles','la taille du cube'],0,'L’orientation est souvent le piège.'],
    ['cubes','facile','Pour compter un empilement, la méthode la plus sûre est :',['par couleur','par colonnes','au hasard','par perspective'],1,'Compter colonne par colonne réduit les erreurs.'],
    ['cubes','facile','Un grand cube 3×3×3 contient :',['9','18','27','30'],2,'3×3×3 = 27.'],
    ['cubes','standard','Un assemblage contient 7 cubes et doit devenir un cube 3×3×3. Cubes à ajouter ?',['18','19','20','21'],2,'27−7 = 20.'],
    ['cubes','standard','Pour compter les faces communes, il faut considérer :',['les contacts par face uniquement','les contacts par sommet','les ombres','les couleurs'],0,'Seules les faces collées comptent.']
  ],
  memos: [
    { title:'Alphabet A=1', rows:[['A','1'],['B','2'],['C','3'],['D','4'],['E','5'],['F','6'],['G','7'],['H','8'],['I','9'],['J','10'],['K','11'],['L','12'],['M','13'],['N','14'],['O','15'],['P','16'],['Q','17'],['R','18'],['S','19'],['T','20'],['U','21'],['V','22'],['W','23'],['X','24'],['Y','25'],['Z','26']] },
    { title:'Carrés jusqu’à 25', rows:[[1,1],[2,4],[3,9],[4,16],[5,25],[6,36],[7,49],[8,64],[9,81],[10,100],[11,121],[12,144],[13,169],[14,196],[15,225],[16,256],[17,289],[18,324],[19,361],[20,400],[21,441],[22,484],[23,529],[24,576],[25,625]] },
    { title:'Cubes jusqu’à 15', rows:[[1,1],[2,8],[3,27],[4,64],[5,125],[6,216],[7,343],[8,512],[9,729],[10,1000],[11,1331],[12,1728],[13,2197],[14,2744],[15,3375]] },
    { title:'Rotations rapides', rows:[['90° H','270° AH'],['90° AH','270° H'],['180°','sens indifférent'],['SV + SH','R180'],['vertical après R90','horizontal'],['horizontal après R90','vertical']] }
  ],
  pdfs: ['Séries symboles — facile','Séries graphiques — standard','Rotations & symétries — concours','Patrons de cubes — standard','Intrus graphiques — concours','Empilements de cubes — facile']
};
