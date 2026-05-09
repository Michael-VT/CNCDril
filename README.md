# CNCDril - CNC Drill File Optimizer

Multi-platform drill file optimizer for converting P-CAD/Altium .drl files to optimized G-Code for CNC machines.

## Features

- **Multiple Platforms**: Delphi VCL, Python CLI/GUI, Node.js CLI, Web-based, and Standalone HTML versions
- **Optimization Algorithms**:
  - SortByX: Sort holes by X coordinate
  - SortByY: Sort holes by Y coordinate
  - SortByPath (OPTICS): Distance-based path optimization
- **Visualization**: Interactive drill path preview with animation
- **Multi-language**: Support for 6 languages (EN, RU, UK, PT, DE, FR)
- **Cross-platform**: Windows, Linux, macOS, and Web browsers

## Versions

### Delphi Version (Original)
- **Location**: `delphi/`
- **Requirements**: Delphi 6.0 or higher
- **Features**: Full-featured VCL desktop application
- **Usage**: Open `CNCDril.dpr` in Delphi IDE and compile

### Python Version
- **Location**: `python/`
- **Requirements**: Python 3.7+, matplotlib, numpy
- **Features**: CLI and GUI interfaces
- **Tests**: `python/test_cncdril.py` (13 tests)
- **Installation**: See `python/README.md`

### Node.js Version
- **Location**: `nodejs/`
- **Requirements**: Node.js 14+ (zero dependencies)
- **Features**: CLI with 6 languages, same algorithms as all other versions
- **Tests**: `nodejs/test/test.mjs` (13 tests)
- **Usage**: `node cncdril.mjs input.drl -o output.nc`

### Web Version
- **Location**: `web/`
- **Requirements**: Modern web browser (no server needed)
- **Features**: Drag-and-drop, interactive visualization, multi-language
- **Tests**: `web/test/test.mjs` (10 tests)
- **Usage**: Open `web/index.html` in a browser

### Standalone HTML Version
- **Location**: `standalone/cncdril.html`
- **Requirements**: Modern web browser only — no server, no installation
- **Features**: Single self-contained HTML file with all CSS and JavaScript inlined
- **Usage**: Open `standalone/cncdril.html` directly in any browser (works via file:// protocol)
- **Same functionality** as the web version: DRL parsing, 3 optimization algorithms, G-Code generation, interactive canvas visualization, 6 languages

## Quick Start

### Delphi Version
1. Open `delphi/CNCDril.dpr` in Delphi IDE
2. Compile and run
3. Load .drl file and generate G-Code

### Python Version
```bash
cd python
pip install -r requirements.txt
python cncdrill.py ../examples/RPCB0827_FIXTURE.DRL -o output.nc
```

### Node.js Version
```bash
cd nodejs
node cncdril.mjs ../examples/RPCB0827_FIXTURE.DRL -o output.nc

# With language
node cncdril.mjs ../examples/RPCB0827_FIXTURE.DRL --language ru -o output.nc
```

### Web Version
```bash
cd web
python -m http.server 8000
# Navigate to http://localhost:8000
```

### Standalone HTML Version
Open `standalone/cncdril.html` in any modern web browser. No server required.

## Testing

### Run All Tests
```bash
# Node.js CLI tests (13 tests)
node nodejs/test/test.mjs

# Web JS module tests (10 tests)
node web/test/test.mjs

# Python tests (13 tests)
cd python && python -m unittest test_cncdril -v
```

### Test Coverage
| Variant | Tests | Coverage |
|---------|-------|----------|
| Node.js CLI | 13 | Help, version, parse, G-Code generation, all 6 languages, error handling |
| Web JS modules | 10 | Point, Tool, DRLParser, all 3 optimization algorithms |
| Python | 13 | Parser, tool diameters, SortByX/Y, OPTICS, G-Code generation, file output |

## File Format

### Input (.drl)
P-CAD/Altium drill files with:
- Tool definitions (T01C1.73)
- Coordinate data (X+005004Y+017894)
- Metric and inch units
- Multiple tools per file

### Output (.nc)
Standard CNC G-Code:
- Tool change commands (T1 M6)
- Safe travel movements (G0 Z5.0)
- Drilling operations (G1 Z-2.0)
- Compatible with most CNC controllers

## Example

The `examples/` directory contains `RPCB0827_FIXTURE.DRL`:
- 7 tools (Ø1.73mm to Ø10.16mm)
- 102 holes total
- Metric units

## Optimization

The OPTICS (Ordering Points To Identify the Clustering Structure) algorithm minimizes tool travel distance by:
1. Finding nearest unvisited hole
2. Moving to that hole
3. Repeating until all holes are visited

This typically reduces total travel distance by 30-50% compared to unsorted paths.

## Multi-language Support

All versions support:
- English (EN)
- Russian (RU)
- Ukrainian (UK)
- Portuguese (PT)
- German (DE)
- French (FR)

Default language is English across all versions.

## Repository Structure

```
CNCDril/
├── README.md              # This file (English)
├── README.RU.md           # Russian documentation
├── README.UA.md           # Ukrainian documentation
├── README.PT.md           # Portuguese documentation
├── README.DE.md           # German documentation
├── README.FR.md           # French documentation
├── .gitignore            # Git ignore rules
├── LICENSE               # MIT License
│
├── delphi/               # Original Delphi application
│   ├── CNCDril.dpr      # Project file
│   ├── CNCDril_r01.pas  # Main source
│   ├── CNCDril_r01.dfm  # Form definition
│   ├── CNCDril.res      # Resources
│   └── README.md        # Delphi-specific docs
│
├── python/              # Python implementation
│   ├── cncdrill.py     # CLI application
│   ├── cncdrill_gui.py # GUI application
│   ├── test_cncdril.py # Test suite (13 tests)
│   ├── requirements.txt # Dependencies
│   └── README.md       # Python-specific docs
│
├── nodejs/              # Node.js CLI implementation
│   ├── cncdril.mjs     # CLI application
│   ├── package.json    # Package config
│   ├── test/
│   │   └── test.mjs   # Test suite (13 tests)
│   └── README.md       # Node.js-specific docs
│
├── web/                 # Web application (multi-file)
│   ├── index.html      # Main interface
│   ├── styles.css      # Styling
│   ├── locales.js      # Translations
│   ├── parser.js       # DRL parser
│   ├── optimizer.js    # Optimization algorithms
│   ├── gcode-generator.js # G-Code generation
│   ├── ui.js           # Canvas visualization
│   ├── cncdrill.js     # Main application
│   ├── test/
│   │   └── test.mjs   # Test suite (10 tests)
│   └── README.md       # Web-specific docs
│
├── standalone/          # Standalone single-file HTML
│   └── cncdril.html    # Self-contained (no server needed)
│
└── examples/            # Example files
    └── RPCB0827_FIXTURE.DRL
```

## Comparison of Versions

| Feature | Delphi | Python | Node.js | Web | Standalone HTML |
|---------|--------|--------|---------|-----|-----------------|
| Desktop GUI | ✅ | ✅ | ❌ | ❌ | ❌ |
| Command Line | ❌ | ✅ | ✅ | ❌ | ❌ |
| Web Interface | ❌ | ❌ | ❌ | ✅ | ✅ |
| Visualization | ✅ | ✅ | ❌ | ✅ | ✅ |
| Offline Use | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cross-platform | Windows | ✅ | ✅ | ✅ | ✅ |
| Installation | Required | Required | Node.js | None | None |
| Server Needed | ❌ | ❌ | ❌ | Optional | ❌ |
| Single File | ❌ | ❌ | ✅ | ❌ | ✅ |
| Tests | — | ✅ 13 | ✅ 13 | ✅ 10 | — |
| Performance | Best | Good | Good | Good | Good |

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please ensure:
- Code follows project conventions
- All optimization algorithms match Delphi implementation
- G-Code output is validated
- Multi-language support is maintained
- Documentation is updated
- Tests are added for new features

## Authors

- Original Delphi version: [Original Author]
- Python/Web/Node.js implementation: [Contributors]

## Acknowledgments

- OPTICS algorithm implementation
- P-CAD/Altium file format support
- CNC community feedback and testing

## Screenshots

### Delphi Application

| Screenshot | Description |
|---|---|
| ![Main Window](docs/screenshots/CNCDril_01.png) | Main Window |
| ![Sort by X](docs/screenshots/CNCDril_02-Sort_by_X.png) | Sort by X Optimization |
| ![Sort by Y](docs/screenshots/CNCDril_03-Sort_by_Y.png) | Sort by Y Optimization |
| ![Sort by Path](docs/screenshots/CNCDril_04-Sort_by_path.png) | Sort by Path (OPTICS) |
| ![Source Code](docs/screenshots/CNCDril_05-code-source.png) | Source Code |
| ![Tool Parameters](docs/screenshots/CNCDril_06-Set-tools-parametr.png) | Tool Parameters |
| ![All Coordinates](docs/screenshots/CNCDril_07-All-drilling-coordinat.png) | All Drilling Coordinates |

### Web Application v2.0

| Screenshot | Description |
|---|---|
| ![Web Interface 1](docs/screenshots/CNCDril_08-All-drilling-by-web.png) | Web Interface - Main View |
| ![Web Interface 2](docs/screenshots/CNCDril_09-All-drilling-by-web.png) | Web Interface - G-Code Generation |
| ![Web Interface 3](docs/screenshots/CNCDril_10-All-drilling-by-web.png) | Web Interface - Visualization |

## Version History

- **v1.0** - Original Delphi implementation
- **v2.0** - Python CLI/GUI, Node.js CLI, Web, and Standalone HTML versions added
