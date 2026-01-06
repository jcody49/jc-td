export class Enemy {
  constructor({ path, gridSize, ctx, canvas, isFlying = false }) {
      this.path = path;
      this.gridSize = gridSize;
      this.ctx = ctx;
      this.canvas = canvas;

      this.pathIndex = 0;
      this.x = path[0].x;
      this.y = path[0].y;

      this.baseSpeed = 0.7;           // base speed (never changes)
      this.speed = this.baseSpeed;    // actual speed each frame
      this.slowMultiplier = 1;        // 1 = normal speed
      this.slowTimer = 0;             // frames remaining slowed
      this.maxHp = 100;
      this.hp = 100;
      this.size = gridSize * 0.5;

      this.isFlashing = false;
      this.flashTimer = 0;
      this.flashLines = [];

      this.escaped = false;
      this.remove = false;
      this.reward = 1;

      this.activeDoTs = [];           // array of active DoTs
      this.isFlying = isFlying;
  }

  update(gameState) {
      // --- Check if reached end of path ---
      if (this.pathIndex >= this.path.length - 1) {
          if (!this.escaped) {
              this.escaped = true;
              gameState.lives--;
          }
          this.remove = true;
          return;
      }

      // --- Apply slow ---
      if (this.slowTimer > 0) {
          this.slowTimer--;
          this.speed = this.baseSpeed * this.slowMultiplier;
      } else {
          this.slowMultiplier = 1;
          this.speed = this.baseSpeed;
      }

      // --- Apply DoTs ---
      if (this.activeDoTs.length > 0) {
          this.activeDoTs.forEach(dot => {
              this.hp -= dot.damagePerTick;
              dot.remaining--;
          });
          // Remove expired DoTs
          this.activeDoTs = this.activeDoTs.filter(dot => dot.remaining > 0);
      }

      // --- Check death ---
      if (this.hp <= 0) {
          this.remove = true;
          return;
      }

      // --- Move along path ---
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

      // Flash effect
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

      // Enemy body (icy blue if slowed)
      ctx.fillStyle = this.slowMultiplier < 1 ? "#6ecbff" : "red";
      ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

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
