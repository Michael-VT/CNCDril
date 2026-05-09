import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Point, Tool, DRLParser } = require('../parser.js');
const { OptimizationAlgorithms } = require('../optimizer.js');
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        passed++;
        console.log(`  ✓ ${name}`);
    } catch (err) {
        failed++;
        console.error(`  ✗ ${name}`);
        console.error(`    ${err.message}`);
    }
}

console.log('Web JS module tests\n');

// --- Point ---
test('Point.distanceTo returns correct Euclidean distance', () => {
    const a = new Point(0, 0);
    const b = new Point(3, 4);
    assert.strictEqual(a.distanceTo(b), 5);
});

// --- Tool ---
test('Tool.toString contains tool id and diameter', () => {
    const tool = new Tool('01', 1.73);
    const s = tool.toString();
    assert.ok(s.includes('01'), `expected '01' in "${s}"`);
    assert.ok(s.includes('1.73'), `expected '1.73' in "${s}"`);
});

// --- DRLParser ---
const drlContent = readFileSync('examples/RPCB0827_FIXTURE.DRL', 'utf-8');
const parser = new DRLParser();
const { tools, holes } = parser.parseDRL(drlContent);

test('DRLParser.parseDRL returns 7 tools', () => {
    assert.strictEqual(Object.keys(tools).length, 7);
});

test('DRLParser.parseDRL returns 102 holes', () => {
    const totalHoles = Object.values(holes).reduce((sum, h) => sum + h.length, 0);
    assert.strictEqual(totalHoles, 102);
});

test('Parser tool 01 has diameter 1.73', () => {
    assert.ok(tools['01'], 'tool 01 missing');
    assert.strictEqual(tools['01'].diameter, 1.73);
});

// Collect all parsed points for optimizer tests
const allPoints = Object.values(holes).flat();

// --- OptimizationAlgorithms ---
test('sortByX returns points sorted by ascending X', () => {
    const sorted = OptimizationAlgorithms.sortByX(allPoints);
    for (let i = 1; i < sorted.length; i++) {
        assert.ok(sorted[i].x >= sorted[i - 1].x,
            `X not ascending at index ${i}: ${sorted[i - 1].x} > ${sorted[i].x}`);
    }
});

test('sortByY returns points sorted by ascending Y', () => {
    const sorted = OptimizationAlgorithms.sortByY(allPoints);
    for (let i = 1; i < sorted.length; i++) {
        assert.ok(sorted[i].y >= sorted[i - 1].y,
            `Y not ascending at index ${i}: ${sorted[i - 1].y} > ${sorted[i].y}`);
    }
});

test('OPTICS optimization returns same point count', () => {
    const optimized = OptimizationAlgorithms.opticsOptimization(allPoints);
    assert.strictEqual(optimized.length, allPoints.length);
});

test('OPTICS optimization reduces path length vs unsorted', () => {
    const unsortedLength = OptimizationAlgorithms.calculatePathLength(allPoints);
    const optimized = OptimizationAlgorithms.opticsOptimization(allPoints);
    const optimizedLength = OptimizationAlgorithms.calculatePathLength(optimized);
    assert.ok(optimizedLength < unsortedLength,
        `optimized ${optimizedLength.toFixed(2)} >= unsorted ${unsortedLength.toFixed(2)}`);
});

test('calculatePathLength returns correct value for known points', () => {
    const pts = [new Point(3, 4), new Point(6, 8), new Point(6, 8)];
    // startPos defaults to pts[0]=(3,4). Iteration: (3,4)→(3,4)=0, (3,4)→(6,8)=5, (6,8)→(6,8)=0 → total=5
    const len = OptimizationAlgorithms.calculatePathLength(pts);
    assert.strictEqual(len, 5);
});
// --- Summary ---
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
    process.exit(1);
}
