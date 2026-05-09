# Technology Stack

**Analysis Date:** 2026-05-09

## Languages & Runtimes

**Primary:**
- JavaScript (ES2020+) — Web, Node.js, Standalone implementations; uses ES modules (`.mjs`), `class` syntax, template literals, `const`/`let`, `async`/`await` (web only)
- Python 3.8+ — CLI (`cncdrill.py`) and GUI (`cncdrill_gui.py`) implementations; uses type hints, f-strings, `pathlib`, `argparse`

**Secondary:**
- Object Pascal (Delphi) — Original desktop app; VCL framework, `CNCDril_r01.pas` (1161 lines)
- HTML5/CSS3 — Web UI shell and Standalone; `<canvas>` for drill path visualization

## Runtimes

- **Node.js** — Required for `nodejs/` CLI; uses `node:fs`, `node:path`, `node:url`, `child_process` (tests only); no transpilation
- **Python 3** — Required for `python/`; uses stdlib `argparse`, `tkinter`, `pathlib`, `re`, `unittest`
- **Browser** — Required for `web/` and `standalone/`; no build step, served as static files
- **Delphi VCL** — Required for `delphi/`; Windows-only desktop app

## Frameworks & Libraries

### Web (`web/`)
- **Zero external dependencies** — All code is vanilla JS loaded via `<script>` tags in `index.html`
- Browser APIs: Canvas 2D (`getContext('2d')`), Drag & Drop API, File API (`FileReader`), `localStorage`
- `web/locales.js` — Inline i18n dictionary (225 lines, 6 languages)
- `web/parser.js` — `Point`, `Tool`, `DRLParser` classes (120 lines)
- `web/optimizer.js` — `OptimizationAlgorithms` class (114 lines)
- `web/gcode-generator.js` — `GCodeGenerator` class (55 lines)
- `web/ui.js` — `UIManager` class with canvas visualization (180 lines)
- `web/styles.css` — Full responsive CSS (8223 bytes)

### Standalone (`standalone/`)
- **Zero dependencies** — Single `cncdril.html` file (~50KB), self-contained
- Embeds all CSS, JS, and translations inline — no network requests needed
- Same core classes as web version (Point, Tool, DRLParser, Optimizer, GCodeGen, UIManager)

### Node.js (`nodejs/`)
- **Zero npm dependencies** — `package.json` has empty `"dependencies": {}`
- Uses only Node.js built-in modules: `node:fs`, `node:path`, `node:url`
- Self-contained CLI arg parser (no `commander`, `yargs`, etc.)
- `nodejs/cncdril.mjs` (384 lines) — monolithic file with parser, optimizer, G-code generator, i18n, CLI

### Python (`python/`)
- **`cncdrill.py`** (587 lines) — Core library with zero external dependencies for CLI mode
  - Uses stdlib only: `argparse`, `sys`, `pathlib`, `typing`, `re`
- **`cncdrill_gui.py`** (564 lines) — Tkinter GUI
  - `matplotlib>=3.5.0` — Canvas visualization (drill path plotting)
  - `numpy>=1.21.0` — Array operations for visualization
  - `tkinter` (stdlib) — GUI framework
  - Falls back gracefully if `cncdrill.py` import fails (inline `Point`/`Tool`/`DRLParser` stubs)

### Delphi (`delphi/`)
- **VCL (Visual Component Library)** — Delphi standard GUI framework
- Units: `Windows`, `Messages`, `SysUtils`, `Variants`, `Classes`, `Graphics`, `Controls`, `Forms`, `Dialogs`, `Grids`, `StdCtrls`, `ExtCtrls`, `Menus`, `ComCtrls`, `TabNotBk`, `Math`
- `CNCDril_r01.dfm` (460KB) — Visual form resource
- No third-party Delphi components detected

## Build & Package Management

### Node.js (`nodejs/`)
- **Package manager:** npm (implied by `package.json`)
- **No build step** — Run directly with `node cncdril.mjs`
- **No lockfile** — No `package-lock.json` present (zero deps)
- **npm scripts** in `package.json`: `test` (runs `node test/test.mjs`)
- **Bin entry:** `"cncdril": "cncdril.mjs"` for global install

### Python (`python/`)
- **Package manager:** pip (implied by `requirements.txt`)
- **Requirements file:** `python/requirements.txt` — `matplotlib>=3.5.0`, `numpy>=1.21.0`
- **No build step** — Run directly with `python3 cncdrill.py` or `python3 cncdrill_gui.py`
- **No `pyproject.toml` or `setup.py`** — Not packaged as installable module

### Web (`web/`)
- **No build step** — Static files served directly
- **No bundler** — No webpack, vite, rollup, etc.
- **Development server:** `server.sh` (bash script, starts HTTP server on port 8000)

### Standalone (`standalone/`)
- **No build step** — Open `cncdril.html` in any browser
- **Self-contained** — All assets inlined

### Delphi (`delphi/`)
- **Build:** Delphi IDE compiles `.dpr` → Windows executable
- **No build scripts** — Manual IDE compilation

## Development Tools

### Testing

**Node.js (`nodejs/test/test.mjs`):**
- Custom test runner (no framework) — `run()` function wraps assertions
- Uses `node:assert` for assertions
- Uses `child_process.execSync` to invoke `cncdril.mjs` as CLI
- Tests: CLI argument handling, file parsing, optimization, G-code generation, error handling
- Run: `node test/test.mjs` or `npm test`

**Web (`web/test/test.mjs`):**
- Custom test runner — `test()` function with `assert` module
- Uses `createRequire()` to load `.js` files as CommonJS from ESM test
- Tests: `Point`, `Tool`, `DRLParser`, `OptimizationAlgorithms` unit tests
- Run: `node test/test.mjs`

**Python (`python/test_cncdril.py`):**
- `unittest` stdlib framework — `unittest.TestCase` subclasses
- Tests: `TestDRLParser`, `TestOptimizationAlgorithms`, `TestGCodeGenerator`
- Uses shared example file: `examples/RPCB0827_FIXTURE.DRL`
- Run: `python3 test_cncdril.py` or `python3 -m unittest`

### Linting/Formatting
- Not detected — no `.eslintrc`, `.prettierrc`, `biome.json`, `flake8`, `black`, `pylint` configs found

### Deployment
- `deploy.sh` — Git deployment helper (adds files, suggests commit message)
- `server.sh` — Local HTTP server start/stop script

### Version Control
- Git — `.gitignore` covers Delphi, Python, Web, IDE, OS artifacts

## Configuration

**No config files** — Each implementation uses hardcoded defaults with CLI arg overrides:
- Safe Z: 5.0mm, Drill Z: -2.0mm, Feed Rate: 100mm/min, Plunge Rate: Feed Rate / 2
- Default algorithm: `path` (OPTICS nearest-neighbor)
- Language detection: browser `navigator.language` (web), CLI `--language` flag (node/python)

## Platform Requirements

**Development:**
- Node.js 14+ (for `node:fs`, ESM support)
- Python 3.8+ (for type hints, f-strings)
- Any modern browser (for `web/` and `standalone/`)
- Delphi IDE (Windows only, for `delphi/`)

**Production:**
- Static file server for web version (or standalone HTML — zero server)
- No database, no authentication, no network calls
- Input: `.drl` files (P-CAD/Altium drill format)
- Output: `.nc` G-code files (plain text)

---

*Stack analysis: 2026-05-09*
