# Coding Conventions

**Analysis Date:** 2026-05-09

## Naming Conventions

### JavaScript (Node.js CLI — `nodejs/cncdril.mjs`)

- **Classes:** PascalCase — `Point`, `Tool`, `DRLParser`, `Optimizer`, `GCodeGen`
- **Methods:** camelCase — `distanceTo()`, `parse()`, `sortByX()`, `optimize()`
- **Variables:** camelCase — `currentTool`, `totalHoles`, `nearestDist`
- **Constants:** UPPER_SNAKE_CASE — `VERSION`, `PROJECT`, `GITHUB`, `LICENSE`, `BIN`, `EXAMPLE`, `OUT`
- **Translation map:** Single uppercase letter `T` holding nested `{ lang: { key: value } }`
- **Translation function:** Single letter `t(key, lang, data)` with `{placeholder}` interpolation
- **File extension:** `.mjs` (ES modules with `import` syntax)

### JavaScript (Web modules — `web/`)

- **Classes:** PascalCase — `Point`, `Tool`, `DRLParser`, `OptimizationAlgorithms`, `GCodeGenerator`, `UIManager`
- **Methods:** camelCase — `distanceTo()`, `parseDRL()`, `sortByX()`, `opticsOptimization()`, `calculatePathLength()`
- **Variables:** camelCase — `currentTool`, `totalHoles`, `nearestIdx`
- **Constants:** `var` declarations — `VERSION`, `PROJECT`, `GITHUB` in `cncdrill.js`
- **Translation function:** `t(key, lang)` with `formatTemplate()` for `{placeholder}` replacement
- **Module export pattern:** UMD-like — `if (typeof module !== 'undefined' && module.exports) { module.exports = {...} }` at file end
- **File extension:** `.js` (CommonJS export for Node test runner, browser `<script>` for web)

### JavaScript (Standalone — `standalone/cncdril.html`)

- Single-file: all CSS, HTML, and JS inlined
- Same class/method naming as web modules
- Uses `var` for global state (matches web `cncdrill.js` style)

### Python (`python/cncdrill.py`, `python/cncdrill_gui.py`)

- **Classes:** PascalCase — `Point`, `Tool`, `DRLParser`, `OptimizationAlgorithms`, `GCodeGenerator`
- **Methods:** snake_case — `distance_to()`, `parse_drl()`, `sort_by_x()`, `optics_optimization()`
- **Variables:** snake_case — `current_tool`, `total_holes`, `nearest_dist`, `tool_id`
- **Constants:** UPPER_SNAKE_CASE — `VERSION`, `PROJECT`, `GITHUB`, `LICENSE`, `EXAMPLE_DRL`
- **Translation map:** `TRANSLATIONS` dict, `GUI_TRANSLATIONS` dict in GUI file
- **Translation function:** `t(key, lang, **kwargs)` with Python `.format()` interpolation
- **Type hints:** Used on method signatures — `def distance_to(self, other: 'Point') -> float:`
- **Docstrings:** Triple-quoted on all classes and public methods
- **File encoding:** UTF-8, `#!/usr/bin/env python3` shebang

### Delphi (`delphi/CNCDril_r01.pas`)

- **Records:** PascalCase — `TLPoint`, `TTools`
- **Global arrays:** PascalCase with abbreviations — `XYLp`, `XYL`, `XY`, `XYCOR`, `XYtools`
- **Variables:** camelCase — `drill_L`, `drill_H`, `cfg_file`, `StatusStr`
- **Event handlers:** Component+Event convention — `Button6Click`, `OpenDRLFile1Click`, `FormCreate`
- **Functions:** PascalCase — `CNStr()`, `desep()`
- **No separate modules:** Everything in one `.pas` unit + `.dfm` form

## Code Style

### JavaScript — Node.js (`nodejs/cncdril.mjs`)

- **Indentation:** 2 spaces
- **Quotes:** Single quotes for strings, backticks for template literals
- **Semicolons:** Present and consistent
- **Module system:** ES modules (`import`/`export` implied by `.mjs`)
- **Section markers:** `// ---------- Name ----------` to divide logical sections
- **Compact style:** Multiple short statements on one line in hot paths
  ```javascript
  constructor(x, y) { this.x = x; this.y = y; }
  ```
- **Error handling:** `try { ... } catch { ... }` with `process.exit(1)` on failure

### JavaScript — Web modules (`web/*.js`)

- **Indentation:** 4 spaces
- **Quotes:** Single quotes for strings; template literals for formatted output
- **Semicolons:** Present and consistent
- **Module system:** UMD pattern — works as both browser `<script>` (no modules) and CommonJS `require()`
- **String concatenation:** Mix of template literals and `+` operator (older code in `gcode-generator.js` uses `+`)
- **Var vs const/let:** `var` in `cncdrill.js` (global scope); `const`/`let` in parser/optimizer modules

### Python

- **Indentation:** 4 spaces
- **Quotes:** Double quotes for strings
- **Line length:** Generally under 100 characters
- **Import order:** stdlib → third-party → local, grouped with blank lines
- **String formatting:** f-strings for output, `.format()` for translation templates
- **CLI:** `argparse` for argument parsing

### CSS (`web/styles.css`, inline in `standalone/cncdril.html`)

- **Indentation:** 4 spaces
- **Selector grouping:** One property per line
- **Color scheme:** Flat design — `#2c3e50` header, `#3498db` accents, `#333` body text
- **Layout:** CSS Grid for two-column layout, Flexbox for header

### Delphi

- **Indentation:** 2 spaces
- **Naming:** Heavily abbreviated variable names (`fkoef`, `ukof`, `udkof`, `koftr`)
- **Form design:** Visual form designer — `.dfm` file (450KB) stores component layout
- **No comments:** Minimal inline documentation

## Error Handling Patterns

### Node.js CLI (`nodejs/cncdril.mjs`)

- `try/catch` around file reads; on failure → `console.error(t('err_no_file', ...))` then `process.exit(1)`
- No custom error classes — uses string error messages via translation function
- CLI argument validation: missing input triggers help output + exit code 1
- G-Code generation has no error handling (assumes valid parsed input)

### Web modules (`web/`)

- `try/catch` in `cncdrill.js` `loadFile()` for FileReader errors
- Parser silently ignores malformed lines (non-matching lines are skipped)
- UI shows `alert()` for user-facing errors
- No structured error types — string-based error communication

### Python (`python/cncdrill.py`)

- `argparse` validates CLI arguments before execution
- `try/except Exception as e` around `parse_drl()` in `main()` — prints error + `sys.exit(1)`
- File existence checked via `Path.exists()` before parsing
- `open()` with `encoding='utf-8', errors='ignore'` for tolerant file reading
- G-Code generation has no error handling (assumes valid parsed input)

### Common Pattern Across Implementations

- **Parser:** Silent line-skipping on unrecognized input — no warnings, no error accumulation
- **Optimizer:** No error handling — pure computation, assumes valid Point objects
- **G-Code Generator:** No validation — assumes all required fields exist on objects
- **CLI entry points:** File-not-found and empty-tool-list are the only explicitly handled error cases

## Internationalization Pattern

All implementations share the same i18n architecture:

### Structure

- **6 languages:** `en`, `ru`, `uk`, `pt`, `de`, `fr`
- **Translation keys:** snake_case string keys — `"total_tools"`, `"err_no_file"`, `"tool_info"`
- **Interpolation:** `{placeholder}` syntax in template strings
- **Fallback:** Default to `en` if requested language is missing

### Per-Implementation

| Implementation | Translation Store | Function | Interpolation |
|---|---|---|---|
| Node.js CLI (`nodejs/cncdril.mjs`) | `const T = { en: {...}, ru: {...} }` | `t(key, lang, data)` | `String.replace('{k}', data[k])` |
| Web (`web/locales.js`) | `const translations = { en: {...} }` | `t(key, lang)` | `formatTemplate(template, data)` |
| Python (`python/cncdrill.py`) | `TRANSLATIONS = { "en": {...} }` | `t(key, lang, **kwargs)` | `str.format(**kwargs)` |
| Python GUI (`python/cncdrill_gui.py`) | Separate `GUI_TRANSLATIONS` dict | Same pattern | Same pattern |
| Standalone (`standalone/cncdril.html`) | Inline JS object | Same as web | Same as web |

### Key Differences

- Node.js uses short keys (`total_tools`) while Python uses the same keys but with `**kwargs` format specifiers (`{diameter:.2f}`)
- Python has additional keys for CLI help text (`help_description`, `help_epilog`) not present in JS versions
- Web version has a separate `locales.js` file; all others embed translations inline

## Documentation Conventions

### Inline Comments

- **Node.js:** Section dividers (`// ---------- Name ----------`), inline comments on regex patterns
- **Web:** JSDoc-style `/** */` comments on class methods in `optimizer.js` and `parser.js`
- **Python:** Docstrings on all classes and public methods (triple-quoted)
- **Delphi:** Essentially no comments

### README Files

Each implementation directory has its own `README.md`:
- `README.md` — Project overview (English)
- `README.RU.md`, `README.UA.md`, `README.FR.md`, `README.DE.md`, `README.PT.md` — Translated overviews
- `python/README.md`, `nodejs/README.md`, `web/README.md` — Platform-specific usage docs

### Header Comments

- Source files begin with a block comment stating project name, version, purpose
- Example (`python/cncdrill.py`): `"""CNCDril - CNC Drill File Optimizer\nVersion: 2.0.0\n..."""`
- Example (`nodejs/cncdril.mjs`): `// CNCDril - CNC Drill File Optimizer v2.0.0`

## Git Conventions

### Commit Style

- **Format:** Imperative mood, short summary — `Add multi-platform CNCDril implementation`, `Update README.md`
- **No conventional commits:** No `feat:`, `fix:`, or scope prefixes
- **No co-authoring:** Single-author commits
- **Branching:** Appears to use a single `main`/`master` branch — no feature branches observed in recent history

### .gitignore

- Comprehensive per-platform ignore rules in a single `.gitignore`
- Covers: Delphi artifacts (`.dcu`, `.exe`), Python (`__pycache__/`, `.pyc`), Web (`node_modules/`), IDE files (`.vscode/`, `.idea/`), OS files (`.DS_Store`)
- Excludes build outputs: `output.nc`, `*.nc.bak`

### Version

- All implementations share version `2.0.0`, defined as a constant in each entry point
- No automated version management — manual sync required across implementations

---

*Convention analysis: 2026-05-09*
