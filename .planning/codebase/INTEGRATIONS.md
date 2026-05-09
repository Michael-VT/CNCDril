# External Integrations

**Analysis Date:** 2026-05-09

## External Dependencies

### Node.js (`nodejs/`)
- **Zero npm dependencies** — `package.json` `"dependencies": {}`
- Node.js built-ins only: `node:fs`, `node:path`, `node:url`
- Test runner uses `child_process` (`execSync`) and `node:assert`

### Python (`python/`)
- **CLI mode (`cncdrill.py`):** Zero external dependencies — pure stdlib
- **GUI mode (`cncdrill_gui.py`):**
  - `matplotlib>=3.5.0` — Drill path canvas visualization via `FigureCanvasTkAgg`
  - `numpy>=1.21.0` — Array operations for plotting
  - `tkinter` (stdlib) — Cross-platform GUI toolkit

### Web (`web/`)
- **Zero dependencies** — No npm, no CDN links, no external scripts
- Browser APIs: Canvas 2D, File API, Drag & Drop, `localStorage`, `navigator.language`

### Standalone (`standalone/`)
- **Zero dependencies** — Single file, no network requests
- Same browser APIs as web version, all inlined

### Delphi (`delphi/`)
- **VCL standard library only** — No third-party components
- Windows API via `Windows`, `Messages` units

## File Format Interfaces

### Input: P-CAD/Altium Drill Format (`.drl`)
- **Format:** Plain text, Excellon drill file variant
- **Structure observed** (from `examples/RPCB0827_FIXTURE.DRL` and parsers):
  - Tool definitions: `T01C1.73` (tool number + diameter in mm)
  - Tool selection: `T01` (switches active tool)
  - Coordinate pairs: `X12345Y67890` (integer values, divided by 1000 for mm)
  - Comments: Lines starting with `;`
  - Section markers: `%`
  - Unit indicator: `METRIC` or `INCH` (only metric fully processed)
- **Parsing implementations:**
  - `web/parser.js:33-120` — `DRLParser.parse(content)` returns `{tools, holes}`
  - `nodejs/cncdril.mjs:137-175` — Inline `DRLParser.parse(content)`
  - `python/cncdrill.py` — `DRLParser.parse_drl(file_path)` returns `(tools, holes)` tuple
  - `standalone/cncdril.html` — Same inline parser as Node.js
  - `delphi/CNCDril_r01.pas` — Delphi-native parser

### Output: G-Code (`.nc`)
- **Format:** Standard CNC G-code, plain text
- **Structure observed** (from `GCodeGen.generate()` in `nodejs/cncdril.mjs:230-260`):
  ```
  % CNCDril G-Code Output
  % Version 2.0.0
  G21 ; mm
  G90 ; absolute
  G0 Z5.000 ; safe height
  % Tool 01 D1.73 15 holes
  G0 X0.000 Y0.000
  T1 M6        ; tool change
  S1000 M3     ; spindle on
  G0 X1.234 Y5.678    ; rapid to position
  G1 Z-2.000 F50      ; drill plunge
  G0 Z5.000           ; retract
  ...
  M5           ; spindle off
  G0 X0 Y0    ; home
  M30          ; program end
  ```
- **Generator implementations:**
  - `web/gcode-generator.js` — `GCodeGenerator.generate(tools, holes, optimizedHoles)`
  - `nodejs/cncdril.mjs` — `GCodeGen.generate(tools, holes, opt)`
  - `python/cncdrill.py` — `GCodeGenerator.generate(tools, holes, optimized_holes)`
  - `standalone/cncdril.html` — Inline `GCodeGen`
  - `delphi/CNCDril_r01.pas` — Delphi-native G-code output

### G-Code Parameters
All implementations share these configurable parameters:

| Parameter | Default | CLI Flag | Description |
|-----------|---------|----------|-------------|
| Safe Z | 5.0 mm | `--safe-z` | Travel clearance height |
| Drill Z | -2.0 mm | `--drill-z` | Plunge depth |
| Feed Rate | 100 mm/min | `--feed-rate` | Rapid/feed rate |
| Plunge Rate | feedRate/2 | computed | Drilling feed rate |
| Tool Change X | 0.0 | hardcoded | X position for tool change |
| Tool Change Y | 0.0 | hardcoded | Y position for tool change |

## Platform-Specific APIs

### Canvas Visualization
- **Web/Standalone:** HTML5 Canvas 2D (`getContext('2d')`)
  - Pan: mouse drag (`mousedown`/`mousemove`/`mouseup` events)
  - Zoom: mouse wheel (`wheel` event)
  - Draw: circles for holes, lines for paths, labels for tool IDs
  - `web/ui.js:1-33` — `UIManager` constructor with event listeners
  - `standalone/cncdril.html` — Inline `UIManager` equivalent
- **Python GUI:** Matplotlib embedded in Tkinter
  - `python/cncdrill_gui.py` — `FigureCanvasTkAgg` for interactive plot
  - Uses `matplotlib.pyplot` and `numpy` for rendering

### File System Access
- **Node.js:** `node:fs` (`readFileSync`, `writeFileSync`) for CLI I/O
- **Python:** `pathlib.Path` for file I/O
- **Web/Standalone:** Browser File API (`FileReader.readAsText()`), drag-and-drop, `<input type="file">`
- **Delphi:** `TOpenDialog`, `TSaveDialog` VCL components

### CLI Interface
- **Node.js:** Custom arg parser in `parseArgs(argv)` at `nodejs/cncdril.mjs:267-292`
  - Flags: `--help`, `--version`, `--list-only`, `-o/--output`, `--optimize`, `--language`, `--safe-z`, `--drill-z`, `--feed-rate`
- **Python:** `argparse` stdlib at `python/cncdrill.py:497-525`
  - Same flags as Node.js (plus `--version` via `action='version'`)

### User Preferences (Web only)
- `localStorage.getItem('cncdril_lang')` — Persists language selection
- `localStorage.getItem('cncdril_algo')` — Persists algorithm selection
- `navigator.language` detection — Auto-selects language on first visit

### Clipboard/Download (Web/Standalone)
- G-code download: `Blob` + `URL.createObjectURL()` + `<a>` click
- No clipboard API usage detected

## Cross-Implementation Parity

### Feature Matrix

| Feature | Delphi | Python CLI | Python GUI | Node.js | Web | Standalone |
|---------|--------|------------|------------|---------|-----|------------|
| DRL file parsing | Yes | Yes | Yes (imports) | Yes | Yes | Yes |
| SortByX optimization | Yes | Yes | Yes | Yes | Yes | Yes |
| SortByY optimization | Yes | Yes | Yes | Yes | Yes | Yes |
| SortByPath (OPTICS) | Yes | Yes | Yes | Yes | Yes | Yes |
| G-Code generation | Yes | Yes | Yes | Yes | Yes | Yes |
| CLI interface | No | Yes | No | Yes | No | No |
| GUI interface | Yes (VCL) | No | Yes (Tkinter) | No | No | No |
| Web interface | No | No | No | No | Yes | Yes |
| Canvas visualization | Yes (TImage) | No | Yes (Matplotlib) | No | Yes (Canvas 2D) | Yes (Canvas 2D) |
| i18n (6 languages) | No | Yes | Yes | Yes | Yes | Yes |
| File drag-and-drop | No | No | No | No | Yes | Yes |
| Language detection | No | No | No | No | Yes (`navigator.language`) | Yes |
| Tool parameter editing | Yes | No | Yes | No | Yes | Yes |
| List-only mode | No | Yes | No | Yes | No | No |
| Version flag | No | Yes | No | Yes | No | No |
| Inch-to-mm conversion | Yes | No | No | No | No | No |

### Core Algorithm Parity
All 5 implementations share the same core algorithms:
1. **DRL Parser** — Regex-based parsing of tool definitions (`T\d+C\d+`), tool selection (`T\d+`), coordinate pairs (`X\d+Y\d+`)
2. **SortByX** — Bubble sort by X coordinate (intentionally matches original Delphi algorithm)
3. **SortByY** — Bubble sort by Y coordinate
4. **SortByPath** — Nearest-neighbor greedy (OPTICS-like): start at first point, always move to closest unvisited
5. **G-Code Generator** — Same structure: preamble → per-tool loop (tool change → rapid → drill → retract) → end

### Version Consistency
All implementations report `VERSION = '2.0.0'`:
- `nodejs/cncdril.mjs:14` — `const VERSION = '2.0.0'`
- `python/cncdrill.py:28` — `VERSION = "2.0.0"`
- `web/cncdrill.js:3` — `var VERSION = '2.0.0'`
- `standalone/cncdril.html` — Inline version in title

## APIs & External Services

**None detected.** The project has zero network integration:
- No API calls
- No webhooks
- No authentication
- No cloud services
- No analytics
- No CDN dependencies

## Data Storage

**Databases:** None

**File Storage:** Local filesystem only
- Input: `.drl` files read from disk or browser file picker
- Output: `.nc` G-code files written to disk or browser download

**Caching:** None (web version uses `localStorage` only for UI preferences, not data)

## Authentication & Identity

**None.** All implementations are local/offline tools with no user accounts.

## Monitoring & Observability

**Error Tracking:** None

**Logging:**
- CLI versions: `console.log`/`print` to stdout, `console.error`/`sys.stderr` for errors
- Web: Browser console via `console.log`/`console.error`
- Delphi: `StatusBar1.SimpleText` for status messages

## CI/CD & Deployment

**CI Pipeline:** None detected — no `.github/workflows/`, no Makefile, no CI config files

**Deployment:**
- `deploy.sh` — Manual git deployment helper script
- `server.sh` — Local HTTP server for web development
- No containerization (Docker, etc.)

## Environment Configuration

**Required env vars:** None

**Secrets:** None — no `.env` files, no credential files, no API keys

## Webhooks & Callbacks

**Incoming:** None

**Outgoing:** None

---

*Integration audit: 2026-05-09*
