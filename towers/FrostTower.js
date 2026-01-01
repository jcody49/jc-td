import { Tower } from './tower.js';
import { frostImg } from '../game-engine.js';

export class FrostTower extends Tower {
    constructor(opts) {
        super({ ...opts, towerType: "frost" });
        this.range = 90;
        this.fireRate = 60;
        this.damage = 5;
        this.slowMultiplier = 0.5;
        this.slowDuration = 160;
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(frostImg, -16, -16, 32, 32);
        ctx.restore();
    }
}
