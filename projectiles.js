export class Projectile {
    constructor({ x, y, target, ctx, type = "cannon", damage = 0, slowMultiplier = 1, slowDuration = 0, dotDamage = 0, dotDuration = 0 }) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.ctx = ctx;
        this.type = type;
        this.speed = 4;
        this.radius = 3;
        this.hit = false;
        this.trail = [];
        this.damage = damage;

        this.slowMultiplier = slowMultiplier;
        this.slowDuration = slowDuration;

        this.dotDamage = dotDamage;
        this.dotDuration = dotDuration || 0;
    }

    update() {
        if (!this.target) return;
    
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.hypot(dx, dy);
    
        if (dist < this.radius + 10) {

            // instant damage
            if (this.damage > 0) {
              this.target.hp -= this.damage;
            }
          
            // slow
            if (this.type === "frost") {
              if (!this.target.slowTimer || this.target.slowTimer < this.slowDuration) {
                this.target.slowMultiplier = this.slowMultiplier;
                this.target.slowTimer = this.slowDuration;
              }
            }
          
            // DoT (acid)
            if (this.type === "acid" && this.dotDamage > 0 && this.dotDuration > 0) {
              this.target.activeDoTs.push({
                damagePerTick: this.dotDamage,
                remaining: this.dotDuration
              });
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

        if (this.type === "cannon") ctx.fillStyle = "yellow";
        else if (this.type === "frost") ctx.fillStyle = "#6ecbff";
        else if (this.type === "acid") ctx.fillStyle = "rgba(124,255,0,0.5)";

        this.trail.forEach(pos => {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
