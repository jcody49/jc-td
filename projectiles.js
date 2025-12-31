// projectile.js
export class Projectile {
    constructor({ x, y, target, ctx }) {
      this.x = x;
      this.y = y;
      this.target = target;
      this.ctx = ctx;
      this.speed = 4;
      this.radius = 3;
      this.hit = false;
      this.trail = [];
    }
  
    update() {
      if (!this.target) return;
  
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      const dist = Math.hypot(dx, dy);
  
      if (dist < this.radius + 10) {
        this.target.hp -= 60;
        this.hit = true;
        return;
      }
  
      this.x += (dx / dist) * this.speed;
      this.y += (dy / dist) * this.speed;
  
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 5) this.trail.shift();
    }
  
    draw() {
      const ctx = this.ctx;
  
      ctx.fillStyle = "rgba(255,255,0,0.5)";
      this.trail.forEach(pos => {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      });
  
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  