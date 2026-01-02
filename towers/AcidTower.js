// AcidTower.js
import { Tower } from './Tower.js';
import { Projectile } from '../projectiles.js';
import { acidImg } from '../game-engine.js';

export class AcidTower extends Tower {
    constructor(opts) {
        super({ ...opts, towerType: "acid" });
        this.range = 100;
        this.fireRate = 45;
        this.damage = 43;         // base DOT damage per tick
        this.dotDuration = 630;   // frames
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
            const totalDoTPercent = 0.3; // tower will remove 30% of target max HP
            const damagePerTick = (target.maxHp * totalDoTPercent) / this.dotDuration;
    
            gameState.projectiles.push(
                new Projectile({
                    x: this.x,
                    y: this.y,
                    target,
                    ctx: this.ctx,
                    type: "acid",
                    damage: 0,
                    dotDamage: .3,
                    dotDuration: 180
                  })
            );
            this.cooldown = this.fireRate;
        }
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(0); // facing up by default
        ctx.drawImage(acidImg, -20, -20, 40, 40);
        ctx.restore();
    }
}
