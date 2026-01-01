import { Tower } from './tower.js';
import { Projectile } from '../projectiles.js';
import { cannonImg } from '../game-engine.js';

export class CannonTower extends Tower {
    constructor(opts) {
        super(opts);
        this.range = 110;
        this.fireRate = 45;
    }

    fire(target, gameState) {
        gameState.projectiles.push(
            new Projectile({
                x: this.x,
                y: this.y,
                target,
                ctx: this.ctx,
                damage: 10
            })
        );
    }

    draw() {
        const ctx = this.ctx;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI); // facing left
        ctx.drawImage(cannonImg, -16, -16, 32, 32);
        ctx.restore();
    }
}
