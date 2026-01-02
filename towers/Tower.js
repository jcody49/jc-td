import { Projectile } from '../projectiles.js';

export class Tower {
    constructor({ x, y, target, ctx, type = "cannon", damage = 60, slowMultiplier = 1, slowDuration = 0, dotDuration = 0 }) {
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
        this.dotDuration = dotDuration; // <-- add this
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
        // overridden by subclasses
    }
}
