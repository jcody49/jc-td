/**********************
 * CANVAS SETUP
 **********************/
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/**********************
 * GAME STATE
 **********************/
const gameState = {
  enemies: [],
  towers: [],
  projectiles: [],
  money: 100,
  lives: 20
};



let enemiesSpawned = 0;   // tracks how many enemies have spawned
const maxEnemies = 20;    // maximum enemies


/**********************
 * UTILS
 **********************/
function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}


/**********************
 * GRID SETTINGS
 **********************/
// Instead of fixed 40px, calculate from canvas / desired grid
const gridCols = 25; // 25 columns
const gridRows = 15; // 15 rows
const gridSize = canvas.width / gridCols; // dynamically set cell size


// Optional: keep track of which tiles are occupied
const gridOccupied = Array.from({ length: gridCols }, () =>
  Array(gridRows).fill(false)
);


/**********************
 * ENEMY
 **********************/
class Enemy {
  constructor() {
    this.x = 0;
    this.y = 200;
    this.speed = 2;
    this.hp = 100;
    this.size = 20;
  }

  update() {
    this.x += this.speed;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.size, this.size);

    // health bar
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y - 6, (this.hp / 100) * this.size, 4);
  }
}

/**********************
 * TOWER
 **********************/
class Tower {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.range = 100;
      this.cooldown = 0;
    }
  
    update() {
      if (this.cooldown > 0) {
        this.cooldown--;
        return;
      }
  
      const target = gameState.enemies.find(
        e => distance(this, e) < this.range
      );
  
      if (target) {
        gameState.projectiles.push(new Projectile(this.x, this.y, target));
        this.cooldown = 45; // frames until next shot
      }
    }
  
    draw() {
      // Draw the tower
      ctx.fillStyle = "cyan";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
      ctx.fill();
  
      // Muzzle flash: only shows 1 frame after shooting
      if (this.cooldown === 44) { // just fired
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 14, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  


/**********************
 * PROJECTILES
 **********************/
class Projectile {
    constructor(x, y, target) {
      this.x = x;
      this.y = y;
      this.target = target;
      this.speed = 4;
      this.radius = 3;
      this.hit = false;
      this.trail = []; // store previous positions
    }
  
    update() {
      if (!this.target) return;
  
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      const dist = Math.hypot(dx, dy);
  
      if (dist < this.radius + 10) {
        this.target.hp -= 60;
        this.hit = true;
        return;
      }
  
      // move projectile
      this.x += (dx / dist) * this.speed;
      this.y += (dy / dist) * this.speed;
  
      // save trail positions
      this.trail.push({x: this.x, y: this.y});
      if (this.trail.length > 5) this.trail.shift(); // limit trail length
    }
  
    draw() {
      // Draw trail
      ctx.fillStyle = "rgba(255,255,0,0.5)";
      this.trail.forEach(pos => {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      });
  
      // Draw projectile
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  

/**********************
 * INPUT
 **********************/
canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
  
    // Snap to nearest grid cell
    const col = Math.floor(x / gridSize);
    const row = Math.floor(y / gridSize);
  
    // Only place if tile is free
    if (!gridOccupied[col][row]) {
      const snappedX = col * gridSize + gridSize / 2; // center of tile
      const snappedY = row * gridSize + gridSize / 2;
  
      gameState.towers.push(new Tower(snappedX, snappedY));
      gridOccupied[col][row] = true;
    }
  });
  


  

/**********************
 * GAME LOOP
 **********************/
function gameLoop() {
  // clear frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  // Draw grid lines
ctx.strokeStyle = "rgba(255,255,255,0.1)";
for (let c = 0; c < gridCols; c++) {
  ctx.beginPath();
  ctx.moveTo(c * gridSize, 0);
  ctx.lineTo(c * gridSize, canvas.height);
  ctx.stroke();
}
for (let r = 0; r < gridRows; r++) {
  ctx.beginPath();
  ctx.moveTo(0, r * gridSize);
  ctx.lineTo(canvas.width, r * gridSize);
  ctx.stroke();
}


  // enemies
  gameState.enemies.forEach(enemy => {
    enemy.update();
    enemy.draw();
  });

  // towers
  gameState.towers.forEach(tower => {
    tower.update();
    tower.draw();
  });

  gameState.projectiles.forEach(p => {
    p.update();
    p.draw();
  });
  

  // cleanup
  gameState.projectiles = gameState.projectiles.filter(p => !p.hit);
    gameState.enemies = gameState.enemies.filter(e => e.hp > 0);


  requestAnimationFrame(gameLoop);
}

let gameStarted = false;
let spawnInterval;

function startGame() {
  if (gameStarted) return;
  gameStarted = true;

  // hide button
  document.getElementById("startButton").style.display = "none";

  // spawn enemies
  spawnInterval = setInterval(() => {
    if (enemiesSpawned >= maxEnemies) {
      clearInterval(spawnInterval);
      return;
    }
    gameState.enemies.push(new Enemy());
    enemiesSpawned++;
  }, 1500);

  gameLoop();
}

document.getElementById("startButton").addEventListener("click", startGame);


