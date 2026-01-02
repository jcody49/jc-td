// TankTower.js
import { Tower } from './Tower.js';
import { Projectile } from '../projectiles.js';
import { tankImg } from '../game-engine.js';

export class TankTower extends Tower {
    constructor(opts) {
        super({ ...opts, towerType: "tank" });
        this.range = 120;       // slightly longer range
        this.fireRate = 100;     // slower firing
        this.damage = 30;       // moderate damage per enemy
        this.splashRadius = 50; // radius of AOE damage
    }

    update(gameState) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        // find target (closest to exit or just first in range)
        const target = gameState.enemies.find(
            e => Math.hypot(this.x - e.x, this.y - e.y) < this.range
        );

        if (target) {
            gameState.projectiles.push(
                new Projectile({
                    x: this.x,
                    y: this.y,
                    target,
                    ctx: this.ctx,
                    type: "tank",
                    damage: this.damage,
                    splashRadius: this.splashRadius
                })
            );
            this.cooldown = this.fireRate;
        }
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(tankImg, -20, -20, 40, 40);
        ctx.restore();
    }
}
