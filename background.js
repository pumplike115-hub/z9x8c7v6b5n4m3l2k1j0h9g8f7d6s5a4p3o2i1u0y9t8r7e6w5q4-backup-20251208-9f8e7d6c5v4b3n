class InteractiveGrid {
    constructor() {
        this.isMobile = this.detectMobile();
        this.createCanvas();
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.gridSize = 35;
        this.isVisible = true;

        this.lastWidth = window.innerWidth;
        this.lastHeight = 0;

        // Interactive state (Desktop only)
        this.mouse = { x: -1000, y: -1000 };
        this.targetMouse = { x: -1000, y: -1000 };
        
        // Animation state
        this.time = 0;
        this.activeNodes = [];
        this.lastFrameTime = 0;
        
        // Optimize FPS for mobile to save battery
        this.frameInterval = this.isMobile ? (1000 / 24) : (1000 / 45); 

        this.init();
    }

    detectMobile() {
        const userAgent = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const touchPoints = navigator.maxTouchPoints > 1;
        const smallScreen = window.innerWidth <= 1024;
        const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSafariIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        return userAgent || isSafariIOS || (touchDevice && smallScreen);
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
            window.addEventListener('mousemove', (e) => {
                this.targetMouse.x = e.pageX;
                this.targetMouse.y = e.pageY;
            }, { passive: true });
        }

        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
        });

        // Start animation loop for BOTH mobile and desktop
        this.animate(0);
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
        
        // Draw once immediately on resize to avoid flash
        this.drawGrid();
    }

    lerpMouse() {
        if (this.isMobile) return;
        const lerp = 0.12;
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * lerp;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * lerp;
    }

    drawStar(x, y, size, alpha) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;

        // 3-pointed star
        for (let i = 0; i < 3; i++) {
            this.ctx.lineTo(0, size * -0.6);
            this.ctx.rotate(Math.PI / 3);
            this.ctx.lineTo(0, size * -0.15);
            this.ctx.rotate(Math.PI / 3);
        }

        this.ctx.fill();

        // Glow is disabled on mobile for performance
        if (!this.isMobile && alpha > 0.35) {
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(139, 92, 246, ${alpha * 0.3})`;
            for (let i = 0; i < 3; i++) {
                this.ctx.lineTo(0, size * -1.0);
                this.ctx.rotate(Math.PI / 3);
                this.ctx.lineTo(0, size * -0.25);
                this.ctx.rotate(Math.PI / 3);
            }
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    updateActiveNodes() {
        // Less active nodes on mobile
        const chance = this.isMobile ? 0.02 : 0.08;
        const maxNodes = this.isMobile ? 5 : 25;

        if (Math.random() < chance && this.activeNodes.length < maxNodes) {
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
        // Optimization: Only draw what's visible on screen plus a small margin
        const margin = this.isMobile ? 50 : 150; 
        const viewTop = scrollY - margin;
        const viewBottom = scrollY + viewH + margin;

        // Clear only visible area
        this.ctx.fillStyle = '#050507';
        this.ctx.fillRect(0, viewTop, this.width, viewBottom - viewTop);

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
                // Slower wave animation for mobile to look calmer
                const waveSpeed = this.isMobile ? 0.6 : 1.2;
                const wave = Math.sin(this.time * waveSpeed + (x * 0.015) + (y * 0.015));
                const breathing = (wave + 1) * 0.5;
                let alpha = 0.12 + (breathing * 0.08);
                let size = this.gridSize * 0.28;

                const activeEffect = this.getActiveNodeEffect(x, y);
                if (activeEffect) {
                    size += activeEffect.sizeBoost;
                    alpha += activeEffect.alphaBoost;
                }

                // Mouse interaction only on desktop
                if (!this.isMobile) {
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
                }

                this.drawStar(x, y, size, Math.min(alpha, 1));
            }
        }
    }

    animate(timestamp) {
        if (!this.isVisible) {
            requestAnimationFrame((t) => this.animate(t));
            return;
        }

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
