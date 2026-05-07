// towers/Tower.js
import { Projectile } from '../projectiles.js';

export class Tower {
  constructor({
    x,
    y,
    ctx,
    type = "cannon",
    description = "",
    levelData = {},
    upgradeCosts = [],
    maxLevel = 5,
    opts = {}
  }) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.type = type;
    this.description = description;


    // ======================
    // DEBUG ID (TRACK THIS TOWER INSTANCE)
    // ======================
    this.uid = Math.random().toString(16).slice(2);

    /*
    console.log("🏗️ TOWER CREATED", {
      uid: this.uid,
      type: this.type,
      level: this.level
    });
    */

    // ===== FORCE ATTACK =====
    this.forcedTarget = null;

    // ===== UPGRADE SYSTEM =====
    this.level = 1;
    this.maxLevel = maxLevel;
    this.levelData = levelData;
    this.upgradeCosts = upgradeCosts;
    this.hasSpecial = opts.hasSpecial || false;
    this.totalSpent = upgradeCosts[0] || 0;

    // ===== STATS =====
    this.damage = 0;
    this.range = 0;
    this.fireRate = 0;      // internal stat used for cooldown
    this.cooldown = 0;
    this.splashRadius = 0;
    this.slowMultiplier = 1;
    this.slowDuration = 0;
    this.dotDuration = 0;
    this.dotDamage = 0;

    this.canHitFlying = opts.canHitFlying ?? false;

    this.isDetectionTower = opts.isDetectionTower || false;

    this.sprite = null;
    this.image = null;

    this.isHovered = false;

    this.applyLevel();
  }

  // ======================
  // LEVEL / UPGRADES
  // ======================
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


    /*
    console.log("🟣 APPLY LEVEL SPRITE CHANGE", {
      uid: this.uid,
      level: this.level,
      sprite: data.sprite
    });
    */

    if (data.sprite && data.sprite !== this.sprite) {
      this.sprite = data.sprite;
      this.image = new Image();
      this.image.src = `assets/${data.sprite}`;
    }

    this.cooldown = 0;
  }

  canUpgrade(gameState) {
    if (this.level >= this.maxLevel) return false;
    return gameState.money >= this.upgradeCosts[this.level - 1];
  }

  upgrade(gameState) {
    // 🔍 TRACK EVERY CALL SOURCE
    /*
    console.trace("🧠 UPGRADE CALL STACK");
    console.count(`UPGRADE ${this.type}`);

    console.log("🟥 UPGRADE ENTERED", {
        uid: this.uid,
        type: this.type,
        levelBefore: this.level,
        upgradeCostsIndex: this.level - 1,
        timestamp: performance.now()
    });
    */

    // 🛑 EARLY EXIT GUARD (important for debugging double-fires)
    if (!this.canUpgrade(gameState)) {
        console.warn("❌ UPGRADE BLOCKED (canUpgrade=false)", {
            uid: this.uid,
            level: this.level,
            money: gameState.money
        });
        return false;
    }

    const cost = this.upgradeCosts[this.level - 1];

    // 🧠 sanity log BEFORE mutation
    console.log("💰 APPLYING UPGRADE COST", {
        cost,
        moneyBefore: gameState.money
    });

    gameState.money -= cost;
    this.totalSpent += cost;

    // ⚠️ THIS IS THE CRITICAL MOMENT
    /*
    console.log("⬆️ LEVEL INCREMENT", {
        before: this.level,
        after: this.level + 1
    });
    */

    this.level++;

    this.applyLevel();

    /*
    console.log("🟢 UPGRADE COMPLETE", {
        uid: this.uid,
        newLevel: this.level,
        sprite: this.image?.src
    });
    */

    return true;
}

  // ======================
  // FORCE ATTACK API
  // ======================
  setForcedTarget(enemy) {
    this.forcedTarget = enemy;
  }

  clearForcedTarget() {
    this.forcedTarget = null;
  }

  // ======================
  // TARGETING
  // ======================
  findTarget(enemies) {
    let closest = null;
    let closestDist = Infinity;
  
    for (const e of enemies) {

      // =========================
      // INVISIBILITY RULE
      // =========================
      if (e.isInvisible && !e.isRevealed) {
        continue;
      }
  
      // =========================
      // FLYING RULES
      // =========================
      const canHitFlying =
        this.type === "antiAir" ||
        this.type === "frost" ||
        this.type === "acid";
  
      // flying enemy but this tower can't hit air
      if (e.isFlying && !canHitFlying) {
        continue;
      }
  
      // anti-air towers ignore ground
      if (this.type === "antiAir" && !e.isFlying) {
        continue;
      }
  
      // =========================
      // IMMUNITY RULES
      // =========================
      if (e.immunities?.includes(this.type)) {
        continue;
      }
  
      const d = Math.hypot(this.x - e.x, this.y - e.y);
  
      if (d <= this.range && d < closestDist) {
        closest = e;
        closestDist = d;
      }
    }
  
    return closest;
  }

  // ======================
  // UPDATE LOOP
  // ======================
  update(gameState) {
    // ------------------------
    // Cooldown handling
    // ------------------------
    if (this.cooldown > 0) {
        this.cooldown -= window.gameSpeed ?? 1;
        if (this.cooldown > 0) return;
    }

    let target = null;

    // ------------------------
    // FORCE TARGET PRIORITY
    // ------------------------
    if (
        this.forcedTarget &&
        !this.forcedTarget.dead &&
        gameState.enemies.includes(this.forcedTarget)
    ) {

        // 🚫 BLOCK if invisible AND not revealed
        if (this.forcedTarget.isInvisible && !this.forcedTarget.isRevealed) {
            this.forcedTarget = null;
        }

        // 🚫 BLOCK forced targeting if enemy is immune to this tower
        else if (
            (this.type === "acid" && this.forcedTarget.immunities?.includes("acid")) ||
            (this.type === "frost" && this.forcedTarget.immunities?.includes("frost"))
        ) {
            this.forcedTarget = null;
        }

        else {
            const d = Math.hypot(
                this.forcedTarget.x - this.x,
                this.forcedTarget.y - this.y
            );

            if (d <= this.range) {
                target = this.forcedTarget;
            } else {
                this.forcedTarget = null;
            }
        }
    }

    // ------------------------
    // NORMAL TARGETING
    // ------------------------
    if (!target) {
        target = this.findTarget(gameState.enemies);
    }

    if (!target) return;

    // ------------------------
    // FIRE
    // ------------------------
    this.fire(target, gameState);

    // reset cooldown exactly for next shot
    this.cooldown = this.fireRate;

    // clear forced target if dead
    if (this.forcedTarget && this.forcedTarget.dead) {
        this.forcedTarget = null;
    }
}

  // ======================
  // FIRE
  // ======================
  fire(target, gameState) {

    const perFrameDot =
      this.dotDuration > 0
        ? (this.dotDamage || this.damage) / this.dotDuration
        : 0;

    // Create and push a new projectile into the array
    const projectile = new Projectile({
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
    });

    gameState.projectiles.push(projectile);
}
  
  // ======================
  // SELL
  // ======================
  sell(gameState) {
    const refund = Math.floor(this.totalSpent * 0.5);
    gameState.money += refund;
    const idx = gameState.towers.indexOf(this);
    if (idx > -1) gameState.towers.splice(idx, 1);
    return refund;
  }

  // ======================
  // DRAW
  // ======================
  draw() {
    if (!this.ctx) return;

    const size = 40;
    const ctx = this.ctx;

    ctx.save();

    // ======================
    // Range / Selection UI
    // ======================
    if (this === window.selectedTower) {
        ctx.strokeStyle = "rgba(128,0,128,0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "rgba(128,0,128,0.5)";
        ctx.shadowColor = "rgba(128,0,128,0.7)";
        ctx.shadowBlur = 15;
        ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
    } else if (this.isHovered) {
        ctx.fillStyle = "rgba(0,0,255,0.3)";
        ctx.shadowColor = "rgba(0,0,255,0.7)";
        ctx.shadowBlur = 10;
        ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
    }

    // ======================
    // Tower Sprite
    // ======================
    const img = this.image;

    if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(
            img,
            this.x - size / 2,
            this.y - size / 2,
            size,
            size
        );
    } else {
        // safe fallback (no logs, no spam)
        ctx.fillStyle = "rgba(120,120,120,0.6)";
        ctx.fillRect(
            this.x - size / 2,
            this.y - size / 2,
            size,
            size
        );
    }

    ctx.restore();
}

  // ======================
  // PLAYER-FACING FIRE RATE
  // ======================
  get displayFireRate() {
    // convert internal fireRate to intuitive "higher = faster"
    const BASE = 2000; // tweak to taste
    return Math.round(BASE / this.fireRate);
  }
}
