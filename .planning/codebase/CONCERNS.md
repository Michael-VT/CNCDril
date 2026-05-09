# Codebase Concerns

**Analysis Date:** 2026-05-09

## Technical Debt

### Bubble Sort Used for All Sorting Algorithms
- Issue: Both `SortByX` and `SortByY` use O(n^2) bubble sort across all 5 implementations. Comments say "matches Delphi implementation" — this is a deliberate parity decision but becomes a performance liability with large drill files.
- Files: `python/cncdrill.py:348-369`, `web/optimizer.js:10-38`, `nodejs/cncdril.mjs:217-230`, `standalone/cncdril.html:930-970`, `delphi/CNCDril_r01.pas:914-970`
- Impact: For files with >1000 holes per tool, bubble sort becomes noticeably slow. O(n^2) vs O(n log n) for built-in sort.
- Fix approach: Replace with `.sort()` / `sorted()` using a comparison key. The Delphi reference is a 1:1 port — algorithm parity tests would catch any regression.

### Hardcoded Array Bounds in Delphi
- Issue: Global arrays use fixed sizes: `XY[0..10000, 0..20]`, `XYTools[0..20]`. Files with >10001 holes per tool or >21 tools will silently overflow.
- Files: `delphi/CNCDril_r01.pas:99-102`
- Impact: Data corruption or access violations for large boards. Modern PCBs can exceed these limits.
- Fix approach: Migrate to dynamic arrays (`array of array of TLPoint`) or impose documented limits with runtime checks.

### Single-File Standalone HTML at 1574 Lines / 50KB
- Issue: `standalone/cncdril.html` contains all CSS, 6 language translations, parser, optimizer, G-code generator, and UI logic in one file. Any change requires editing a 50KB file with no modularity.
- Files: `standalone/cncdril.html`
- Impact: High maintenance friction. Bug fixes must be applied both to the modular web/ files AND this monolith. Divergence risk is high.
- Fix approach: Generate `standalone/cncdril.html` via a build script that concatenates the modular `web/` sources. Eliminate manual synchronization.

### `YOUR_USERNAME` Placeholder in URLs
- Issue: Python GUI and some references still contain `https://github.com/YOUR_USERNAME/CNCDril`.
- Files: `python/cncdrill_gui.py:13`, `python/cncdrill_gui.py:28` (fallback block)
- Impact: Broken links in the GUI and about dialog. Looks unfinished.
- Fix approach: Replace with the actual GitHub organization/username.

### Inches Parsing Mismatch
- Issue: The Delphi parser uses `fkoef := 10000` for INCH files (line `delphi/CNCDril_r01.pas:771`), meaning it divides raw coordinates by 10000. The Python/JS parsers always divide by 1000 regardless of METRIC/INCH flag. The metric flag is detected but never used for coordinate scaling in the modern implementations.
- Files: `delphi/CNCDril_r01.pas:767-771`, `python/cncdrill.py:332-333`, `web/parser.js:80-82`, `nodejs/cncdril.mjs:177-179`
- Impact: INCH-mode DRL files will produce incorrect coordinates in Python/Node/Web versions. Only the Delphi version handles inch scaling correctly.
- Fix approach: Apply a scale factor based on the detected unit: metric `/1000`, inch `/10000`. Add test coverage for INCH-mode files.

## Code Duplication

### Core Logic Duplicated Across 5 Implementations
- The DRL parser, optimization algorithms, and G-code generator are independently implemented 5 times: Delphi, Python, Node.js, Web (modular), and Standalone HTML.
- The `standalone/cncdril.html` is a verbatim copy of the `web/` modules concatenated inline.
- `nodejs/cncdril.mjs` reimplements the same parser/optimizer/generator that exists in `web/parser.js`, `web/optimizer.js`, `web/gcode-generator.js`.
- Files: `python/cncdrill.py`, `nodejs/cncdril.mjs`, `web/parser.js`, `web/optimizer.js`, `web/gcode-generator.js`, `standalone/cncdril.html`
- Impact: Any algorithm fix or enhancement must be applied in 4-5 places. Missed updates create behavioral divergence.
- Fix approach: Define a shared algorithm specification (pseudo-code or a reference test suite). Consider generating the standalone HTML from `web/` sources via build script.

### Point/Tool Classes Defined Repeatedly
- `Point` class with `distanceTo` defined in: `web/parser.js:4-18`, `nodejs/cncdril.mjs:134-139`, `standalone/cncdril.html:820-835`
- Python uses its own `Point` class in `python/cncdrill.py:16-27`.
- Files: See above.
- Impact: Low. Classes are small and stable. Risk is acceptable given different language ecosystems.

## Error Handling Gaps

### Silent Parser Failures
- Issue: The DRL parser in all JS implementations silently ignores malformed lines — it only matches known patterns and skips everything else. A corrupted file with partially valid content will produce output with no warning that data was lost.
- Files: `web/parser.js:52-95`, `nodejs/cncdril.mjs:157-185`, `standalone/cncdril.html:855-920`
- Impact: A truncated or corrupt DRL file produces G-code with missing holes. The CNC operator has no indication that output is incomplete.
- Fix approach: Track unparsed non-comment, non-empty lines. Warn if count exceeds threshold. Add a "holes expected vs. parsed" validation.

### Empty try/catch Blocks
- Issue: `web/cncdrill.js:20` wraps `localStorage.getItem` in `try { } catch(e){}` with empty catch. `web/cncdrill.js:106` does the same for `setItem`. Errors are silently swallowed.
- Files: `web/cncdrill.js:20`, `web/cncdrill.js:106`
- Impact: If localStorage is corrupted or blocked, language preference silently resets on every page load with no diagnostics.
- Fix approach: Log to console in catch blocks: `catch(e) { console.warn('localStorage unavailable:', e); }`

### Broad Exception Catch in Python CLI
- Issue: `python/cncdrill.py:525` uses `except Exception as e:` which catches everything including `KeyboardInterrupt` and `SystemExit`.
- Files: `python/cncdrill.py:522-524`
- Impact: Ctrl+C during file parsing is caught and reported as a parse error rather than terminating.
- Fix approach: Use `except (ValueError, IOError, OSError) as e:` or re-raise `KeyboardInterrupt`/`SystemExit`.

### Python GUI Fallback Hides Import Failures
- Issue: `python/cncdrill_gui.py:19-39` catches `ImportError` and provides a stubbed `DRLParser` that returns empty dicts. The GUI will launch but silently do nothing useful.
- Files: `python/cncdrill_gui.py:19-39`
- Impact: User sees a window but cannot parse files. No error message indicates the core module is missing.
- Fix approach: Show a messagebox warning on fallback activation, or fail fast with a clear error.

### No NaN/Infinity Validation on Parsed Coordinates
- Issue: `parseFloat()` / `float()` on malformed numeric strings produces `NaN` or `Infinity` which propagates through optimization and into G-code output.
- Files: `web/parser.js:82-83`, `nodejs/cncdril.mjs:178-179`, `python/cncdrill.py:332-333`
- Impact: G-code with NaN coordinates could cause unpredictable CNC machine behavior.
- Fix approach: Validate parsed coordinates with `isFinite()` / `math.isfinite()` before adding to holes array.

## Security Considerations

### No Input Size Limits
- Issue: The web version accepts any file via drag-and-drop with no size check. A multi-GB file would crash the browser tab.
- Files: `web/cncdrill.js:113-120`, `standalone/cncdril.html` (file input handler)
- Impact: Denial of service in browser context. Low severity (self-hosted tool) but should be defended.
- Fix approach: Check `file.size` before reading. Reject files above a reasonable limit (e.g., 10MB).

### File Extension Check Only in Web Version
- Issue: `web/cncdrill.js:115` checks `file.name.toLowerCase().endsWith('.drl')` but this is trivially bypassed. The parser itself does no content-type validation.
- Files: `web/cncdrill.js:115`
- Impact: Low. The tool is local-only. But accepting arbitrary file content without any header validation could produce unexpected G-code.
- Fix approach: Validate first few lines for expected DRL header patterns (`M48`, `%;`, `METRIC`/`INCH`).

### No Content Security Policy in Web Version
- Issue: `web/index.html` and `standalone/cncdril.html` have no CSP headers. All scripts are inline.
- Files: `web/index.html`, `standalone/cncdril.html`
- Impact: Low for a local/offline tool. If served over network, XSS risk exists.
- Fix approach: Add `<meta http-equiv="Content-Security-Policy">` if the app is ever served remotely.

## Maintainability Risks

### Standalone HTML Must Be Manually Synchronized
- Issue: `standalone/cncdril.html` is a hand-maintained copy of the modular `web/` sources. Any change to `web/parser.js`, `web/optimizer.js`, `web/gcode-generator.js`, `web/locales.js`, `web/styles.css`, or `web/ui.js` must be duplicated.
- Files: `standalone/cncdril.html`
- Impact: High risk of divergence. Already contains the same code with minor formatting differences.
- Fix approach: Create a build step (`node build-standalone.js`) that concatenates web/ sources into the standalone HTML template.

### Delphi Code Has No Tests
- Issue: The Delphi implementation (`delphi/CNCDril_r01.pas`, 1161 lines) has no automated test coverage. The parser, sorting, and G-code generation are untested.
- Files: `delphi/CNCDril_r01.pas`
- Impact: Any change to the Delphi version risks introducing regressions with no safety net. The Delphi version is also the reference implementation for algorithm parity.
- Fix approach: Add DUnit/DUnitX tests, or validate Delphi output against known-correct G-code fixtures.

### No Type Checking in JavaScript
- Issue: All JS implementations (web, node, standalone) use plain JavaScript with no TypeScript, JSDoc type hints, or runtime type checking.
- Files: `web/*.js`, `nodejs/cncdril.mjs`, `standalone/cncdril.html`
- Impact: Type errors (e.g., passing a string where a number is expected) are caught only at runtime, often in the form of incorrect G-code output rather than a clear error.
- Fix approach: Add JSDoc `@typedef` and `@param` annotations at minimum. Consider TypeScript for the Node.js version.

### Delphi VCL Coupling — Business Logic in Event Handlers
- Issue: Sort functions (`SortByX`, `SortByY`, `SortByPath`) in `delphi/CNCDril_r01.pas` directly mutate global arrays and update `StringGrid` UI components. No separation between algorithm and presentation.
- Files: `delphi/CNCDril_r01.pas:893-912` (SortByPath), `delphi/CNCDril_r01.pas:914-947` (SortByX), `delphi/CNCDril_r01.pas:949-975` (SortByY)
- Impact: Cannot test or reuse the algorithms independently of the VCL form. Makes migration or refactoring risky.
- Fix approach: Extract pure algorithm functions that operate on typed arrays, then call them from event handlers.

## Performance Considerations

### O(n^2) SortByPath / OPTICS for Every Tool
- Issue: The nearest-neighbor algorithm is O(n^2) per tool group — for each of n points, it scans all remaining points. For a board with 5000 holes under one tool, this is ~25M comparisons.
- Files: `python/cncdrill.py:371-395`, `web/optimizer.js:44-78`, `nodejs/cncdril.mjs:221-234`, `delphi/CNCDril_r01.pas:893-912`
- Impact: Acceptable for typical PCB sizes (<500 holes). Becomes slow for panelized boards or dense BGA breakouts.
- Fix approach: Use a KD-tree or spatial index for nearest-neighbor queries, reducing to O(n log n). Only needed if large files become common.

### Bubble Sort O(n^2) for SortByX/SortByY
- Issue: Bubble sort is used instead of the language's built-in O(n log n) sort.
- Files: Same as above.
- Impact: 1000 holes: ~500K comparisons (fast). 10000 holes: ~50M comparisons (noticeable pause).
- Fix approach: Use native `.sort()` with comparator. Verify parity against Delphi output with the example DRL file.

### Canvas Redraw on Every Mouse Move During Drag
- Issue: `web/ui.js:33-40` calls `this.draw()` on every `mousemove` event while dragging. `draw()` iterates all holes and draws circles/lines.
- Files: `web/ui.js:33-40`
- Impact: With many holes, dragging feels sluggish. The browser must re-render the entire canvas at 60fps.
- Fix approach: Use `requestAnimationFrame` to throttle redraws. Cache the static drill visualization in an off-screen canvas and only transform coordinates during drag.

### Delphi Array Initialization Loops
- Issue: `delphi/CNCDril_r01.pas:919-925` initializes a `[0..20, 0..1000]` array with nested loops on every file open. This is 20K iterations.
- Files: `delphi/CNCDril_r01.pas:919-925`
- Impact: Negligible for the array size, but the hardcoded bounds are the real problem (see above).
- Fix approach: Use `FillChar` or `ZeroMemory` for bulk initialization. Migrate to dynamic arrays.

## Cross-Platform Consistency

### Algorithm Parity: SortByX / SortByY — X-Tiebreaker Differs
- Issue: Delphi `SortByX` has a secondary sort by Y when X values are equal (`if (ax = bx) and (ay > by)`). Python/JS versions do NOT have this tiebreaker — they only compare X.
- Files: `delphi/CNCDril_r01.pas:941-945` (has tiebreaker) vs. `python/cncdrill.py:355-357` (no tiebreaker), `web/optimizer.js:16-18` (no tiebreaker)
- Impact: Points at identical X but different Y positions will sort differently across implementations. For most boards this is cosmetic, but it means G-code output is not reproducible across platforms.
- Fix approach: Add Y-tiebreaker to Python/JS `SortByX`, and X-tiebreaker to `SortByY`, matching Delphi behavior.

### Algorithm Parity: OPTICS Implementation Differs
- Issue: Delphi uses a recursive `optics_recurse` with `sort_from_center` that sorts ALL remaining points by distance, then picks the farthest one. Python/JS implementations use simple nearest-neighbor (pick the closest). These produce different paths.
- Files: `delphi/CNCDril_r01.pas:868-890` (recursive, picks farthest after sort) vs. `python/cncdrill.py:371-395` (iterative, picks nearest)
- Impact: SortByPath output differs between Delphi and all other implementations. The code comments say "matches Delphi SortByPath implementation" but this is incorrect.
- Fix approach: Verify the Delphi algorithm behavior with the example file. Either align all implementations to the Delphi behavior, or document the difference and update the comments.

### G-Code Format Differences: Delphi vs. Modern Implementations
- Issue: The Delphi version generates G83 canned cycles (`G83 R... Z-... Q...`) and helical milling (G02 arcs) for slot drilling. The Python/Node/Web versions generate simple G1 drill moves (`G1 Z-... F...`). These are fundamentally different CNC strategies.
- Files: `delphi/CNCDril_r01.pas:410-450` (G83 + helical) vs. `python/cncdrill.py:432-435` (simple G1)
- Impact: The same DRL file produces G-code with different CNC semantics. The Delphi output supports peck drilling and slot milling; the modern versions do not.
- Fix approach: Document that the modern implementations use a simplified drilling strategy. Consider adding G83 support to the Python/JS generators as an option.

### Node.js Uses `Math.hypot` for Distance — Others Use Manual sqrt
- Issue: `nodejs/cncdril.mjs:136` uses `Math.hypot(this.x - o.x, this.y - o.y)` while all others use `Math.sqrt(Math.pow(this.x - other.x, 2) + ...)`. `Math.hypot` is numerically more stable (avoids overflow for very large coordinates) but the difference is negligible for PCB-scale values.
- Files: `nodejs/cncdril.mjs:136` vs. `web/parser.js:11`
- Impact: No practical difference for typical DRL files. Consistency only matters for exact bit-identical output across implementations.
- Fix approach: Use `Math.hypot` everywhere for consistency and clarity. Or standardize on the explicit formula.

### Coordinate Division Always by 1000
- Issue: All modern implementations divide coordinates by 1000 (`parseFloat(xm[1])/1000`). The Delphi version uses a dynamic `fkoef` based on detected format (METRIC/TZ vs METRIC/LZ vs INCH). If a DRL file specifies `METRIC,TZ` or has different zero-suppression, the modern parsers will produce wrong coordinates.
- Files: `delphi/CNCDril_r01.pas:767-771` (dynamic fkoef) vs. `python/cncdrill.py:332` (hardcoded /1000)
- Impact: Files using trailing-zero suppression or INCH mode will have incorrect coordinates in all non-Delphi implementations.
- Fix approach: Parse the METRIC/INCH format string to determine coordinate divisor. Apply format-appropriate scaling.

## Missing Infrastructure

### No CI/CD Pipeline
- Issue: No GitHub Actions, Travis CI, or any automated testing pipeline exists. Tests must be run manually.
- Files: No `.github/workflows/`, no `.travis.yml`, no `Makefile`
- Impact: Regressions across the 5 implementations are not caught automatically. Code duplication amplifies the risk.
- Fix approach: Add GitHub Actions workflow running Python tests (`python -m pytest`), Node.js tests (`node nodejs/test/test.mjs`), and web tests (`node web/test/test.mjs`).

### No Linting or Formatting Configuration
- Issue: No ESLint, Prettier, Flake8, Black, or any linting configuration. Code style is inconsistent (e.g., semicolons in some JS files, omitted in others).
- Files: No config files found.
- Impact: Style inconsistencies accumulate. PR reviews focus on formatting rather than logic.
- Fix approach: Add `.eslintrc.json` for JS, `pyproject.toml` with `[tool.ruff]` for Python. Run in CI.

### No Build System for Standalone HTML
- Issue: `standalone/cncdril.html` is maintained by hand. No build script concatenates the modular `web/` sources into it.
- Files: No `build.js`, `Makefile`, or similar.
- Impact: Every change to web/ must be manually duplicated. Divergence is inevitable.
- Fix approach: Create a build script that generates standalone HTML from web/ sources. Run it in CI to detect drift.

### No Integration Tests Across Implementations
- Issue: Tests exist for Python (13 tests), Web (11 tests), and Node.js (8 tests), but they only test within their own implementation. No test verifies that all implementations produce identical (or equivalent) output for the same input.
- Files: `python/test_cncdril.py`, `web/test/test.mjs`, `nodejs/test/test.mjs`
- Impact: Algorithm parity is assumed but unverified. The OPTICS difference (see above) would be caught by a cross-implementation test.
- Fix approach: Create a shared test fixture (the example DRL file + expected output per algorithm). Run each implementation against it and compare results.

### No Package Lockfile for Node.js
- Issue: `nodejs/package.json` exists but no `package-lock.json` was found. Dependencies could resolve differently across installs.
- Files: `nodejs/package.json`
- Impact: Non-reproducible builds. A dependency update could break the CLI.
- Fix approach: Run `npm install` to generate `package-lock.json`. Commit it.

### No `.gitignore` Visibility
- Issue: No `.gitignore` was found in the explored files. `__pycache__`, `.pyc`, `node_modules/`, and other generated artifacts may be committed.
- Files: Not found.
- Impact: Repository bloat, potential credential leaks.
- Fix approach: Add a comprehensive `.gitignore` covering Python, Node.js, and editor artifacts.

---

*Concerns audit: 2026-05-09*
