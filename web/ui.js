// UI Management and Canvas Visualization

class UIManager {
    constructor() {
        this.canvas = document.getElementById('preview_canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scale = 1.0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.editMode = false;
        this.currentTool = null;
        this.toolsData = null;
        this.holesData = null;
        this.optimizedData = null;
        
        this.setupCanvas();
        this.setupEventListeners();
    }
    
    setupCanvas() {
        // Set canvas size
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = container.clientWidth * dpr;
        this.canvas.height = container.clientHeight * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = container.clientWidth + 'px';
        this.canvas.style.height = container.clientHeight + 'px';
        
        this.clearCanvas();
    }
    
    setupEventListeners() {
        // Mouse events for panning
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.onWheel(e));
        this.canvas.addEventListener('click', (e) => this.onClick(e));
        
        // Window resize
        window.addEventListener('resize', () => this.setupCanvas());
        
        // Control buttons
        document.getElementById('zoom_in').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoom_out').addEventListener('click', () => this.zoomOut());
        document.getElementById('reset_view').addEventListener('click', () => this.resetView());
        document.getElementById('show_paths').addEventListener('change', () => this.draw());
        document.getElementById('edit_mode').addEventListener('change', (e) => {
            this.editMode = e.target.checked;
            this.updateCursor();
        });
    }
    
    clearCanvas() {
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = '#f5f5f5';
        this.ctx.fillRect(0, 0, width, height);
        this.drawGrid();
    }
    
    drawGrid() {
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);
        
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        
        const gridSize = 50 * this.scale;
        const offsetX = this.offsetX % gridSize;
        const offsetY = this.offsetY % gridSize;
        
        this.ctx.beginPath();
        for (let x = offsetX; x < width; x += gridSize) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
        }
        for (let y = offsetY; y < height; y += gridSize) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
        }
        this.ctx.stroke();
    }
    
    setData(tools, holes, optimized) {
        this.toolsData = tools;
        this.holesData = holes;
        this.optimizedData = optimized;
        this.fitToScreen();
        this.draw();
    }
    
    fitToScreen() {
        if (!this.holesData) return;
        
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        Object.values(this.holesData).forEach(points => {
            points.forEach(point => {
                minX = Math.min(minX, point.x);
                minY = Math.min(minY, point.y);
                maxX = Math.max(maxX, point.x);
                maxY = Math.max(maxY, point.y);
            });
        });
        
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);
        
        const dataWidth = maxX - minX;
        const dataHeight = maxY - minY;
        
        if (dataWidth > 0 && dataHeight > 0) {
            const scaleX = (width - 40) / dataWidth;
            const scaleY = (height - 40) / dataHeight;
            this.scale = Math.min(scaleX, scaleY);
            
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;
            
            this.offsetX = width / 2 - centerX * this.scale;
            this.offsetY = height / 2 + centerY * this.scale; // Flip Y axis
        }
    }
    
    toCanvasCoords(x, y) {
        return {
            x: x * this.scale + this.offsetX,
            y: -y * this.scale + this.offsetY
        };
    }
    
    toDataCoords(canvasX, canvasY) {
        return {
            x: (canvasX - this.offsetX) / this.scale,
            y: -(canvasY - this.offsetY) / this.scale
        };
    }
    
    draw() {
        this.clearCanvas();
        
        if (!this.optimizedData) return;
        
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#34495e', '#1abc9c'];
        let colorIdx = 0;
        
        const showPaths = document.getElementById('show_paths').checked;
        
        Object.entries(this.optimizedData).forEach(([toolId, points]) => {
            if (!points || points.length === 0) return;
            
            const color = colors[colorIdx % colors.length];
            
            // Draw paths if enabled
            if (showPaths && points.length > 1) {
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 2;
                this.ctx.globalAlpha = 0.3;
                this.ctx.beginPath();
                
                const first = this.toCanvasCoords(points[0].x, points[0].y);
                this.ctx.moveTo(first.x, first.y);
                
                for (let i = 1; i < points.length; i++) {
                    const coord = this.toCanvasCoords(points[i].x, points[i].y);
                    this.ctx.lineTo(coord.x, coord.y);
                }
                
                this.ctx.stroke();
                this.ctx.globalAlpha = 1.0;
            }
            
            // Draw holes
            points.forEach((point, index) => {
                const coord = this.toCanvasCoords(point.x, point.y);
                
                this.ctx.beginPath();
                this.ctx.arc(coord.x, coord.y, 6, 0, 2 * Math.PI);
                this.ctx.fillStyle = color;
                this.ctx.fill();
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                // Draw hole number
                this.ctx.fillStyle = '#000';
                this.ctx.font = '10px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(index + 1, coord.x, coord.y - 10);
            });
            
            colorIdx++;
        });
    }
    
    onMouseDown(e) {
        this.isDragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
    }
    
    onMouseMove(e) {
        if (this.isDragging) {
            const dx = e.clientX - this.lastX;
            const dy = e.clientY - this.lastY;
            this.offsetX += dx;
            this.offsetY += dy;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            this.draw();
        }
        
        // Update coordinates display
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const dataCoords = this.toDataCoords(x, y);
        document.getElementById('coordinates').textContent = 
            `X: ${dataCoords.x.toFixed(3)}mm, Y: ${dataCoords.y.toFixed(3)}mm`;
    }
    
    onMouseUp(e) {
        this.isDragging = false;
    }
    
    onWheel(e) {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        this.zoom(zoomFactor);
    }
    
    onClick(e) {
        if (!this.editMode || !this.holesData) return;
        
        // TODO: Implement hole editing (add/remove)
    }
    
    zoomIn() {
        this.zoom(1.2);
    }
    
    zoomOut() {
        this.zoom(0.8);
    }
    
    zoom(factor) {
        const rect = this.canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        this.offsetX = centerX - (centerX - this.offsetX) * factor;
        this.offsetY = centerY - (centerY - this.offsetY) * factor;
        this.scale *= factor;
        
        this.draw();
    }
    
    resetView() {
        this.fitToScreen();
        this.draw();
    }
    
    updateCursor() {
        this.canvas.style.cursor = this.editMode ? 'crosshair' : 'grab';
    }
    
    updateToolsInfo(tools, holes) {
        const container = document.getElementById('tools_info');
        const summary = DRLParser.prototype.getSummary.call({ tools, holes });
        
        let html = `<p><strong>Total Tools:</strong> ${summary.totalTools}</p>`;
        html += `<p><strong>Total Holes:</strong> ${summary.totalHoles}</p>`;
        html += '<hr>';
        
        Object.entries(tools).sort().forEach(([toolId, tool]) => {
            const count = holes[toolId] ? holes[toolId].length : 0;
            html += `<p><strong>Tool ${toolId}:</strong> Ø${tool.diameter.toFixed(2)}mm - ${count} holes</p>`;
        });
        
        container.innerHTML = html;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UIManager };
}