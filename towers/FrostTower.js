import { Tower } from './tower.js';
import { frostImg } from '../game-engine.js';

export class FrostTower extends Tower {
    constructor(opts) {
        super({ ...opts, towerType: "frost" });
        this.range = 120;          // slightly bigger range
        this.fireRate = 45;        // frames between shots
        this.cooldown = 0;
        this.damage = 40;          // frost damage
        this.slowMultiplier = 0.5; // 50% speed
        this.slowDuration = 210;   // 3.5 seconds at 60fps
    }

    // target closest unslowed enemy first, else closest slowed
    findTarget(enemies) {
        let unslowed = [];
        let slowed = [];

        enemies.forEach(e => {
            const dist = Math.hypot(this.x - e.x, this.y - e.y);
            if (dist > this.range) return;

            if (!e.slowTimer || e.slowTimer <= 0) unslowed.push({ e, dist });
            else slowed.push({ e, dist });
        });

        if (unslowed.length > 0) {
            unslowed.sort((a, b) => a.dist - b.dist);
            return unslowed[0].e;
        }

        if (slowed.length > 0) {
            slowed.sort((a, b) => a.dist - b.dist);
            return slowed[0].e;
        }

        return null;
    }

    update(gameState) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        const target = this.findTarget(gameState.enemies);
        if (target) {
            // use base fire method to create projectile
            this.fire(target, gameState);
            this.cooldown = this.fireRate;
        }
    }

    draw() {
        super.draw();
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(frostImg, -16, -16, 32, 32);
        ctx.restore();
    }
}
