// enemies/enemies.js
export function loadEnemyImages(enemiesData) {
  Object.values(enemiesData).forEach(enemy => {
    enemy.img = new Image();
    enemy.img.src = enemy.image; // relative path from this file
  });
}

export class Enemy {
  constructor({ path, gridSize, ctx, canvas, config }) {
    if (!path || !path.length) {
      throw new Error("Enemy path is undefined or empty");
    }

    this.path = path;
    this.gridSize = gridSize;
    this.ctx = ctx;
    this.canvas = canvas;

    this.pathIndex = 0;
    this.x = path[0].x;
    this.y = path[0].y;

    // Apply config stats
    this.baseSpeed = config.speed ?? 0.7;
    this.speed = this.baseSpeed;
    this.maxHp = config.maxHp ?? 100;
    this.hp = this.maxHp;
    this.reward = config.reward ?? 1;
    this.isFlying = config.isFlying ?? false;
    this.name = config.name ?? "Enemy";

    this.size = gridSize * 0.5;

    this.img = config.img ?? null; // <-- store the preloaded image

    // Effects
    this.slowMultiplier = 1;
    this.slowTimer = 0;
    this.activeDoTs = [];
    this.isFlashing = false;
    this.flashTimer = 0;
    this.flashLines = [];

    this.escaped = false;
    this.remove = false;
  }

  get dead() { return this.remove; }

  update(gameState) {
    if (this.pathIndex >= this.path.length - 1) {
      if (!this.escaped) {
        this.escaped = true;
        gameState.lives--;
      }
      this.remove = true;
      return;
    }

    if (this.slowTimer > 0) {
      this.slowTimer--;
      this.speed = this.baseSpeed * this.slowMultiplier;
    } else {
      this.slowMultiplier = 1;
      this.speed = this.baseSpeed;
    }

    if (this.activeDoTs.length > 0) {
      this.activeDoTs.forEach(dot => {
        this.hp -= dot.damagePerTick;
        dot.remaining--;
      });
      this.activeDoTs = this.activeDoTs.filter(dot => dot.remaining > 0);
    }

    if (this.hp <= 0) {
      this.remove = true;
      return;
    }

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
  }

  draw() {
    const ctx = this.ctx;

    // Hover highlight
    if (window.hoveredEnemy === this) {
      ctx.save();
      const pulse = 0.15 * Math.sin(Date.now() / 200) + 1;
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "rgba(255,60,60,1)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.9 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Flash on hit
    if (this.isFlashing) {
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 2;
      this.flashLines.forEach(line => {
        const length = line.length * (this.flashTimer / 10);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x + Math.cos(line.angle) * length,
          this.y + Math.sin(line.angle) * length
        );
        ctx.stroke();
      });
      return;
    }

    // Enemy body — draw image if available
    if (this.img) {
      ctx.drawImage(
        this.img,
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size
      );
    } else {
      // fallback rectangle
      ctx.fillStyle = this.slowMultiplier < 1 ? "#6ecbff" : "red";
      ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    // Health bar
    const hpBarWidth = this.size;
    const hpBarHeight = 4;
    const hpPercent = Math.max(this.hp / this.maxHp, 0);
    ctx.fillStyle = "green";
    ctx.fillRect(this.x - hpBarWidth / 2, this.y - this.size / 2 - hpBarHeight - 2, hpBarWidth * hpPercent, hpBarHeight);
    ctx.strokeStyle = "black";
    ctx.strokeRect(this.x - hpBarWidth / 2, this.y - this.size / 2 - hpBarHeight - 2, hpBarWidth, hpBarHeight);
  }
}
