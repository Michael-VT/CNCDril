// UI Management and Canvas Visualization

class UIManager {
    constructor() {
        this.canvas = document.getElementById('preview_canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.scale = 1.0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.toolsData = null;
        this.holesData = null;
        this.optimizedData = null;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
        });
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.offsetX += e.clientX - this.lastX;
                this.offsetY += e.clientY - this.lastY;
                this.lastX = e.clientX;
                this.lastY = e.clientY;
                this.draw();
            }
            var rect = this.canvas.getBoundingClientRect();
            var dc = this.toDataCoords(e.clientX - rect.left, e.clientY - rect.top);
            var coordEl = document.getElementById('coordinates');
            if (coordEl) coordEl.textContent = 'X:' + dc.x.toFixed(2) + ' Y:' + dc.y.toFixed(2);
        });
        this.canvas.addEventListener('mouseup', () => { this.isDragging = false; });
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.zoom(e.deltaY > 0 ? 0.9 : 1.1);
        });

        this.clearCanvas();
    }

    resizeCanvas() {
        if (!this.canvas) return;
        var container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.draw();
    }

    clearCanvas() {
        if (!this.ctx) return;
        var w = this.canvas.width, h = this.canvas.height;
        this.ctx.fillStyle = '#f5f5f5';
        this.ctx.fillRect(0, 0, w, h);

        // Grid
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        var gs = 50 * this.scale;
        if (gs < 10) gs = 10;
        this.ctx.beginPath();
        for (var x = this.offsetX % gs; x < w; x += gs) { this.ctx.moveTo(x,0); this.ctx.lineTo(x,h); }
        for (var y = this.offsetY % gs; y < h; y += gs) { this.ctx.moveTo(0,y); this.ctx.lineTo(w,y); }
        this.ctx.stroke();
    }

    toCanvasCoords(x, y) {
        return { x: x * this.scale + this.offsetX, y: -y * this.scale + this.offsetY };
    }
    toDataCoords(cx, cy) {
        return { x: (cx - this.offsetX) / this.scale, y: -(cy - this.offsetY) / this.scale };
    }

    setData(tools, holes, optimized) {
        this.toolsData = tools;
        this.holesData = holes;
        this.optimizedData = optimized;
        if (holes) this.fitToScreen();
        this.draw();
    }

    fitToScreen() {
        if (!this.holesData) return;
        var minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
        for (var tid in this.holesData) {
            var pts = this.holesData[tid];
            for (var i = 0; i < pts.length; i++) {
                if (pts[i].x < minX) minX = pts[i].x;
                if (pts[i].y < minY) minY = pts[i].y;
                if (pts[i].x > maxX) maxX = pts[i].x;
                if (pts[i].y > maxY) maxY = pts[i].y;
            }
        }
        var w = this.canvas.width, h = this.canvas.height;
        var dw = maxX - minX, dh = maxY - minY;
        if (dw > 0 && dh > 0) {
            this.scale = Math.min((w - 60) / dw, (h - 60) / dh);
            this.offsetX = w / 2 - ((minX + maxX) / 2) * this.scale;
            this.offsetY = h / 2 + ((minY + maxY) / 2) * this.scale;
        }
    }

    draw() {
        this.clearCanvas();
        if (!this.optimizedData) return;
        var colors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#34495e','#1abc9c'];
        var ci = 0;
        var showPaths = true;
        var spEl = document.getElementById('show_paths');
        if (spEl) showPaths = spEl.checked;

        for (var tid in this.optimizedData) {
            var pts = this.optimizedData[tid];
            if (!pts || pts.length === 0) continue;
            var color = colors[ci % colors.length];

            if (showPaths && pts.length > 1) {
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 2;
                this.ctx.globalAlpha = 0.3;
                this.ctx.beginPath();
                var f = this.toCanvasCoords(pts[0].x, pts[0].y);
                this.ctx.moveTo(f.x, f.y);
                for (var i = 1; i < pts.length; i++) {
                    var c = this.toCanvasCoords(pts[i].x, pts[i].y);
                    this.ctx.lineTo(c.x, c.y);
                }
                this.ctx.stroke();
                this.ctx.globalAlpha = 1.0;
            }

            for (var i = 0; i < pts.length; i++) {
                var c = this.toCanvasCoords(pts[i].x, pts[i].y);
                this.ctx.beginPath();
                this.ctx.arc(c.x, c.y, 5, 0, 2 * Math.PI);
                this.ctx.fillStyle = color;
                this.ctx.fill();
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 1.5;
                this.ctx.stroke();
            }
            ci++;
        }
    }

    zoomIn()  { this.zoom(1.2); }
    zoomOut() { this.zoom(0.8); }
    zoom(factor) {
        var cx = this.canvas.width / 2, cy = this.canvas.height / 2;
        this.offsetX = cx - (cx - this.offsetX) * factor;
        this.offsetY = cy - (cy - this.offsetY) * factor;
        this.scale *= factor;
        this.draw();
    }
    resetView() { this.fitToScreen(); this.draw(); }

    updateToolsInfo(tools, holes) {
        var el = document.getElementById('tools_info');
        if (!el) return;
        var total = 0;
        for (var tid in holes) total += holes[tid].length;
        var html = '<p><strong>Tools:</strong> ' + Object.keys(tools).length + '</p>';
        html += '<p><strong>Holes:</strong> ' + total + '</p><hr>';
        var ids = Object.keys(tools).sort();
        for (var i = 0; i < ids.length; i++) {
            var tid = ids[i];
            var tool = tools[tid];
            var cnt = holes[tid] ? holes[tid].length : 0;
            html += '<p>Tool ' + tid + ': D' + tool.diameter.toFixed(2) + 'mm - ' + cnt + ' holes</p>';
        }
        el.innerHTML = html;
    }
}