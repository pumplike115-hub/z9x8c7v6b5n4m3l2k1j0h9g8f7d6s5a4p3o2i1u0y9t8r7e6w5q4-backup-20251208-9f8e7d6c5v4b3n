class InteractiveGrid {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isLowEnd = this.detectLowEnd();
        this.createCanvas();
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.gridSize = this.isMobile ? 45 : 35;
        this.isVisible = true;

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.mouse = { x: -1000, y: -1000 };
        this.targetMouse = { x: -1000, y: -1000 };

        this.time = 0;
        this.activeNodes = [];
        this.lastFrameTime = 0;

        // FPS: low-end=12, mobile=15, desktop=60
        this.frameInterval = this.isLowEnd ? (1000 / 12) : this.isMobile ? (1000 / 15) : (1000 / 60);
        this._rafId = null;

        this.init();
    }

    detectMobile() {
        const ua = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const small = window.innerWidth <= 1024;
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        return ua || ios || (touch && small);
    }

    detectLowEnd() {
        const cores = navigator.hardwareConcurrency || 4;
        const memory = navigator.deviceMemory || 4;          // Chrome only
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const verySmall = window.innerWidth <= 480;
        // Low battery API (Chrome Android)
        this._checkBattery();
        return reduced || verySmall || (this.isMobile && (cores <= 2 || memory <= 2));
    }

    _checkBattery() {
        if (!navigator.getBattery) return;
        navigator.getBattery().then(bat => {
            // If battery < 20% and not charging, switch to static mode
            const goStatic = () => {
                if (!bat.charging && bat.level < 0.2 && !this.isLowEnd) {
                    this.isLowEnd = true;
                    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
                    this.drawStaticGrid();
                }
            };
            bat.addEventListener('levelchange', goStatic);
            bat.addEventListener('chargingchange', goStatic);
            goStatic();
        }).catch(() => {});
    }

    createCanvas() {
        const existing = document.getElementById('bg-canvas');
        if (existing) existing.remove();

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'bg-canvas';
        Object.assign(this.canvas.style, {
            position: 'fixed',
            top: '0', left: '0',
            width: '100%', height: '100%',
            zIndex: '-1', pointerEvents: 'none',
            background: '#050507'
        });
        document.body.prepend(this.canvas);
    }

    init() {
        // Low-end: static grid only — no rAF loop
        if (this.isLowEnd) {
            this.resize(true);
            window.addEventListener('resize', () => this.resize(true), { passive: true });
            return;
        }

        this.resize(true);

        window.addEventListener('resize', () => {
            this.resize();
        }, { passive: true });

        if (!this.isMobile) {
            window.addEventListener('mousemove', (e) => {
                this.targetMouse.x = e.pageX;
                this.targetMouse.y = e.pageY;
            }, { passive: true });
        }

        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
            if (this.isVisible && !this._rafId) {
                // Resume animation when tab becomes visible again
                this._rafId = requestAnimationFrame((t) => this.animate(t));
            }
        });

        this._rafId = requestAnimationFrame((t) => this.animate(t));
    }

    resize(force = false) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        
        if (!force && this.width === w && this.height === h) return;

        this.width = w;
        this.height = h;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.isLowEnd ? this.drawStaticGrid() : this.drawGrid();
    }

    // Static grid for low-end / prefers-reduced-motion — no CPU loop
    drawStaticGrid() {
        this.ctx.fillStyle = '#050507';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.05)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for (let x = 0; x <= this.width; x += this.gridSize) {
            this.ctx.moveTo(x, 0); this.ctx.lineTo(x, this.height);
        }
        for (let y = 0; y <= this.height; y += this.gridSize) {
            this.ctx.moveTo(0, y); this.ctx.lineTo(this.width, y);
        }
        this.ctx.stroke();

        this.ctx.fillStyle = 'rgba(167, 139, 250, 0.1)';
        for (let x = 0; x <= this.width; x += this.gridSize) {
            for (let y = 0; y <= this.height; y += this.gridSize) {
                this.ctx.beginPath();
                this.ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    lerpMouse() {
        if (this.isMobile) return;
        const l = 0.18;
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * l;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * l;
    }

    drawStar(x, y, size, alpha) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;
        for (let i = 0; i < 3; i++) {
            this.ctx.lineTo(0, size * -0.6);
            this.ctx.rotate(Math.PI / 3);
            this.ctx.lineTo(0, size * -0.15);
            this.ctx.rotate(Math.PI / 3);
        }
        this.ctx.fill();

        // Glow only on desktop
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
        const chance = this.isMobile ? 0.015 : 0.08;
        const max = this.isMobile ? 3 : 25;

        if (Math.random() < chance && this.activeNodes.length < max) {
            const sy = window.scrollY, vh = this.height;
            const gx = Math.floor(Math.random() * (this.width / this.gridSize)) * this.gridSize;
            const minY = Math.floor(sy / this.gridSize) * this.gridSize;
            const maxY = minY + vh;
            const gy = Math.floor(Math.random() * ((maxY - minY) / this.gridSize + 6)) * this.gridSize + minY - 3 * this.gridSize;
            this.activeNodes.push({ x: gx, y: gy, life: 0, maxLife: this.isMobile ? 60 : (80 + Math.random() * 80), scale: 1 + Math.random() * 1.2 });
        }

        for (let i = this.activeNodes.length - 1; i >= 0; i--) {
            this.activeNodes[i].life++;
            if (this.activeNodes[i].life > this.activeNodes[i].maxLife) this.activeNodes.splice(i, 1);
        }
    }

    getActiveNodeEffect(x, y) {
        for (const n of this.activeNodes) {
            if (n.x === x && n.y === y) {
                const p = n.life / n.maxLife;
                const k = Math.sin(p * Math.PI);
                return { sizeBoost: k * 12 * n.scale, alphaBoost: k * 0.5 };
            }
        }
        return null;
    }

    drawGrid() {
        const sy = window.scrollY, vh = this.height;
        const margin = this.isMobile ? 30 : 150;
        const top = sy - margin, bot = sy + vh + margin;

        this.ctx.save();
        this.ctx.translate(0, -sy);

        this.ctx.fillStyle = '#050507';
        this.ctx.fillRect(0, top, this.width, bot - top);

        this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.04)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();

        const startY = Math.floor(top / this.gridSize) * this.gridSize;
        const endY = Math.ceil(bot / this.gridSize) * this.gridSize;

        for (let x = 0; x <= this.width; x += this.gridSize) {
            this.ctx.moveTo(x, startY); this.ctx.lineTo(x, endY);
        }
        for (let y = startY; y <= endY; y += this.gridSize) {
            this.ctx.moveTo(0, y); this.ctx.lineTo(this.width, y);
        }
        this.ctx.stroke();

        this.updateActiveNodes();

        for (let x = 0; x <= this.width; x += this.gridSize) {
            for (let y = startY; y <= endY; y += this.gridSize) {
                const ws = this.isMobile ? 0.5 : 1.2;
                const wave = Math.sin(this.time * ws + x * 0.015 + y * 0.015);
                let alpha = 0.12 + (wave + 1) * 0.04;
                let size = this.gridSize * 0.28;

                const fx = this.getActiveNodeEffect(x, y);
                if (fx) { size += fx.sizeBoost; alpha += fx.alphaBoost; }

                if (!this.isMobile) {
                    const dx = this.mouse.x - x, dy = this.mouse.y - y;
                    const dSq = dx * dx + dy * dy, maxD = 140;
                    if (dSq < maxD * maxD) {
                        const t = 1 - Math.sqrt(dSq) / maxD;
                        const f = t * t * t;
                        size += f * 8; alpha += f * 0.35;
                    }
                }

                this.drawStar(x, y, size, Math.min(alpha, 1));
            }
        }

        this.ctx.restore();
    }

    animate(timestamp) {
        // CRITICAL FIX: truly stop the loop when tab is hidden
        if (!this.isVisible) {
            this._rafId = null; // Let visibilitychange restart it
            return;
        }

        const elapsed = timestamp - this.lastFrameTime;
        if (elapsed >= this.frameInterval) {
            this.lastFrameTime = timestamp - (elapsed % this.frameInterval);
            this.lerpMouse();
            this.time += this.isMobile ? 0.008 : 0.012;
            this.drawGrid();
        }

        this._rafId = requestAnimationFrame((t) => this.animate(t));
    }
}

window.startBackground = () => {
    if (!window.bgCanvasStarted) {
        window.bgCanvasStarted = true;
        // Store instance globally
        setTimeout(() => { window.bgCanvasInst = new InteractiveGrid(); }, 50);
    }
};
