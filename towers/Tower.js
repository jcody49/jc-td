// towers/Tower.js
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

        // Force attack target
        this.forcedTarget = null;

        // Upgrade system
        this.level = 1;
        this.maxLevel = maxLevel;
        this.levelData = levelData;
        this.upgradeCosts = upgradeCosts;
        this.hasSpecial = opts.hasSpecial || false;
        this.totalSpent = upgradeCosts[0] || 0;

        // Stats
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

        this.isHovered = false; // hover highlight
        this.applyLevel();
    }

    // Apply stats from current level
    applyLevel() {
        const data = this.levelData[this.level];
        if (!data) return;

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

        this.cooldown = 0; // reset cooldown after upgrade
    }

    // Check if upgrade is possible
    canUpgrade(gameState) {
        if (this.level >= this.maxLevel) return false;
        return gameState.money >= this.upgradeCosts[this.level - 1];
    }

    // Upgrade tower
    upgrade(gameState) {
        if (!this.canUpgrade(gameState)) return false;
        const cost = this.upgradeCosts[this.level - 1];
        gameState.money -= cost;
        this.totalSpent += cost;
        this.level++;
        this.applyLevel();
        return true;
    }

    // Force attack methods
    setForcedTarget(enemy) {
        this.forcedTarget = enemy;
    }

    clearForcedTarget() {
        this.forcedTarget = null;
    }

    // Find target in range (default: closest)
    findTarget(enemies) {
        const inRange = enemies
            .map(e => ({ e, dist: Math.hypot(this.x - e.x, this.y - e.y) }))
            .filter(obj => obj.dist <= this.range);

        if (inRange.length === 0) return null;

        inRange.sort((a, b) => a.dist - b.dist);
        return inRange[0].e;
    }

    // Main update per frame
    update(gameState) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        let target = null;

        // --- Force attack logic ---
        if (this.forcedTarget && !this.forcedTarget.dead && gameState.enemies.includes(this.forcedTarget)) {
            const dx = this.forcedTarget.x - this.x;
            const dy = this.forcedTarget.y - this.y;
            const dist = Math.hypot(dx, dy);

            if (dist <= this.range) {
                target = this.forcedTarget; // keep forcing attack
            } else {
                target = this.findTarget(gameState.enemies);
            }
        } else {
            // Forced target is dead or undefined -> normal targeting
            this.forcedTarget = null;
            target = this.findTarget(gameState.enemies);
        }

        if (!target) return;

        this.fire(target, gameState);
        this.cooldown = this.fireRate;

        // --- Auto-resume attack if forced target died ---
        if (this.forcedTarget && this.forcedTarget.dead) {
            this.forcedTarget = null;
        }
    }

    // Fire projectile
    fire(target, gameState) {
        const perFrameDot = this.dotDuration > 0 ? (this.dotDamage || this.damage) / this.dotDuration : 0;

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

    // Sell tower
    sell(gameState) {
        const refund = Math.floor(this.totalSpent * 0.5);
        gameState.money += refund;
        const idx = gameState.towers.indexOf(this);
        if (idx > -1) gameState.towers.splice(idx, 1);
        return refund;
    }

    // Draw tower
    draw() {
        if (!this.ctx) return;

        const size = 40;

        this.ctx.save();

        // Selected highlight (purple)
        if (this === window.selectedTower) {
            this.ctx.fillStyle = "rgba(128,0,128,0.5)";
            this.ctx.shadowColor = "rgba(128,0,128,0.7)";
            this.ctx.shadowBlur = 15;
            this.ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
        }
        // Hover highlight (blue)
        else if (this.isHovered) {
            this.ctx.fillStyle = "rgba(0,0,255,0.3)";
            this.ctx.shadowColor = "rgba(0,0,255,0.7)";
            this.ctx.shadowBlur = 10;
            this.ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
        }

        // Draw tower sprite
        if (this.image) {
            this.ctx.drawImage(this.image, this.x - size / 2, this.y - size / 2, size, size);
        }

        this.ctx.restore();
    }
}
