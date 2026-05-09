# CNCDril - Optimisateur de Perçage pour CNC

Optimiseur de fichiers de perçage multiplateforme pour convertir les fichiers .drl P-CAD/Altium en G-Code optimisé pour les machines CNC.

## Fonctionnalités

- **Plusieurs Plateformes** : Delphi VCL, Python CLI/GUI, Node.js CLI, version Web et version HTML autonome
- **Algorithmes d'Optimisation** :
  - SortByX : Trier les trous par coordonnée X
  - SortByY : Trier les trous par coordonnée Y
  - SortByPath (OPTICS) : Optimisation basée sur la distance
- **Visualisation** : Aperçu interactif du chemin de perçage avec animation
- **Multilingue** : Support pour 6 langues (EN, RU, UK, PT, DE, FR)
- **Multiplateforme** : Windows, Linux, macOS et navigateurs web

## Versions

### Version Delphi (Originale)
- **Emplacement** : `delphi/`
- **Configuration requise** : Delphi 6.0 ou supérieur
- **Fonctionnalités** : Application de bureau VCL complète
- **Utilisation** : Ouvrir `CNCDril.dpr` dans l'IDE Delphi et compiler

### Version Python
- **Emplacement** : `python/`
- **Configuration requise** : Python 3.7+, matplotlib, numpy
- **Fonctionnalités** : Interfaces CLI et GUI
- **Tests** : `python/test_cncdril.py` (13 tests)
- **Installation** : Voir `python/README.md`

### Version Node.js
- **Emplacement** : `nodejs/`
- **Configuration requise** : Node.js 14+ (zéro dépendance)
- **Fonctionnalités** : CLI avec 6 langues, mêmes algorithmes que toutes les autres versions
- **Tests** : `nodejs/test/test.mjs` (13 tests)
- **Utilisation** : `node cncdril.mjs input.drl -o output.nc`

### Version Web
- **Emplacement** : `web/`
- **Configuration requise** : Navigateur web moderne (pas de serveur nécessaire)
- **Fonctionnalités** : Glisser-déposer, visualisation interactive, multilingue
- **Tests** : `web/test/test.mjs` (10 tests)
- **Utilisation** : Ouvrir `web/index.html` dans le navigateur

### Version HTML Autonome
- **Emplacement** : `standalone/cncdril.html`
- **Configuration requise** : Navigateur web moderne uniquement -- pas de serveur, pas d'installation
- **Fonctionnalités** : Fichier HTML unique et autonome avec tout le CSS et JavaScript intégrés
- **Utilisation** : Ouvrir `standalone/cncdril.html` directement dans n'importe quel navigateur (fonctionne via le protocole file://)
- **Mêmes fonctionnalités** que la version web : analyse DRL, 3 algorithmes d'optimisation, génération de G-Code, visualisation interactive sur canvas, 6 langues

## Démarrage Rapide

### Version Delphi
1. Ouvrir `delphi/CNCDril.dpr` dans l'IDE Delphi
2. Compiler et exécuter
3. Charger le fichier .drl et générer le G-Code

### Version Python
```bash
cd python
pip install -r requirements.txt
python cncdrill.py ../examples/RPCB0827_FIXTURE.DRL -o output.nc
```

### Version Node.js
```bash
cd nodejs
node cncdril.mjs ../examples/RPCB0827_FIXTURE.DRL -o output.nc

# Avec langue
node cncdril.mjs ../examples/RPCB0827_FIXTURE.DRL --language fr -o output.nc
```

### Version Web
```bash
cd web
python -m http.server 8000
# Naviguer vers http://localhost:8000
```

### Version HTML Autonome
Ouvrir `standalone/cncdril.html` dans n'importe quel navigateur web moderne. Aucun serveur requis.

## Tests

### Exécuter tous les tests
```bash
# Tests CLI Node.js (13 tests)
node nodejs/test/test.mjs

# Tests des modules JS Web (10 tests)
node web/test/test.mjs

# Tests Python (13 tests)
cd python && python -m unittest test_cncdril -v
```

### Couverture des tests
| Variante | Tests | Couverture |
|----------|-------|------------|
| CLI Node.js | 13 | Aide, version, analyse, génération G-Code, les 6 langues, gestion des erreurs |
| Modules JS Web | 10 | Point, Tool, DRLParser, les 3 algorithmes d'optimisation |
| Python | 13 | Analyseur, diamètres d'outils, SortByX/Y, OPTICS, génération G-Code, sortie fichier |

## Format de Fichier

### Entrée (.drl)
Fichiers de perçage P-CAD/Altium avec :
- Définitions d'outils (T01C1.73)
- Données de coordonnées (X+005004Y+017894)
- Unités métriques et impériales
- Plusieurs outils par fichier

### Sortie (.nc)
G-Code CNC standard :
- Commandes de changement d'outil (T1 M6)
- Mouvements de hauteur sûre (G0 Z5.0)
- Opérations de perçage (G1 Z-2.0)
- Compatible avec la plupart des contrôleurs CNC

## Exemple

Le répertoire `examples/` contient `RPCB0827_FIXTURE.DRL` :
- 7 outils (Ø1.73mm à Ø10.16mm)
- 102 trous au total
- Unités métriques

## Optimisation

L'algorithme OPTICS (Ordering Points To Identify the Clustering Structure) minimise la distance de déplacement de l'outil :
1. Trouve le trou non visité le plus proche
2. Se déplace vers ce trou
3. Répète jusqu'à ce que tous les trous soient visités

Cela réduit généralement la distance totale de déplacement de 30 à 50 % par rapport aux chemins non triés.

## Multilingue

Toutes les versions supportent :
- Anglais (EN)
- Russe (RU)
- Ukrainien (UK)
- Portugais (PT)
- Allemand (DE)
- Français (FR)

La langue par défaut est l'anglais dans toutes les versions.

## Structure du Dépôt

```
CNCDril/
├── README.md              # Ce fichier (Anglais)
├── README.RU.md           # Documentation en russe
├── README.UA.md           # Documentation en ukrainien
├── README.PT.md           # Documentation en portugais
├── README.DE.md           # Documentation en allemand
├── README.FR.md           # Documentation en français
├── .gitignore            # Règles d'exclusion Git
├── LICENSE               # Licence MIT
│
├── delphi/               # Application Delphi originale
│   ├── CNCDril.dpr      # Fichier projet
│   ├── CNCDril_r01.pas  # Source principal
│   ├── CNCDril_r01.dfm  # Définition de la fiche
│   ├── CNCDril.res      # Ressources
│   └── README.md        # Documentation Delphi
│
├── python/              # Implémentation Python
│   ├── cncdrill.py     # Application CLI
│   ├── cncdrill_gui.py # Application GUI
│   ├── test_cncdril.py # Suite de tests (13 tests)
│   ├── requirements.txt # Dépendances
│   └── README.md       # Documentation Python
│
├── nodejs/              # Implémentation CLI Node.js
│   ├── cncdril.mjs     # Application CLI
│   ├── package.json    # Configuration du paquet
│   ├── test/
│   │   └── test.mjs   # Suite de tests (13 tests)
│   └── README.md       # Documentation Node.js
│
├── web/                 # Application Web (multi-fichiers)
│   ├── index.html      # Interface principale
│   ├── styles.css      # Styles
│   ├── locales.js      # Traductions
│   ├── parser.js       # Analyseur DRL
│   ├── optimizer.js    # Algorithmes d'optimisation
│   ├── gcode-generator.js # Génération G-Code
│   ├── ui.js           # Visualisation sur canvas
│   ├── cncdrill.js     # Application principale
│   ├── test/
│   │   └── test.mjs   # Suite de tests (10 tests)
│   └── README.md       # Documentation Web
│
├── standalone/          # HTML autonome en un seul fichier
│   └── cncdril.html    # Autonome (pas de serveur nécessaire)
│
└── examples/            # Fichiers d'exemple
    └── RPCB0827_FIXTURE.DRL
```

## Comparaison des Versions

| Fonctionnalité | Delphi | Python | Node.js | Web | HTML Autonome |
|----------------|--------|--------|---------|-----|---------------|
| Interface de bureau | Oui | Oui | Non | Non | Non |
| Ligne de commande | Non | Oui | Oui | Non | Non |
| Interface Web | Non | Non | Non | Oui | Oui |
| Visualisation | Oui | Oui | Non | Oui | Oui |
| Utilisation hors ligne | Oui | Oui | Oui | Oui | Oui |
| Multiplateforme | Windows | Oui | Oui | Oui | Oui |
| Installation | Requise | Requise | Node.js | Aucune | Aucune |
| Serveur nécessaire | Non | Non | Non | Optionnel | Non |
| Fichier unique | Non | Non | Oui | Non | Oui |
| Tests | -- | Oui, 13 | Oui, 13 | Oui, 10 | -- |
| Performance | Optimale | Bonne | Bonne | Bonne | Bonne |

## Licence

MIT License - Voir le fichier LICENSE pour les détails

## Contribution

Les contributions sont les bienvenues ! Veuillez vous assurer que :
- Le code respecte les conventions du projet
- Tous les algorithmes d'optimisation correspondent à l'implémentation Delphi
- La sortie G-Code est validée
- Le support multilingue est maintenu
- La documentation est mise à jour
- Des tests sont ajoutés pour les nouvelles fonctionnalités

## Auteurs

- Version Delphi originale : [Auteur original]
- Implémentation Python/Web/Node.js : [Contributeurs]

## Remerciements

- Implémentation de l'algorithme OPTICS
- Support du format de fichier P-CAD/Altium
- Retours et tests de la communauté CNC

## Captures d'écran

### Application Delphi

|Capture|Description|
|---|---|
|![Fenêtre principale](docs/screenshots/CNCDril_01.png)|Fenêtre principale|
|![Tri par X](docs/screenshots/CNCDril_02-Sort_by_X.png)|Tri par X|
|![Tri par Y](docs/screenshots/CNCDril_03-Sort_by_Y.png)|Tri par Y|
|![Tri par chemin](docs/screenshots/CNCDril_04-Sort_by_path.png)|Tri par chemin (OPTICS)|
|![Code source](docs/screenshots/CNCDril_05-code-source.png)|Code source|
|![Paramètres](docs/screenshots/CNCDril_06-Set-tools-parametr.png)|Paramètres des outils|
|![Coordonnées](docs/screenshots/CNCDril_07-All-drilling-coordinat.png)|Toutes les coordonnées de perçage|

### Application Web v2.0

|Capture|Description|
|---|---|
|![Web 1](docs/screenshots/CNCDril_08-All-drilling-by-web.png)|Interface Web - Vue principale|
|![Web 2](docs/screenshots/CNCDril_09-All-drilling-by-web.png)|Interface Web - Génération G-Code|
|![Web 3](docs/screenshots/CNCDril_10-All-drilling-by-web.png)|Interface Web - Visualisation|

## Historique des Versions

- **v1.0** - Implémentation Delphi originale
- **v2.0** - Ajout des versions Python CLI/GUI, Node.js CLI, Web et HTML autonome
