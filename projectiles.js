export class Projectile {
    constructor({ x, y, target, ctx, type = "cannon" }) {
      this.x = x;
      this.y = y;
      this.target = target;
      this.ctx = ctx;
      this.type = type;      // new!
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
        if (this.type === "cannon") {
          this.target.hp -= 60;  // cannon damage
        } else if (this.type === "frost") {
          this.target.slowMultiplier = 0.5;
          this.target.slowTimer = 120;
        }
  
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
  
      if (this.type === "cannon") ctx.fillStyle = "rgba(255,255,0,0.5)";
      else if (this.type === "frost") ctx.fillStyle = "rgba(0,200,255,0.5)";
  
      this.trail.forEach(pos => {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      });
  
      ctx.beginPath();
      if (this.type === "cannon") ctx.fillStyle = "yellow";
      else if (this.type === "frost") ctx.fillStyle = "#6ecbff";
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  