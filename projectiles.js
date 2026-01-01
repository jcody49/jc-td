export class Projectile {
    constructor({ x, y, target, ctx, type = "cannon" }) {
      this.x = x;
      this.y = y;
      this.target = target;
      this.ctx = ctx;
      this.type = type;          // "cannon" or "frost"
      this.speed = 4;            // projectile speed
      this.radius = 3;           // base size
      this.hit = false;          // whether it hit its target
      this.trail = [];           // for visual trail
    }
  
    update() {
      if (!this.target) return;
  
      // Move towards target
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      const dist = Math.hypot(dx, dy);
  
      // Check if it hits
      if (dist < this.radius + 10) {
        if (this.type === "cannon") {
          this.target.hp -= 60;  // cannon damage
        } else if (this.type === "frost") {
          this.target.slowMultiplier = 0.5;   // slow enemy
          this.target.slowTimer = 120;        // duration in frames
        }
  
        this.hit = true;
        return;
      }
  
      // Move projectile
      this.x += (dx / dist) * this.speed;
      this.y += (dy / dist) * this.speed;
  
      // Add to trail
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 5) this.trail.shift();
    }
  
    draw() {
        const ctx = this.ctx;
      
        // Draw trail
        this.trail.forEach(pos => {
          ctx.beginPath();
          if (this.type === "cannon") ctx.fillStyle = "rgba(255,255,0,0.5)";
          else if (this.type === "frost") ctx.fillStyle = "rgba(173, 216, 230, 0.5)"; // icy light blue
          ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      
        // Draw main projectile
        ctx.beginPath();
        if (this.type === "cannon") ctx.fillStyle = "yellow";
        else if (this.type === "frost") ctx.fillStyle = "rgba(0, 191, 255, 1)"; // solid icy blue
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
  }
  