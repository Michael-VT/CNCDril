// G-Code Generator for CNC Drill Files
// No global constants here - they come from cncdrill.js

class GCodeGenerator {
    constructor(params) {
        this.params = params || {
            safeZ: 5.0,
            drillZ: -2.0,
            feedRate: 100,
            plungeRate: 50,
            toolChangeX: 0.0,
            toolChangeY: 0.0,
        };
    }

    generate(tools, holes, optimizedHoles) {
        var lines = [];

        lines.push('G21 ; Set units to mm');
        lines.push('G90 ; Absolute positioning');
        lines.push('G0 Z' + this.params.safeZ.toFixed(3) + ' ; Move to safe height');
        lines.push('');

        var sortedToolIds = Object.keys(holes).sort();

        for (var ti = 0; ti < sortedToolIds.length; ti++) {
            var toolId = sortedToolIds[ti];
            var tool = tools[toolId];
            var points = optimizedHoles[toolId] || [];

            if (!tool || points.length === 0) continue;

            lines.push('% Tool ' + toolId + ' - D' + tool.diameter.toFixed(2) + 'mm - ' + points.length + ' holes');
            lines.push('G0 X' + this.params.toolChangeX.toFixed(3) + ' Y' + this.params.toolChangeY.toFixed(3));
            lines.push('T' + parseInt(toolId) + ' M6 ; Tool change');
            lines.push('S1000 M3 ; Spindle on');
            lines.push('');

            for (var i = 0; i < points.length; i++) {
                var p = points[i];
                lines.push('% Hole ' + (i + 1));
                lines.push('G0 X' + p.x.toFixed(3) + ' Y' + p.y.toFixed(3) + ' ; Move to hole');
                lines.push('G1 Z' + this.params.drillZ.toFixed(3) + ' F' + this.params.plungeRate + ' ; Drill');
                lines.push('G0 Z' + this.params.safeZ.toFixed(3) + ' ; Retract');
                lines.push('');
            }
        }

        lines.push('M5 ; Spindle off');
        lines.push('G0 X0 Y0 ; Move to origin');
        lines.push('M30 ; End of program');

        return lines.join('\n');
    }
}