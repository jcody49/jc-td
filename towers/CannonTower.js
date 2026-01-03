import { Tower } from './tower.js';
import { cannonImg } from '../game-engine.js';

export class CannonTower extends Tower {
    constructor(opts) {
        super({ ...opts, towerType: "cannon" });
        this.range = 95;
        this.fireRate = 60;
        this.damage = 55;
    }

    draw() {
        super.draw();
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(this.x, this.y);


        const size = 27; // new smaller image size
        
        ctx.drawImage(cannonImg, -size / 2, -size / 2, size, size);

        ctx.restore();
    }
}
