import { execSync } from 'child_process';
import { existsSync, unlinkSync, readFileSync } from 'node:fs';
import assert from 'node:assert';

const BIN = 'node cncdril.mjs';
const EXAMPLE = '../examples/RPCB0827_FIXTURE.DRL';
const OUT = '/tmp/cncdril_test_out.nc';

let passed = 0;
let failed = 0;

function run(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  PASS  ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL  ${name}`);
    console.log(`        ${e.message}`);
  }
}

function exec(cmd, expectFail = false) {
  try {
    const stdout = execSync(cmd, { cwd: 'nodejs', encoding: 'utf-8', timeout: 15000 });
    if (expectFail) throw new Error('Expected non-zero exit but succeeded');
    return stdout;
  } catch (e) {
    if (expectFail) return null;
    const stderr = e.stderr || '';
    const msg = e.stdout ? `stdout=${e.stdout}\nstderr=${stderr}` : stderr;
    throw new Error(`Exit ${e.status}: ${msg}`);
  }
}

// Cleanup any previous output
if (existsSync(OUT)) unlinkSync(OUT);

console.log('\nCNCDril Node.js CLI Tests\n');

// 1. Help flag
run('help flag shows usage', () => {
  const out = exec(`${BIN} --help`);
  assert.ok(out.includes('Usage') || out.includes('cncdril'), 'Output should mention Usage or cncdril');
});

// 2. Version flag
run('version flag shows 2.0.0', () => {
  const out = exec(`${BIN} --version`);
  assert.ok(out.includes('2.0.0'), `Expected 2.0.0 in: ${out.trim()}`);
});

// 3. List-only with example file
run('list-only parses example (7 tools, 102 holes)', () => {
  const out = exec(`${BIN} ${EXAMPLE} --list-only`);
  assert.ok(out.includes('7'), 'Should report 7 tools');
  assert.ok(out.includes('102'), 'Should report 102 holes');
});

// 4. G-Code generation
run('gcode generation produces valid output file', () => {
  exec(`${BIN} ${EXAMPLE} -o ${OUT}`);
  assert.ok(existsSync(OUT), 'Output file should exist');
  const content = readFileSync(OUT, 'utf-8');
  assert.ok(content.includes('G21'), 'Should contain G21 (metric)');
  assert.ok(content.includes('G90'), 'Should contain G90 (absolute)');
  assert.ok(content.includes('M30'), 'Should contain M30 (program end)');
  assert.ok(content.includes('T1 M6'), 'Should contain T1 M6 (tool change)');
  unlinkSync(OUT);
});

// 5. Russian language
run('Russian language produces Cyrillic output', () => {
  const out = exec(`${BIN} ${EXAMPLE} --list-only --language ru`);
  // Cyrillic range: \u0400-\u04FF
  assert.ok(/[\u0400-\u04FF]/.test(out), 'Should contain Cyrillic characters');
});

// 6. Optimization none
run('optimize none works', () => {
  const out = exec(`${BIN} ${EXAMPLE} --list-only --optimize none`);
  assert.ok(out.includes('7'), 'Should still report 7 tools');
});

// 7. Invalid file
run('invalid file exits non-zero', () => {
  exec(`${BIN} /tmp/nonexistent_cncdril_test.drl --list-only`, true);
});

// 8. All languages
for (const lang of ['en', 'ru', 'uk', 'pt', 'de', 'fr']) {
  run(`language ${lang}`, () => {
    const out = exec(`${BIN} ${EXAMPLE} --list-only --language ${lang}`);
    assert.ok(out.includes('102'), `${lang}: should report 102 holes`);
  });
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
