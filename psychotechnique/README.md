# Psychotechnique ESSEC — Export

Ce dossier sert à isoler toute la partie **tests psychotechniques ESSEC** pour pouvoir la transférer ensuite dans un autre dépôt GitHub.

## Structure conseillée pour le futur dépôt

- `index.html` : page d’accueil de l’espace psychotechnique
- `quantitatif/` : séries de nombres, lettres, codes, mastermind, conditions minimales, pourcentages, vitesse, géométrie
- `verbal/` : synonymes, analogies, vocabulaire, compréhension, logique verbale
- `visuel/` : séries graphiques, matrices, rotations, symétries, cubes, opérateurs
- `manifest.json` : liste propre des fichiers à migrer

## Fichiers sources actuellement utilisés dans le repo

### Racine psycho
- `essec-psycho.html`

### Quantitatif
- `essec-series-nombres.html`
- `essec-series-nombres-td1.html`
- `essec-series-nombres-td2.html`
- `essec-series-nombres-td3.html`
- `essec-series-lettres.html`
- `essec-series-lettres-td1.html`
- `essec-series-lettres-td2.html`
- `essec-series-lettres-td3.html`
- `essec-mastermind-bp-mp.html`
- `essec-mastermind-bp-mp-td1.html`
- `essec-mastermind-bp-mp-td2.html`
- `essec-conditions-minimales.html`
- `essec-conditions-minimales-td1.html`
- `essec-conditions-minimales-td2.html`
- `essec-pourcentages-vitesse-geometrie.html`
- `essec-pourcentages-vitesse-geometrie-td1.html`
- `essec-pourcentages-vitesse-geometrie-td2.html`

### Visuel
- `essec-series-graphiques-matrices.html`
- `essec-series-graphiques-matrices-td1.html`
- `essec-series-graphiques-matrices-td2.html` — à créer
- chapitre 7 rotations/symétries/cubes — à créer
- chapitre 8 logique visuelle avancée — à créer

### Verbal
- `essec-verbal-synonymes-antonymes.html`
- `essec-verbal-synonymes-antonymes-td1.html`
- `essec-verbal-synonymes-antonymes-td2.html`
- `essec-verbal-analogies.html`
- `essec-verbal-analogies-td1.html`
- `essec-verbal-analogies-td2.html`
- `essec-verbal-vocabulaire-culture.html`
- `essec-verbal-vocabulaire-culture-td1.html`
- `essec-verbal-vocabulaire-culture-td2.html`
- `essec-verbal-comprehension.html`
- `essec-verbal-comprehension-td1.html`
- `essec-verbal-expression-logique.html`
- `essec-verbal-expression-logique-td1.html`
- `essec-verbal-expression-logique-td2.html`

## Note importante

Pour ne pas casser le site actuel, les fichiers racine ne sont pas déplacés. Le dossier `psychotechnique/` est le point de préparation pour l’export. Les prochaines étapes consistent à copier physiquement les fichiers dans les sous-dossiers puis à transformer les liens absolus `/fichier.html` en liens relatifs `./...`.