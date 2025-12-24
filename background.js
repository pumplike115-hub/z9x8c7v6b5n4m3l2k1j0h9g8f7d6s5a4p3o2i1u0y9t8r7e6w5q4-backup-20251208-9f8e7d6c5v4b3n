class InteractiveGrid {
    constructor() {
        this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouse = { x: -1000, y: -1000 };
        this.gridSize = 35;
        this.time = 0;

        // Array to store active "flashing" nodes
        // Each node: { x, y, life, maxLife }
        this.activeNodes = [];

        this.init();
    }

    createCanvas() {
        const existing = document.getElementById('bg-canvas');
        if (existing) existing.remove();

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'bg-canvas';
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
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Touch support for mobile interaction
        window.addEventListener('touchstart', (e) => {
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        }, { passive: true });
        window.addEventListener('touchmove', (e) => {
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        }, { passive: true });

        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    drawStar(x, y, size, alpha) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();

        // Purple theme
        this.ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;

        const innerRadius = size * 0.15;
        const outerRadius = size * 0.5;

        this.ctx.moveTo(0, -outerRadius);
        this.ctx.quadraticCurveTo(innerRadius, -innerRadius, outerRadius, 0);
        this.ctx.quadraticCurveTo(innerRadius, innerRadius, 0, outerRadius);
        this.ctx.quadraticCurveTo(-innerRadius, innerRadius, -outerRadius, 0);
        this.ctx.quadraticCurveTo(-innerRadius, -innerRadius, 0, -outerRadius);

        this.ctx.fill();

        // Glow
        if (alpha > 0.2) {
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
            gradient.addColorStop(0, `rgba(139, 92, 246, ${alpha * 0.6})`);
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    updateActiveNodes() {
        // 1. Randomly spawn new active nodes (auto-play)
        // Chance depends on screen size (more nodes on larger screens)
        if (Math.random() < 0.1) { // 10% chance per frame
            const gridX = Math.floor(Math.random() * (this.width / this.gridSize)) * this.gridSize;
            const gridY = Math.floor(Math.random() * (this.height / this.gridSize)) * this.gridSize;

            this.activeNodes.push({
                x: gridX,
                y: gridY,
                life: 0,
                maxLife: 60 + Math.random() * 60, // 1-2 seconds at 60fps
                scale: 1 + Math.random() * 1.5 // Random size boost
            });
        }

        // 2. Update existing nodes
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
                // Sine wave for smooth fade in/out
                const progress = node.life / node.maxLife;
                const intensity = Math.sin(progress * Math.PI); // 0 -> 1 -> 0
                return {
                    sizeBoost: intensity * 15 * node.scale,
                    alphaBoost: intensity * 0.6
                };
            }
        }
        return null;
    }

    drawGrid() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Faint Grid
        this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.04)'; // Slightly increased visibility
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for (let x = 0; x <= this.width; x += this.gridSize) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
        }
        for (let y = 0; y <= this.height; y += this.gridSize) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
        }
        this.ctx.stroke();

        this.updateActiveNodes();

        // Draw Stars
        for (let x = 0; x <= this.width; x += this.gridSize) {
            for (let y = 0; y <= this.height; y += this.gridSize) {

                // 1. Base Ambient Breathing (Increased base brightness for mobile)
                const wave = Math.sin(this.time * 1.5 + (x * 0.02) + (y * 0.02));
                const breathing = (wave + 1) / 2;
                let alpha = 0.15 + (breathing * 0.1); // Base 0.15-0.25 (Brighter than before)
                let size = this.gridSize * 0.3;

                // 2. Autonomous "Playful" Flashes
                const activeEffect = this.getActiveNodeEffect(x, y);
                if (activeEffect) {
                    size += activeEffect.sizeBoost;
                    alpha += activeEffect.alphaBoost;
                }

                // 3. Mouse Interaction (Still kept for desktop)
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
