#!/usr/bin/env node
// CNCDril - CNC Drill File Optimizer v2.0.0
// Node.js CLI — same core logic as the web version
//
// Usage:
//   node cncdril.mjs input.drl -o output.nc --language ru
//   node cncdril.mjs input.drl --list-only --language uk
//   node cncdril.mjs --version
//   node cncdril.mjs --help

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------- version ----------
const VERSION  = '2.0.0';
const PROJECT  = 'CNCDril';
const GITHUB   = 'https://github.com/AntiquityMC/CNCDril';
const LICENSE  = 'MIT';

// ---------- translations ----------
const T = {
  en: {
    parsing:       'Parsing',
    summary:       'Drill File Summary',
    total_tools:   'Total tools',
    total_holes:   'Total holes',
    units:         'Units',
    metric:        'Metric (mm)',
    tool_info:     'Tool {tool}: Ø{d}mm – {n} holes',
    optimizing:    'Optimizing with {algo}',
    generating:    'Generating G-Code...',
    written:       'G-Code written to: {file}',
    file_size:     'File size: {size} bytes',
    err_no_file:   'Error: file not found: {file}',
    err_no_tools:  'Error: no tools found in file',
    err_parse:     'Error parsing file: {err}',
    usage_line:    `${PROJECT} v${VERSION} – CNC Drill File Optimizer`,
    help_usage:    'Usage: cncdril <input.drl> [options]',
    help_options:  'Options:',
    help_examples: 'Examples:',
  },
  ru: {
    parsing:       'Разбор файла',
    summary:       'Сводка по сверловке',
    total_tools:   'Всего инструментов',
    total_holes:   'Всего отверстий',
    units:         'Единицы',
    metric:        'Метрические (мм)',
    tool_info:     'Инструмент {tool}: Ø{d}мм – {n} отверстий',
    optimizing:    'Оптимизация: {algo}',
    generating:    'Создание G-Code...',
    written:       'G-Code записан в: {file}',
    file_size:     'Размер файла: {size} байт',
    err_no_file:   'Ошибка: файл не найден: {file}',
    err_no_tools:  'Ошибка: инструменты не найдены',
    err_parse:     'Ошибка разбора: {err}',
    usage_line:    `${PROJECT} v${VERSION} – Оптимизатор сверловки`,
    help_usage:    'Использование: cncdril <файл.drl> [опции]',
    help_options:  'Опции:',
    help_examples: 'Примеры:',
  },
  uk: {
    parsing:       'Розбір файлу',
    summary:       'Зведення по свердленню',
    total_tools:   'Всього інструментів',
    total_holes:   'Всього отворів',
    units:         'Одиниці',
    metric:        'Метричні (мм)',
    tool_info:     'Інструмент {tool}: Ø{d}мм – {n} отворів',
    optimizing:    'Оптимізація: {algo}',
    generating:    'Створення G-Code...',
    written:       'G-Code записаний в: {file}',
    file_size:     'Розмір файлу: {size} байт',
    err_no_file:   'Помилка: файл не знайдено: {file}',
    err_no_tools:  'Помилка: інструменти не знайдені',
    err_parse:     'Помилка розбору: {err}',
    usage_line:    `${PROJECT} v${VERSION} – Оптимізатор свердління`,
    help_usage:    'Використання: cncdril <файл.drl> [опції]',
    help_options:  'Опції:',
    help_examples: 'Приклади:',
  },
  pt: {
    parsing:       'Analisando',
    summary:       'Resumo de Furações',
    total_tools:   'Ferramentas totais',
    total_holes:   'Furos totais',
    units:         'Unidades',
    metric:        'Métrico (mm)',
    tool_info:     'Ferramenta {tool}: Ø{d}mm – {n} furos',
    optimizing:    'Otimizando com {algo}',
    generating:    'Gerando G-Code...',
    written:       'G-Code gravado em: {file}',
    file_size:     'Tamanho: {size} bytes',
    err_no_file:   'Erro: arquivo não encontrado: {file}',
    err_no_tools:  'Erro: nenhuma ferramenta encontrada',
    err_parse:     'Erro ao analisar: {err}',
    usage_line:    `${PROJECT} v${VERSION} – Otimizador de Furações CNC`,
    help_usage:    'Uso: cncdril <arquivo.drl> [opções]',
    help_options:  'Opções:',
    help_examples: 'Exemplos:',
  },
  de: {
    parsing:       'Einlesen',
    summary:       'Bohrungs-Zusammenfassung',
    total_tools:   'Werkzeuge gesamt',
    total_holes:   'Löcher gesamt',
    units:         'Einheiten',
    metric:        'Metrisch (mm)',
    tool_info:     'Werkzeug {tool}: Ø{d}mm – {n} Löcher',
    optimizing:    'Optimierung: {algo}',
    generating:    'G-Code wird generiert...',
    written:       'G-Code geschrieben nach: {file}',
    file_size:     'Dateigröße: {size} Bytes',
    err_no_file:   'Fehler: Datei nicht gefunden: {file}',
    err_no_tools:  'Fehler: keine Werkzeuge gefunden',
    err_parse:     'Fehler beim Parsen: {err}',
    usage_line:    `${PROJECT} v${VERSION} – Bohrungs-Optimierer`,
    help_usage:    'Verwendung: cncdril <datei.drl> [Optionen]',
    help_options:  'Optionen:',
    help_examples: 'Beispiele:',
  },
  fr: {
    parsing:       'Analyse',
    summary:       'Résumé du Perçage',
    total_tools:   'Outils totaux',
    total_holes:   'Trous totaux',
    units:         'Unités',
    metric:        'Métrique (mm)',
    tool_info:     'Outil {tool}: Ø{d}mm – {n} trous',
    optimizing:    'Optimisation: {algo}',
    generating:    'Génération du G-Code...',
    written:       'G-Code écrit dans: {file}',
    file_size:     'Taille: {size} octets',
    err_no_file:   'Erreur: fichier introuvable: {file}',
    err_no_tools:  'Erreur: aucun outil trouvé',
    err_parse:     'Erreur d\'analyse: {err}',
    usage_line:    `${PROJECT} v${VERSION} – Optimisateur de Perçage`,
    help_usage:    'Usage: cncdril <fichier.drl> [options]',
    help_options:  'Options:',
    help_examples: 'Exemples:',
  },
};

function t(key, lang = 'en', data = {}) {
  let s = (T[lang] || T.en)[key] || key;
  for (const k in data) s = s.replace(`{${k}}`, data[k]);
  return s;
}

// ---------- DRL Parser (standalone, no DOM deps) ----------

class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  distanceTo(o) { return Math.hypot(this.x - o.x, this.y - o.y); }
}

class Tool {
  constructor(id, d) { this.toolId = id; this.diameter = d; }
}

class DRLParser {
  constructor() { this.tools = {}; this.holes = {}; }

  parse(content) {
    const lines = content.split('\n').map(l => l.trim().toUpperCase());
    let cur = null;
    for (const line of lines) {
      if (!line || line.startsWith(';')) continue;
      if (line.includes('METRIC')) { /* noop, we always output mm */ }
      if (line === '%') continue;

      // tool definition: T01C1.73
      const td = line.match(/^T(\d+)C([\d.]+)$/);
      if (td && !line.includes('X')) {
        const id = td[1].padStart(2,'0');
        this.tools[id] = new Tool(id, parseFloat(td[2]));
        continue;
      }
      // tool switch: T01
      const ts = line.match(/^T(\d+)$/);
      if (ts) {
        cur = ts[1].padStart(2,'0');
        if (cur === '00') cur = null;
        else if (!this.holes[cur]) this.holes[cur] = [];
        continue;
      }
      // coordinate
      const xm = line.match(/X\+?(\d+)/);
      const ym = line.match(/Y\+?(\d+)/);
      if (xm && ym && cur) {
        this.holes[cur].push(new Point(parseFloat(xm[1])/1000, parseFloat(ym[1])/1000));
      }
    }
    // remove empty
    for (const k in this.holes) { if (!this.holes[k].length) delete this.holes[k]; }
    return { tools: this.tools, holes: this.holes };
  }
}

// ---------- Optimizer ----------

class Optimizer {
  static sortByX(pts) {
    const a = [...pts]; const n = a.length;
    for (let i = 0; i < n; i++) for (let j = 0; j < n-i-1; j++)
      if (a[j].x > a[j+1].x) [a[j],a[j+1]] = [a[j+1],a[j]];
    return a;
  }
  static sortByY(pts) {
    const a = [...pts]; const n = a.length;
    for (let i = 0; i < n; i++) for (let j = 0; j < n-i-1; j++)
      if (a[j].y > a[j+1].y) [a[j],a[j+1]] = [a[j+1],a[j]];
    return a;
  }
  static sortByPath(pts) {
    if (!pts.length) return [];
    const rem = [...pts]; const out = [];
    let cur = rem[0];
    while (rem.length) {
      let best = 0, bestD = Infinity;
      for (let i = 0; i < rem.length; i++) {
        const d = cur.distanceTo(rem[i]);
        if (d < bestD) { bestD = d; best = i; }
      }
      cur = rem.splice(best, 1)[0];
      out.push(cur);
    }
    return out;
  }
  static optimize(pts, algo) {
    switch(algo) {
      case 'x': return Optimizer.sortByX(pts);
      case 'y': return Optimizer.sortByY(pts);
      case 'path': return Optimizer.sortByPath(pts);
      default: return [...pts];
    }
  }
}

// ---------- G-Code Generator ----------

class GCodeGen {
  constructor(p = {}) {
    this.p = Object.assign({ safeZ:5, drillZ:-2, feedRate:100, plungeRate:50, tcX:0, tcY:0 }, p);
  }
  generate(tools, holes, opt) {
    const L = [];
    L.push(`% ${PROJECT} G-Code Output`);
    L.push(`% Version ${VERSION}`);
    L.push(`% GitHub: ${GITHUB}`);
    L.push('G21 ; mm');
    L.push('G90 ; absolute');
    L.push(`G0 Z${this.p.safeZ.toFixed(3)} ; safe`);
    for (const tid of Object.keys(holes).sort()) {
      const tool = tools[tid]; const pts = opt[tid] || [];
      if (!tool || !pts.length) continue;
      L.push(`% Tool ${tid} D${tool.diameter.toFixed(2)} ${pts.length} holes`);
      L.push(`G0 X${this.p.tcX.toFixed(3)} Y${this.p.tcY.toFixed(3)}`);
      L.push(`T${parseInt(tid)} M6`);
      L.push('S1000 M3');
      for (let i = 0; i < pts.length; i++) {
        L.push(`G0 X${pts[i].x.toFixed(3)} Y${pts[i].y.toFixed(3)}`);
        L.push(`G1 Z${this.p.drillZ.toFixed(3)} F${this.p.plungeRate}`);
        L.push(`G0 Z${this.p.safeZ.toFixed(3)}`);
      }
    }
    L.push('M5');
    L.push('G0 X0 Y0');
    L.push('M30');
    return L.join('\n');
  }
}

// ---------- CLI arg parser (no dependencies) ----------

function parseArgs(argv) {
  const args = { input: null, output: null, optimize: 'path', language: 'en',
    safeZ: 5, drillZ: -2, feedRate: 100, listOnly: false, help: false, version: false };
  
  const rest = [];
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help'    || a === '-h')                    { args.help = true; }
    else if (a === '--version')                             { args.version = true; }
    else if (a === '--list-only')                           { args.listOnly = true; }
    else if (a === '-o' || a === '--output')                { args.output = argv[++i]; }
    else if (a === '--optimize')                            { args.optimize = argv[++i]; }
    else if (a === '--language')                            { args.language = argv[++i]; }
    else if (a === '--safe-z')                              { args.safeZ = parseFloat(argv[++i]); }
    else if (a === '--drill-z')                             { args.drillZ = parseFloat(argv[++i]); }
    else if (a === '--feed-rate')                           { args.feedRate = parseFloat(argv[++i]); }
    else if (!a.startsWith('-'))                            { rest.push(a); }
  }
  if (rest.length) args.input = rest[0];
  return args;
}

// ---------- Main ----------

function main() {
  const args = parseArgs(process.argv);
  const lang = T[args.language] ? args.language : 'en';

  if (args.version) { console.log(`${PROJECT} ${VERSION}`); process.exit(0); }

  if (args.help || !args.input) {
    console.log(`${t('usage_line',lang)}`);
    console.log(`${t('help_usage',lang)}`);
    console.log('');
    console.log(`${t('help_options',lang)}`);
    console.log('  -o, --output FILE    Output G-Code file (.nc)');
    console.log('  --optimize ALGO      x | y | path | none  (default: path)');
    console.log('  --language LANG      en ru uk pt de fr    (default: en)');
    console.log('  --safe-z MM          Safe travel height   (default: 5)');
    console.log('  --drill-z MM         Drill depth          (default: -2)');
    console.log('  --feed-rate MM/MIN   Feed rate            (default: 100)');
    console.log('  --list-only          Show summary only');
    console.log('  --version            Show version');
    console.log('  -h, --help           Show this help');
    console.log('');
    console.log(`${t('help_examples',lang)}`);
    console.log(`  cncdril input.drl -o out.nc`);
    console.log(`  cncdril input.drl --language ru --list-only`);
    console.log(`  cncdril input.drl --optimize x --safe-z 10`);
    console.log('');
    console.log(`GitHub: ${GITHUB}`);
    console.log(`License: ${LICENSE}`);
    process.exit(args.help ? 0 : 1);
  }

  // --- Parse ---
  const inputPath = resolve(args.input);
  let content;
  try { content = readFileSync(inputPath, 'utf-8'); }
  catch { console.error(t('err_no_file', lang, { file: args.input })); process.exit(1); }

  console.log(`${t('parsing',lang)}: ${basename(inputPath)}`);
  const parser = new DRLParser();
  const { tools, holes } = parser.parse(content);

  if (!Object.keys(tools).length) { console.error(t('err_no_tools',lang)); process.exit(1); }

  // --- Summary ---
  const totalHoles = Object.values(holes).reduce((s,h) => s + h.length, 0);
  console.log('\n' + '='.repeat(55));
  console.log(t('summary',lang));
  console.log('='.repeat(55));
  console.log(`${t('total_tools',lang)}: ${Object.keys(tools).length}`);
  console.log(`${t('total_holes',lang)}: ${totalHoles}`);
  console.log(`${t('units',lang)}: ${t('metric',lang)}`);
  console.log();
  for (const tid of Object.keys(holes).sort()) {
    const tool = tools[tid];
    console.log(`  ${t('tool_info',lang,{tool:tid, d:tool.diameter.toFixed(2), n:holes[tid].length})}`);
  }
  console.log('='.repeat(55) + '\n');

  if (args.listOnly) process.exit(0);

  // --- Optimize ---
  const algoNames = { x:'SortByX', y:'SortByY', path:'SortByPath', none:'None' };
  console.log(t('optimizing',lang,{ algo: algoNames[args.optimize] || args.optimize }));

  const opt = {};
  for (const tid in holes) opt[tid] = Optimizer.optimize(holes[tid], args.optimize);

  // --- Generate ---
  console.log(t('generating',lang));
  const gen = new GCodeGen({ safeZ: args.safeZ, drillZ: args.drillZ,
    feedRate: args.feedRate, plungeRate: args.feedRate / 2 });
  const gcode = gen.generate(tools, holes, opt);

  if (args.output) {
    writeFileSync(resolve(args.output), gcode, 'utf-8');
    console.log(t('written',lang,{ file: args.output }));
    console.log(t('file_size',lang,{ size: gcode.length }));
  } else {
    console.log('\n' + '-'.repeat(55));
    console.log(gcode);
  }
}

main();