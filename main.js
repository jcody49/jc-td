import { gameLoop } from './game-engine.js';
import { Enemy } from './enemies.js';
import { Tower } from './towers.js';




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


canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Snap to grid if you want (optional)
  const col = Math.floor(x / gridSize);
  const row = Math.floor(y / gridSize);
  const snappedX = col * gridSize + gridSize / 2;
  const snappedY = row * gridSize + gridSize / 2;

  // Only place if tile is free (optional)
  if (!gridOccupied[col][row]) {
    gameState.towers.push(new Tower({ x: snappedX, y: snappedY, ctx }));
    gridOccupied[col][row] = true;
  }
});


/**********************
 * GAME CONTROL
 **********************/
let gameStarted = false;
let spawnInterval;

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


  
/***********************
* WAVE LOGIC
***********************/

function startWave() {
  waveState.status = "spawning";
  waveText.textContent = `Wave ${waveState.currentWave} in progress`;

  skipButton.disabled = true; // disable once wave starts

  let enemiesSpawned = 0;
  const maxEnemies = 20; // fixed per wave

  spawnInterval = setInterval(() => {
    if (enemiesSpawned >= maxEnemies) {
      clearInterval(spawnInterval);
      return;
    }

    gameState.enemies.push(
      new Enemy({
        path,       // pass path
        gridSize,   // pass grid size
        ctx,        // pass canvas context
        canvas      // pass canvas
      })
    );

    enemiesSpawned++;
  }, 1500);
}

function startNextWave() {
  waveState.currentWave++;
  waveState.countdown = 40;
  waveState.status = "countdown";

  skipButton.disabled = false; // enable during countdown

  if (waveState.countdownInterval) clearInterval(waveState.countdownInterval);

  waveText.textContent = `Wave ${waveState.currentWave} starting in: ${waveState.countdown}`;

  waveState.countdownInterval = setInterval(() => {
    waveState.countdown--;
    waveText.textContent = `Wave ${waveState.currentWave} starting in: ${waveState.countdown}`;

    if (waveState.countdown <= 0) {
      clearInterval(waveState.countdownInterval);
      startWave(); // enemies start spawning now
    }
  }, 1000);
}

function startGame() {
  if (gameStarted) return;
  gameStarted = true;

  // hide start button
  document.getElementById("startButton").style.display = "none";

  startNextWave();

  // start the game loop (grid + entities)
  gameLoop(ctx, canvas, gridCols, gridRows, gridSize, gameState);
}

document.getElementById("startButton").addEventListener("click", startGame);
