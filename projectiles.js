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
        if (!this.target) return;

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < this.radius + 10 && !this.hit) {
            // --- Tank AOE ---
            if (this.type === "tank" && this.splashRadius > 0) {
                gameState.enemies.forEach(enemy => {
                    const d = Math.hypot(enemy.x - this.x, enemy.y - this.y);
                    if (d <= this.splashRadius) {
                        enemy.hp -= this.damage;
                    }
                });
            }
            // --- Acid DoT ---
            else if (this.type === "acid" && this.dotDamage > 0 && this.dotDuration > 0) {
                if (!this.target.activeDoTs) this.target.activeDoTs = [];
                this.target.activeDoTs.push({
                    damagePerTick: this.dotDamage,
                    remaining: this.dotDuration
                });
            }
            // --- Frost slow ---
            else if (this.type === "frost") {
                if (!this.target.slowTimer || this.target.slowTimer < this.slowDuration) {
                    this.target.slowMultiplier = this.slowMultiplier;
                    this.target.slowTimer = this.slowDuration;
                }
                if (this.damage > 0) this.target.hp -= this.damage;
            }
            // --- Default single-target damage ---
            else {
                if (this.damage > 0) this.target.hp -= this.damage;
            }

            this.hit = true;
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
        if (this.type === "cannon") ctx.fillStyle = "yellow";
        else if (this.type === "frost") ctx.fillStyle = "#6ecbff";
        else if (this.type === "acid") ctx.fillStyle = "rgba(124,255,0,0.5)";

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
