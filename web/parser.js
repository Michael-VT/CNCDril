// DRL File Parser for JavaScript

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    distanceTo(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }
    
    toString() {
        return `Point(${this.x.toFixed(4)}, ${this.y.toFixed(4)})`;
    }
}

class Tool {
    constructor(toolId, diameter) {
        this.toolId = toolId;
        this.diameter = diameter;
    }
    
    toString() {
        return `Tool(${this.toolId}, Ø${this.diameter.toFixed(2)}mm)`;
    }
}

class DRLParser {
    constructor() {
        this.tools = {};
        this.holes = {};
        this.metric = true;
        this.rawLines = [];
    }
    
    parseDRL(content) {
        // Parse DRL file content
        const lines = content.split('\n').map(line => line.trim().toUpperCase());
        this.rawLines = lines;
        
        let currentTool = null;
        
        for (let line of lines) {
            if (!line || line.startsWith(';')) continue;
            
            // Detect metric/inch
            if (line.includes('METRIC')) {
                this.metric = true;
            } else if (line.includes('INCH')) {
                this.metric = false;
            }
            
            // Skip the separator
            if (line === '%') continue;
            
            // Parse tool definitions: T01C1.73
            const toolMatch = line.match(/^T(\d+)C([\d.]+)$/);
            if (toolMatch && !line.includes('X') && !line.includes('Y')) {
                const toolId = toolMatch[1].padStart(2, '0');
                const diameter = parseFloat(toolMatch[2]);
                this.tools[toolId] = new Tool(toolId, diameter);
                continue;
            }
            
            // Parse tool switch: T01 (standalone lines after %)
            const switchMatch = line.match(/^T(\d+)$/);
            if (switchMatch) {
                currentTool = switchMatch[1].padStart(2, '0');
                if (!this.holes[currentTool]) {
                    this.holes[currentTool] = [];
                }
                // Skip T00 (end marker)
                if (currentTool === '00') {
                    currentTool = null;
                }
                continue;
            }
            
            // Extract X and Y coordinates
            const xMatch = line.match(/X\+?(\d+)/);
            const yMatch = line.match(/Y\+?(\d+)/);
            
            if (xMatch && yMatch && currentTool) {
                // Parse coordinates - format is X+005004 meaning 5.004mm
                const x = parseFloat(xMatch[1]) / 1000.0;
                const y = parseFloat(yMatch[1]) / 1000.0;
                
                if (!this.holes[currentTool]) {
                    this.holes[currentTool] = [];
                }
                
                this.holes[currentTool].push(new Point(x, y));
            }
        }
        
        // Remove empty tools
        Object.keys(this.holes).forEach(toolId => {
            if (this.holes[toolId].length === 0) {
                delete this.holes[toolId];
            }
        });
        
        return { tools: this.tools, holes: this.holes };
    }
    
    getSummary() {
        const totalHoles = Object.values(this.holes).reduce((sum, holes) => sum + holes.length, 0);
        return {
            totalTools: Object.keys(this.tools).length,
            totalHoles: totalHoles,
            metric: this.metric
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Point, Tool, DRLParser };
}