#!/usr/bin/env python3
"""
CNCDril - CNC Drill File Optimizer (CLI Version)
Converts P-CAD/Altium .drl files to optimized G-Code for CNC machines

Supports three optimization algorithms:
- SortByX: Sort holes by X coordinate
- SortByY: Sort holes by Y coordinate  
- SortByPath (OPTICS): Distance-based path optimization
"""

import argparse
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import re


class Point:
    """Represents a drill hole position"""
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
    
    def __repr__(self):
        return f"Point({self.x:.4f}, {self.y:.4f})"
    
    def distance_to(self, other: 'Point') -> float:
        """Calculate Euclidean distance to another point"""
        return ((self.x - other.x)**2 + (self.y - other.y)**2)**0.5


class Tool:
    """Represents a drill tool definition"""
    def __init__(self, tool_id: str, diameter: float):
        self.tool_id = tool_id
        self.diameter = diameter
    
    def __repr__(self):
        return f"Tool({self.tool_id}, Ø{self.diameter:.2f}mm)"


class DRLParser:
    """Parser for P-CAD/Altium .drl files"""
    
    def __init__(self):
        self.tools: Dict[str, Tool] = {}
        self.holes: Dict[str, List[Point]] = {}
        self.metric = True
        self.raw_lines: List[str] = []
    
    def parse_drl(self, file_path: str) -> Tuple[Dict[str, Tool], Dict[str, List[Point]]]:
        """Parse a .drl file and extract tools and holes"""
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
        
        self.raw_lines = [line.strip() for line in lines]
        current_tool = None
        
        for line in self.raw_lines:
            line = line.strip().upper()
            if not line or line.startswith(';'):
                continue
            
            # Detect metric/inch
            if 'METRIC' in line:
                self.metric = True
            elif 'INCH' in line:
                self.metric = False
            
            # Parse tool definitions: T01C1.73 (before % separator)
            tool_match = re.match(r'T(\d+)C([\d.]+)', line)
            if tool_match and 'X' not in line and 'Y' not in line:
                tool_id = tool_match.group(1).zfill(2)
                diameter = float(tool_match.group(2))
                self.tools[tool_id] = Tool(tool_id, diameter)
                # Don't set current_tool yet - wait for actual tool switch after %
                continue
            
            # Skip the separator
            if line == '%':
                continue
            
            # Parse tool switch: T01, T02, etc. (standalone lines after %)
            switch_match = re.match(r'^T(\d+)$', line)
            if switch_match:
                current_tool = switch_match.group(1).zfill(2)
                if current_tool not in self.holes:
                    self.holes[current_tool] = []
                # Skip T00 (end marker)
                if current_tool == '00':
                    current_tool = None
                continue
            
            # Extract X and Y coordinates
            x_match = re.search(r'X\+?(\d+)', line)
            y_match = re.search(r'Y\+?(\d+)', line)
            
            if x_match and y_match and current_tool:
                # Parse coordinates - format is X+005004 meaning 5.004mm
                x = float(x_match.group(1)) / 1000.0
                y = float(y_match.group(1)) / 1000.0
                
                self.holes[current_tool].append(Point(x, y))
        
        # Remove empty tools
        self.holes = {k: v for k, v in self.holes.items() if v}
        return self.tools, self.holes


class OptimizationAlgorithms:
    """Optimization algorithms for drill paths"""
    
    @staticmethod
    def sort_by_x(points: List[Point]) -> List[Point]:
        """Sort points by X coordinate (bubble sort - matches Delphi implementation)"""
        points = points.copy()
        n = len(points)
        for i in range(n):
            for j in range(0, n - i - 1):
                if points[j].x > points[j + 1].x:
                    points[j], points[j + 1] = points[j + 1], points[j]
        return points
    
    @staticmethod
    def sort_by_y(points: List[Point]) -> List[Point]:
        """Sort points by Y coordinate (bubble sort - matches Delphi implementation)"""
        points = points.copy()
        n = len(points)
        for i in range(n):
            for j in range(0, n - i - 1):
                if points[j].y > points[j + 1].y:
                    points[j], points[j + 1] = points[j + 1], points[j]
        return points
    
    @staticmethod
    def optics_optimization(points: List[Point], start_pos: Optional[Point] = None, min_pts: int = 1) -> List[Point]:
        """
        OPTICS-like clustering for path optimization
        Uses nearest neighbor approach (matches Delphi SortByPath implementation)
        """
        if not points:
            return []
        
        points = points.copy()
        optimized = []
        current = start_pos if start_pos else points[0]
        
        while points:
            # Find nearest point to current position
            nearest_idx = 0
            nearest_dist = float('inf')
            
            for i, point in enumerate(points):
                dist = current.distance_to(point)
                if dist < nearest_dist:
                    nearest_dist = dist
                    nearest_idx = i
            
            # Move to nearest point
            current = points.pop(nearest_idx)
            optimized.append(current)
        
        return optimized


class GCodeGenerator:
    """Generate G-Code from optimized drill paths"""
    
    def __init__(self, params: Optional[Dict] = None):
        self.params = params or {
            'safe_z': 5.0,           # Safe travel height (mm)
            'drill_z': -2.0,         # Drill depth (mm)
            'feed_rate': 100,        # Feed rate (mm/min)
            'plunge_rate': 50,       # Plunge rate (mm/min)
            'tool_change_x': 0.0,    # Tool change X position
            'tool_change_y': 0.0,    # Tool change Y position
        }
    
    def generate(self, tools: Dict[str, Tool], holes: Dict[str, List[Point]], 
                 optimized_holes: Dict[str, List[Point]]) -> str:
        """Generate G-Code from tools and holes"""
        lines = []
        
        # Header
        lines.append("% CNCDril G-Code Output")
        lines.append("% Generated by CNCDril Python Version")
        lines.append("G21 ; Set units to mm")
        lines.append(f"G90 ; Absolute positioning")
        lines.append(f"G0 Z{self.params['safe_z']:.3f} ; Move to safe height")
        lines.append("")
        
        # Process each tool
        for tool_id in sorted(holes.keys()):
            tool = tools.get(tool_id)
            points = optimized_holes.get(tool_id, [])
            
            if not points or not tool:
                continue
            
            lines.append(f"% Tool {tool_id} - Ø{tool.diameter:.2f}mm - {len(points)} holes")
            
            # Move to tool change position
            lines.append(f"G0 X{self.params['tool_change_x']:.3f} Y{self.params['tool_change_y']:.3f}")
            lines.append(f"T{int(tool_id)} M6 ; Tool change")
            lines.append("S1000 M3 ; Spindle on")
            lines.append("")
            
            # Drill holes
            for i, point in enumerate(points, 1):
                lines.append(f"% Hole {i}")
                lines.append(f"G0 X{point.x:.3f} Y{point.y:.3f} ; Move to hole")
                lines.append(f"G1 Z{self.params['drill_z']:.3f} F{self.params['plunge_rate']} ; Drill")
                lines.append(f"G0 Z{self.params['safe_z']:.3f} ; Retract")
                lines.append("")
        
        # Footer
        lines.append("M5 ; Spindle off")
        lines.append("G0 X0 Y0 ; Move to origin")
        lines.append("M30 ; End of program")
        
        return '\n'.join(lines)


def print_summary(tools: Dict[str, Tool], holes: Dict[str, List[Point]]):
    """Print summary of parsed file"""
    print("\n" + "="*60)
    print("CNCDril - Drill File Summary")
    print("="*60)
    
    total_holes = sum(len(h) for h in holes.values())
    print(f"Total tools: {len(tools)}")
    print(f"Total holes: {total_holes}")
    print(f"Units: {'Metric (mm)' if True else 'Inch'}")
    print()
    
    for tool_id in sorted(holes.keys()):
        tool = tools.get(tool_id)
        count = len(holes[tool_id])
        if tool:
            print(f"  Tool {tool_id}: Ø{tool.diameter:.2f}mm - {count} holes")
    
    print("="*60 + "\n")


def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(
        description='CNCDril - CNC Drill File Optimizer',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s input.drl -o output.nc --optimize path
  %(prog)s input.drl --optimize x --safe-z 10
  %(prog)s input.drl --list-only
        """
    )
    
    parser.add_argument('input', help='Input .drl file')
    parser.add_argument('-o', '--output', help='Output G-Code file (.nc)')
    parser.add_argument('--optimize', choices=['x', 'y', 'path', 'none'], 
                       default='path', help='Optimization algorithm (default: path)')
    parser.add_argument('--safe-z', type=float, default=5.0, 
                       help='Safe travel height in mm (default: 5.0)')
    parser.add_argument('--drill-z', type=float, default=-2.0, 
                       help='Drill depth in mm (default: -2.0)')
    parser.add_argument('--feed-rate', type=float, default=100, 
                       help='Feed rate in mm/min (default: 100)')
    parser.add_argument('--list-only', action='store_true', 
                       help='Only list tools and holes, no G-Code generation')
    
    args = parser.parse_args()
    
    # Validate input file
    input_path = Path(args.input)
    if not input_path.exists():
        print(f"Error: Input file '{args.input}' not found", file=sys.stderr)
        sys.exit(1)
    
    # Parse DRL file
    print(f"Parsing: {args.input}")
    parser_obj = DRLParser()
    tools, holes = parser_obj.parse_drl(args.input)
    
    if not tools:
        print("Error: No tools found in file", file=sys.stderr)
        sys.exit(1)
    
    # Print summary
    print_summary(tools, holes)
    
    if args.list_only:
        return
    
    # Optimize drill paths
    print(f"Optimizing with SortBy{args.optimize.capitalize()} algorithm...")
    optimized_holes = {}
    
    for tool_id, points in holes.items():
        if args.optimize == 'x':
            optimized_holes[tool_id] = OptimizationAlgorithms.sort_by_x(points)
        elif args.optimize == 'y':
            optimized_holes[tool_id] = OptimizationAlgorithms.sort_by_y(points)
        elif args.optimize == 'path':
            optimized_holes[tool_id] = OptimizationAlgorithms.optics_optimization(points)
        else:
            optimized_holes[tool_id] = points
    
    # Generate G-Code
    params = {
        'safe_z': args.safe_z,
        'drill_z': args.drill_z,
        'feed_rate': args.feed_rate,
        'plunge_rate': args.feed_rate // 2,
        'tool_change_x': 0.0,
        'tool_change_y': 0.0,
    }
    
    generator = GCodeGenerator(params)
    gcode = generator.generate(tools, holes, optimized_holes)
    
    # Write output
    if args.output:
        output_path = Path(args.output)
        output_path.write_text(gcode, encoding='utf-8')
        print(f"G-Code written to: {args.output}")
        print(f"File size: {len(gcode)} bytes")
    else:
        print("\n" + "-"*60)
        print("G-Code Output:")
        print("-"*60)
        print(gcode)


if __name__ == '__main__':
    main()
