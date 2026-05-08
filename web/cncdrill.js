// Main CNCDril Web Application

let currentLanguage = 'en';
let parser = null;
let uiManager = null;
let currentData = {
    tools: {},
    holes: {},
    optimized: {},
    gcode: ''
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Detect browser language
    const browserLang = navigator.language.slice(0, 2);
    if (translations[browserLang]) {
        currentLanguage = browserLang;
    }
    
    // Initialize UI manager
    uiManager = new UIManager();
    
    // Setup event listeners
    setupEventListeners();
    
    // Apply initial translations
    applyLanguage(currentLanguage);
    document.getElementById('language_selector').value = currentLanguage;
}

function setupEventListeners() {
    // File input
    const fileInput = document.getElementById('file_input');
    const dropZone = document.getElementById('file_drop_zone');
    
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    
    // Clear file button
    document.getElementById('clear_file').addEventListener('click', clearFile);
    
    // Language selector
    document.getElementById('language_selector').addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });
    
    // Optimization algorithm change
    document.getElementById('optimize_algorithm').addEventListener('change', () => {
        if (currentData.holes && Object.keys(currentData.holes).length > 0) {
            optimizeAndDraw();
        }
    });
    
    // Generate G-Code button
    document.getElementById('generate_btn').addEventListener('click', generateGCode);
    
    // Download G-Code button
    document.getElementById('download_btn').addEventListener('click', downloadGCode);
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    // Validate file extension
    if (!file.name.toLowerCase().endsWith('.drl')) {
        showError('error_invalid_file');
        return;
    }
    
    // Read file
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        parseDRLFile(content, file.name);
    };
    reader.onerror = () => {
        showError('error_parse_failed');
    };
    reader.readAsText(file);
}

function parseDRLFile(content, filename) {
    try {
        parser = new DRLParser();
        const result = parser.parseDRL(content);
        
        currentData.tools = result.tools;
        currentData.holes = result.holes;
        
        // Update UI
        document.getElementById('file_info').style.display = 'flex';
        document.getElementById('file_name').textContent = filename;
        document.getElementById('drop_zone_text').style.display = 'none';
        
        // Update tools info
        uiManager.updateToolsInfo(currentData.tools, currentData.holes);
        
        // Optimize and draw
        optimizeAndDraw();
        
        // Update status
        updateStatus('canvas_status_loaded', { file: filename });
        
    } catch (error) {
        console.error('Parse error:', error);
        showError('error_parse_failed');
    }
}

function optimizeAndDraw() {
    const algorithm = document.getElementById('optimize_algorithm').value;
    
    currentData.optimized = {};
    
    Object.entries(currentData.holes).forEach(([toolId, points]) => {
        currentData.optimized[toolId] = OptimizationAlgorithms.optimize(points, algorithm);
    });
    
    uiManager.setData(currentData.tools, currentData.holes, currentData.optimized);
}

function generateGCode() {
    if (!currentData.holes || Object.keys(currentData.holes).length === 0) {
        showError('error_no_file');
        return;
    }
    
    try {
        updateStatus('canvas_status_generating');
        
        // Get parameters
        const params = {
            safeZ: parseFloat(document.getElementById('safe_z').value),
            drillZ: parseFloat(document.getElementById('drill_z').value),
            feedRate: parseFloat(document.getElementById('feed_rate').value),
            plungeRate: parseFloat(document.getElementById('feed_rate').value) / 2,
            toolChangeX: 0.0,
            toolChangeY: 0.0,
        };
        
        // Generate G-Code
        const generator = new GCodeGenerator(params);
        currentData.gcode = generator.generate(currentData.tools, currentData.holes, currentData.optimized);
        
        // Update UI
        document.getElementById('gcode_preview').value = currentData.gcode;
        document.getElementById('download_btn').disabled = false;
        
        // Calculate stats
        const totalHoles = Object.values(currentData.holes).reduce((sum, holes) => sum + holes.length, 0);
        updateStatus('canvas_status_done', { holes: totalHoles });
        
        showSuccess('success_generated', { holes: totalHoles });
        
    } catch (error) {
        console.error('Generation error:', error);
        showError('error_parse_failed');
    }
}

function downloadGCode() {
    if (!currentData.gcode) return;
    
    const blob = new Blob([currentData.gcode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.nc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function clearFile() {
    currentData = {
        tools: {},
        holes: {},
        optimized: {},
        gcode: ''
    };
    
    document.getElementById('file_input').value = '';
    document.getElementById('file_info').style.display = 'none';
    document.getElementById('drop_zone_text').style.display = 'block';
    document.getElementById('tools_info').innerHTML = `<p id="no_file_message">${t('no_file_message')}</p>`;
    document.getElementById('gcode_preview').value = '';
    document.getElementById('download_btn').disabled = true;
    
    uiManager.setData(null, null, null);
    updateStatus('canvas_status_ready');
}

function setLanguage(lang) {
    currentLanguage = lang;
    applyLanguage(lang);
    
    // Save preference
    localStorage.setItem('cncdril_language', lang);
}

function applyLanguage(lang) {
    // Apply translations to elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key, lang);
    });
    
    // Update specific elements
    document.getElementById('app_title').textContent = t('app_title', lang);
    document.getElementById('file_section_title').textContent = t('file_section_title', lang);
    document.getElementById('drop_zone_label').textContent = t('drop_zone_label', lang);
    document.getElementById('optimization_title').textContent = t('optimization_title', lang);
    document.getElementById('algorithm_label').textContent = t('algorithm_label', lang);
    document.getElementById('parameters_title').textContent = t('parameters_title', lang);
    document.getElementById('safe_z_label').textContent = t('safe_z_label', lang);
    document.getElementById('drill_z_label').textContent = t('drill_z_label', lang);
    document.getElementById('feed_rate_label').textContent = t('feed_rate_label', lang);
    document.getElementById('tools_title').textContent = t('tools_title', lang);
    document.getElementById('generate_btn').textContent = t('generate_button', lang);
    document.getElementById('download_btn').textContent = t('download_button', lang);
    document.getElementById('gcode_preview_title').textContent = t('gcode_preview_title', lang);
    document.getElementById('preview_title').textContent = t('preview_title', lang);
    document.getElementById('show_paths_label').textContent = t('show_paths_label', lang);
    document.getElementById('edit_mode_label').textContent = t('edit_mode_label', lang);
    
    // Update algorithm options
    const algorithmSelect = document.getElementById('optimize_algorithm');
    algorithmSelect.options[0].text = t('algorithm_none', lang);
    algorithmSelect.options[1].text = t('algorithm_x', lang);
    algorithmSelect.options[2].text = t('algorithm_y', lang);
    algorithmSelect.options[3].text = t('algorithm_path', lang);
}

function updateStatus(key, data = {}) {
    const statusEl = document.getElementById('canvas_status');
    const template = t(key, currentLanguage);
    statusEl.textContent = formatTemplate(template, data);
}

function showError(key) {
    // Simple alert for errors - could be enhanced with a toast notification
    alert(t(key, currentLanguage));
}

function showSuccess(key, data = {}) {
    // Simple alert for success - could be enhanced with a toast notification
    const template = t(key, currentLanguage);
    alert(formatTemplate(template, data));
}