# Architecture

**Analysis Date:** 2026-05-09

## System Overview

CNCDril is a multi-platform CNC drill file optimizer that converts P-CAD/Altium `.drl` files into optimized G-Code for CNC machines. The system has 5 independent implementations (Delphi, Python CLI, Python GUI, Node.js CLI, Web browser) that share identical core algorithms but differ in their runtime environments and UI layers.

```text
┌──────────────────────────────────────────────────────────────────────┐
│                        Input Layer                                    │
│   .drl file → File reader / FileReader API / drag-drop upload        │
├──────────────────────────────────────────────────────────────────────┤
│                        DRL Parser                                     │
│   Parse tool definitions (T01C1.73) and coordinates (X+005004Y+…)   │
│   → Output: tools{} dict + holes{} dict of Point arrays              │
├──────────────────────────────────────────────────────────────────────┤
│                        Optimizer                                      │
│   SortByX (bubble sort) | SortByY (bubble sort) | SortByPath (NN)   │
│   → Output: optimized{} dict of reordered Point arrays               │
├──────────────────────────────────────────────────────────────────────┤
│                        G-Code Generator                               │
│   Iterate tools in order → move / drill / retract per hole           │
│   → Output: .nc G-Code string                                        │
├──────────────────────────────────────────────────────────────────────┤
│                        Output / Visualization Layer                   │
│   File save | console | canvas | matplotlib | memo widget            │
└──────────────────────────────────────────────────────────────────────┘
```

## Core Domain Model

Key data structures are replicated identically across all implementations:

### Point
Represents a single drill hole coordinate in mm.

| Field | Type | Description |
|-------|------|-------------|
| `x` | `float` | X coordinate in mm |
| `y` | `float` | Y coordinate in mm |

Methods: `distanceTo(other)` — Euclidean distance.

**Locations:**
- `python/cncdrill.py` — `class Point`
- `web/parser.js` — `class Point`
- `nodejs/cncdril.mjs` — `class Point`
- `standalone/cncdril.html` — inline `class Point`
- `delphi/CNCDril_r01.pas` — `TLPoint` record (includes `L`, `C`, `N`, `T` fields)

### Tool
Represents a drill bit definition extracted from the DRL header.

| Field | Type | Description |
|-------|------|-------------|
| `toolId` | `str` | Zero-padded ID like `"01"`, `"02"` |
| `diameter` | `float` | Bit diameter in mm |

**Locations:** Same as Point — each implementation has its own `Tool` class.
Delphi equivalent: `TTools` record with `Npoint` (hole count) and `Sise` (diameter).

### Parsed Result
The output of DRL parsing consumed by optimizer and generator.

| Field | Type | Description |
|-------|------|-------------|
| `tools` | `Dict[str, Tool]` | Map of tool ID → Tool definition |
| `holes` | `Dict[str, List[Point]]` | Map of tool ID → list of drill coordinates |
| `optimized` | `Dict[str, List[Point]]` | Map of tool ID → reordered coordinates |
| `gcode` | `str` | Final G-Code output |

## Processing Pipeline

### 1. DRL Parsing

Input: `.drl` file text → Output: `{ tools, holes }`

The DRL format has two sections separated by `%`:

**Header section (before `%`):**
- `M48` — start marker
- `METRIC,0000.00` or `INCH` — unit declaration
- `T02C2.54` — tool definitions (tool ID + diameter)
- `;` lines — comments

**Drill section (after `%`):**
- `T01` — tool switch (select active tool)
- `X+005004Y+017894` — coordinate (value divided by 1000 to get mm)
- `Y+010351` — partial coordinate (inherits X from previous line)
- `T00` — end marker
- `M30` — program end

**Parser implementations:**
| Platform | File | Class/Function |
|----------|------|----------------|
| Python | `python/cncdrill.py` | `class DRLParser.parse_drl(path)` |
| Web | `web/parser.js` | `class DRLParser.parseDRL(content)` |
| Node.js | `nodejs/cncdril.mjs` | `class DRLParser.parse(content)` |
| Delphi | `delphi/CNCDril_r01.pas` | `function parser(ps: string): integer` |
| Standalone | `standalone/cncdril.html` | inline `class DRLParser` |

**Key parsing logic (shared pattern):**
```
1. Split content into lines, uppercase
2. Skip empty lines and comments (; prefix)
3. Detect METRIC/INCH
4. Before %: match T(\d+)C([\d.]+) → tool definitions
5. Skip % separator
6. After %: match T(\d+) → tool switch
7. Match X\+?(\d+) and Y\+?(\d+) → coordinates / 1000
8. Remove tools with zero holes
```

**Delphi differences:**
- Uses character-by-character parsing via `extxy()` and `exttc()` functions rather than regex
- Tracks coordinate scale via `fkoef` variable (power of 10 based on format string)
- Handles partial coordinates (X-only or Y-only lines) by inheriting from previous point
- Stores data in fixed-size arrays (`XY[0..20, 0..1000]`) rather than dynamic dicts
- Parses unit format string to determine divisor (e.g., `METRIC,0000.00` → fkoef = 100)

### 2. Optimization

Input: `holes{}` → Output: `optimized{}`

Three algorithms, all operating per-tool (each tool's holes are optimized independently):

**SortByX** — Bubble sort ascending by X coordinate (secondary sort by Y when X is equal):
- `delphi/CNCDril_r01.pas` — `function SortByX()`
- `python/cncdrill.py` — `OptimizationAlgorithms.sort_by_x()`
- `web/optimizer.js` — `OptimizationAlgorithms.sortByX()`
- `nodejs/cncdril.mjs` — `Optimizer.sortByX()`

**SortByY** — Bubble sort ascending by Y coordinate (secondary sort by X when Y is equal):
- Same locations as SortByX, named `SortByY` / `sort_by_y` / `sortByY`

**SortByPath (OPTICS)** — Nearest-neighbor path optimization:
- Starts from center point (or first point)
- Greedily selects the nearest unvisited point at each step
- Uses Euclidean distance (`distanceTo` / `distance` / `sort_distance`)
- Delphi variant uses recursive `optics_recurse()` with a `min_pts` parameter
- All other implementations use an iterative approach: copy points to a `remaining` list, splice nearest each iteration

**Algorithm dispatch pattern (all implementations):**
```
switch(algorithm) {
  'x'    → sortByX(points)
  'y'    → sortByY(points)
  'path' → sortByPath(points) / opticsOptimization(points)
  'none' → points unchanged
}
```

### 3. G-Code Generation

Input: `tools{}`, `holes{}`, `optimized{}` → Output: G-Code string

**G-Code structure (all implementations produce identical output):**
```
% CNCDril G-Code Output
% Version 2.0.0
G21 ; mm
G90 ; absolute
G0 Z{safeZ} ; safe height
[per tool, sorted by ID]:
  % Tool {id} D{diameter} {count} holes
  G0 X{tcX} Y{tcY}        ; move to tool change
  T{N} M6                  ; tool change
  S1000 M3                 ; spindle on
  [per hole]:
    G0 X{x} Y{y}           ; rapid move
    G1 Z{drillZ} F{plunge} ; drill
    G0 Z{safeZ}            ; retract
M5 ; spindle off
G0 X0 Y0 ; home
M30 ; end
```

**Delphi G-Code differences** (`delphi/CNCDril_r01.pas` `Button6Click`):
- Uses `G83` canned drill cycle (peck drilling) instead of manual G1/G0
- Supports helical interpolation for oversized tools (G02 arc commands)
- Adds line numbering (`N001`, `N002`, ...) when `CheckBox5` is enabled
- More complex tool change sequence with M05/M06 pauses
- Reads all parameters from `StringGrid4` cells at runtime

**G-Code Generator implementations:**
| Platform | File | Class |
|----------|------|-------|
| Python | `python/cncdrill.py` | `class GCodeGenerator` |
| Web | `web/gcode-generator.js` | `class GCodeGenerator` |
| Node.js | `nodejs/cncdril.mjs` | `class GCodeGen` |
| Delphi | `delphi/CNCDril_r01.pas` | `Button6Click` procedure |

**G-Code parameters:**
| Param | Default | Description |
|-------|---------|-------------|
| `safeZ` | 5.0 | Safe travel height (mm) |
| `drillZ` | -2.0 | Drill depth (mm) |
| `feedRate` | 100 | Feed rate (mm/min) |
| `plungeRate` | 50 | Plunge rate (mm/min), usually feedRate/2 |
| `toolChangeX` | 0.0 | X position for tool changes |
| `toolChangeY` | 0.0 | Y position for tool changes |

## Per-Implementation Architecture

### Delphi (`delphi/`)

Monolithic VCL Forms application. All logic in a single form unit.

```text
CNCDril.dpr (project entry)
  └── CNCDril_r01.pas (Form1 — everything)
        ├── parser()         — DRL line-by-line parser
        ├── extxy()          — extract X/Y from coordinate string
        ├── exttc()          — extract T/C from tool definition
        ├── SortByX()        — bubble sort by X
        ├── SortByY()        — bubble sort by Y
        ├── SortByPath()     — OPTICS nearest-neighbor
        │   └── optics_recurse()
        ├── jgraph()         — TImage canvas visualization
        ├── Button6Click()   — G-Code generation
        ├── Button11Click()  — file open + parse + sort + draw
        ├── Button12Click()  — save G-Code to file
        ├── Button13Click()  — reload file
        └── Button7Click/8Click — load/save config
```

**Data storage:** Global arrays — `XY[0..20, 0..1000] of TLPoint`, `XYTools[0..20] of TTools`. Fixed capacity: 20 tools × 1000 holes each.

**UI:** Delphi VCL `TForm` with `TTabbedNotebook` (Source, CNC, Tools, Graph tabs), `TImage` for canvas, `TMemo` for source/G-Code display, `TStringGrid` for tool parameters and coordinates.

**Visualization:** Direct VCL `TCanvas` drawing on `TImage` with color-coded tool paths and animated drawing support.

### Python CLI (`python/cncdrill.py`)

Clean module structure with CLI via `argparse`.

```text
cncdrill.py
  ├── class Point          — coordinate with distance_to()
  ├── class Tool           — tool definition
  ├── class DRLParser      — parse_drl(path) → (tools, holes)
  ├── class OptimizationAlgorithms
  │   ├── sort_by_x()      — bubble sort
  │   ├── sort_by_y()      — bubble sort
  │   └── optics_optimization() — nearest-neighbor
  ├── class GCodeGenerator — generate(tools, holes, optimized) → str
  ├── t(key, lang, **kw)   — translation helper
  ├── TRANSLATIONS{}       — 6-language strings
  ├── print_summary()      — console output
  └── main()               — argparse CLI entry point
```

**Pattern:** Single file, all classes defined at module level. `if __name__ == '__main__': main()`.

### Python GUI (`python/cncdrill_gui.py`)

Tkinter GUI wrapping `cncdrill.py` core classes.

```text
cncdrill_gui.py
  ├── from cncdril import DRLParser, OptimizationAlgorithms, GCodeGenerator, ...
  ├── class CNCDrilGUI
  │   ├── setup_ui()         — Tkinter layout with matplotlib canvas
  │   ├── load_file()        — file dialog → parse → plot
  │   ├── plot_holes()       — matplotlib scatter + path lines
  │   ├── generate_gcode()   — GCodeGenerator → status update
  │   ├── save_gcode()       — file dialog write
  │   └── set_language()     — UI language switch + rebuild
  └── main()                 — root = tk.Tk() → CNCDrilGUI(root)
```

**Visualization:** Matplotlib `FigureCanvasTkAgg` embedded in Tkinter. Scatter plot + path lines per tool.

**Fallback:** If `from cncdril import ...` fails, defines stub classes inline.

### Node.js CLI (`nodejs/cncdril.mjs`)

Single-file ESM module with no external dependencies.

```text
cncdril.mjs
  ├── import { readFileSync, writeFileSync } from 'node:fs'
  ├── const T = {}           — 6-language translations
  ├── t(key, lang, data)     — translation helper
  ├── class Point            — with distanceTo() using Math.hypot
  ├── class Tool
  ├── class DRLParser        — parse(content) → { tools, holes }
  ├── class Optimizer
  │   ├── sortByX()          — bubble sort
  │   ├── sortByY()          — bubble sort
  │   └── sortByPath()       — nearest-neighbor
  ├── class GCodeGen         — generate(tools, holes, opt) → string
  ├── parseArgs(argv)        — manual CLI arg parser
  └── main()                 — parse → optimize → generate → write/stdout
```

**Pattern:** Pure ESM, zero dependencies. Uses `Math.hypot` for distance instead of `Math.sqrt(Math.pow(...))`.

### Web Browser (`web/`)

Multi-file browser application with script-tag loading (no bundler).

```text
index.html (entry — loads scripts via <script> tags)
  ├── locales.js       — translations{} + t() + formatTemplate()
  ├── parser.js        — Point, Tool, DRLParser classes
  ├── optimizer.js     — OptimizationAlgorithms class
  ├── gcode-generator.js — GCodeGenerator class
  ├── ui.js            — UIManager class (canvas viz)
  ├── styles.css       — all CSS
  └── cncdrill.js      — bootstrap, events, orchestration
        ├── init()           — DOMContentLoaded → wireEvents + UIManager
        ├── loadFile()       — FileReader → parseContent
        ├── parseContent()   — DRLParser.parseDRL → optimizeAndDraw
        ├── optimizeAndDraw() — OptimizationAlgorithms.optimize per tool
        ├── generateGCode()  — GCodeGenerator → preview + download
        ├── downloadGCode()  — Blob + createObjectURL download
        └── applyLanguage()  — DOM text replacement from translations
```

**Script load order (from `index.html`):**
1. `locales.js` — defines `translations` global and `t()` function
2. `parser.js` — defines `Point`, `Tool`, `DRLParser`
3. `optimizer.js` — defines `OptimizationAlgorithms`
4. `gcode-generator.js` — defines `GCodeGenerator`
5. `ui.js` — defines `UIManager`
6. `cncdrill.js` — orchestrator, depends on all above

**State management:** Single global `currentData = { tools, holes, optimized, gcode }` in `cncdrill.js`.

**Visualization:** HTML5 Canvas 2D via `UIManager` class. Supports pan (mouse drag), zoom (scroll wheel), path display toggle, coordinate tooltip.

**File loading:** Drag-and-drop on `#file_drop_zone` or `<input type="file">` click. Uses `FileReader.readAsText()`.

### Standalone HTML (`standalone/cncdril.html`)

Single 50KB self-contained file combining all web modules.

```text
cncdril.html
  ├── <style>        — all CSS inlined
  ├── <script> #1    — translations + t() + formatTemplate()
  ├── <script> #2    — Point, Tool, DRLParser
  ├── <script> #3    — OptimizationAlgorithms
  ├── <script> #4    — GCodeGenerator
  ├── <script> #5    — UIManager
  └── <script> #6    — cncdrill.js orchestration (init, events, file handling)
```

Identical runtime behavior to `web/` — same classes, same logic, same UI. The standalone version is the web version concatenated into a single file with inline `<script>` blocks. No server required.

## Design Patterns Used

### 1. Shared Algorithm Pattern (Cross-Cutting)
All 5 implementations replicate identical algorithms independently. There is no shared library or code generation. Changes to the core logic must be applied 5 times:
- Bubble sort for X/Y ordering
- Nearest-neighbor greedy for path optimization
- Regex-based DRL parsing
- Sequential G-Code emission

### 2. Pipeline Pattern
Every implementation follows: **Parse → Optimize → Generate** as a linear, stateless pipeline. The parsed data (`tools` + `holes`) flows through optimization into G-Code generation without backtracking.

### 3. Per-Tool Processing
Optimization and G-Code generation operate independently per tool ID. The tool ID order is sorted numerically. Each tool's holes are optimized in isolation — there is no cross-tool optimization.

### 4. Translation Dictionary Pattern
All implementations embed translations as a `Dict[str, Dict[str, str]]` keyed by language code. Template substitution via `{placeholder}` syntax. The `t(key, lang, **kwargs)` helper is replicated in every implementation.

### 5. Class-Based Domain Objects
`Point`, `Tool`, `DRLParser`, `OptimizationAlgorithms`, and `GCodeGenerator` are implemented as classes in all JavaScript and Python implementations. Delphi uses records and functions. The class APIs are nearly identical across platforms.

## Error Handling

**Strategy:** Fail-fast with clear error messages.

**Patterns:**
- File not found: `sys.exit(1)` / `process.exit(1)` / `alert()`
- Parse failure: caught at top level, reported to user, no partial state
- Missing tools: early exit with error message
- Python CLI: `argparse` validates arguments before execution
- Web: file extension check (`.drl` only), `try/catch` around `parseDRL()`

## Architectural Constraints

- **No shared code:** All 5 implementations are independent. Bug fixes and feature additions must be synchronized manually.
- **Bubble sort:** SortByX and SortByY use O(n²) bubble sort to match the original Delphi implementation. Adequate for typical drill files (< 1000 holes per tool).
- **Fixed capacity (Delphi only):** `XY[0..20, 0..1000]` limits Delphi to 20 tools × 1000 holes. All other implementations use dynamic data structures.
- **Synchronous processing:** All implementations parse/optimize/generate synchronously. No async or streaming. Acceptable given typical file sizes (< 10K holes).
- **Global state (Delphi):** The Delphi implementation uses unit-level global variables for all parsed data (`XY`, `XYTools`, `tooln`, `drilln`, etc.).
- **Script-tag loading (Web):** No module bundler; scripts are loaded via `<script>` tags in dependency order. Globals are used for inter-module communication.
- **No test coverage for G-Code output:** Tests verify parsing and optimization. G-Code generation output is not tested end-to-end.

---

*Architecture analysis: 2026-05-09*
