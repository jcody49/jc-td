import { Projectile } from './projectiles.js';
import { cannonImg } from './game-engine.js';

export class Tower {
    constructor({ x, y, ctx }) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.range = 100;
        this.cooldown = 0;
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
                new Projectile({ x: this.x, y: this.y, target, ctx: this.ctx })
            );
            this.cooldown = 45;
        }
    }

    draw() {
        const ctx = this.ctx;
    
        // Draw the cannon image
        ctx.save();
        ctx.translate(this.x, this.y);
    
        // Rotate to face left
        ctx.rotate(Math.PI*2.5); // 180 degrees
    
        // Slightly smaller cannon
        const cannonSize = 27; // a tad smaller
        ctx.drawImage(
            cannonImg,
            -cannonSize / 2,
            -cannonSize / 2,
            cannonSize,
            cannonSize
        );
    
        ctx.restore();
    
        // Muzzle flash: only shows 1 frame after shooting
        if (this.cooldown === 44) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(this.x, this.y, 14, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    
    
}
