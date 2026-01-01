import { Tower } from './tower.js';
import { cannonImg } from '../game-engine.js';

export class CannonTower extends Tower {
    constructor(opts) {
        super({ ...opts, towerType: "cannon" });
        this.range = 100;
        this.fireRate = 35;
        this.damage = 55;
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI / 2); // left-facing

        const size = 27; // new smaller image size
        // center the image automatically
        ctx.drawImage(cannonImg, -size / 2, -size / 2, size, size);

        ctx.restore();
    }
}
