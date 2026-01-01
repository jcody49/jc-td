import { Tower } from './tower.js';
import { Projectile } from '../projectiles.js';
import { frostImg } from '../game-engine.js';

export class FrostTower extends Tower {
    constructor(opts) {
        super(opts);
        this.range = 90;
        this.cooldown = 0;  // track firing cooldown
    }

    update(gameState) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        // Find the first enemy in range
        const target = gameState.enemies.find(
            e => Math.hypot(this.x - e.x, this.y - e.y) < this.range
        );

        if (target) {
            // FIRE projectile with slow effect
            gameState.projectiles.push(
                new Projectile({
                    x: this.x,
                    y: this.y,
                    target,
                    ctx: this.ctx,
                    damage: 5,
                    slowMultiplier: 0.5,   // 50% speed
                    slowDuration: 120       // 2 seconds at 60fps
                })
            );

            this.cooldown = 60; // frames until next shot
        }
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(frostImg, -16, -16, 32, 32); // draw tower sprite
        ctx.restore();
    }
}
