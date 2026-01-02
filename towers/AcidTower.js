import { Projectile } from '../projectiles.js';
import { acidImg } from '../game-engine.js';

export class AcidTower {
    constructor({ x, y, ctx }) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.damage= 20
        this.range = 100;
        this.cooldown = 0;

        this.towerType = "acid";
        this.fireRate = 50; // slower than cannon
    }

    update(gameState) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }

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
                    type: this.towerType
                })
            );

            this.cooldown = this.fireRate;
        }
    }

    draw() {
        const ctx = this.ctx;

        ctx.save();
        ctx.translate(this.x, this.y);

        // Adjust rotation if your acid tower sprite needs it
        ctx.rotate(0);

        ctx.drawImage(
            acidImg,
            -20,
            -20,
            40,
            40
        );

        ctx.restore();

        // Optional: acid "sizzle" flash on fire
        if (this.cooldown === this.fireRate - 1) {
            ctx.fillStyle = "rgba(124,255,0,0.6)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, 14, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
