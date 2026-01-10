import { Projectile } from '../projectiles.js';

export class Tower {
    constructor({
        x,
        y,
        ctx,
        type = "cannon",
        levelData = {},
        upgradeCosts = [],
        maxLevel = 5,
        opts = {}
    }) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.type = type;

        this.forcedTarget = null;


        // --- Upgrade system ---
        this.level = 1;
        this.maxLevel = maxLevel;
        this.levelData = levelData;
        this.upgradeCosts = upgradeCosts;

        this.hasSpecial = opts.hasSpecial || false;

        this.totalSpent = upgradeCosts[0] || 0;

        // --- Stats ---
        this.damage = 0;
        this.splashRadius = 0;
        this.range = 0;
        this.fireRate = 0;
        this.cooldown = 0;
        this.slowMultiplier = 1;
        this.slowDuration = 0;
        this.dotDuration = 0;
        this.dotDamage = 0;

        this.sprite = null;
        this.image = null;

        this.applyLevel();
    }

    // --- Apply stats from current level ---
    applyLevel() {
        const data = this.levelData[this.level];
        if (!data) return;

        // Explicit stat assignment
        this.damage = data.damage ?? this.damage;
        this.range = data.range ?? this.range;
        this.fireRate = data.fireRate ?? this.fireRate;
        this.splashRadius = data.splashRadius ?? this.splashRadius;
        this.slowMultiplier = data.slowMultiplier ?? this.slowMultiplier;
        this.slowDuration = data.slowDuration ?? this.slowDuration;
        this.dotDuration = data.dotDuration ?? this.dotDuration;
        this.dotDamage = data.dotDamage ?? this.dotDamage;

        if (data.sprite && data.sprite !== this.sprite) {
            this.sprite = data.sprite;
            this.image = new Image();
            this.image.src = `assets/${data.sprite}`;
        }

        // Reset cooldown for immediate usability after upgrade
        this.cooldown = 0;
    }

    // --- Can this tower upgrade? ---
    canUpgrade(gameState) {
        if (this.level >= this.maxLevel) return false;
        const cost = this.upgradeCosts[this.level - 1];
        return gameState.money >= cost;
    }

    // --- Upgrade tower ---
    upgrade(gameState) {
        if (this.level >= this.maxLevel) return false;
    
        const cost = this.upgradeCosts[this.level - 1];
        if (gameState.money < cost) return false;
    
        gameState.money -= cost;
        this.totalSpent += cost;  // track upgrades
        this.level++;
        this.applyLevel();
    
        return true;
    }
    

    setForcedTarget(enemy) {
        this.forcedTarget = enemy;
      }
      
      clearForcedTarget() {
        this.forcedTarget = null;
      }
      

    // --- Targeting ---
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

        // Default: closest enemy
        inRange.sort((a, b) => a.dist - b.dist);
        return inRange[0].e;
    }

    // --- Main update per frame ---
    update(gameState) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }
    
        // =========================
        // FORCE ATTACK OVERRIDE
        // =========================
        let target = null;
    
        if (
            this.forcedTarget &&
            !this.forcedTarget.dead &&
            gameState.enemies.includes(this.forcedTarget)
        ) {
            const dx = this.forcedTarget.x - this.x;
            const dy = this.forcedTarget.y - this.y;
            const dist = Math.hypot(dx, dy);
        
            if (dist <= this.range) {
                target = this.forcedTarget;
            } else {
                // Out of range, ignore forced target
                this.forcedTarget = null;
                target = this.findTarget(gameState.enemies);
            }
        } else {
            this.forcedTarget = null;
            target = this.findTarget(gameState.enemies);
        }
        
    
        if (!target) return;
    
        this.fire(target, gameState);
        this.cooldown = this.fireRate;
    }
    


    // --- Fire projectile ---
    fire(target, gameState) {
        let perFrameDot = 0;

        if (this.dotDuration > 0) {
            const totalDot = this.dotDamage || this.damage;
            perFrameDot = totalDot / this.dotDuration;
        }

        gameState.projectiles.push(
            new Projectile({
                x: this.x,
                y: this.y,
                target,
                ctx: this.ctx,
                type: this.type,
                damage: this.damage,
                dotDamage: perFrameDot,
                dotDuration: this.dotDuration,
                slowMultiplier: this.slowMultiplier,
                slowDuration: this.slowDuration,
                splashRadius: this.splashRadius
            })
        );
    }

    sell(gameState) {
        const refund = Math.floor(this.totalSpent * 0.5);
        gameState.money += refund;
    
        // Remove the tower from gameState.towers
        const index = gameState.towers.indexOf(this);
        if (index > -1) gameState.towers.splice(index, 1);
    
        return refund;
    }
    

    // --- Draw tower ---
    draw() {
        if (!this.ctx) return;
    
        const size = 40; // tower size in px
    
        this.ctx.save();
    
        // --- Selected highlight (purple) ---
        if (this === window.selectedTower) {
            this.ctx.fillStyle = "rgba(128, 0, 128, 0.5)"; // semi-transparent purple
            this.ctx.shadowColor = "rgba(128,0,128,0.7)";
            this.ctx.shadowBlur = 15;
            this.ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
        }
        // --- Hover highlight (blue) ---
        else if (this.isHovered) {
            this.ctx.fillStyle = "rgba(0,0,255,0.3)";
            this.ctx.shadowColor = "rgba(0,0,255,0.7)";
            this.ctx.shadowBlur = 10;
            this.ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
        }
    
        // --- Draw tower sprite ---
        if (this.image) {
            this.ctx.drawImage(this.image, this.x - size / 2, this.y - size / 2, size, size);
        }
    
        this.ctx.restore();
    }
    
}
