import { Tower } from './tower.js';
import { Projectile } from '../projectiles.js';
import { frostImg } from '../game-engine.js';

export class FrostTower extends Tower {
    constructor(opts) {
        super(opts);
        this.range = 120;       // slightly bigger range
        this.fireRate = 45;     // frames between shots
        this.cooldown = 0;
        this.towerType = "frost";
    }

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
            // closest unslowed enemy
            unslowed.sort((a, b) => a.dist - b.dist);
            return unslowed[0].e;
        }

        if (slowed.length > 0) {
            // closest slowed enemy if no unslowed left
            slowed.sort((a, b) => a.dist - b.dist);
            return slowed[0].e;
        }

        return null; // nothing in range
    }

    update(gameState) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        const target = this.findTarget(gameState.enemies);
        if (target) {
            gameState.projectiles.push(
                new Projectile({
                    x: this.x,
                    y: this.y,
                    target,
                    ctx: this.ctx,
                    type: "frost",
                    damage: 0,
                    slowMultiplier: 0.5,
                    slowDuration: 180
                })
            );

            this.cooldown = this.fireRate;
        }
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(frostImg, -16, -16, 32, 32);
        ctx.restore();
    }
}
