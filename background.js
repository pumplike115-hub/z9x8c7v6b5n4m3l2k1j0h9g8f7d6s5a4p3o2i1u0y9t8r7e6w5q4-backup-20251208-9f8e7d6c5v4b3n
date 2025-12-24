class InteractiveGrid {
    constructor() {
        this.createCanvas();
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.mouse = { x: -1000, y: -1000 };
        this.targetMouse = { x: -1000, y: -1000 };
        this.gridSize = 35;
        this.time = 0;
        this.activeNodes = [];

        // Performance detection
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        // Smooth animation settings
        this.lastFrameTime = 0;
        this.targetFPS = this.isMobile ? 30 : 60;
        this.frameInterval = 1000 / this.targetFPS;

        // State for managing resize stability
        this.lastWidth = window.innerWidth;
        this.lastHeight = 0;

        // Throttle settings
        this.lastTouchTime = 0;
        this.touchThrottle = 16;

        // Pre-calculate grid positions for stability
        this.gridPoints = [];

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
            background: '#050507',
            willChange: 'transform',
            transform: 'translate3d(0,0,0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
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

        // Mouse events
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = e.pageX;
            this.targetMouse.y = e.pageY;
        }, { passive: true });

        // Touch events with throttling
        const handleTouch = (e) => {
            const now = performance.now();
            if (now - this.lastTouchTime < this.touchThrottle) return;
            this.lastTouchTime = now;

            const touch = e.touches[0];
            if (touch) {
                this.targetMouse.x = touch.pageX;
                this.targetMouse.y = touch.pageY;
            }
        };

        window.addEventListener('touchstart', handleTouch, { passive: true });
        window.addEventListener('touchmove', handleTouch, { passive: true });
        window.addEventListener('touchend', () => {
            this.targetMouse.x = -1000;
            this.targetMouse.y = -1000;
        }, { passive: true });

        this.animate(0);
    }

    calculateGridPoints() {
        this.gridPoints = [];
        for (let x = 0; x <= this.width; x += this.gridSize) {
            for (let y = 0; y <= this.height; y += this.gridSize) {
                this.gridPoints.push({ x, y });
            }
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

        this.calculateGridPoints();
    }

    // Smooth mouse interpolation
    lerpMouse() {
        const lerp = 0.12;
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * lerp;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * lerp;
    }

    drawStar(x, y, size, alpha) {
        // Use simple circles for better performance and smoother look
        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;
        this.ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
        this.ctx.fill();

        // Subtle glow for interactive stars
        if (alpha > 0.35) {
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(139, 92, 246, ${alpha * 0.3})`;
            this.ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    updateActiveNodes() {
        const spawnChance = this.isMobile ? 0.04 : 0.08;
        const maxNodes = this.isMobile ? 12 : 25;

        if (Math.random() < spawnChance && this.activeNodes.length < maxNodes) {
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
                // Smoother easing
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

        // Clear visible area
        this.ctx.fillStyle = '#050507';
        this.ctx.fillRect(0, viewTop, this.width, viewH + 100);

        // Draw faint grid lines
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

        // Draw stars - only in visible area
        for (let x = 0; x <= this.width; x += this.gridSize) {
            for (let y = startY; y <= endY; y += this.gridSize) {
                // Smooth wave animation
                const wave = Math.sin(this.time * 1.2 + (x * 0.015) + (y * 0.015));
                const breathing = (wave + 1) * 0.5;
                let alpha = 0.12 + (breathing * 0.08);
                let size = this.gridSize * 0.28;

                // Active node effect
                const activeEffect = this.getActiveNodeEffect(x, y);
                if (activeEffect) {
                    size += activeEffect.sizeBoost;
                    alpha += activeEffect.alphaBoost;
                }

                // Mouse interaction with smooth falloff
                const dx = this.mouse.x - x;
                const dy = this.mouse.y - y;
                const distSq = dx * dx + dy * dy;
                const maxDist = 140;
                const maxDistSq = maxDist * maxDist;

                if (distSq < maxDistSq) {
                    const dist = Math.sqrt(distSq);
                    // Smoother cubic falloff
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
    // Small delay for Safari to ensure DOM is ready
    setTimeout(() => new InteractiveGrid(), 50);
});
