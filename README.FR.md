# CNCDril - Optimisateur de Perçage pour CNC

Optimiseur de fichiers de perçage multiplateforme pour convertir les fichiers .drl P-CAD/Altium en G-Code optimisé pour les machines CNC.

## Fonctionnalités

- **Plusieurs Plateformes**: Delphi VCL, Python CLI/GUI et version web
- **Algorithmes d'Optimisation**:
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
- **Installation** : Voir `python/README.md`

### Version Web
- **Emplacement** : `web/`
- **Configuration requise** : Navigateur web moderne (pas de serveur nécessaire)
- **Fonctionnalités** : Glisser-déposer, visualisation interactive, multilingue
- **Utilisation** : Ouvrir `web/index.html` dans le navigateur

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

### Version Web
```bash
cd web
python -m http.server 8000
# Naviguer vers http://localhost:8000
```

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

## Licence

MIT License - Voir le fichier LICENSE pour les détails