import { Projectile } from '../projectiles.js';

export class Tower {
    constructor({ x, y, target, ctx, type = "cannon", damage = 60, slowMultiplier = 1, slowDuration = 0, dotDuration = 0, opts }) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.ctx = ctx;
        this.type = type;
        this.speed = 4;
        this.radius = 3;
        this.hit = false;
        this.trail = [];
        this.damage = damage;
    
        this.slowMultiplier = slowMultiplier;
        this.slowDuration = slowDuration;
        this.dotDuration = dotDuration;
        this.hasSpecial = opts.hasSpecial || false;
    }
    

    findTarget(enemies) {
        return enemies.find(
            e => Math.hypot(this.x - e.x, this.y - e.y) < this.range
        );
    }

    update(gameState) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        const target = this.findTarget(gameState.enemies);
        if (target) {
            this.fire(target, gameState);
            this.cooldown = this.fireRate;
        }
    }

    fire(target, gameState) {
        gameState.projectiles.push(
            new Projectile({
                x: this.x,
                y: this.y,
                target,
                ctx: this.ctx,
                type: this.towerType,
                damage: this.damage,
                slowMultiplier: this.slowMultiplier,
                slowDuration: this.slowDuration
            })
        );
    }

    draw() {
        if (!this.ctx) return;
    
        // Draw hover effect if mouse is over this tower
        if (this.isHovered) {
            const size = 40; // size of the square (match tower image size)
            this.ctx.save();
            this.ctx.fillStyle = "rgba(0,255,255,0.2)"; // semi-transparent neon cyan
            this.ctx.shadowColor = "rgba(0,255,255,0.8)";
            this.ctx.shadowBlur = 10; // glow spread
            this.ctx.fillRect(this.x - size/2, this.y - size/2, size, size); // centered on tower
            this.ctx.restore();
        }
        
        
    
        // Actual tower drawing is still handled by subclasses
    }
    
}
