import { Tower } from './tower.js';
import { cannonImg } from '../game-engine.js';

export class CannonTower extends Tower {
    constructor(opts) {
        super({ ...opts, towerType: "cannon" });
        this.range = 100;
        this.fireRate = 45;
        this.damage = 60;
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI / 2); // left-facing
        ctx.drawImage(cannonImg, -20, -20, 40, 40);
        ctx.restore();
    }
}
