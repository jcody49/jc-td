import { gameLoop } from './game-engine.js';
import { Enemy } from './enemies.js';
import { Tower } from './towers.js';
import { startWave, startNextWave, waveState } from './waves.js';
import { initHUD } from './hud.js';





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

const hud = initHUD(gameState, waveState, startWave);


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
 * WAVE TEXT
 **********************/
//const startButton = document.getElementById("startButton");
const waveText = document.getElementById("waveText");




const skipButton = document.getElementById("skipButton");

skipButton.addEventListener("click", () => {
  if (waveState.status === "countdown") {
    clearInterval(waveState.countdownInterval);
    startWave(gameState, path, gridSize, ctx, canvas, waveText, skipButton);
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
* START GAME
***********************/

function startGame() {
  if (gameStarted) return;
  gameStarted = true;

  document.getElementById("startButton").style.display = "none";

  // SHOW HUD
  hud.show();

  startNextWave(gameState, path, gridSize, ctx, canvas, waveText, skipButton);

  gameLoop(ctx, canvas, gridCols, gridRows, gridSize, gameState, hud);
}




document.getElementById("startButton").addEventListener("click", startGame);
