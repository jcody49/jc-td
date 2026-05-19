// enemies/enemies.js
import { showMoneyPopup, showLifePopup } from '../ui-effects.js';
import { checkUpgradeTip } from "../tips.js";

console.error("🔥 REAL enemies/enemies.js LOADED 🔥");

/**
 * Preload enemy images and attach them directly to enemy config
 */
export function loadEnemyImages(enemiesData) {
  Object.values(enemiesData).forEach(enemy => {
    enemy.img = new Image();
    enemy.img.src = enemy.image;

    enemy.img.onload = () =>
      console.log(`🖼️ Loaded enemy image: ${enemy.name}`);
    enemy.img.onerror = () =>
      console.error(`❌ Failed to load enemy image: ${enemy.image}`);
  });
}

export class Enemy {
  constructor({ path, gridSize, ctx, canvas, config }) {
    if (!path || !path.length) {
      throw new Error("Enemy path is undefined or empty");
    }

    if (!config) {
      throw new Error("Enemy spawned with NO CONFIG");
    }

    

    this.path = path;
    this.gridSize = gridSize;
    this.ctx = ctx;
    this.canvas = canvas;

    // Path position
    this.pathIndex = 0;
    this.x = path[0].x;
    this.y = path[0].y;

    //target enemy flash
    this.forceFlashTimer = 0;

    // =====================
    // STATS (NO SILENT FALLBACKS)
    // =====================
    this.baseSpeed = Number(config.speed);
    this.speed = this.baseSpeed;

    this.maxHp = Number(config.maxHp);
    this.hp = this.maxHp;

    /*
    console.log("🛡️ ENEMY CONFIG CHECK", {
      name: config.name,
      id: config.id,
      armor: config.armor,
      maxArmor: config.armor ?? 0
    });
    */

    this.maxArmor = config.armor ?? 0;
    this.armor = this.maxArmor;

    this.immunities = config.immunities ?? [];

    this.lifeReward = Number(config.lifeReward ?? 0);
    this.reward = Number(config.reward ?? 1);
    this.score = config.score ?? 5;
    this.isFlying = Boolean(config.isFlying);
    this.canBeTargetedByAntiAir =
    Boolean(config.canBeTargetedByAntiAir);
    this.types =
      config.types ??
      (config.type ? [config.type] : ["basic"]);

    this.type = this.types[0];

    this.isInvisible =
        config.isInvisible ??
        this.types.includes("invisible");

    this.isRevealed = !this.isInvisible;

    this.isBoss  = this.types.includes("boss");
    this.isBonus =
      this.types.includes("bonus") ||
      config.type === "bonus";
    this.isSpeed = this.types.includes("speed");

    if (!Number.isFinite(this.maxHp)) {
      console.error("❌ INVALID maxHp:", config);
      this.maxHp = 100;
      this.hp = 100;
    }

    // Size + sprite
    this.size = gridSize * (config.sizeMultiplier ?? 0.75);
    this.img = config.img ?? null;


    // =====================
    // HOP ANIMATION
    // =====================
    this.yOffset = 0;
    this.hopProgress = 0;
    this.hopSpeed = 0.04;
    this.hopPaused = 0;
    this.hopAmplitude = gridSize * 0.13;

    // =====================
    // EFFECTS
    // =====================
    this.slowMultiplier = 1;
    this.slowTimer = 0;
    this.activeDoTs = [];
    this.isFlashing = false;
    this.flashTimer = 0;
    this.flashLines = [];

    this.escaped = false;
    this.remove = false;
  }

  get dead() {
    return this.remove;
  }

  update(gameState) {
    // --- Exit path ---
    if (this.pathIndex >= this.path.length - 1) {
      if (!this.escaped) {
          this.escaped = true;
  
          if (this.isBonus) {
              showLifePopup(0);
          } else {
              gameState.lives--;
              showLifePopup(-1);
          }
  
          const ctx = this.ctx;
          ctx.save();
          ctx.strokeStyle = "yellow";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(this.x - this.size, this.y - this.size);
          ctx.lineTo(this.x + this.size, this.y + this.size);
          ctx.moveTo(this.x + this.size, this.y - this.size);
          ctx.lineTo(this.x - this.size, this.y + this.size);
          ctx.stroke();
          ctx.restore();
      }
  
      this.remove = true;
      return;
  }

    // --- Slow ---
    if (this.slowTimer > 0) {
        this.slowTimer--;
        this.speed = this.baseSpeed * this.slowMultiplier;
    } else {
        this.slowMultiplier = 1;
        this.speed = this.baseSpeed;
    }

    // --- DoT ---
    for (const dot of this.activeDoTs) {
      let remaining = dot.damagePerTick;
  
      if (this.armor > 0) {
          const absorbed = Math.min(this.armor, remaining);
          this.armor -= absorbed;
          remaining -= absorbed;
      }
  
      if (remaining > 0) {
          this.hp -= remaining;
      }
  
      dot.remaining--;
  }
    this.activeDoTs = this.activeDoTs.filter(d => d.remaining > 0);

    if (this.hp <= 0) {
        if (this.reward > 0) {
            gameState.money += this.reward;
            showMoneyPopup(this.reward, this.x, this.y);

            checkUpgradeTip(gameState);
        }

        if (this.score > 0) {
            gameState.score += this.score;
        }

        if (this.lifeReward > 0) {
          gameState.lives += this.lifeReward;
          showLifePopup(this.lifeReward);
      }


        this.remove = true;
        return;
    }

    // --- Movement with fast-forward ---
    const target = this.path[this.pathIndex + 1];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy);

    const effectiveSpeed = this.speed * window.gameSpeed;

    if (dist < effectiveSpeed) {
        this.x = target.x;
        this.y = target.y;
        this.pathIndex++;
    } else {
        this.x += (dx / dist) * effectiveSpeed;
        this.y += (dy / dist) * effectiveSpeed;
    }

    // --- Hop ---
    if (this.hopPaused > 0) {
        this.hopPaused--;
        this.yOffset = 0;
    } else {
        this.yOffset =
            -Math.sin(this.hopProgress * Math.PI) * this.hopAmplitude;
        this.hopProgress += this.hopSpeed;

        if (this.hopProgress >= 1) {
            this.hopProgress = 0;
            this.hopPaused = 5;
        }
    }
}

draw() {
  const ctx = this.ctx;
  const baseLift = this.gridSize * 0.1;

  // flying enemies hover higher
  const flyingLift = this.isFlying
    ? this.gridSize * 0.35
    : 0;

  const drawY =
    this.y -
    baseLift -
    flyingLift +
    (this.yOffset ?? 0);

  

  // ---------------------------
  // Flying shadow
  // ---------------------------
  if (this.isFlying) {
    ctx.save();

    ctx.fillStyle = "rgba(0,0,0,0.28)";

    ctx.beginPath();

    ctx.ellipse(
      this.x,
      this.y + this.size * 0.18, // shadow stays on ground
      this.size * 0.28,          // width
      this.size * 0.12,          // height
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();
    ctx.restore();
  }


  // ---------------------------
  // Enemy body
  // ---------------------------
// Enemy body (invisibility-aware)
// ---------------------------
if (this.isInvisible && !this.isRevealed) {

  ctx.save();

  // invisible state (not revealed)
  ctx.globalAlpha = 0.12;

  ctx.drawImage(
      this.img,
      this.x - this.size / 2,
      drawY - this.size / 2,
      this.size,
      this.size
  );

  ctx.restore();

} else {

  // fully visible
  if (this.img) {
      ctx.drawImage(
          this.img,
          this.x - this.size / 2,
          drawY - this.size / 2,
          this.size,
          this.size
      );
  } else {
      ctx.fillStyle = "red";
      ctx.fillRect(
          this.x - this.size / 2,
          drawY - this.size / 2,
          this.size,
          this.size
      );
  }
}

  // ---------------------------
  // FORCE ATTACK FLASH
  // red → white → red
  // ---------------------------
  if (this.forceFlashTimer > 0) {
    ctx.save();

    // Alternate every 4 frames: red ↔ white
    const isWhite = Math.floor(this.forceFlashTimer / 4) % 2 === 0;

    ctx.globalAlpha = 0.75;
    ctx.fillStyle = isWhite ? "white" : "red";

    ctx.beginPath();
    ctx.arc(this.x, drawY, this.size * 0.9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    this.forceFlashTimer--;
}

  // ---------------------------
  // Hover highlight
  // ---------------------------
  if (window.hoveredEnemy === this) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "rgba(255,50,50,1)";
    ctx.beginPath();
    ctx.arc(this.x, drawY, this.size * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

  // ---------------------------
  // HP Bar
  // ---------------------------
  const hpPct = Math.max(this.hp / this.maxHp, 0);

  ctx.save();
  ctx.fillStyle = "green";
  ctx.fillRect(
      this.x - this.size / 2,
      drawY - this.size / 2 - 6,
      this.size * hpPct,
      4
  );

  ctx.strokeStyle = "black";
  ctx.strokeRect(
      this.x - this.size / 2,
      drawY - this.size / 2 - 6,
      this.size,
      4
  );
  ctx.restore();

  if (this.maxArmor > 0) {
    const armorPct = Math.max(this.armor / this.maxArmor, 0);
  
    ctx.save();
  
    // position: directly under HP bar
    const barX = this.x - this.size / 2;
    const barY = drawY - this.size / 2 + 1;
    const barWidth = this.size;
    const barHeight = 3;
  
    // background
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(barX, barY, barWidth, barHeight);
  
    // armor fill (pink)
    ctx.fillStyle = "pink";
    ctx.fillRect(barX, barY, barWidth * armorPct, barHeight);
  
    // border (optional but matches HP style)
    ctx.strokeStyle = "black";
    ctx.strokeRect(barX, barY, barWidth, barHeight);
  
    ctx.restore();
  }
}
}
