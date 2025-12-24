class InteractiveGrid {
    constructor() {
        this.createCanvas();
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.mouse = { x: -1000, y: -1000 };
        this.targetMouse = { x: -1000, y: -1000 };
        this.gridSize = 35;
        this.time = 0;
        this.activeNodes = [];

        // Performance settings
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        this.frameSkip = this.isMobile ? 2 : 1; // Skip frames on mobile
        this.frameCount = 0;
        this.lastFrameTime = 0;
        this.targetFPS = this.isMobile ? 30 : 60;
        this.frameInterval = 1000 / this.targetFPS;

        // State for managing resize stability
        this.lastWidth = window.innerWidth;
        this.lastHeight = 0;

        // Offscreen canvas for static grid
        this.gridCanvas = null;
        this.gridCtx = null;
        this.gridNeedsRedraw = true;

        // Throttle settings
        this.lastTouchTime = 0;
        this.touchThrottle = this.isMobile ? 32 : 16; // ~30fps on mobile, ~60fps on desktop

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
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
        });
        document.body.prepend(this.canvas);
    }

    createGridCanvas() {
        this.gridCanvas = document.createElement('canvas');
        this.gridCanvas.width = this.width;
        this.gridCanvas.height = this.height;
        this.gridCtx = this.gridCanvas.getContext('2d', { alpha: true });
    }

    init() {
        this.resize(true);

        // Stability Fix for mobile address bar
        window.addEventListener('resize', () => {
            const newWidth = window.innerWidth;
            if (newWidth !== this.lastWidth) {
                this.lastWidth = newWidth;
                this.gridNeedsRedraw = true;
                this.resize(true);
            }
        }, { passive: true });

        const resizeObserver = new ResizeObserver(() => {
            const bodyH = document.body.scrollHeight;
            if (Math.abs(bodyH - this.lastHeight) > 100) {
                this.gridNeedsRedraw = true;
                this.resize(false);
            }
        });
        resizeObserver.observe(document.body);

        // Mouse events (desktop)
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
            // Smoothly fade out mouse position
            this.targetMouse.x = -1000;
            this.targetMouse.y = -1000;
        }, { passive: true });

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

        this.createGridCanvas();
        this.gridNeedsRedraw = true;
    }

    // Smooth interpolation for mouse position
    lerpMouse() {
        const lerp = this.isMobile ? 0.15 : 0.2;
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * lerp;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * lerp;
    }

    drawStaticGrid() {
        if (!this.gridNeedsRedraw || !this.gridCtx) return;

        this.gridCtx.clearRect(0, 0, this.width, this.height);
        this.gridCtx.strokeStyle = 'rgba(139, 92, 246, 0.04)';
        this.gridCtx.lineWidth = 1;
        this.gridCtx.beginPath();

        for (let x = 0; x <= this.width; x += this.gridSize) {
            this.gridCtx.moveTo(x, 0);
            this.gridCtx.lineTo(x, this.height);
        }
        for (let y = 0; y <= this.height; y += this.gridSize) {
            this.gridCtx.moveTo(0, y);
            this.gridCtx.lineTo(this.width, y);
        }
        this.gridCtx.stroke();
        this.gridNeedsRedraw = false;
    }

    drawStar(x, y, size, alpha) {
        const scrollY = window.scrollY;
        const viewH = window.innerHeight;

        if (y < scrollY - 100 || y > scrollY + viewH + 100) return;

        // Simplified star for mobile
        if (this.isMobile && size < 8) {
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;
            this.ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
            this.ctx.fill();
            return;
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;

        const innerRadius = size * 0.15;
        const outerRadius = size * 0.5;

        this.ctx.moveTo(x, y - outerRadius);
        this.ctx.quadraticCurveTo(x + innerRadius, y - innerRadius, x + outerRadius, y);
        this.ctx.quadraticCurveTo(x + innerRadius, y + innerRadius, x, y + outerRadius);
        this.ctx.quadraticCurveTo(x - innerRadius, y + innerRadius, x - outerRadius, y);
        this.ctx.quadraticCurveTo(x - innerRadius, y - innerRadius, x, y - outerRadius);
        this.ctx.fill();

        // Glow effect only for larger stars on desktop
        if (!this.isMobile && alpha > 0.3) {
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 1.5);
            gradient.addColorStop(0, `rgba(139, 92, 246, ${alpha * 0.5})`);
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
    }

    updateActiveNodes() {
        // Reduce spawn rate on mobile
        const spawnChance = this.isMobile ? 0.05 : 0.1;

        if (Math.random() < spawnChance) {
            const scrollY = window.scrollY;
            const viewH = window.innerHeight;

            const gridX = Math.floor(Math.random() * (this.width / this.gridSize)) * this.gridSize;
            const minY = Math.floor(scrollY / this.gridSize) * this.gridSize;
            const maxY = minY + viewH;
            const gridY = Math.floor(Math.random() * ((maxY - minY) / this.gridSize + 6)) * this.gridSize + minY - (3 * this.gridSize);

            // Limit active nodes on mobile
            const maxNodes = this.isMobile ? 15 : 30;
            if (this.activeNodes.length < maxNodes) {
                this.activeNodes.push({
                    x: gridX,
                    y: gridY,
                    life: 0,
                    maxLife: 60 + Math.random() * 60,
                    scale: 1 + Math.random() * 1.5
                });
            }
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

        // Clear only visible area
        this.ctx.fillStyle = '#050507';
        this.ctx.fillRect(0, scrollY - 100, this.width, viewH + 200);

        // Draw static grid from offscreen canvas
        this.drawStaticGrid();
        if (this.gridCanvas) {
            this.ctx.drawImage(
                this.gridCanvas,
                0, scrollY - 100, this.width, viewH + 200,
                0, scrollY - 100, this.width, viewH + 200
            );
        }

        this.updateActiveNodes();

        const startY = Math.floor((scrollY - 100) / this.gridSize) * this.gridSize;
        const endY = startY + viewH + 200;

        // Increase step on mobile for better performance
        const step = this.isMobile ? this.gridSize * 2 : this.gridSize;

        // Batch similar operations
        for (let x = 0; x <= this.width; x += step) {
            for (let y = startY; y <= endY; y += step) {
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
                const distSq = dx * dx + dy * dy;
                const maxDistSq = 150 * 150;

                if (distSq < maxDistSq) {
                    const dist = Math.sqrt(distSq);
                    const factor = Math.pow(1 - (dist / 150), 2);
                    size += factor * 10;
                    alpha += factor * 0.4;
                }

                this.drawStar(x, y, size, alpha);
            }
        }
    }

    animate(timestamp) {
        // Frame rate limiting
        const elapsed = timestamp - this.lastFrameTime;

        if (elapsed >= this.frameInterval) {
            this.lastFrameTime = timestamp - (elapsed % this.frameInterval);

            this.frameCount++;
            if (this.frameCount % this.frameSkip === 0) {
                this.lerpMouse();
                this.time += 0.01;
                this.drawGrid();
            }
        }

        requestAnimationFrame((t) => this.animate(t));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Delay initialization slightly for Safari
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        setTimeout(() => new InteractiveGrid(), 100);
    } else {
        new InteractiveGrid();
    }
});
