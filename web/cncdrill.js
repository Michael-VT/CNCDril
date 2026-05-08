// CNCDril Web Application v2.0.0

var VERSION = '2.0.0';
var PROJECT = 'CNCDril';
var GITHUB  = 'https://github.com/AntiquityMC/CNCDril';

var currentLanguage = 'en';
var uiManager = null;
var currentData = { tools:{}, holes:{}, optimized:{}, gcode:'' };

// ---- bootstrap ----
document.addEventListener('DOMContentLoaded', init);

function init() {
    // detect browser lang
    var bl = (navigator.language || 'en').slice(0,2);
    if (translations[bl]) currentLanguage = bl;

    // saved preference
    try { var saved = localStorage.getItem('cncdril_lang'); if (saved && translations[saved]) currentLanguage = saved; } catch(e){}

    document.getElementById('language_selector').value = currentLanguage;
    applyLanguage(currentLanguage);

    uiManager = new UIManager();
    wireEvents();
}

// ---- translation ----
function applyLanguage(lang) {
    var map = {
        'app_title':'app_title',
        'file_section_title':'file_section_title',
        'drop_zone_label':'drop_zone_label',
        'optimization_title':'optimization_title',
        'algorithm_label':'algorithm_label',
        'parameters_title':'parameters_title',
        'safe_z_label':'safe_z_label',
        'drill_z_label':'drill_z_label',
        'feed_rate_label':'feed_rate_label',
        'tools_title':'tools_title',
        'generate_btn':'generate_button',
        'download_btn':'download_button',
        'gcode_preview_title':'gcode_preview_title',
        'preview_title':'preview_title',
        'show_paths_label':'show_paths_label',
        'edit_mode_label':'edit_mode_label',
        'no_file_message':'no_file_message'
    };
    for (var id in map) {
        var el = document.getElementById(id);
        if (el) el.textContent = t(map[id], lang);
    }
    var sel = document.getElementById('optimize_algorithm');
    if (sel) {
        sel.options[0].text = t('algorithm_none', lang);
        sel.options[1].text = t('algorithm_x', lang);
        sel.options[2].text = t('algorithm_y', lang);
        sel.options[3].text = t('algorithm_path', lang);
    }
}

// ---- events ----
function wireEvents() {
    // language
    on('language_selector','change', function(e){ setLang(e.target.value); });

    // file input
    var fi = document.getElementById('file_input');
    if (fi) fi.addEventListener('change', function(e){ if(e.target.files[0]) loadFile(e.target.files[0]); });

    // drag-drop
    var dz = document.getElementById('file_drop_zone');
    if (dz) {
        dz.addEventListener('dragover', function(e){ e.preventDefault(); dz.classList.add('drag-over'); });
        dz.addEventListener('dragleave', function(){ dz.classList.remove('drag-over'); });
        dz.addEventListener('drop', function(e){ e.preventDefault(); dz.classList.remove('drag-over'); if(e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]); });
    }

    on('clear_file','click', clearFile);
    on('optimize_algorithm','change', function(){ if(Object.keys(currentData.holes).length) optimizeAndDraw(); });
    on('generate_btn','click', generateGCode);
    on('download_btn','click', downloadGCode);
    on('zoom_in','click', function(){ if(uiManager) uiManager.zoomIn(); });
    on('zoom_out','click', function(){ if(uiManager) uiManager.zoomOut(); });
    on('reset_view','click', function(){ if(uiManager) uiManager.resetView(); });
    on('show_paths','change', function(){ if(uiManager) uiManager.draw(); });

    // help
    on('help_btn','click', showAbout);
    on('about_close','click', function(){ document.getElementById('about_dialog').style.display='none'; });
    window.addEventListener('click', function(e){ var m=document.getElementById('about_dialog'); if(e.target===m) m.style.display='none'; });
    document.addEventListener('keydown', function(e){ if(e.key==='F1'){e.preventDefault(); showAbout();} });

    // footer
    on('footer_github','click', function(e){ e.preventDefault(); window.open(GITHUB,'_blank'); });
    on('footer_docs','click', function(e){ e.preventDefault(); window.open(GITHUB+'#readme','_blank'); });
}

function on(id, evt, fn) { var el=document.getElementById(id); if(el) el.addEventListener(evt, fn); }

// ---- language ----
function setLang(lang) {
    currentLanguage = lang;
    applyLanguage(lang);
    try { localStorage.setItem('cncdril_lang', lang); } catch(e){}
}

// ---- file handling ----
function loadFile(file) {
    if (!file.name.toLowerCase().endsWith('.drl')) {
        alert(t('error_invalid_file', currentLanguage));
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) { parseContent(e.target.result, file.name); };
    reader.readAsText(file);
}

function parseContent(text, filename) {
    try {
        var parser = new DRLParser();
        var result = parser.parseDRL(text);
        currentData.tools = result.tools;
        currentData.holes = result.holes;

        document.getElementById('file_info').style.display = 'flex';
        document.getElementById('file_name').textContent = filename;
        document.getElementById('drop_zone_text').style.display = 'none';

        if (uiManager) uiManager.updateToolsInfo(currentData.tools, currentData.holes);
        optimizeAndDraw();

        var st = document.getElementById('canvas_status');
        if (st) st.textContent = formatTemplate(t('canvas_status_loaded', currentLanguage), {file:filename});
    } catch(err) {
        alert(t('error_parse_failed', currentLanguage) + '\n' + err.message);
    }
}

function optimizeAndDraw() {
    var algo = document.getElementById('optimize_algorithm').value;
    currentData.optimized = {};
    for (var tid in currentData.holes) {
        currentData.optimized[tid] = OptimizationAlgorithms.optimize(currentData.holes[tid], algo);
    }
    if (uiManager) uiManager.setData(currentData.tools, currentData.holes, currentData.optimized);
}

function clearFile() {
    currentData = { tools:{}, holes:{}, optimized:{}, gcode:'' };
    document.getElementById('file_input').value = '';
    document.getElementById('file_info').style.display = 'none';
    document.getElementById('drop_zone_text').style.display = 'block';
    document.getElementById('tools_info').innerHTML = '<p id="no_file_message">' + t('no_file_message', currentLanguage) + '</p>';
    document.getElementById('gcode_preview').value = '';
    document.getElementById('download_btn').disabled = true;
    if (uiManager) uiManager.setData(null, null, null);
}

// ---- gcode ----
function generateGCode() {
    if (!Object.keys(currentData.holes).length) { alert(t('error_no_file', currentLanguage)); return; }

    var params = {
        safeZ:     parseFloat(document.getElementById('safe_z').value),
        drillZ:    parseFloat(document.getElementById('drill_z').value),
        feedRate:   parseFloat(document.getElementById('feed_rate').value),
        plungeRate: parseFloat(document.getElementById('feed_rate').value) / 2,
        toolChangeX: 0, toolChangeY: 0
    };

    var gen = new GCodeGenerator(params);
    var body = gen.generate(currentData.tools, currentData.holes, currentData.optimized);

    // prepend header with version
    currentData.gcode = '% ' + PROJECT + ' G-Code Output\n% Version ' + VERSION + '\n% GitHub: ' + GITHUB + '\n' + body;

    document.getElementById('gcode_preview').value = currentData.gcode;
    document.getElementById('download_btn').disabled = false;

    var total = 0;
    for (var tid in currentData.holes) total += currentData.holes[tid].length;
    var st = document.getElementById('canvas_status');
    if (st) st.textContent = formatTemplate(t('canvas_status_done', currentLanguage), {holes:total});
    alert(formatTemplate(t('success_generated', currentLanguage), {holes:total}));
}

function downloadGCode() {
    if (!currentData.gcode) return;
    var blob = new Blob([currentData.gcode], {type:'text/plain'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = PROJECT + '_v' + VERSION + '_output.nc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// ---- about dialog ----
function showAbout() {
    var m = document.getElementById('about_dialog');
    document.getElementById('about_title').textContent = t('about_title', currentLanguage);
    document.getElementById('about_text').innerHTML =
        '<h3>' + PROJECT + ' v' + VERSION + '</h3>' +
        '<p>CNC Drill File Optimizer</p>' +
        '<p>Converts P-CAD / Altium .drl files to optimized G-Code.</p>' +
        '<h3>Features</h3><ul>' +
        '<li>SortByX, SortByY, SortByPath (OPTICS)</li>' +
        '<li>6 languages: EN, RU, UK, PT, DE, FR</li>' +
        '<li>Interactive visualization</li>' +
        '<li>Drag-and-drop file upload</li></ul>' +
        '<h3>How to use</h3><ol>' +
        '<li>Drop a .drl file or click to browse</li>' +
        '<li>Select optimization algorithm</li>' +
        '<li>Click Generate G-Code</li>' +
        '<li>Download the result</li></ol>' +
        '<p><strong>License:</strong> ' + 'MIT</p>';

    var dl = document.getElementById('docs_link');
    var gl = document.getElementById('github_link');
    dl.href = GITHUB + '#readme'; dl.textContent = '📚 ' + t('docs_link_text', currentLanguage); dl.target='_blank';
    gl.href = GITHUB;             gl.textContent = '🔗 ' + t('github_link_text', currentLanguage); gl.target='_blank';
    m.style.display = 'block';
}