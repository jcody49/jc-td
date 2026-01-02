import { gameLoop } from './game-engine.js';
import { Enemy } from './enemies.js';
import { Tower } from './towers/Tower.js';
import { startWave, startNextWave, waveState } from './waves.js';
import { initHUD } from './hud.js';

//TOWER IMPORTS
import { CannonTower } from './towers/CannonTower.js';
import { FrostTower } from './towers/FrostTower.js';
import { AcidTower } from './towers/AcidTower.js';






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
  money: 90,
  lives: 10
};

export let selectedTowerType = null;




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


  // Convert pathCells to a simple array of "col,row" strings for quick lookup
  const pathOccupied = pathCells.map(cell => `${cell.col},${cell.row}`);


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

const hud = initHUD({
  gameState,
  path,
  gridSize,
  ctx,
  canvas,
  waveText,
  waveState,
  startWave
});



// Select all tower cards
const towerCards = document.querySelectorAll(".towerCard");

towerCards.forEach(card => {
  card.addEventListener("click", () => {
    const cost = parseInt(card.querySelector(".towerCost").textContent.replace("$",""));
    
    const towerName = card.querySelector(".towerName").textContent.replace(":", "").trim();

    if (gameState.money >= cost) {
      gameState.money -= cost;         // subtract money
      hud.update();                    // refresh HUD
      selectedTowerType = towerName;   // store which tower is selected
      window.selectedTowerType = selectedTowerType;

    } else {
      alert("Not enough money!");
    }
  });
});



canvas.addEventListener("click", e => {
  if (!selectedTowerType) return;

  const col = Math.floor(mouseX / gridSize);
  const row = Math.floor(mouseY / gridSize);

  const cellKey = `${col},${row}`;
  const validPlacement = !gridOccupied[col][row] && !pathOccupied.includes(cellKey);

  if (validPlacement) {
    const snappedX = col * gridSize + gridSize / 2;
    const snappedY = row * gridSize + gridSize / 2;

    // Create the correct tower type based on selection
    if (selectedTowerType === "Cannon") {
      gameState.towers.push(new CannonTower({ x: snappedX, y: snappedY, ctx }));
    } else if (selectedTowerType === "Frost") {
      gameState.towers.push(new FrostTower({ x: snappedX, y: snappedY, ctx }));
    }
    else if (selectedTowerType === "Acid") {
      gameState.towers.push(new AcidTower({ x: snappedX, y: snappedY, ctx }));
    }
    

    gridOccupied[col][row] = true;      // mark cell as occupied
    selectedTowerType = null;           // clear selection
    window.selectedTowerType = null;    // also clear ghost
    hud.update();                       // update HUD (e.g., money)
  }
});




let mouseX = 0;
let mouseY = 0;

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;

  window.mouseX = mouseX;
  window.mouseY = mouseY;
});



document.addEventListener('keydown', e => {
  if (e.key === 'Escape') selectedTowerType = null;
});




function startGame() {
  if (gameStarted) return;
  gameStarted = true;

  document.getElementById("startButton").style.display = "none";

  // SHOW HUD
  hud.show();

  // START COUNTDOWN FOR FIRST WAVE
  waveState.status = "countdown";
  startNextWave(gameState, path, gridSize, ctx, canvas, waveText, document.getElementById("skipButton"));

  // START GAME LOOP
  gameLoop(
    ctx,
    canvas,
    gridCols,
    gridRows,
    gridSize,
    gameState,
    hud
  );
  
}


document.getElementById("startButton").addEventListener("click", startGame);


window.selectedTowerType = selectedTowerType;
window.mouseX = mouseX;
window.mouseY = mouseY;

window.gridOccupied = gridOccupied;
window.pathOccupied = pathOccupied;
