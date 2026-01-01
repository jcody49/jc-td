import { Projectile } from '../projectiles.js';
import { cannonImg } from '../game-engine.js';

export class Tower {
    constructor({ x, y, ctx }) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.range = 100;
        this.cooldown = 0;
        this.fireRate = 45;
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
        // overridden by subclasses
    }

    draw() {
        // overridden by subclasses
    }
}
