# CNCDril - Web Implementation v2.0

Browser-based implementation of CNCDril drill file optimizer using pure HTML, CSS, and JavaScript.

## 🎉 Version 2.0 Features

### 🌍 Multi-language Support (6 Languages)
- **English (EN)**, **Russian (RU)**, **Ukrainian (UK)**
- **Portuguese (PT)**, **German (DE)**, **French (FR)**
- Automatic browser language detection
- Language preference saved in localStorage
- Complete interface localization

### 🆘 Help System
- **Help Button** (❓) in header
- **About Dialog** with comprehensive information
- **F1** keyboard shortcut for help
- **Footer Links** to GitHub and Documentation
- Version information displayed everywhere

### 📊 Version Information
- **Version**: 2.0.0 displayed in header and footer
- **G-Code Metadata**: Version and GitHub in every generated file
- **Console Logging**: Version info on application start
- **About Dialog**: Complete project information

### 🔗 GitHub Integration
- Direct links to GitHub repository
- Links to documentation (README)
- G-Code contains GitHub URL
- Footer with project links

## Features

- **Pure JavaScript**: No server required, runs entirely in browser
- **Drag & Drop**: Easy file upload with drag and drop support
- **Interactive Visualization**: Canvas-based drill path preview with pan/zoom
- **Real-time Optimization**: See optimization results instantly
- **Multi-language**: Complete support for 6 languages
- **Edit Mode**: Interactive hole editing (add/remove positions) - coming soon
- **G-Code Generation**: Download optimized G-Code files with metadata
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Usage

### Local Usage

Simply open `index.html` in a modern web browser:

```bash
# Using Python's built-in server
cd web
python -m http.server 8000

# Or using Node.js http-server
npx http-server

# Or any other static server
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

### Online Deployment

The web application can be deployed to any static hosting service:
- **GitHub Pages** (recommended for this project)
- Netlify
- Vercel
- AWS S3 + CloudFront
- Surge.sh

## File Support

### Input Format
- P-CAD/Altium .drl files
- Metric and inch units
- Multiple tools per file
- Tool definitions (T01C1.73)
- Coordinate data (X+005004Y+017894)

### Output Format
- Standard CNC G-Code (.nc files)
- **Enhanced with metadata**:
  ```g-code
  % CNCDril G-Code Output
  % Version 2.0.0
  % GitHub: https://github.com/YOUR_USERNAME/CNCDril
  % Generated: 2024-05-08T10:30:00.000Z
  ```
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
├── index.html          # Main HTML structure with Help button
├── styles.css          # Styling with modal and footer styles
├── locales.js          # Multi-language translations + About content
├── parser.js           # DRL file parser
├── optimizer.js        # Optimization algorithms
├── gcode-generator.js  # G-Code generation with version info
├── ui.js              # Canvas visualization and UI management
├── cncdril.js        # Main application with Help system
└── README.md          # This file
```

## New in v2.0

### Enhanced Header
```html
<div class="header-left">
    <h1>CNCDril - Drill File Optimizer</h1>
    <span class="version">v2.0.0</span>
</div>
<div class="header-controls">
    <button id="help_btn">❓ Help</button>
    <select id="language_selector">...</select>
</div>
```

### About Dialog
- **Professional Modal Design**
- **Complete Project Information**
- **Features List**
- **Quick Start Guide**
- **GitHub and Documentation Links**
- **F1 Keyboard Shortcut**

### Footer
```
© 2024 CNCDril Contributors | GitHub | v2.0.0 | Documentation
```

### Enhanced G-Code Output
```gcode
% CNCDril G-Code Output
% Version 2.0.0
% GitHub: https://github.com/YOUR_USERNAME/CNCDril
% Generated: 2024-05-08T10:30:00.000Z
G21 ; Set units to mm
G90 ; Absolute positioning
G0 Z5.000 ; Move to safe height
...
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Performance

- Handles files with 1000+ holes efficiently
- Real-time optimization without blocking UI
- Optimized canvas rendering (60fps)
- Minimal memory footprint (<100MB)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **F1** | Open Help/About dialog |
| **Escape** | Close modal dialogs |

## Security

- All processing happens client-side
- No data sent to servers
- No external dependencies
- Safe for offline use
- No API keys or secrets

## JavaScript Module System

The application uses modern JavaScript ES6+ modules:
- `class` syntax for all components
- `const`/`let` for variable declarations
- Arrow functions
- Template literals
- Async/await where needed
- Modules ready for bundling

## Comparison with Other Versions

### Advantages over Python/Delphi:
- **No installation required** - just open in browser
- **Cross-platform compatibility** - works anywhere
- **Interactive visualization** - better than Python matplotlib
- **Easier to share and deploy** - just send a link
- **Mobile-friendly** - works on tablets and phones
- **Instant updates** - no need to reinstall

### Limitations:
- Limited by browser memory (very large files)
- No batch processing
- No command-line interface
- Slightly slower for extremely large files

## Development

### Adding New Languages

1. Add translations to `locales.js`
2. Update language selector in `index.html`
3. Add About content in `aboutTranslations`
4. Test all UI elements

### Extending Functionality

The modular architecture makes it easy to add:
- New optimization algorithms
- Additional file formats
- Custom G-Code dialects
- Enhanced editing features
- Export to different formats

## Help System

### Accessing Help
1. Click **❓ Help** button in header
2. Press **F1** keyboard shortcut
3. Click links in footer

### About Dialog Contains
- Project title and version
- Feature list
- Quick start guide
- GitHub repository link
- Documentation link
- License information

## Localization

The application supports 6 languages with complete translations:
- User interface elements
- Error messages
- Status messages
- Help dialog content
- Tooltips

## Testing

### Manual Testing Checklist
- [x] All 6 languages work correctly
- [x] Help dialog opens with F1
- [x] GitHub links work
- [x] Version displayed correctly
- [x] G-Code contains metadata
- [x] File upload works
- [x] All optimization algorithms produce valid output
- [x] Canvas visualization works
- [x] Download functionality works

## Future Enhancements

- [ ] Advanced editing mode (click to add/remove holes)
- [ ] Undo/redo support
- [ ] 3D visualization
- [ ] Export to different G-Code dialects
- [ ] Batch file processing
- [ ] Save/load project files
- [ ] Print optimization report
- [ ] Integration with CNC simulators

## License

MIT License - See root LICENSE file for details

## Contributing

Contributions are welcome! Please ensure:
- Code follows ES6+ standards
- All optimization algorithms match Delphi/Python implementations
- G-Code output is validated
- Multi-language support is maintained
- Help dialogs are updated for new features
- Responsive design is preserved

## Screenshots

|Screenshot|Description|
|---|---|
|![Main View](../docs/screenshots/CNCDril_08-All-drilling-by-web.png)|Main Interface with File Upload|
|![G-Code Generation](../docs/screenshots/CNCDril_09-All-drilling-by-web.png)|G-Code Generation and Preview|
|![Visualization](../docs/screenshots/CNCDril_10-All-drilling-by-web.png)|Drill Path Visualization|