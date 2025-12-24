class InteractiveGrid {
    constructor() {
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        this.createCanvas();
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.mouse = { x: -1000, y: -1000 };
        this.targetMouse = { x: -1000, y: -1000 };
        this.gridSize = 35;
        this.time = 0;
        this.activeNodes = [];

        this.lastWidth = window.innerWidth;
        this.lastHeight = 0;
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / 60;

        // Mobile: pre-rendered static stars
        this.staticCanvas = null;
        this.stars = [];

        this.init();
    }

    createCanvas() {
        const existing = document.getElementById('bg-canvas');
        if (existing) existing.remove();

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'bg-canvas';
        Object.assign(this.canvas.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '0px',
            zIndex: '-1',
            pointerEvents: 'none',
            background: '#050507'
        });
        document.body.prepend(this.canvas);
    }

    init() {
        this.resize(true);

        window.addEventListener('resize', () => {
            const newWidth = window.innerWidth;
            if (newWidth !== this.lastWidth) {
                this.lastWidth = newWidth;
                this.resize(true);
            }
        }, { passive: true });

        const resizeObserver = new ResizeObserver(() => {
            const bodyH = document.body.scrollHeight;
            if (Math.abs(bodyH - this.lastHeight) > 100) {
                this.resize(false);
            }
        });
        resizeObserver.observe(document.body);

        if (!this.isMobile) {
            // Desktop: interactive
            window.addEventListener('mousemove', (e) => {
                this.targetMouse.x = e.pageX;
                this.targetMouse.y = e.pageY;
            }, { passive: true });

            window.addEventListener('touchstart', (e) => {
                this.targetMouse.x = e.touches[0].pageX;
                this.targetMouse.y = e.touches[0].pageY;
            }, { passive: true });

            window.addEventListener('touchmove', (e) => {
                this.targetMouse.x = e.touches[0].pageX;
                this.targetMouse.y = e.touches[0].pageY;
            }, { passive: true });

            window.addEventListener('touchend', () => {
                this.targetMouse.x = -1000;
                this.targetMouse.y = -1000;
            }, { passive: true });

            this.animate(0);
        } else {
            // Mobile: static render once
            this.renderStaticStars();
        }
    }

    resize(force = false) {
        const docH = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            window.innerHeight
        );

        if (!force && Math.abs(docH - this.lastHeight) < 100) return;

        this.width = window.innerWidth;
        this.height = docH;
        this.lastHeight = docH;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.height = `${this.height}px`;

        if (this.isMobile) {
            this.generateStars();
            this.renderStaticStars();
        }
    }

    // ===== MOBILE: Static Starfield =====
    generateStars() {
        this.stars = [];
        const density = 0.0004; // stars per pixel
        const numStars = Math.floor(this.width * this.height * density);

        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.6 + 0.2,
                type: Math.random() // for variety
            });
        }

        // Add some brighter accent stars
        const accentCount = Math.floor(numStars * 0.08);
        for (let i = 0; i < accentCount; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 3 + 2,
                alpha: Math.random() * 0.4 + 0.5,
                type: 2, // accent type
                glow: true
            });
        }
    }

    renderStaticStars() {
        // Fill background
        this.ctx.fillStyle = '#050507';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw subtle grid
        this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.03)';
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

        // Draw stars
        for (const star of this.stars) {
            if (star.glow) {
                // Glow effect for accent stars
                const gradient = this.ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.size * 3
                );
                gradient.addColorStop(0, `rgba(167, 139, 250, ${star.alpha})`);
                gradient.addColorStop(0.4, `rgba(139, 92, 246, ${star.alpha * 0.4})`);
                gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Star core
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(200, 180, 255, ${star.alpha})`;
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    // ===== DESKTOP: Interactive Animation =====
    lerpMouse() {
        const lerp = 0.12;
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * lerp;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * lerp;
    }

    drawStar(x, y, size, alpha) {
        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;
        this.ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
        this.ctx.fill();

        if (alpha > 0.35) {
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(139, 92, 246, ${alpha * 0.3})`;
            this.ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    updateActiveNodes() {
        if (Math.random() < 0.08 && this.activeNodes.length < 25) {
            const scrollY = window.scrollY;
            const viewH = window.innerHeight;

            const gridX = Math.floor(Math.random() * (this.width / this.gridSize)) * this.gridSize;
            const minY = Math.floor(scrollY / this.gridSize) * this.gridSize;
            const maxY = minY + viewH;
            const gridY = Math.floor(Math.random() * ((maxY - minY) / this.gridSize + 6)) * this.gridSize + minY - (3 * this.gridSize);

            this.activeNodes.push({
                x: gridX,
                y: gridY,
                life: 0,
                maxLife: 80 + Math.random() * 80,
                scale: 1 + Math.random() * 1.2
            });
        }

        for (let i = this.activeNodes.length - 1; i >= 0; i--) {
            this.activeNodes[i].life++;
            if (this.activeNodes[i].life > this.activeNodes[i].maxLife) {
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
                    sizeBoost: intensity * 12 * node.scale,
                    alphaBoost: intensity * 0.5
                };
            }
        }
        return null;
    }

    drawGrid() {
        const scrollY = window.scrollY;
        const viewH = window.innerHeight;
        const viewTop = scrollY - 50;
        const viewBottom = scrollY + viewH + 50;

        this.ctx.fillStyle = '#050507';
        this.ctx.fillRect(0, viewTop, this.width, viewH + 100);

        this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.04)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();

        const startY = Math.floor(viewTop / this.gridSize) * this.gridSize;
        const endY = Math.ceil(viewBottom / this.gridSize) * this.gridSize;

        for (let x = 0; x <= this.width; x += this.gridSize) {
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, endY);
        }
        for (let y = startY; y <= endY; y += this.gridSize) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
        }
        this.ctx.stroke();

        this.updateActiveNodes();

        for (let x = 0; x <= this.width; x += this.gridSize) {
            for (let y = startY; y <= endY; y += this.gridSize) {
                const wave = Math.sin(this.time * 1.2 + (x * 0.015) + (y * 0.015));
                const breathing = (wave + 1) * 0.5;
                let alpha = 0.12 + (breathing * 0.08);
                let size = this.gridSize * 0.28;

                const activeEffect = this.getActiveNodeEffect(x, y);
                if (activeEffect) {
                    size += activeEffect.sizeBoost;
                    alpha += activeEffect.alphaBoost;
                }

                const dx = this.mouse.x - x;
                const dy = this.mouse.y - y;
                const distSq = dx * dx + dy * dy;
                const maxDist = 140;
                const maxDistSq = maxDist * maxDist;

                if (distSq < maxDistSq) {
                    const dist = Math.sqrt(distSq);
                    const t = 1 - (dist / maxDist);
                    const factor = t * t * t;
                    size += factor * 8;
                    alpha += factor * 0.35;
                }

                this.drawStar(x, y, size, Math.min(alpha, 1));
            }
        }
    }

    animate(timestamp) {
        const elapsed = timestamp - this.lastFrameTime;

        if (elapsed >= this.frameInterval) {
            this.lastFrameTime = timestamp - (elapsed % this.frameInterval);
            this.lerpMouse();
            this.time += 0.008;
            this.drawGrid();
        }

        requestAnimationFrame((t) => this.animate(t));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => new InteractiveGrid(), 50);
});
