import { Projectile } from './projectiles.js';

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
  
      // Find the first enemy in range
      const target = gameState.enemies.find(
        e => Math.hypot(this.x - e.x, this.y - e.y) < this.range
      );
  
      if (target) {
        
        gameState.projectiles.push(
          new Projectile({ x: this.x, y: this.y, target, ctx: this.ctx })
        );
        this.cooldown = 45; // frames until next shot
      }
    }
  
    draw() {
        const ctx = this.ctx;
      
        // Draw tower body
        ctx.fillStyle = "cyan";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.fill();
      
        // Muzzle flash: only shows 1 frame after shooting
        if (this.cooldown === 44) { // just fired
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(this.x, this.y, 14, 0, Math.PI * 2);
          ctx.fill();
        }
      
        // Optional: draw range circle for debugging
        // ctx.strokeStyle = "rgba(0,255,255,0.3)";
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        // ctx.stroke();
      }
      
  }
  