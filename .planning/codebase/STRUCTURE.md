# Codebase Structure

**Analysis Date:** 2026-05-09

## Directory Layout

```
CNCDril/                          # Project root
├── delphi/                       # Original Delphi VCL desktop application
│   ├── CNCDril.dpr               #   Project entry point
│   ├── CNCDril_r01.pas           #   Main form unit (all logic)
│   ├── CNCDril_r01.dfm           #   Form layout (VCL designer)
│   └── CNCDril.res               #   Compiled resources (bitmaps)
├── python/                       # Python CLI + GUI
│   ├── cncdrill.py               #   Core library + CLI
│   ├── cncdrill_gui.py           #   Tkinter GUI wrapper
│   ├── test_cncdril.py           #   Unit tests
│   ├── requirements.txt          #   Dependencies (matplotlib, numpy)
│   └── README.md                 #   Python-specific docs
├── nodejs/                       # Node.js CLI (zero dependencies)
│   ├── cncdril.mjs               #   Single-file ESM CLI
│   ├── package.json              #   Package manifest
│   ├── test/
│   │   └── test.mjs              #   Unit tests
│   └── README.md                 #   Node.js-specific docs
├── web/                          # Browser application (multi-file)
│   ├── index.html                #   Entry point, loads all scripts
│   ├── locales.js                #   Translations (6 languages)
│   ├── parser.js                 #   Point, Tool, DRLParser
│   ├── optimizer.js              #   OptimizationAlgorithms
│   ├── gcode-generator.js        #   GCodeGenerator
│   ├── ui.js                     #   UIManager (canvas visualization)
│   ├── cncdrill.js               #   Orchestrator / bootstrap
│   ├── styles.css                #   All CSS
│   ├── test/
│   │   └── test.mjs              #   Unit tests
│   └── README.md                 #   Web-specific docs
├── standalone/                   # Self-contained HTML (no server)
│   └── cncdril.html              #   All web files concatenated (~50KB)
├── examples/                     # Sample data
│   └── RPCB0827_FIXTURE.DRL      #   Example drill file (7 tools, ~140 holes)
├── docs/
│   └── screenshots/              #   UI screenshots for README
├── .planning/                    # GSD planning artifacts
│   └── codebase/                 #   Codebase analysis documents
├── README.md                     # Main project README (EN)
├── README.RU.md                  # Russian README
├── README.UA.md                  # Ukrainian README
├── README.PT.md                  # Portuguese README
├── README.DE.md                  # German README
├── README.FR.md                  # French README
├── LICENSE                       # MIT license
├── .gitignore
├── .gitattributes
├── server.sh                     # Local HTTP server for web/ development
└── deploy.sh                     # Deployment script
```

## Directory Purposes

**`delphi/`**
- Purpose: Original desktop application, the reference implementation
- Contains: Object Pascal source (.pas), form layout (.dfm), project file (.dpr), resources (.res)
- Key files: `CNCDril_r01.pas` (36.1KB, 1161 lines — all application logic in one file)

**`python/`**
- Purpose: Python CLI and GUI implementation
- Contains: Core library (`cncdrill.py`), GUI wrapper (`cncdrill_gui.py`), tests
- Key files: `cncdrill.py` (21.6KB, 587 lines), `cncdrill_gui.py` (23.3KB, 564 lines)
- Dependencies: `matplotlib`, `numpy` (GUI only), `tkinter` (stdlib, GUI only)

**`nodejs/`**
- Purpose: Node.js CLI implementation, zero external dependencies
- Contains: Single ESM module, package.json, tests
- Key files: `cncdril.mjs` (14.5KB, ~400 lines)
- No runtime dependencies — uses only Node.js built-ins (`fs`, `path`, `url`)

**`web/`**
- Purpose: Browser-based application with interactive visualization
- Contains: HTML entry point, 5 JS modules, CSS, tests
- Key files: `cncdrill.js` (9.2KB, orchestrator), `ui.js` (6.4KB, canvas), `locales.js` (10.9KB, translations)
- No build step, no bundler — raw `<script>` tag loading

**`standalone/`**
- Purpose: Single self-contained HTML file, no server required
- Contains: `cncdril.html` (49.7KB) — concatenation of all web/ files
- Can be opened directly in a browser via `file://` protocol

**`examples/`**
- Purpose: Sample DRL files for testing
- Contains: `RPCB0827_FIXTURE.DRL` (2.2KB) — 7 tools, ~140 holes, metric format

**`docs/screenshots/`**
- Purpose: UI screenshots for README documentation
- Contains: 11 PNG images showing the application across platforms

## File Inventory

### `delphi/`

| File | Size | Purpose | Key Exports |
|------|------|---------|-------------|
| `CNCDril.dpr` | 244B | Project entry point | `program CNCDril` |
| `CNCDril_r01.pas` | 36.1KB | Main form — all logic (parser, optimizer, generator, UI) | `TForm1`, `parser()`, `SortByX()`, `SortByY()`, `SortByPath()`, `jgraph()` |
| `CNCDril_r01.dfm` | 450.2KB | VCL form layout (designer-generated) | Visual form definition |
| `CNCDril.res` | 876B | Compiled resources (drill animation bitmaps) | Bitmap resources |

### `python/`

| File | Size | Purpose | Key Exports |
|------|------|---------|-------------|
| `cncdrill.py` | 21.6KB | Core library + CLI | `Point`, `Tool`, `DRLParser`, `OptimizationAlgorithms`, `GCodeGenerator`, `t()`, `main()` |
| `cncdrill_gui.py` | 23.3KB | Tkinter GUI application | `CNCDrilGUI`, `main()` |
| `test_cncdril.py` | 4.9KB | Unit tests | `TestPoint`, `TestTool`, `TestDRLParser`, `TestOptimization` |
| `requirements.txt` | 32B | Python dependencies | `matplotlib`, `numpy` |
| `README.md` | 3.4KB | Python-specific documentation | — |

### `nodejs/`

| File | Size | Purpose | Key Exports |
|------|------|---------|-------------|
| `cncdril.mjs` | 14.5KB | Single-file CLI (all classes inline) | `Point`, `Tool`, `DRLParser`, `Optimizer`, `GCodeGen`, `main()` |
| `package.json` | 619B | Package manifest, no dependencies | `{ name, version, bin, scripts }` |
| `test/test.mjs` | 3.1KB | Unit tests | Test suite using Node.js `assert` |
| `README.md` | 3.0KB | Node.js-specific documentation | — |

### `web/`

| File | Size | Purpose | Key Exports |
|------|------|---------|-------------|
| `index.html` | 7.2KB | Entry point, loads scripts, defines HTML structure | — |
| `locales.js` | 10.9KB | 6-language translations | `translations`, `t()`, `formatTemplate()` |
| `parser.js` | 3.6KB | DRL file parser | `Point`, `Tool`, `DRLParser` |
| `optimizer.js` | 3.1KB | Path optimization algorithms | `OptimizationAlgorithms` |
| `gcode-generator.js` | 1.9KB | G-Code output | `GCodeGenerator` |
| `ui.js` | 6.4KB | Canvas visualization | `UIManager` |
| `cncdrill.js` | 9.2KB | Application orchestrator | `init()`, `loadFile()`, `optimizeAndDraw()`, `generateGCode()` |
| `styles.css` | 8.0KB | All CSS styling | — |
| `test/test.mjs` | 3.5KB | Unit tests (Node.js `assert` module) | Test suite |
| `README.md` | 8.5KB | Web-specific documentation | — |

### `standalone/`

| File | Size | Purpose | Key Exports |
|------|------|---------|-------------|
| `cncdril.html` | 49.7KB | Self-contained single-file application | Same as web/ — all inline |

### `examples/`

| File | Size | Purpose | Key Exports |
|------|------|---------|-------------|
| `RPCB0827_FIXTURE.DRL` | 2.2KB | Sample P-CAD drill file | 7 tools (T01–T07), ~140 holes |

## Entry Points

| Implementation | File | Trigger | Entry Function |
|----------------|------|---------|----------------|
| Delphi | `delphi/CNCDril.dpr` | Double-click executable | `Application.Run` → `Form1.OnCreate` |
| Python CLI | `python/cncdrill.py` | `python cncdrill.py input.drl` | `main()` via `if __name__ == '__main__'` |
| Python GUI | `python/cncdrill_gui.py` | `python cncdrill_gui.py` | `main()` → `tk.Tk()` → `CNCDrilGUI` |
| Node.js CLI | `nodejs/cncdril.mjs` | `node cncdril.mjs input.drl` | `main()` called at file end |
| Web | `web/index.html` | Browser opens URL | `DOMContentLoaded` → `init()` in `cncdrill.js` |
| Standalone | `standalone/cncdril.html` | Open file in browser | Same as web — `DOMContentLoaded` → `init()` |

## Module Dependency Graph

### Web (`web/`)

```text
index.html
  │
  ├── <script> locales.js          (no deps — defines global translations, t(), formatTemplate)
  │
  ├── <script> parser.js           (no deps — defines Point, Tool, DRLParser)
  │
  ├── <script> optimizer.js        (depends on: Point from parser.js for distanceTo())
  │                                   defines OptimizationAlgorithms
  │
  ├── <script> gcode-generator.js  (no deps — defines GCodeGenerator)
  │
  ├── <script> ui.js               (no deps — defines UIManager, uses DOM)
  │
  └── <script> cncdrill.js         (depends on: all above)
                                      uses: DRLParser, OptimizationAlgorithms,
                                            GCodeGenerator, UIManager, t(), formatTemplate()
```

**Global interface contracts between modules:**

| Consumer | Provider | Interface Used |
|----------|----------|----------------|
| `cncdrill.js` | `parser.js` | `new DRLParser()`, `parser.parseDRL(text)` → `{tools, holes}` |
| `cncdrill.js` | `optimizer.js` | `OptimizationAlgorithms.optimize(points, algo)` → `Point[]` |
| `cncdrill.js` | `gcode-generator.js` | `new GCodeGenerator(params)`, `gen.generate(tools, holes, opt)` → `string` |
| `cncdrill.js` | `ui.js` | `new UIManager()`, `ui.setData()`, `ui.updateToolsInfo()`, `ui.zoomIn/Out()` |
| `cncdrill.js` | `locales.js` | `t(key, lang)`, `formatTemplate(template, data)` |
| `ui.js` | `parser.js` | `Point.x`, `Point.y` (accessed on optimized data arrays) |
| `optimizer.js` | `parser.js` | `Point.distanceTo(other)` |
| `gcode-generator.js` | `parser.js` | `Point.x`, `Point.y`, `Tool.diameter` |

### Python (`python/`)

```text
cncdrill.py (standalone — all classes in one file)
  ├── class Point
  ├── class Tool
  ├── class DRLParser         (uses Point, Tool)
  ├── class OptimizationAlgorithms  (uses Point.distance_to)
  ├── class GCodeGenerator     (uses Point, Tool)
  ├── TRANSLATIONS + t()
  └── main()                   (uses all above)

cncdrill_gui.py
  ├── from cncdrill import DRLParser, OptimizationAlgorithms, GCodeGenerator, Point, Tool, VERSION, PROJECT, GITHUB, LICENSE
  ├── import tkinter, matplotlib, numpy
  └── class CNCDrilGUI         (uses all above)
```

### Node.js (`nodejs/`)

```text
cncdril.mjs (standalone — all classes in one file)
  ├── import { readFileSync, writeFileSync } from 'node:fs'
  ├── import { resolve, basename } from 'node:path'
  ├── import { fileURLToPath } from 'node:url'
  ├── const T = {}             (translations)
  ├── t()
  ├── class Point              (self-contained)
  ├── class Tool               (self-contained)
  ├── class DRLParser          (uses Point, Tool)
  ├── class Optimizer          (uses Point.distanceTo)
  ├── class GCodeGen           (uses Point, Tool)
  ├── parseArgs()
  └── main()
```

### Delphi (`delphi/`)

```text
CNCDril.dpr
  └── uses CNCDril_r01 in 'CNCDril_r01.pas' {Form1}

CNCDril_r01.pas (single unit — everything)
  ├── uses Windows, Messages, SysUtils, Variants, Classes, Graphics,
  │        Controls, Forms, Dialogs, Grids, StdCtrls, ExtCtrls, Menus,
  │        ComCtrls, TabNotBk, Math
  ├── Global data types: TLPoint, TTools
  ├── Global variables: XY[], XYTools[], sorted[], fsorted[], ...
  ├── Parsing: parser(), extxy(), exttc()
  ├── Optimization: SortByX(), SortByY(), SortByPath(), optics_recurse()
  ├── Visualization: jgraph()
  ├── G-Code: Button6Click()
  ├── File I/O: Button11Click (open), Button12Click (save), Button13Click (reload)
  └── Config: Button7Click (load), Button8Click (save)
```

## Naming Conventions

**Files:**
- JavaScript modules: camelCase (`cncdrill.js`, `gcode-generator.js`)
- Python modules: lowercase with underscores (`cncdrill.py`, `cncdrill_gui.py`)
- Delphi: PascalCase with prefixes (`CNCDril_r01.pas`)
- Tests: `test_` prefix (`test_cncdril.py`, `test.mjs`)

**Classes:**
- JavaScript/Python: PascalCase (`DRLParser`, `OptimizationAlgorithms`, `GCodeGenerator`)
- Delphi: Hungarian prefix (`TForm1`, `TLPoint`, `TTools`)

**Functions:**
- JavaScript: camelCase (`sortByX`, `opticsOptimization`, `generateGCode`)
- Python: snake_case (`sort_by_x`, `optics_optimization`, `parse_drl`)
- Delphi: PascalCase (`SortByX`, `SortByPath`, `Button6Click`)

## Where to Add New Code

**New optimization algorithm:**
- `web/optimizer.js` — add static method to `OptimizationAlgorithms`, update `optimize()` switch
- `python/cncdrill.py` — add static method to `OptimizationAlgorithms`, update dispatch in `main()`
- `nodejs/cncdril.mjs` — add static method to `Optimizer`, update `optimize()` switch
- `standalone/cncdril.html` — find the inline `OptimizationAlgorithms` script block
- `delphi/CNCDril_r01.pas` — add standalone function, wire into `Button11Click` via `ComboBox4.ItemIndex`
- Update `web/locales.js` and translation dicts in all implementations for algorithm name

**New UI feature (web):**
- Primary code: `web/ui.js` (canvas viz), `web/cncdrill.js` (events/orchestration)
- HTML structure: `web/index.html`
- Styling: `web/styles.css`
- Translations: `web/locales.js`
- Standalone sync: `standalone/cncdril.html`

**New CLI option:**
- `nodejs/cncdril.mjs` — update `parseArgs()` and `main()`
- `python/cncdrill.py` — update `argparse` in `main()`

**New G-Code parameter:**
- `web/gcode-generator.js` — update `constructor` defaults and `generate()` method
- `python/cncdrill.py` — update `GCodeGenerator.__init__` defaults and `generate()`
- `nodejs/cncdril.mjs` — update `GCodeGen.constructor` and `generate()`
- `delphi/CNCDril_r01.pas` — add to `StringGrid4` and `Button6Click`

**New test:**
- Web: `web/test/test.mjs`
- Node.js: `nodejs/test/test.mjs`
- Python: `python/test_cncdril.py`

## Special Directories

**`.planning/`**
- Purpose: GSD (Get Stuff Done) workflow artifacts
- Generated: Yes (by GSD tooling)
- Committed: Yes
- Contains: `codebase/` subdirectory with analysis documents

**`docs/screenshots/`**
- Purpose: UI screenshots for README documentation
- Generated: Manually captured
- Committed: Yes
- Contains: 11 PNG images

**`python/__pycache__/`**
- Purpose: Python bytecode cache
- Generated: Yes (automatically by Python)
- Committed: No (in `.gitignore`)

---

*Structure analysis: 2026-05-09*
