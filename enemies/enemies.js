// enemies/enemies.js

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

    console.log(
      "👾 SPAWNING ENEMY:",
      config.name,
      "maxHp:",
      config.maxHp
    );

    this.path = path;
    this.gridSize = gridSize;
    this.ctx = ctx;
    this.canvas = canvas;

    // Path position
    this.pathIndex = 0;
    this.x = path[0].x;
    this.y = path[0].y;

    // =====================
    // STATS (NO SILENT FALLBACKS)
    // =====================
    this.baseSpeed = Number(config.speed);
    this.speed = this.baseSpeed;

    this.maxHp = Number(config.maxHp);
    this.hp = this.maxHp;

    this.reward = Number(config.reward ?? 1);
    this.isFlying = Boolean(config.isFlying);
    this.name = config.name ?? "Enemy";

    if (!Number.isFinite(this.maxHp)) {
      console.error("❌ INVALID maxHp:", config);
      this.maxHp = 100;
      this.hp = 100;
    }

    // Size + sprite
    this.size = gridSize * 0.5;
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
        gameState.lives--;

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
      this.hp -= dot.damagePerTick;
      dot.remaining--;
    }
    this.activeDoTs = this.activeDoTs.filter(d => d.remaining > 0);

    if (this.hp <= 0) {
      this.remove = true;
      return;
    }

    // --- Movement ---
    const target = this.path[this.pathIndex + 1];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist < this.speed) {
      this.x = target.x;
      this.y = target.y;
      this.pathIndex++;
    } else {
      this.x += (dx / dist) * this.speed;
      this.y += (dy / dist) * this.speed;
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
    const lift = this.gridSize * 0.1;
    const drawY = this.y - lift + this.yOffset;

    // Hover highlight
    if (window.hoveredEnemy === this) {
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "rgba(255,60,60,1)";
      ctx.beginPath();
      ctx.arc(this.x, drawY, this.size * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Enemy body
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

    // HP bar
    const hpPct = Math.max(this.hp / this.maxHp, 0);
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
  }
}
