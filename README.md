# CNCDril - CNC Drill File Optimizer

Multi-platform drill file optimizer for converting P-CAD/Altium .drl files to optimized G-Code for CNC machines.

## Features

- **Multiple Platforms**: Delphi VCL, Python CLI/GUI, and Web-based versions
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
- **Installation**: See `python/README.md`

### Web Version
- **Location**: `web/`
- **Requirements**: Modern web browser (no server needed)
- **Features**: Drag-and-drop, interactive visualization, multi-language
- **Usage**: Open `web/index.html` in a browser

## Quick Start

### Delphi Version
1. Open `delphi/CNCDril.dpr` in Delphi IDE
2. Compile and run
3. Load .drl file and generate G-Code

### Python Version
```bash
cd python
pip install -r requirements.txt
python cncdril.py ../examples/RPCB0827_FIXTURE.DRL -o output.nc
```

### Web Version
```bash
cd web
python -m http.server 8000
# Navigate to http://localhost:8000
```

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
│   ├── requirements.txt # Dependencies
│   └── README.md       # Python-specific docs
│
├── web/                 # Web application
│   ├── index.html      # Main interface
│   ├── styles.css      # Styling
│   ├── locales.js      # Translations
│   ├── parser.js       # DRL parser
│   ├── optimizer.js    # Optimization algorithms
│   ├── gcode-generator.js # G-Code generation
│   ├── ui.js           # Canvas visualization
│   ├── cncdrill.js     # Main application
│   └── README.md       # Web-specific docs
│
└── examples/            # Example files
    └── RPCB0827_FIXTURE.DRL
```

## Comparison of Versions

| Feature | Delphi | Python | Web |
|---------|--------|--------|-----|
| Desktop GUI | ✅ | ✅ | ❌ |
| Command Line | ❌ | ✅ | ❌ |
| Web Interface | ❌ | ❌ | ✅ |
| Visualization | ✅ | ✅ | ✅ |
| Offline Use | ✅ | ✅ | ✅ |
| Cross-platform | Windows | ✅ | ✅ |
| Installation | Required | Required | None |
| Performance | Best | Good | Good |

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please ensure:
- Code follows project conventions
- All optimization algorithms match Delphi implementation
- G-Code output is validated
- Multi-language support is maintained
- Documentation is updated

## Authors

- Original Delphi version: [Original Author]
- Python/Web implementation: [Contributors]

## Acknowledgments

- OPTICS algorithm implementation
- P-CAD/Altium file format support
- CNC community feedback and testing

## Version History

- **v1.0** - Original Delphi implementation
- **v2.0** - Python CLI/GUI version added
- **v3.0** - Web-based version with multi-language support