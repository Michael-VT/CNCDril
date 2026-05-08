# CNCDril - Web Implementation

Browser-based implementation of CNCDril drill file optimizer using pure HTML, CSS, and JavaScript.

## Features

- **Pure JavaScript**: No server required, runs entirely in the browser
- **Drag & Drop**: Easy file upload with drag and drop support
- **Interactive Visualization**: Canvas-based drill path preview
- **Real-time Optimization**: See optimization results instantly
- **Multi-language**: Support for 6 languages (EN, RU, UK, PT, DE, FR)
- **Edit Mode**: Interactive hole editing (add/remove positions)
- **G-Code Generation**: Download optimized G-Code files
- **Responsive Design**: Works on desktop and mobile devices

## Usage

### Local Usage

Simply open `index.html` in a modern web browser:

```bash
# Using Python's built-in server
python -m http.server 8000

# Or using Node.js http-server
npx http-server
```

Then navigate to `http://localhost:8000`

### Online Deployment

The web application can be deployed to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront

## File Support

### Input Format
- P-CAD/Altium .drl files
- Metric and inch units
- Multiple tools per file
- Tool definitions (T01C1.73)
- Coordinate data (X+005004Y+017894)

### Output Format
- Standard CNC G-Code (.nc files)
- Tool change commands
- Safe travel movements
- Optimized drill paths
- Compatible with most CNC controllers

## Optimization Algorithms

1. **None**: Original hole order
2. **Sort by X**: Sorts holes by X coordinate
3. **Sort by Y**: Sorts holes by Y coordinate
4. **Sort by Path (OPTICS)**: Distance-based optimization (recommended)

## Architecture

```
web/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── locales.js          # Multi-language translations
├── parser.js           # DRL file parser
├── optimizer.js        # Optimization algorithms
├── gcode-generator.js  # G-Code generation
├── ui.js              # Canvas visualization and UI management
└── cncdrill.js        # Main application logic
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Features in Detail

### Visualization
- Interactive canvas with pan and zoom
- Color-coded tools
- Path visualization with toggle option
- Real-time coordinate display
- Responsive to window resizing

### Editing (Planned)
- Click to add holes
- Click to remove holes
- Drag to reposition holes
- Undo/redo support

### Multi-language Support
- English (EN)
- Russian (RU)
- Ukrainian (UK)
- Portuguese (PT)
- German (DE)
- French (FR)

Language detection is automatic based on browser settings.

## Performance

- Handles files with 1000+ holes efficiently
- Real-time optimization without blocking UI
- Optimized canvas rendering
- Minimal memory footprint

## Security

- All processing happens client-side
- No data sent to servers
- No external dependencies
- Safe for offline use

## Comparison with Other Versions

### Advantages over Python/Delphi:
- No installation required
- Cross-platform compatibility
- Interactive visualization
- Easier to share and deploy
- Mobile-friendly interface

### Limitations:
- Limited by browser memory
- No batch processing
- No command-line interface
- Slightly slower for very large files

## Development

### Project Structure
Each module is self-contained:
- `parser.js`: DRL file parsing logic
- `optimizer.js`: Path optimization algorithms
- `gcode-generator.js`: G-Code generation
- `ui.js`: Canvas rendering and interaction
- `cncdrill.js`: Main application coordination

### Adding New Languages

1. Add translations to `locales.js`
2. Update language selector in `index.html`
3. Test all UI elements

### Extending Functionality

The modular architecture makes it easy to add:
- New optimization algorithms
- Additional file formats
- Custom G-Code dialects
- Enhanced editing features

## License

Same license as the main CNCDril project.

## Contributing

Contributions are welcome! Please ensure:
- Code follows ES6+ standards
- All optimization algorithms match Delphi implementation
- G-Code output is validated
- Multi-language support is maintained
- Responsive design is preserved