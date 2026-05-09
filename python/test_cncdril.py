#!/usr/bin/env python3
"""Test suite for CNCDril Python version."""

import unittest
import sys
import os
import tempfile

# Ensure the python directory is on the path so we can import cncdrill
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from cncdrill import DRLParser, OptimizationAlgorithms, GCodeGenerator, Point, Tool

EXAMPLE_DRL = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                           '..', 'examples', 'RPCB0827_FIXTURE.DRL')


class TestDRLParser(unittest.TestCase):
    """Tests for the DRL file parser."""

    @classmethod
    def setUpClass(cls):
        cls.parser = DRLParser()
        cls.tools, cls.holes = cls.parser.parse_drl(EXAMPLE_DRL)

    def test_parse_example(self):
        """Parsing the example file yields 7 tools and 102 total holes."""
        self.assertEqual(len(self.tools), 7)
        total_holes = sum(len(pts) for pts in self.holes.values())
        self.assertEqual(total_holes, 102)

    def test_tools_parsed(self):
        """Tool dict has keys '01' through '07'."""
        for tid in ('01', '02', '03', '04', '05', '06', '07'):
            self.assertIn(tid, self.tools, f"Tool {tid} missing")

    def test_tool_diameters(self):
        """Specific tool diameters are correct."""
        self.assertAlmostEqual(self.tools['01'].diameter, 1.73)
        self.assertAlmostEqual(self.tools['07'].diameter, 10.16)

    def test_metric_flag(self):
        """Parser detects METRIC format."""
        self.assertTrue(self.parser.metric)


class TestOptimization(unittest.TestCase):
    """Tests for drill path optimization algorithms."""

    @classmethod
    def setUpClass(cls):
        parser = DRLParser()
        cls.tools, cls.holes = parser.parse_drl(EXAMPLE_DRL)
        cls.all_points = []
        for pts in parser.holes.values():
            cls.all_points.extend(pts)

    def test_sort_by_x(self):
        """sort_by_x returns points in ascending X order."""
        sorted_pts = OptimizationAlgorithms.sort_by_x(self.all_points)
        xs = [p.x for p in sorted_pts]
        self.assertEqual(xs, sorted(xs))

    def test_sort_by_y(self):
        """sort_by_y returns points in ascending Y order."""
        sorted_pts = OptimizationAlgorithms.sort_by_y(self.all_points)
        ys = [p.y for p in sorted_pts]
        self.assertEqual(ys, sorted(ys))

    def test_optics_returns_same_count(self):
        """OPTICS optimization preserves point count."""
        optimized = OptimizationAlgorithms.optics_optimization(self.all_points.copy())
        self.assertEqual(len(optimized), len(self.all_points))

    def test_optics_reduces_distance(self):
        """OPTICS path is no longer than unsorted (nearest-neighbour should help)."""
        def total_travel(points):
            d = 0.0
            for i in range(1, len(points)):
                d += points[i - 1].distance_to(points[i])
            return d

        unsorted = self.all_points.copy()
        optimized = OptimizationAlgorithms.optics_optimization(self.all_points.copy())
        self.assertLessEqual(total_travel(optimized), total_travel(unsorted))


class TestGCodeGenerator(unittest.TestCase):
    """Tests for G-Code output."""

    @classmethod
    def setUpClass(cls):
        parser = DRLParser()
        tools, holes = parser.parse_drl(EXAMPLE_DRL)
        # Use sort_by_x for deterministic optimized holes
        optimized_holes = {}
        for tid, pts in holes.items():
            optimized_holes[tid] = OptimizationAlgorithms.sort_by_x(pts)
        gen = GCodeGenerator()
        cls.output = gen.generate(tools, holes, optimized_holes)

    def test_generate_contains_header(self):
        """Output includes G21 and G90."""
        self.assertIn('G21', self.output)
        self.assertIn('G90', self.output)

    def test_generate_contains_tool_change(self):
        """Output includes tool change commands."""
        # Tool IDs sorted: '01','02',...,'07' → T1..T7
        self.assertTrue(
            'T1 M6' in self.output or 'T2 M6' in self.output,
            "Expected at least one tool change command (T<n> M6)"
        )

    def test_generate_contains_drill(self):
        """Output includes a drill move (G1 Z negative)."""
        self.assertRegex(self.output, r'G1\s+Z-')

    def test_generate_contains_footer(self):
        """Output ends with M30."""
        self.assertIn('M30', self.output)

    def test_generate_file(self):
        """G-Code can be written to a temp file and read back."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.nc',
                                          delete=False) as tmp:
            tmp.write(self.output)
            tmp_path = tmp.name
        try:
            self.assertTrue(os.path.exists(tmp_path))
            with open(tmp_path) as f:
                content = f.read()
            self.assertGreater(len(content), 0)
            self.assertEqual(content, self.output)
        finally:
            os.unlink(tmp_path)


if __name__ == '__main__':
    unittest.main()
