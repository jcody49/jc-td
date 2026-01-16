// enemies/enemies.js
export function loadEnemyImages(enemiesData) {
  Object.values(enemiesData).forEach(enemy => {
    enemy.img = new Image();
    enemy.img.src = enemy.image;

    enemy.img.onload = () => console.log(`Loaded ${enemy.name}`);
    enemy.img.onerror = () => console.error(`Failed to load ${enemy.image}`);
  });
}

export class Enemy {
  constructor({ path, gridSize, ctx, canvas, config }) {
    if (!path || !path.length) {
      throw new Error("Enemy path is undefined or empty");
    }

    this.path = path;
    this.gridSize = gridSize;
    if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) {
      throw new Error("Invalid ctx passed to Enemy");
    }
    this.ctx = ctx;
    this.canvas = canvas;

    this.pathIndex = 0;
    this.x = path[0].x;
    this.y = path[0].y;

    // Config stats
    this.baseSpeed = config.speed ?? 0.7;
    this.speed = this.baseSpeed;
    this.maxHp = config.maxHp ?? 100;
    this.hp = this.maxHp;
    this.reward = config.reward ?? 1;
    this.isFlying = config.isFlying ?? false;
    this.name = config.name ?? "Enemy";

    this.size = gridSize * 0.5;

    this.img = config.img ?? null;

    // Effects
    this.slowMultiplier = 1;
    this.slowTimer = 0;
    this.activeDoTs = [];
    this.isFlashing = false;
    this.flashTimer = 0;
    this.flashLines = [];

    this.escaped = false;
    this.remove = false;

    // Gentle wobble animation
    this.wobbleOffset = config.wobbleOffset ?? Math.random() * Math.PI * 2;
    this.wobbleAmplitude = config.wobbleAmplitude ?? this.size * 0.05;
    this.wobbleXAmplitude = config.wobbleXAmplitude ?? this.size * 0.02;
    this.wobbleSpeed = config.wobbleSpeed ?? 0.02;

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
    const time = Date.now();
    const wobbleY = Math.sin(time * this.wobbleSpeed + this.wobbleOffset) * this.wobbleAmplitude;
    const wobbleX = Math.sin(time * this.wobbleSpeed + this.wobbleOffset * 1.5) * this.wobbleXAmplitude;
    console.log(this.name, wobbleX, wobbleY);

    // --- Hover highlight ---
    if (window.hoveredEnemy === this) {
      ctx.save();
      const pulse = 0.15 * Math.sin(time / 200) + 1;
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "rgba(255,60,60,1)";
      ctx.beginPath();
      ctx.arc(this.x + wobbleX, this.y + wobbleY, this.size * 0.9 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // --- Flash on hit ---
    if (this.isFlashing) {
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 2;
      this.flashLines.forEach(line => {
        const length = line.length * (this.flashTimer / 10);
        ctx.beginPath();
        ctx.moveTo(this.x + wobbleX, this.y + wobbleY);
        ctx.lineTo(
          this.x + wobbleX + Math.cos(line.angle) * length,
          this.y + wobbleY + Math.sin(line.angle) * length
        );
        ctx.stroke();
      });
      return;
    }

    // --- Enemy body ---
    if (this.img) {
      ctx.drawImage(
        this.img,
        this.x - this.size / 2 + wobbleX,
        this.y - this.size / 2 + wobbleY,
        this.size,
        this.size
      );
    } else {
      ctx.fillStyle = this.slowMultiplier < 1 ? "#6ecbff" : "red";
      ctx.fillRect(
        this.x - this.size / 2 + wobbleX,
        this.y - this.size / 2 + wobbleY,
        this.size,
        this.size
      );
    }

    // --- Health bar ---
    const hpBarWidth = this.size;
    const hpBarHeight = 4;
    const hpPercent = Math.max(this.hp / this.maxHp, 0);
    ctx.fillStyle = "green";
    ctx.fillRect(
      this.x - hpBarWidth / 2 + wobbleX,
      this.y - this.size / 2 - hpBarHeight - 2 + wobbleY,
      hpBarWidth * hpPercent,
      hpBarHeight
    );
    ctx.strokeStyle = "black";
    ctx.strokeRect(
      this.x - hpBarWidth / 2 + wobbleX,
      this.y - this.size / 2 - hpBarHeight - 2 + wobbleY,
      hpBarWidth,
      hpBarHeight
    );
  }
}
