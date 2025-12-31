import { gameLoop } from './game-engine.js';



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
 * WAVE STATE
 **********************/
//const startButton = document.getElementById("startButton");
const waveText = document.getElementById("waveText");

const waveState = {
  currentWave: 0,
  countdown: 40,
  countdownInterval: null,
  status: "idle" // idle | countdown | spawning
};


  const skipButton = document.getElementById("skipButton");

skipButton.addEventListener("click", () => {
    // only skip if a wave countdown is active
    if (waveState.status === "countdown") {
        clearInterval(waveState.countdownInterval); // stop the countdown
        startWave(); // start the wave immediately
    }
});

  


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
const gridSizeX = canvas.width / gridCols;
const gridSizeY = canvas.height / gridRows;
const gridSize = Math.min(gridSizeX, gridSizeY); // square cells



/**********************
 * PATHING
 **********************/
const pathCells = [

    // start--4 cells right
    { col: 0, row: 7 }, 
    { col: 1, row: 7 },
    { col: 2, row: 7 },
    { col: 3, row: 7 },
    { col: 4, row: 7 }, 
    
    
    // move up
    { col: 4, row: 6 }, 
    { col: 4, row: 5 },
    { col: 4, row: 4 }, 
    { col: 4, row: 3 }, 
  
    // new segment: right 2
    { col: 5, row: 3 },
    { col: 6, row: 3 },

  
    // new segment: down 7
    { col: 6, row: 4 },
    { col: 6, row: 5 },
    { col: 6, row: 6 },
    { col: 6, row: 7 },
    { col: 6, row: 8 },
    { col: 6, row: 9 },
    { col: 6, row: 10 },
    { col: 6, row: 11 },


    // new segment: right 2
    { col: 7, row: 11 },
    { col: 8, row: 11 },


    // new segment: up 7
    { col: 8, row: 10 },
    { col: 8, row: 9 },
    { col: 8, row: 8 },
    { col: 8, row: 7 },
    { col: 8, row: 6 },
    { col: 8, row: 5 },
    { col: 8, row: 4 },
    { col: 8, row: 3 },


    // new segment: right 2
    { col: 9, row: 3 },
    { col: 10, row: 3 },


    // new segment: down 5
    { col: 10, row: 4 },
    { col: 10, row: 5 },
    { col: 10, row: 6 },
    { col: 10, row: 7 },


    // new segment: right 3
    { col: 11, row: 7 },
    { col: 12, row: 7 },
    { col: 13, row: 7 },
    { col: 14, row: 7 },
    { col: 15, row: 7 },
    { col: 16, row: 7 },
    { col: 17, row: 7 },
    { col: 18, row: 7 },
    { col: 19, row: 7 },
    { col: 20, row: 7 },
    { col: 21, row: 7 },
    { col: 22, row: 7 },
    { col: 23, row: 7 },
    { col: 24, row: 7 },
    { col: 25, row: 7 },
    { col: 26, row: 7 },

  ];

  
  

  const path = pathCells.map(cell => ({
    x: cell.col * gridSize + gridSize / 2,
    y: cell.row * gridSize + gridSize / 2
  }));

// Optional: keep track of which tiles are occupied
const gridOccupied = Array.from({ length: gridCols }, () =>
  Array(gridRows).fill(false)
);



/**********************
 * ENEMIES
 **********************/
class Enemy {
    constructor() {
      this.pathIndex = 0;
      this.x = path[0].x;
      this.y = path[0].y;
      this.speed = 2;
      this.hp = 100;
      this.size = gridSize * 0.5;
      this.isFlashing = false;
      this.flashTimer = 0;
      this.flashLines = []; // store zap lines
    }
  
    update() {
        if (this.isFlashing) {
          this.flashTimer--;
          if (this.flashTimer <= 0) {
            this.hp = 0; // remove from game
          }
          return;
        }
      
        // Trigger zap a bit earlier (2 steps before the last cell)
        const zapTriggerIndex = path.length - 3;
        if (this.pathIndex >= zapTriggerIndex && !this.isFlashing) {
          this.isFlashing = true;
          this.flashTimer = 10; // frames
          this.flashLines = [];
          const lineCount = 6;
          for (let i = 0; i < lineCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const length = Math.random() * this.size * 2 + this.size;
            this.flashLines.push({ angle, length });
          }
          return;
        }
      
        // Normal movement along path
        if (this.pathIndex >= path.length - 1) return;
      
        const target = path[this.pathIndex + 1];
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
        if (this.isFlashing) {
          // draw zap lines
          ctx.strokeStyle = "yellow";
          ctx.lineWidth = 2;
      
          // adjust line length based on enemy size and canvas width
          const maxLineLength = this.size * 2 * (canvas.width / 920); // scale from old width
          this.flashLines.forEach(line => {
            const length = line.length * (this.flashTimer / 10) * (canvas.width / 920);
            const endX = this.x + Math.cos(line.angle) * length;
            const endY = this.y + Math.sin(line.angle) * length;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
          });
        } else {
          // normal enemy
          ctx.fillStyle = "red";
          ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
          ctx.fillStyle = "green";
          ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2 - 6, (this.hp / 100) * this.size, 4);
        }
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
  


  
/***********************
* WAVE LOGIC
***********************/

function startNextWave() {
  console.log("startNextWave called");
    waveState.currentWave++;
    waveState.countdown = 40;
    waveState.status = "countdown";
  
    skipButton.disabled = false; // enable during countdown
  
    if (waveState.countdownInterval) clearInterval(waveState.countdownInterval);
  
    waveText.textContent = `Wave ${waveState.currentWave} starting in: ${waveState.countdown}`;
  
    waveState.countdownInterval = setInterval(() => {
      console.log("Countdown:", waveState.countdown);
      waveState.countdown--;
      waveText.textContent = `Wave ${waveState.currentWave} starting in: ${waveState.countdown}`;
  
      if (waveState.countdown <= 0) {
        clearInterval(waveState.countdownInterval);
        startWave();
      }
    }, 1000);
  }
  
  function startWave() {
    waveState.status = "spawning";
    waveText.textContent = `Wave ${waveState.currentWave} in progress`;
  
    skipButton.disabled = true; // disable once wave starts
  
    let enemiesSpawned = 0;
  const maxEnemies = 20; // fixed per wave
  const spawnInterval = setInterval(() => {
    if (enemiesSpawned >= maxEnemies) {
      clearInterval(spawnInterval);
      return;
    }
    gameState.enemies.push(new Enemy());
    enemiesSpawned++;
  }, 1500);
  }
  
  
  


  let gameStarted = false;
  let spawnInterval;
  



  function startGame() {
    if (gameStarted) return;
    gameStarted = true;

    // hide start button
    document.getElementById("startButton").style.display = "none";

    startNextWave();

    // start the game loop
    gameLoop(ctx, canvas, gridCols, gridRows, gridSize, gameState);
}

  

document.getElementById("startButton").addEventListener("click", startGame);


