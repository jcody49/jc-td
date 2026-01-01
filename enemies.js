export class Enemy {
    constructor({ path, gridSize, ctx, canvas }) {
      this.path = path;
      this.gridSize = gridSize;
      this.ctx = ctx;
      this.canvas = canvas;
  
      this.pathIndex = 0;
      this.x = path[0].x;
      this.y = path[0].y;
  
      this.baseSpeed = 1.2;         // base speed (never changes)
      this.speed = this.baseSpeed;  // actual speed each frame
      this.slowMultiplier = 1;      // 1 = normal speed
      this.slowTimer = 0;           // frames remaining slowed
  
      this.hp = 100;
      this.size = gridSize * 0.5;
  
      this.isFlashing = false;
      this.flashTimer = 0;
      this.flashLines = [];
  
      this.escaped = false;
      this.remove = false;
      this.reward = 1;
    }
  
    update(gameState) {
        // reached end of path
        if (this.pathIndex >= this.path.length - 1) {
          if (!this.escaped) {
            this.escaped = true;
            gameState.lives--;
          }
          this.remove = true;
          return;
        }
      
        // --- SLOW HANDLING ---
        if (this.slowTimer > 0) {
          this.slowTimer--;                       // countdown slow duration
          this.speed = this.baseSpeed * this.slowMultiplier; // apply slow
        } else {
          this.slowMultiplier = 1;               // reset to normal speed
          this.speed = this.baseSpeed;
        }
      
        // enemy dies when hp <= 0
        if (this.hp <= 0) {
          this.remove = true;
          return;
        }
      
        // move along path
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
  
      // draw enemy (icy blue if slowed)
      ctx.fillStyle = this.slowMultiplier < 1 ? "#6ecbff" : "red";
      ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  
      // health bar
      const hpBarWidth = this.size;
      const hpBarHeight = 4;
      const hpPercent = Math.max(this.hp / 100, 0);
      ctx.fillStyle = "green";
      ctx.fillRect(this.x - hpBarWidth / 2, this.y - this.size / 2 - hpBarHeight - 2, hpBarWidth * hpPercent, hpBarHeight);
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.x - hpBarWidth / 2, this.y - this.size / 2 - hpBarHeight - 2, hpBarWidth, hpBarHeight);
    }
  }
  