import { Projectile } from '../projectiles.js';

export class Tower {
    constructor({ x, y, ctx, type = "cannon", levelData = {}, upgradeCosts = [], maxLevel = 5, opts = {} }) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.type = type;

        // --- Upgrade system ---
        this.level = 1;
        this.maxLevel = maxLevel;
        this.levelData = levelData;
        this.upgradeCosts = upgradeCosts;

        this.hasSpecial = opts.hasSpecial || false;

        // Stats (set by levelData)
        this.damage = 0;
        this.splashRadius = 0;
        this.range = 0;
        this.fireRate = 0;
        this.cooldown = 0;
        this.slowMultiplier = 1;
        this.slowDuration = 0;
        this.dotDuration = 0;
        this.sprite = null;
        this.image = null;

        this.applyLevel();
    }

    applyLevel() {
        const data = this.levelData[this.level];
        if (!data) return;

        Object.assign(this, data);

        if (data.sprite) {
            this.image = new Image();
            this.image.src = `assets/${data.sprite}`;
        }
    }

    upgrade(gameState) {
        if (this.level >= this.maxLevel) return false;

        const cost = this.upgradeCosts[this.level - 1];
        if (gameState.money < cost) return false;

        gameState.money -= cost;
        this.level++;
        this.applyLevel();
        return true;
    }

    findTarget(enemies) {
        const inRange = enemies
            .map(e => ({
                e,
                dist: Math.hypot(this.x - e.x, this.y - e.y)
            }))
            .filter(obj => obj.dist < this.range);
    
        if (inRange.length === 0) return null;
    
        // Frost logic
        if (this.targetingMode === "unslowedFirst") {
            const unslowed = inRange.filter(
                obj => !obj.e.slowTimer || obj.e.slowTimer <= 0
            );
            if (unslowed.length > 0) {
                unslowed.sort((a, b) => a.dist - b.dist);
                return unslowed[0].e;
            }
        }
    
        // Default closest
        inRange.sort((a, b) => a.dist - b.dist);
        return inRange[0].e;
    }
    

    update(gameState) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        const target = this.findTarget(gameState.enemies);
        if (target) {
            this.fire(target, gameState);
            this.cooldown = this.fireRate;
        }
    }

    fire(target, gameState) {
        console.log("TOWER FIRE", this.type, this.damage, this.splashRadius, this.dotDuration, this.dotDamage);
    
        // Calculate per-frame DoT if this tower has dotDuration defined
        let perFrameDot = 0;
        if (this.dotDuration && this.dotDuration > 0) {
            // If dotDamage is undefined, use damage as total DoT
            const totalDot = this.dotDamage !== undefined ? this.dotDamage : this.damage;
            perFrameDot = totalDot / this.dotDuration;
        }
    
        gameState.projectiles.push(
            new Projectile({
                x: this.x,
                y: this.y,
                target,
                ctx: this.ctx,
                type: this.type,
                damage: this.damage,             // instant damage
                dotDamage: perFrameDot,          // per-frame DoT
                dotDuration: this.dotDuration || 0,
                slowMultiplier: this.slowMultiplier,
                slowDuration: this.slowDuration,
                splashRadius: this.splashRadius || 0
            })
        );
    }
    
    

    draw() {
        if (!this.ctx) return;

        // Hover effect
        if (this.isHovered) {
            const size = 40;
            this.ctx.save();
            this.ctx.fillStyle = "rgba(0,255,255,0.2)";
            this.ctx.shadowColor = "rgba(0,255,255,0.8)";
            this.ctx.shadowBlur = 10;
            this.ctx.fillRect(this.x - size/2, this.y - size/2, size, size);
            this.ctx.restore();
        }

        // Draw sprite if available
        if (this.image) {
            const size = 40;
            this.ctx.drawImage(this.image, this.x - size/2, this.y - size/2, size, size);
        }
    }
}
