# Testing Patterns

**Analysis Date:** 2026-05-09

## Test Infrastructure

### Node.js CLI Tests (`nodejs/test/test.mjs`)

- **Runner:** Custom harness — no framework. Uses `node:assert` for assertions
- **Run command:** `node nodejs/test/test.mjs` (from project root)
- **Style:** Integration/black-box tests — invokes the CLI via `child_process.execSync()`
- **Assertions:** `assert.ok()`, `assert.strictEqual()` from Node built-in
- **Test runner pattern:**
  ```javascript
  let passed = 0;
  let failed = 0;
  function run(name, fn) {
    try { fn(); passed++; console.log(`  PASS  ${name}`); }
    catch (e) { failed++; console.log(`  FAIL  ${name}`); console.log(`        ${e.message}`); }
  }
  ```
- **Exit code:** `process.exit(failed > 0 ? 1 : 0)`

### Web Module Tests (`web/test/test.mjs`)

- **Runner:** Custom harness — same pattern as Node.js CLI tests
- **Run command:** `node web/test/test.mjs` (from project root)
- **Style:** Unit tests — imports modules directly via `createRequire()` to use CommonJS exports
- **Assertions:** `node:assert` — `assert.strictEqual()`, `assert.ok()`
- **Module loading:**
  ```javascript
  import { createRequire } from 'module';
  const require = createRequire(import.meta.url);
  const { Point, Tool, DRLParser } = require('../parser.js');
  const { OptimizationAlgorithms } = require('../optimizer.js');
  ```
- **Exit code:** `process.exit(1)` on failure

### Python Tests (`python/test_cncdril.py`)

- **Runner:** `unittest` standard library
- **Run command:** `python python/test_cncdril.py` or `cd python && python -m pytest test_cncdril.py`
- **Style:** Unit tests — imports classes directly from `cncdrill` module
- **Assertions:** `self.assertEqual()`, `self.assertTrue()`, `self.assertIn()`, `self.assertAlmostEqual()`, `self.assertLessEqual()`, `self.assertRegex()`
- **Test organization:** `unittest.TestCase` subclasses grouped by component
- **Fixture loading:** `setUpClass()` classmethod loads example DRL file once per test class

### Delphi (`delphi/`)

- **No tests.** No test framework, no test files detected.

### Standalone HTML (`standalone/cncdril.html`)

- **No tests.** The standalone file bundles all logic inline; no test infrastructure.

## Test Coverage Summary

### Node.js CLI (`nodejs/test/test.mjs`) — 13 test cases

| Area | Tests | Coverage |
|---|---|---|
| CLI flags | `--help`, `--version` | Good — verifies exit code 0 and expected output |
| DRL parsing | `--list-only` with example file | Good — checks tool count (7) and hole count (102) |
| G-Code generation | Output file creation, content validation | Good — checks G21, G90, M30, T1 M6 presence |
| Internationalization | All 6 languages via loop | Good — verifies each language produces output with correct hole count |
| Error handling | Invalid file exits non-zero | Good — tests negative case |
| Optimization | `--optimize none` | Minimal — only tests that `none` doesn't crash |

**Not tested:** Optimization correctness (sortByX/sortByY/optics), individual algorithm outputs, G-Code parameter customization (safe-z, drill-z, feed-rate), file write errors, malformed DRL input.

### Web Module Tests (`web/test/test.mjs`) — 10 test cases

| Area | Tests | Coverage |
|---|---|---|
| Point class | `distanceTo()` Euclidean distance | Good — known value (3-4-5 triangle) |
| Tool class | `toString()` format | Good — checks toolId and diameter in string |
| DRL parser | Tool count, hole count, specific diameter | Good — verifies parsing against example file |
| Optimization | sortByX ascending, sortByY ascending, OPTICS count, OPTICS path reduction, pathLength calculation | Good — covers all three algorithms |

**Not tested:** G-Code generation (`gcode-generator.js`), UI code (`ui.js`), localization (`locales.js`), main controller (`cncdrill.js`), edge cases (empty file, malformed lines, tool T00 handling).

### Python Tests (`python/test_cncdril.py`) — 12 test cases

| Area | Tests | Coverage |
|---|---|---|
| DRL parser | Tool count (7), hole count (102), tool keys '01'-'07', specific diameters, metric flag | Good — thorough parser validation |
| Optimization | sortByX ascending, sortByY ascending, OPTICS count, OPTICS path reduction | Good — covers all three algorithms |
| G-Code generation | Header (G21, G90), tool change (T<n> M6), drill move (G1 Z-), footer (M30), file write/read roundtrip | Good — covers G-Code output |

**Not tested:** CLI argument parsing (`argparse`), `print_summary()` output, error paths (file not found, empty tools), parameter customization, `main()` function, GUI module (`cncdrill_gui.py`), malformed DRL input.

### Delphi — 0 test cases

No testing infrastructure exists for the Delphi implementation.

### Standalone HTML — 0 test cases

No testing infrastructure exists for the standalone implementation.

## Test Patterns

### Common Test Data

All three test suites use the same fixture file:
- **File:** `examples/RPCB0827_FIXTURE.DRL`
- **Expected values:** 7 tools, 102 total holes, tool '01' diameter 1.73, tool '07' diameter 10.16
- **No other test fixtures** — all tests use this single file

### Test Structure Patterns

**Node.js CLI (integration tests):**
```javascript
run('test name', () => {
  const out = exec(`${BIN} ${EXAMPLE} --list-only`);
  assert.ok(out.includes('102'), 'Should report 102 holes');
});
```

**Web modules (unit tests):**
```javascript
test('sortByX returns points sorted by ascending X', () => {
    const sorted = OptimizationAlgorithms.sortByX(allPoints);
    for (let i = 1; i < sorted.length; i++) {
        assert.ok(sorted[i].x >= sorted[i - 1].x, ...);
    }
});
```

**Python (unit tests):**
```python
class TestDRLParser(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.parser = DRLParser()
        cls.tools, cls.holes = cls.parser.parse_drl(EXAMPLE_DRL)

    def test_parse_example(self):
        """Parsing the example file yields 7 tools and 102 total holes."""
        self.assertEqual(len(self.tools), 7)
```

### Assertion Patterns

| Implementation | Equality | Boolean | Membership | Regex |
|---|---|---|---|---|
| Node.js CLI | `assert.strictEqual()` | `assert.ok()` | — | `/regex/.test()` |
| Web modules | `assert.strictEqual()` | `assert.ok()` | — | — |
| Python | `self.assertEqual()` | `self.assertTrue()` | `self.assertIn()` | `self.assertRegex()` |

### Custom Test Harness (JavaScript)

Both JavaScript test suites implement the same minimal runner:
- Global `passed`/`failed` counters
- `run()`/`test()` wrapper function with try/catch
- `console.log` for pass, `console.error` for fail
- `process.exit(1)` on any failure

No test discovery, no describe/it nesting, no setup/teardown (beyond manual file cleanup in Node CLI tests).

## Test Data

### Fixtures

| File | Location | Used By | Size |
|---|---|---|---|
| `RPCB0827_FIXTURE.DRL` | `examples/` | All 3 test suites | Single example file |

### No Generated Test Data

- No factories, no randomized tests, no property-based testing
- No parameterized tests (except the language loop in Node.js CLI tests)
- No edge-case fixtures (empty files, single-tool files, inch-format files, malformed DRL)

## Gaps & Recommendations

### High Priority

1. **No G-Code generation tests in web modules.** `web/gcode-generator.js` (54 lines) is imported by the web app but never tested. The `GCodeGenerator.generate()` method is verified only in Python and Node.js CLI tests.

2. **No negative/error path tests for parsers.** All implementations silently skip malformed lines. No test verifies behavior with:
   - Empty file
   - File with no tools
   - File with tools but no coordinates
   - Malformed tool definitions (e.g., `T01C` without a number)
   - Inch-format DRL files (`INCH` instead of `METRIC`)

3. **No tests for `python/cncdrill_gui.py`** (563 lines, ~10% of Python code). The GUI module imports from `cncdrill.py` but has its own fallback implementations — these fallbacks are never exercised in tests.

### Medium Priority

4. **No optimization edge case tests.** Empty point lists, single-point lists, duplicate points, and points at identical coordinates are not tested in any implementation.

5. **No test for parameter customization.** G-Code generation parameters (safe-z, drill-z, feed-rate, plunge-rate) use defaults in all tests. No test verifies custom values propagate correctly to output.

6. **No test for G-Code numerical accuracy.** Tests check for command presence (G21, G90, M30) but don't verify coordinate values in the output match expected parsed coordinates.

7. **`web/cncdrill.js` (224 lines) and `web/ui.js` (179 lines) have zero test coverage.** The main controller and UI manager are untested — though this is partially understandable for DOM-dependent code.

### Low Priority

8. **No tests for `web/locales.js`** (224 lines). Translation completeness across all 6 languages is not verified. A test could check that all language keys have the same set of translation keys.

9. **No standalone HTML tests.** The standalone file duplicates web module logic but has no test coverage.

10. **No performance/regression tests.** The OPTICS nearest-neighbor algorithm is O(n²) in the worst case. No test benchmarks performance or checks for regressions with larger inputs.

11. **No cross-implementation parity tests.** Given 5 implementations of the same algorithms, no test verifies they produce identical output for the same input.

---

*Testing analysis: 2026-05-09*
