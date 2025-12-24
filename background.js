class InteractiveGrid {
    constructor() {
        this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.mouse = { x: -1000, y: -1000 };
        this.gridSize = 35;
        this.time = 0;
        this.activeNodes = [];

        this.init();
    }

    createCanvas() {
        const existing = document.getElementById('bg-canvas');
        if (existing) existing.remove();

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'bg-canvas';
        // Back to fixed to prevent document size expansion (infinite scroll bug)
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.background = '#050507';
        document.body.prepend(this.canvas);
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        window.addEventListener('mousemove', (e) => {
            // Store World Coordinates (includes scroll)
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
        // Canvas now matches Viewport, not Document (Performance + Bug fix)
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    updateActiveNodes(scrollY) {
        // Spawn based on current view
        if (Math.random() < 0.1) {
            const gridX = Math.floor(Math.random() * (this.width / this.gridSize)) * this.gridSize;

            // Random Y within current viewport (World Coords)
            // We want stars to spawn in the visible area + buffer
            const minY = Math.floor(scrollY / this.gridSize) * this.gridSize;
            const maxY = minY + this.height; // this.height is viewport height

            const gridY = Math.floor(Math.random() * ((maxY - minY) / this.gridSize + 2)) * this.gridSize + minY - this.gridSize;

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

    drawBenzStar(x, y, size, alpha) {
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

    drawGrid() {
        const scrollY = window.scrollY; // Current scroll position

        // 1. Clear Canvas (Viewport)
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 2. Translate Context to simulate scrolling
        // Moving the camera down means shifting the world up => -scrollY
        this.ctx.translate(0, -scrollY);

        this.updateActiveNodes(scrollY);

        // 3. Draw Elements (Optimization: Only draw visible range)
        // Convert Viewport range to World Y range
        const startY = Math.floor(scrollY / this.gridSize) * this.gridSize - this.gridSize;
        const endY = startY + this.height + (2 * this.gridSize);

        // Draw Faint Grid Lines
        this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.04)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();

        // Vertical lines (Full world height? No, just visible part is enough for lines too)
        // For lines, it's easier to draw efficient long lines.
        // We simulate infinite vertical lines by just drawing from startY to endY
        for (let x = 0; x <= this.width; x += this.gridSize) {
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, endY);
        }
        // Horizontal lines
        for (let y = startY; y <= endY; y += this.gridSize) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
        }
        this.ctx.stroke();

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

                // Mouse Interaction (Both in World Coords)
                const dx = this.mouse.x - x;
                const dy = this.mouse.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const factor = Math.pow(1 - (dist / 150), 2);
                    size += factor * 10;
                    alpha += factor * 0.4;
                }

                this.drawBenzStar(x, y, size, alpha);
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
