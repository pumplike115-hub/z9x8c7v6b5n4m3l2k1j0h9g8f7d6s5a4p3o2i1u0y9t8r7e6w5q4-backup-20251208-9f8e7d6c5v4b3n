class InteractiveGrid {
    constructor() {
        this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.mouse = { x: -1000, y: -1000 };
        this.gridSize = 35;
        this.time = 0;
        this.activeNodes = [];
        this.lastHeight = 0; // To prevent resize loops

        this.init();
    }

    createCanvas() {
        const existing = document.getElementById('bg-canvas');
        if (existing) existing.remove();

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'bg-canvas';
        // Use ABSOLUTE positioning so it scrolls NATIVELY with the page (Butter smooth on mobile)
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        // Start with 0 height to avoid pushing page
        this.canvas.style.height = '0px';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.background = '#050507';
        document.body.prepend(this.canvas);
    }

    init() {
        // Initial sizing
        this.resize();

        // Use ResizeObserver but with a debounce/check to prevent infinite loops
        const resizeObserver = new ResizeObserver((entries) => {
            // Only resize if the document height has changed significantly (> 50px)
            // This prevents micro-adjustments from causing loops
            const newHeight = document.documentElement.scrollHeight;
            if (Math.abs(newHeight - this.lastHeight) > 50) {
                this.resize();
            }
        });
        resizeObserver.observe(document.body);

        window.addEventListener('resize', () => {
            // Standard window resize (rotation etc) -> force update
            this.resize();
        });

        window.addEventListener('mousemove', (e) => {
            // Absolute coordinates
            this.mouse.x = e.pageX;
            this.mouse.y = e.pageY;
        });

        window.addEventListener('touchstart', (e) => {
            this.mouse.x = e.touches[0].pageX;
            this.mouse.y = e.touches[0].pageY;
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            this.mouse.x = e.touches[0].pageX;
            this.mouse.y = e.touches[0].pageY;
        }, { passive: true });

        this.animate();
    }

    resize() {
        // Calculate required height based on content
        const bodyHeight = document.body.scrollHeight;
        const htmlHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;

        // Use the largest to ensure coverage
        const newHeight = Math.max(bodyHeight, htmlHeight, windowHeight);

        // Prevent update if it's the same (or very close)
        if (Math.abs(newHeight - this.lastHeight) < 5) return;

        this.width = window.innerWidth;
        this.height = newHeight;
        this.lastHeight = newHeight;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.height = `${this.height}px`;
    }

    drawStar(x, y, size, alpha) {
        // Optimization: Culling
        // Since we are scrolling natively, we need to check if (y) is within the current viewport window
        // window.scrollY is the top of the viewport
        const scrollY = window.scrollY;
        const viewH = window.innerHeight;

        // Draw buffer: +/- 100px
        if (y < scrollY - 100 || y > scrollY + viewH + 100) return;

        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;

        const innerRadius = size * 0.15;
        const outerRadius = size * 0.5;

        this.ctx.moveTo(x + 0, y - outerRadius);
        this.ctx.quadraticCurveTo(x + innerRadius, y - innerRadius, x + outerRadius, y + 0);
        this.ctx.quadraticCurveTo(x + innerRadius, y + innerRadius, x + 0, y + outerRadius);
        this.ctx.quadraticCurveTo(x - innerRadius, y + innerRadius, x - outerRadius, y + 0);
        this.ctx.quadraticCurveTo(x - innerRadius, y - innerRadius, x + 0, y - outerRadius);

        this.ctx.fill();

        if (alpha > 0.2) {
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 1.5);
            gradient.addColorStop(0, `rgba(139, 92, 246, ${alpha * 0.6})`);
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
    }

    updateActiveNodes() {
        if (Math.random() < 0.1) {
            // Spawn mostly within visible viewport for relevance
            const scrollY = window.scrollY;
            const viewH = window.innerHeight;

            const gridX = Math.floor(Math.random() * (this.width / this.gridSize)) * this.gridSize;

            // Random Y in view
            const minY = Math.floor(scrollY / this.gridSize) * this.gridSize;
            const maxY = minY + viewH;

            // Add randomness to spawn slightly outside view too
            const gridY = Math.floor(Math.random() * ((maxY - minY) / this.gridSize + 6)) * this.gridSize + minY - (3 * this.gridSize);

            this.activeNodes.push({
                x: gridX,
                y: gridY,
                life: 0,
                maxLife: 60 + Math.random() * 60,
                scale: 1 + Math.random() * 1.5
            });
        }

        for (let i = this.activeNodes.length - 1; i >= 0; i--) {
            const node = this.activeNodes[i];
            node.life++;
            if (node.life > node.maxLife) {
                this.activeNodes.splice(i, 1);
            }
        }
    }

    getActiveNodeEffect(x, y) {
        for (const node of this.activeNodes) {
            if (node.x === x && node.y === y) {
                const progress = node.life / node.maxLife;
                const intensity = Math.sin(progress * Math.PI);
                return {
                    sizeBoost: intensity * 15 * node.scale,
                    alphaBoost: intensity * 0.6
                };
            }
        }
        return null;
    }

    drawGrid() {
        const scrollY = window.scrollY;
        const viewH = window.innerHeight;

        // Clear only Visible Area (Optimization)
        // Actually, with absolute positioning, clearing rect at (0, scrollY, w, h) is better than full clear
        // But some browsers have artifacts. Let's try partial clear.
        this.ctx.clearRect(0, scrollY - 100, this.width, viewH + 200);

        // Loop bounds
        const startY = Math.floor((scrollY - 100) / this.gridSize) * this.gridSize;
        const endY = startY + viewH + 200;

        // Draw Faint Grid Lines (Visible only)
        this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.04)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();

        // Vertical lines (Segmented to visible area to avoid drawing 10000px lines)
        for (let x = 0; x <= this.width; x += this.gridSize) {
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, endY);
        }
        // Horizontal
        for (let y = startY; y <= endY; y += this.gridSize) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
        }
        this.ctx.stroke();

        this.updateActiveNodes();

        // Draw Stars
        for (let x = 0; x <= this.width; x += this.gridSize) {
            for (let y = startY; y <= endY; y += this.gridSize) {

                const wave = Math.sin(this.time * 1.5 + (x * 0.02) + (y * 0.02));
                const breathing = (wave + 1) / 2;
                let alpha = 0.15 + (breathing * 0.1);
                let size = this.gridSize * 0.3;

                const activeEffect = this.getActiveNodeEffect(x, y);
                if (activeEffect) {
                    size += activeEffect.sizeBoost;
                    alpha += activeEffect.alphaBoost;
                }

                const dx = this.mouse.x - x;
                const dy = this.mouse.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const factor = Math.pow(1 - (dist / 150), 2);
                    size += factor * 10;
                    alpha += factor * 0.4;
                }

                this.drawStar(x, y, size, alpha);
            }
        }
    }

    animate() {
        this.time += 0.01;
        this.drawGrid();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new InteractiveGrid();
});
