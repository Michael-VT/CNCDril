# CNCDril - Node.js CLI v2.0.0

CNC drill file optimizer — Node.js CLI variant. Zero dependencies.

Converts P-CAD/Altium `.drl` files to optimized G-Code for CNC machines.

 A standalone HTML version is also available at `standalone/cncdril.html` -- a single self-contained file that runs in any browser without a server or Node.js.

## Quick Start

```bash
# No install needed
node cncdril.mjs input.drl -o output.nc

# With language
node cncdril.mjs input.drl --language ru --list-only

# Global install (optional)
npm install -g .
cncdril input.drl -o output.nc
```

## Features

- **Zero dependencies** — pure Node.js, no `npm install` needed
- **6 languages** — EN, RU, UK, PT, DE, FR
- **3 optimization algorithms** — SortByX, SortByY, SortByPath (OPTICS)
- **Version 2.0.0** — metadata in every G-Code file
- **Cross-platform** — any OS with Node.js 14+

## Usage

```
Usage: cncdril <input.drl> [options]

Options:
  -o, --output FILE    Output G-Code file (.nc)
  --optimize ALGO      x | y | path | none  (default: path)
  --language LANG      en ru uk pt de fr    (default: en)
  --safe-z MM          Safe travel height   (default: 5)
  --drill-z MM         Drill depth          (default: -2)
  --feed-rate MM/MIN   Feed rate            (default: 100)
  --list-only          Show summary only
  --version            Show version
  -h, --help           Show this help
```

## Examples

```bash
# Basic
node cncdril.mjs ../examples/RPCB0827_FIXTURE.DRL -o output.nc

# Russian interface
node cncdril.mjs ../examples/RPCB0827_FIXTURE.DRL --language ru -o output.nc

# Summary only
node cncdril.mjs ../examples/RPCB0827_FIXTURE.DRL --list-only --language uk

# Custom parameters
node cncdril.mjs input.drl -o out.nc --optimize path --safe-z 10 --drill-z -3
```

## Output

G-Code with metadata header:

```gcode
% CNCDril G-Code Output
% Version 2.0.0
% GitHub: https://github.com/AntiquityMC/CNCDril
G21 ; mm
G90 ; absolute
G0 Z5.000 ; safe
...
M30
```

## Screenshots

| Screenshot | Description |
|---|---|
| ![Web 1](../docs/screenshots/CNCDril_08-All-drilling-by-web.png) | Web Interface - Main View |
| ![Web 2](../docs/screenshots/CNCDril_09-All-drilling-by-web.png) | Web Interface - G-Code Generation |
| ![Web 3](../docs/screenshots/CNCDril_10-All-drilling-by-web.png) | Web Interface - Visualization |

## Comparison with other versions

| Feature | Python CLI | Node.js CLI | Web | Standalone HTML |
|---------|-----------|-------------|-----|-----------------|
| Install needed | pip install | node.js only | Browser | None |
| Dependencies | matplotlib, numpy | None | None | None |
| Languages | 6 | 6 | 6 | 6 |
| File I/O | Native | Native | Browser API | Browser API |
| CI/CD friendly | Yes | Yes | No | No |

## Testing

```bash
node nodejs/test/test.mjs
```

**13 tests** covering:
- DRL file parsing (coordinates, tools, units)
- G-Code generation
- Optimization algorithms (SortByX, SortByY, SortByPath)
- CLI argument handling
- Edge cases (empty input, single tool, multiple tools)

## License

MIT