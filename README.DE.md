# CNCDril - Bohrungs-Optimierer für CNC

Multiplattform-Bohrdatei-Optimierer zur Konvertierung von P-CAD/Altium .drl-Dateien in optimierten G-Code für CNC-Maschinen.

## Funktionen

- **Mehrere Plattformen**: Delphi VCL, Python CLI/GUI, Node.js CLI, Web-basiert und eigenständige HTML-Version
- **Optimierungsalgorithmen**:
  - SortByX: Löcher nach X-Koordinate sortieren
  - SortByY: Löcher nach Y-Koordinate sortieren
  - SortByPath (OPTICS): Distanzbasierte Pfadoptimierung
- **Visualisierung**: Interaktive Bohrpfadvorschau mit Animation
- **Mehrsprachigkeit**: Unterstützung für 6 Sprachen (EN, RU, UK, PT, DE, FR)
- **Plattformübergreifend**: Windows, Linux, macOS und Web-Browser

## Versionen

### Delphi-Version (Original)
- **Standort**: `delphi/`
- **Voraussetzungen**: Delphi 6.0 oder höher
- **Funktionen**: Vollständige VCL-Desktop-Anwendung
- **Verwendung**: `CNCDril.dpr` in Delphi IDE öffnen und kompilieren

### Python-Version
- **Standort**: `python/`
- **Voraussetzungen**: Python 3.7+, matplotlib, numpy
- **Funktionen**: CLI- und GUI-Schnittstellen
- **Tests**: `python/test_cncdril.py` (13 Tests)
- **Installation**: Siehe `python/README.md`

### Node.js-Version
- **Standort**: `nodejs/`
- **Voraussetzungen**: Node.js 14+ (keine Abhängigkeiten)
- **Funktionen**: CLI mit 6 Sprachen, gleiche Algorithmen wie alle anderen Versionen
- **Tests**: `nodejs/test/test.mjs` (13 Tests)
- **Verwendung**: `node cncdril.mjs input.drl -o output.nc`

### Web-Version
- **Standort**: `web/`
- **Voraussetzungen**: Moderner Web-Browser (kein Server erforderlich)
- **Funktionen**: Drag-and-Drop, interaktive Visualisierung, mehrsprachig
- **Tests**: `web/test/test.mjs` (10 Tests)
- **Verwendung**: `web/index.html` im Browser öffnen

### Eigenständige HTML-Version
- **Standort**: `standalone/cncdril.html`
- **Voraussetzungen**: Nur ein moderner Web-Browser - kein Server, keine Installation
- **Funktionen**: Einzelne eigenständige HTML-Datei mit eingebettetem CSS und JavaScript
- **Verwendung**: `standalone/cncdril.html` direkt in einem beliebigen Browser öffnen (funktioniert über file://-Protokoll)
- **Gleiche Funktionalität** wie die Web-Version: DRL-Parsing, 3 Optimierungsalgorithmen, G-Code-Generierung, interaktive Canvas-Visualisierung, 6 Sprachen

## Schnellstart

### Delphi-Version
1. `delphi/CNCDril.dpr` in Delphi IDE öffnen
2. Kompilieren und ausführen
3. .drl-Datei laden und G-Code generieren

### Python-Version
```bash
cd python
pip install -r requirements.txt
python cncdrill.py ../examples/RPCB0827_FIXTURE.DRL -o output.nc
```

### Node.js-Version
```bash
cd nodejs
node cncdril.mjs ../examples/RPCB0827_FIXTURE.DRL -o output.nc

# Mit Sprachauswahl
node cncdril.mjs ../examples/RPCB0827_FIXTURE.DRL --language ru -o output.nc
```

### Web-Version
```bash
cd web
python -m http.server 8000
# Zu http://localhost:8000 navigieren
```

### Eigenständige HTML-Version
`standalone/cncdril.html` in einem beliebigen modernen Web-Browser öffnen. Kein Server erforderlich.

## Tests

### Alle Tests ausführen
```bash
# Node.js CLI-Tests (13 Tests)
node nodejs/test/test.mjs

# Web JS-Modul-Tests (10 Tests)
node web/test/test.mjs

# Python-Tests (13 Tests)
cd python && python -m unittest test_cncdril -v
```

### Testabdeckung
| Variante | Tests | Abdeckung |
|----------|-------|-----------|
| Node.js CLI | 13 | Hilfe, Version, Parsing, G-Code-Generierung, alle 6 Sprachen, Fehlerbehandlung |
| Web JS-Module | 10 | Point, Tool, DRLParser, alle 3 Optimierungsalgorithmen |
| Python | 13 | Parser, Werkzeugdurchmesser, SortByX/Y, OPTICS, G-Code-Generierung, Dateiausgabe |

## Dateiformat

### Eingabe (.drl)
P-CAD/Altium-Bohrdateien mit:
- Werkzeugdefinitionen (T01C1.73)
- Koordinatendaten (X+005004Y+017894)
- Metrische und Zoll-Einheiten
- Mehrere Werkzeuge pro Datei

### Ausgabe (.nc)
Standard-CNC-G-Code:
- Werkzeugwechselbefehle (T1 M6)
- Sichere Verfahrwege (G0 Z5.0)
- Bohroperationen (G1 Z-2.0)
- Kompatibel mit den meisten CNC-Steuerungen

## Beispiel

Das Verzeichnis `examples/` enthält `RPCB0827_FIXTURE.DRL`:
- 7 Werkzeuge (Ø1.73mm bis Ø10.16mm)
- 102 Löcher insgesamt
- Metrische Einheiten

## Optimierung

Der OPTICS-Algorithmus (Ordering Points To Identify the Clustering Structure) minimiert die Werkzeugverfahrstrecke durch:
1. Finden des nächstgelegenen unbesuchten Lochs
2. Bewegen zu diesem Loch
3. Wiederholen, bis alle Löcher besucht wurden

Dies reduziert normalerweise die Gesamtverfahrstrecke um 30-50% im Vergleich zu unsortierten Pfaden.

## Mehrsprachigkeit

Alle Versionen unterstützen:
- Englisch (EN)
- Russisch (RU)
- Ukrainisch (UK)
- Portugiesisch (PT)
- Deutsch (DE)
- Französisch (FR)

Die Standardsprache ist Englisch in allen Versionen.

## Repository-Struktur

```
CNCDril/
├── README.md              # Diese Datei (Englisch)
├── README.RU.md           # Russische Dokumentation
├── README.UA.md           # Ukrainische Dokumentation
├── README.PT.md           # Portugiesische Dokumentation
├── README.DE.md           # Deutsche Dokumentation
├── README.FR.md           # Französische Dokumentation
├── .gitignore            # Git-Ignore-Regeln
├── LICENSE               # MIT-Lizenz
│
├── delphi/               # Original Delphi-Anwendung
│   ├── CNCDril.dpr      # Projektdatei
│   ├── CNCDril_r01.pas  # Hauptquellcode
│   ├── CNCDril_r01.dfm  # Formulardefinition
│   ├── CNCDril.res      # Ressourcen
│   └── README.md        # Delphi-spezifische Dokumentation
│
├── python/              # Python-Implementierung
│   ├── cncdrill.py     # CLI-Anwendung
│   ├── cncdrill_gui.py # GUI-Anwendung
│   ├── test_cncdril.py # Test-Suite (13 Tests)
│   ├── requirements.txt # Abhängigkeiten
│   └── README.md       # Python-spezifische Dokumentation
│
├── nodejs/              # Node.js CLI-Implementierung
│   ├── cncdril.mjs     # CLI-Anwendung
│   ├── package.json    # Paketkonfiguration
│   ├── test/
│   │   └── test.mjs   # Test-Suite (13 Tests)
│   └── README.md       # Node.js-spezifische Dokumentation
│
├── web/                 # Web-Anwendung (mehrere Dateien)
│   ├── index.html      # Hauptoberfläche
│   ├── styles.css      # Stildefinitionen
│   ├── locales.js      # Übersetzungen
│   ├── parser.js       # DRL-Parser
│   ├── optimizer.js    # Optimierungsalgorithmen
│   ├── gcode-generator.js # G-Code-Generierung
│   ├── ui.js           # Canvas-Visualisierung
│   ├── cncdrill.js     # Hauptanwendung
│   ├── test/
│   │   └── test.mjs   # Test-Suite (10 Tests)
│   └── README.md       # Web-spezifische Dokumentation
│
├── standalone/          # Eigenständige HTML-Einzeldatei
│   └── cncdril.html    # Selbstständig (kein Server benötigt)
│
└── examples/            # Beispieldateien
    └── RPCB0827_FIXTURE.DRL
```

## Versionsvergleich

| Funktion | Delphi | Python | Node.js | Web | Eigenständiges HTML |
|----------|--------|--------|---------|-----|---------------------|
| Desktop-GUI | Ja | Ja | Nein | Nein | Nein |
| Kommandozeile | Nein | Ja | Ja | Nein | Nein |
| Web-Oberfläche | Nein | Nein | Nein | Ja | Ja |
| Visualisierung | Ja | Ja | Nein | Ja | Ja |
| Offline-Nutzung | Ja | Ja | Ja | Ja | Ja |
| Plattformübergreifend | Windows | Ja | Ja | Ja | Ja |
| Installation | Erforderlich | Erforderlich | Node.js | Keine | Keine |
| Server benötigt | Nein | Nein | Nein | Optional | Nein |
| Einzeldatei | Nein | Nein | Ja | Nein | Ja |
| Tests | -- | Ja 13 | Ja 13 | Ja 10 | -- |
| Leistung | Beste | Gut | Gut | Gut | Gut |

## Lizenz

MIT-Lizenz - Siehe LICENSE-Datei für Details

## Mitwirken

Beiträge sind willkommen! Bitte stellen Sie sicher:
- Code folgt den Projektkonventionen
- Alle Optimierungsalgorithmen entsprechen der Delphi-Implementierung
- G-Code-Ausgabe ist validiert
- Mehrsprachigkeit wird beibehalten
- Dokumentation wird aktualisiert
- Tests werden für neue Funktionen hinzugefügt

## Autoren

- Original Delphi-Version: [Originalautor]
- Python/Web/Node.js-Implementierung: [Mitwirkende]

## Danksagung

- OPTICS-Algorithmus-Implementierung
- P-CAD/Altium-Dateiformatunterstützung
- Feedback und Tests aus der CNC-Community

## Screenshots

### Delphi-Anwendung

|Screenshot|Beschreibung|
|---|---|
|![Hauptfenster](docs/screenshots/CNCDril_01.png)|Hauptfenster|
|![Sortierung nach X](docs/screenshots/CNCDril_02-Sort_by_X.png)|Sortierung nach X-Optimierung|
|![Sortierung nach Y](docs/screenshots/CNCDril_03-Sort_by_Y.png)|Sortierung nach Y-Optimierung|
|![Pfad-Sortierung](docs/screenshots/CNCDril_04-Sort_by_path.png)|Pfad-Sortierung (OPTICS)|
|![Quellcode](docs/screenshots/CNCDril_05-code-source.png)|Quellcode|
|![Parameter](docs/screenshots/CNCDril_06-Set-tools-parametr.png)|Werkzeugparameter|
|![Koordinaten](docs/screenshots/CNCDril_07-All-drilling-coordinat.png)|Alle Bohrkoordinaten|

### Web-Anwendung v2.0

|Screenshot|Beschreibung|
|---|---|
|![Web 1](docs/screenshots/CNCDril_08-All-drilling-by-web.png)|Web-Oberfläche - Hauptansicht|
|![Web 2](docs/screenshots/CNCDril_09-All-drilling-by-web.png)|Web-Oberfläche - G-Code-Generierung|
|![Web 3](docs/screenshots/CNCDril_10-All-drilling-by-web.png)|Web-Oberfläche - Visualisierung|

## Versionsverlauf

- **v1.0** - Original Delphi-Implementierung
- **v2.0** - Python CLI/GUI, Node.js CLI, Web und eigenständige HTML-Versionen hinzugefügt
