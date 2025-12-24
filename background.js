class InteractiveGrid {
    constructor() {
        this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouse = { x: -1000, y: -1000 };
        this.gridSize = 35; // Smaller grid as requested previously
        this.time = 0;

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

        // Purple theme (Violet/Indigo mix)
        this.ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`; // #a78bfa

        const innerRadius = size * 0.15;
        const outerRadius = size * 0.5;

        // Draw 4-pointed star
        this.ctx.moveTo(0, -outerRadius);
        this.ctx.quadraticCurveTo(innerRadius, -innerRadius, outerRadius, 0);
        this.ctx.quadraticCurveTo(innerRadius, innerRadius, 0, outerRadius);
        this.ctx.quadraticCurveTo(-innerRadius, innerRadius, -outerRadius, 0);
        this.ctx.quadraticCurveTo(-innerRadius, -innerRadius, 0, -outerRadius);

        this.ctx.fill();

        // Add subtle purple glow if alpha is high enough
        if (alpha > 0.2) {
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
            gradient.addColorStop(0, `rgba(139, 92, 246, ${alpha * 0.5})`); // #8b5cf6
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    drawGrid() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Draw Faint Purple Grid Lines
        this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.03)'; // Very faint purple
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

        // 2. Draw Breathing Stars at Intersections
        for (let x = 0; x <= this.width; x += this.gridSize) {
            for (let y = 0; y <= this.height; y += this.gridSize) {
                // Ambient Animation (Breathing Wave - as requested to restore)
                // Use sine wave based on position and time for a wave effect
                const wave = Math.sin(this.time * 2 + (x * 0.01) + (y * 0.01));
                const breathing = (wave + 1) / 2; // Normalize to 0-1

                // Random twinkling to make it organic (seeded by position)
                const randomSeed = Math.sin(x * y);

                // Base appearance
                let size = this.gridSize * 0.25;
                let alpha = 0.05 + (breathing * 0.08); // Pulse between 0.05 and 0.13

                // Interaction (still there but subtle)
                const dx = this.mouse.x - x;
                const dy = this.mouse.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const range = 180;

                if (dist < range) {
                    const factor = Math.pow(1 - (dist / range), 3);
                    size += factor * 8;
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
