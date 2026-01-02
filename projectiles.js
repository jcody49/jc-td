export class Projectile {
    constructor({ x, y, target, ctx, type = "cannon", damage = 60, slowMultiplier = 1, slowDuration = 0 }) {
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
    }

    update() {
        if (!this.target) return;
    
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.hypot(dx, dy);
    
        if (dist < this.radius + 10) {
            // Apply damage for ALL projectiles, regardless of type
            if (this.damage && this.damage > 0) {
                this.target.hp -= this.damage;
            }
    
            // Apply slow only if frost
            if (this.type === "frost") {
                // refresh slow only if longer than current
                if (!this.target.slowTimer || this.target.slowTimer < this.slowDuration) {
                    this.target.slowMultiplier = this.slowMultiplier;
                    this.target.slowTimer = this.slowDuration;
                }
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
