# CNCDril - Bohrungs-Optimierer für CNC

Multiplattform-Bohrdatei-Optimierer zur Konvertierung von P-CAD/Altium .drl-Dateien in optimierten G-Code für CNC-Maschinen.

## Funktionen

- **Mehrere Plattformen**: Delphi VCL, Python CLI/GUI und Web-Version
- **Optimierungsalgorithmen**:
  - SortByX: Löcher nach X-Koordinate sortieren
  - SortByY: Löcher nach Y-Koordinate sortieren
  - SortByPath (OPTICS): Distanzbasierte Optimierung
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
- **Installation**: Siehe `python/README.md`

### Web-Version
- **Standort**: `web/`
- **Voraussetzungen**: Moderner Web-Browser (kein Server erforderlich)
- **Funktionen**: Drag-and-Drop, interaktive Visualisierung, mehrsprachig
- **Verwendung**: `web/index.html` im Browser öffnen

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

### Web-Version
```bash
cd web
python -m http.server 8000
# Zu http://localhost:8000 navigieren
```

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

Der OPTICS-Algorithmus (Ordering Points To Identify the Clustering Structure) minimiert die Werkzeugverfahrstrecke:
1. Findet das nächstgelegene unbesuchte Loch
2. Bewegt sich zu diesem Loch
3. Wiederholt, bis alle Löcher besucht wurden

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

## Lizenz

MIT License - Siehe LICENSE-Datei für Details