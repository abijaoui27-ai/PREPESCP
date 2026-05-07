window.PREPORAL_DASHBOARD = {
  appName: 'PrepOral',
  adminEmail: 'abijaoui@icloud.com',
  rechargeEmail: 'abijaoui27@gmail.com',
  schools: {
    escp: {
      id: 'escp',
      label: 'ESCP',
      agent: 'Jean-Marc Delaunay',
      colorClass: 'escp',
      launchUrl: '/entretien',
      launchLabel: '🎙️ Lancer un entretien ESCP',
      historyTitle: 'Historique ESCP',
      feedbackAgent: 'Jean-Marc Delaunay'
    },
    emlyon: {
      id: 'emlyon',
      label: 'EM Lyon',
      agent: 'Sophie Marchand',
      colorClass: 'emlyon',
      launchUrl: '/entretien-emlyon',
      launchLabel: '🃏 Lancer un entretien EM Lyon',
      historyTitle: 'Historique EM Lyon',
      feedbackAgent: 'Sophie Marchand'
    },
    essec: {
      id: 'essec',
      label: 'ESSEC',
      agent: 'Oral & psychotechnique',
      colorClass: 'essec',
      launchUrl: '/essec-spatial',
      launchLabel: 'Ouvrir l’espace ESSEC →',
      title: 'Oral ESSEC + tests psychotechniques',
      description: 'Accède à la page ESSEC dédiée : oral, cours, entraînements par thème, mini-fiches et futurs tests chronométrés.',
      stats: [
        ['30\'', 'Oral ESSEC'],
        ['15\'', 'Mini test'],
        ['8+', 'Chapitres']
      ]
    }
  },
  questionnaireFields: [
    ['centres_interet', '1. Centres d’intérêt & activités extrascolaires', 'Précis : depuis combien de temps, fréquence, exemples concrets.'],
    ['fierte', '2. Réalisation dont vous êtes fier(e)', 'Succès ou échec — ce que vous en avez appris.'],
    ['experience_travail', '3. Expérience du monde du travail', 'Stages, jobs, rencontres. Précisez lieu et durée.'],
    ['experience_cultures', '4. Expériences de différentes cultures', 'Voyages, lectures, rencontres, expositions…'],
    ['experience_marquante', '5. Une expérience marquante', 'Ce qu’elle vous a appris sur vous-même.'],
    ['autres_infos', '6. Autres informations pour le jury', 'Tout ce que vous jugez utile.']
  ]
};
