class InteractiveGrid {
    constructor() {
        this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.mouse = { x: -1000, y: -1000 };
        this.gridSize = 35;
        this.time = 0;
        this.activeNodes = [];

        // State for managing resize stability
        this.lastWidth = window.innerWidth;
        this.lastHeight = 0;

        this.init();
    }

    createCanvas() {
        const existing = document.getElementById('bg-canvas');
        if (existing) existing.remove();

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'bg-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '0px';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.background = '#050507';
        document.body.prepend(this.canvas);
    }

    init() {
        this.resize(true); // Force initial resize

        // Stability Fix: 
        // Mobile browsers trigger 'resize' when address bar hides/shows during scroll.
        // We MUST ignore resize if only height changes (scrolling), otherwise background flickers/resets.
        window.addEventListener('resize', () => {
            const newWidth = window.innerWidth;
            if (newWidth !== this.lastWidth) {
                this.lastWidth = newWidth;
                this.resize(true);
            }
        });

        // Use ResizeObserver to detect meaningful DOM changes (loading content)
        // But debounce/limit it
        const resizeObserver = new ResizeObserver(() => {
            const bodyH = document.body.scrollHeight;
            if (Math.abs(bodyH - this.lastHeight) > 100) { // Only if grows significantly
                this.resize(false);
            }
        });
        resizeObserver.observe(document.body);

        window.addEventListener('mousemove', (e) => {
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

    resize(force = false) {
        // Calculate total required height
        const docH = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            window.innerHeight
        );

        // If not forced, and height change is small (address bar), ignore
        if (!force && Math.abs(docH - this.lastHeight) < 100) return;

        this.width = window.innerWidth;
        this.height = docH;
        this.lastHeight = docH;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.height = `${this.height}px`;
    }

    drawStar(x, y, size, alpha) {
        // Culling: Only draw visible stars
        const scrollY = window.scrollY;
        const viewH = window.innerHeight;

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
            const scrollY = window.scrollY;
            const viewH = window.innerHeight;

            const gridX = Math.floor(Math.random() * (this.width / this.gridSize)) * this.gridSize;

            // Random Y in view
            const minY = Math.floor(scrollY / this.gridSize) * this.gridSize;
            const maxY = minY + viewH;

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

        // Partial Clear
        this.ctx.clearRect(0, scrollY - 100, this.width, viewH + 200);

        const startY = Math.floor((scrollY - 100) / this.gridSize) * this.gridSize;
        const endY = startY + viewH + 200;

        // Faint Grid
        this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.04)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();

        // Optimized: Only draw lines in view
        // Vertical segments
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

        // Stars
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
