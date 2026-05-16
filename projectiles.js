export class Projectile {
    constructor({
        x, y, target, ctx, type = "cannon",
        damage = 60, slowMultiplier = 1, slowDuration = 0,
        dotDamage = 0, dotDuration = 0, splashRadius = 0
    }) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.ctx = ctx;
        this.type = type;
        this.speed = 4;
        this.radius = 3;
        this.trail = [];
        this.hit = false;

        // Damage / effects
        this.damage = damage;          // instant damage
        this.dotDamage = dotDamage;    // per-frame DoT
        this.dotDuration = dotDuration;
        this.slowMultiplier = slowMultiplier;
        this.slowDuration = slowDuration;
        this.splashRadius = splashRadius;
    }

    update(gameState) {
        function applyDamage(enemy, damage) {
            let remaining = damage;
        
            if (enemy.armor > 0) {
                const absorbed = Math.min(enemy.armor, remaining);
                enemy.armor -= absorbed;
                remaining -= absorbed;
            }
        
            if (remaining > 0) {
                enemy.hp -= remaining;
            }
        }

        if (!this.target || this.hit) {
            this.remove = true; // Mark this projectile for removal
            return;
        }
    
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.hypot(dx, dy);
    
        if (dist < this.radius + 10 && !this.hit) {
            // Handle the hit logic (apply effects, damage, etc.)
            if (this.type === "tank" && this.splashRadius > 0) {
                gameState.enemies.forEach(enemy => {
                    const d = Math.hypot(enemy.x - this.x, enemy.y - this.y);
                    if (d <= this.splashRadius) {
            
                        const piercePct = .95;
                        const pierceDamage = this.damage * piercePct;
            
                        // 1. FULL damage goes through armor system
                        applyDamage(enemy, this.damage);
            
                        // 2. EXTRA pierce damage goes straight to HP
                        enemy.hp = Math.max(0, enemy.hp - pierceDamage);
                    }
                });
            } else if (this.type === "acid" && this.dotDamage > 0 && this.dotDuration > 0) {
                if (!this.target.activeDoTs) this.target.activeDoTs = [];
                this.target.activeDoTs.push({
                    damagePerTick: this.dotDamage,
                    remaining: this.dotDuration
                });
            } else if (this.type === "frost") {
                if (!this.target.slowTimer || this.target.slowTimer < this.slowDuration) {
                    this.target.slowMultiplier = this.slowMultiplier;
                    this.target.slowTimer = this.slowDuration;
                }
                if (this.damage > 0) applyDamage(this.target, this.damage);
            } else {
                if (this.damage > 0) applyDamage(this.target, this.damage);
            }
            this.hit = true;
            this.remove = true;
            return;
        }
    
        // Move projectile toward target
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;
    
        // Trail effect
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 5) this.trail.shift();
    }
    

    draw() {

        const ctx = this.ctx;

        ctx.save();

        if (this.type === "cannon") {
            ctx.fillStyle = "yellow";
        }
        else if (this.type === "tank") {
            ctx.fillStyle = "#ff9933"; // orange shell
        }
        else if (this.type === "frost") {
            ctx.fillStyle = "#6ecbff";
        }
        else if (this.type === "acid") {
            ctx.fillStyle = "rgba(124,255,0,0.5)";
        }
        else if (this.type === "antiAir") {
            ctx.fillStyle = "red";
        }
        else {
            ctx.fillStyle = "white";
        }

        // Draw trail
        this.trail.forEach(pos => {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw projectile
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
