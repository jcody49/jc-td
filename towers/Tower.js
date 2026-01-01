import { Projectile } from '../projectiles.js';

export class Tower {
    constructor({ x, y, ctx, towerType = "cannon" }) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.range = 100;
        this.cooldown = 0;
        this.fireRate = 45;
        this.towerType = towerType; // cannon or frost
        this.damage = 20;           // default damage
        this.slowMultiplier = 1;    // default no slow
        this.slowDuration = 0;      // default no slow
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
