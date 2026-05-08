# CNCDril - Python Implementation

Python implementation of CNCDril drill file optimizer with both CLI and GUI interfaces.

## Features

- **CLI Interface**: Command-line tool for batch processing and automation
- **GUI Interface**: Tkinter-based graphical interface with visualization
- **Optimization Algorithms**: 
  - SortByX: Sort holes by X coordinate
  - SortByY: Sort holes by Y coordinate  
  - SortByPath (OPTICS): Distance-based path optimization
- **Visualization**: Real-time preview of drill paths with matplotlib
- **Multi-language**: English and Russian interface support (GUI)

## Installation

### Requirements
- Python 3.7 or higher
- matplotlib (for GUI)
- numpy (for calculations)

### Install Dependencies

```bash
pip install -r requirements.txt
```

Or install manually:
```bash
pip install matplotlib numpy
```

## Usage

### CLI Interface

Basic usage:
```bash
python cncdrill.py input.drl -o output.nc
```

List tools and holes only:
```bash
python cncdrill.py input.drl --list-only
```

Specify optimization algorithm:
```bash
python cncdril.py input.drl -o output.nc --optimize path
```

Available algorithms: `none`, `x`, `y`, `path`

Custom parameters:
```bash
python cncdrill.py input.drl -o output.nc \
    --optimize path \
    --safe-z 10.0 \
    --drill-z -2.5 \
    --feed-rate 150
```

### GUI Interface

Launch the GUI:
```bash
python cncdrill_gui.py
```

**Features:**
- Drag-and-drop file loading
- Real-time visualization of drill paths
- Interactive parameter adjustment
- Tool and hole information display
- G-Code generation and preview
- Language switching (English/Russian)

## Example

```python
from cncdril import DRLParser, OptimizationAlgorithms, GCodeGenerator

# Parse DRL file
parser = DRLParser()
tools, holes = parser.parse_drl('example.drl')

# Optimize drill paths
optimized_holes = {}
for tool_id, points in holes.items():
    optimized_holes[tool_id] = OptimizationAlgorithms.optics_optimization(points)

# Generate G-Code
generator = GCodeGenerator()
gcode = generator.generate(tools, holes, optimized_holes)

# Save to file
with open('output.nc', 'w') as f:
    f.write(gcode)
```

## File Format

Supports P-CAD/Altium .drl files:
- Header with tool definitions (T01C1.73)
- Coordinate data (X+005004Y+017894)
- Metric and inch units
- Multiple tools per file

## G-Code Output

Generates standard CNC G-Code:
- Tool change commands
- Safe travel movements
- Drilling operations
- Proper feed rates and spindle control
- Compatible with most CNC controllers

## Comparison with Delphi Version

The Python version produces identical G-Code to the original Delphi implementation:
- Same optimization algorithms
- Same coordinate parsing
- Same G-Code format
- Additional visualization capabilities
- Cross-platform compatibility

## License

Same license as the main CNCDril project.

## Contributing

Contributions are welcome! Please ensure:
- Code follows PEP 8 style guidelines
- All optimization algorithms match Delphi implementation
- G-Code output is validated against original version
- Multi-language support is maintained
## Screenshots

### Web Interface v2.0

The project also includes a web-based interface:

|Screenshot|Description|
|---|---|
|![Web 1](../docs/screenshots/CNCDril_08-All-drilling-by-web.png)|Web Interface - Main View|
|![Web 2](../docs/screenshots/CNCDril_09-All-drilling-by-web.png)|Web Interface - G-Code Generation|
|![Web 3](../docs/screenshots/CNCDril_10-All-drilling-by-web.png)|Web Interface - Visualization|