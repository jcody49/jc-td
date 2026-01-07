import { gameLoop } from './game-engine.js';
import { Enemy } from './enemies.js';
import { Tower } from './towers/Tower.js';
import { startWave, startNextWave, waveState } from './waves.js';
import { initHUD } from './hud.js';

// TOWER IMPORTS
import { CannonTower } from './towers/CannonTower.js';
import { FrostTower } from './towers/FrostTower.js';
import { AcidTower } from './towers/AcidTower.js';
import { TankTower } from './towers/TankTower.js';

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

// We'll use window.selectedTowerType as the global source of truth
window.selectedTowerType = null;

/**********************
 * GAME CONTROL
 **********************/
let gameStarted = false;
let spawnInterval;

/**********************
 * WAVE TEXT
 **********************/
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
const gridCols = 25;
const gridRows = 15;
const gridSizeX = canvas.width / gridCols;
const gridSizeY = canvas.height / gridRows;
const gridSize = Math.min(gridSizeX, gridSizeY);

/**********************
 * PATHING
 **********************/
const pathCells = [
  // ... your path cells as before ...
  { col: 0, row: 7 }, { col: 1, row: 7 }, { col: 2, row: 7 }, { col: 3, row: 7 }, { col: 4, row: 7 },
  { col: 4, row: 6 }, { col: 4, row: 5 }, { col: 4, row: 4 }, { col: 4, row: 3 },
  { col: 5, row: 3 }, { col: 6, row: 3 },
  { col: 6, row: 4 }, { col: 6, row: 5 }, { col: 6, row: 6 }, { col: 6, row: 7 }, { col: 6, row: 8 },
  { col: 6, row: 9 }, { col: 6, row: 10 }, { col: 6, row: 11 },
  { col: 7, row: 11 }, { col: 8, row: 11 },
  { col: 8, row: 10 }, { col: 8, row: 9 }, { col: 8, row: 8 }, { col: 8, row: 7 }, { col: 8, row: 6 },
  { col: 8, row: 5 }, { col: 8, row: 4 }, { col: 8, row: 3 },
  { col: 9, row: 3 }, { col: 10, row: 3 },
  { col: 10, row: 4 }, { col: 10, row: 5 }, { col: 10, row: 6 }, { col: 10, row: 7 },
  { col: 11, row: 7 }, { col: 12, row: 7 }, { col: 13, row: 7 }, { col: 14, row: 7 }, { col: 15, row: 7 },
  { col: 16, row: 7 }, { col: 17, row: 7 }, { col: 18, row: 7 }, { col: 19, row: 7 }, { col: 20, row: 7 },
  { col: 21, row: 7 }, { col: 22, row: 7 }, { col: 23, row: 7 }, { col: 24, row: 7 }, { col: 25, row: 7 },
  { col: 26, row: 7 },
];

// Quick lookup arrays
const pathOccupied = pathCells.map(cell => `${cell.col},${cell.row}`);
const path = pathCells.map(cell => ({
  x: cell.col * gridSize + gridSize / 2,
  y: cell.row * gridSize + gridSize / 2
}));

const gridOccupied = Array.from({ length: gridCols }, () =>
  Array(gridRows).fill(false)
);

// Get tower at canvas position
function getTowerAtPosition(x, y) {
  for (let tower of gameState.towers) {
    const size = gridSize * 0.8;
    if (x >= tower.x - size/2 && x <= tower.x + size/2 &&
        y >= tower.y - size/2 && y <= tower.y + size/2) {
      return tower;
    }
  }
  return null;
}

/***********************
* INIT HUD
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

console.log(hud);

// Expose HUD modal functions globally
window.showTowerModal = (tower) => hud.showTowerModal(tower);
window.hideTowerModal = () => hud.hideTowerModal();

/***********************
* TOWER CARD SELECTION
***********************/
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



/***********************
* CANVAS CLICK
***********************/
canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // 1️⃣ Tower Placement
  if (window.selectedTowerType) {
    const col = Math.floor(clickX / gridSize);
    const row = Math.floor(clickY / gridSize);

    if (!gridOccupied[col] || gridOccupied[col][row] === undefined) return;

    const cellKey = `${col},${row}`;
    const validPlacement =
      !gridOccupied[col][row] &&
      !pathOccupied.includes(cellKey);

    if (validPlacement) {
      const snappedX = col * gridSize + gridSize / 2;
      const snappedY = row * gridSize + gridSize / 2;

      console.log("Placing tower:", window.selectedTowerType, `"${window.selectedTowerType.length}"`);

      switch (window.selectedTowerType) {
        case "Cannon":
          gameState.towers.push(new CannonTower({ x: snappedX, y: snappedY, ctx, opts: {} }));
          break;
        case "Frost":
          gameState.towers.push(new FrostTower({ x: snappedX, y: snappedY, ctx, opts: { hasSpecial: true } }));
          break;
        case "Acid":
          gameState.towers.push(new AcidTower({ x: snappedX, y: snappedY, ctx, opts: { hasSpecial: false } }));
          break;
        case "Tank":
          gameState.towers.push(new TankTower({ x: snappedX, y: snappedY, ctx, opts: { hasSpecial: false } }));
          break;
      }

      gridOccupied[col][row] = true;
      window.selectedTowerType = null;
      hud.update(); // refresh HUD if needed
    }
    return;
  }

  // 2️⃣ Tower Selection (show modal)
  const tower = getTowerAtPosition(clickX, clickY);
  if (tower) hud.showTowerModal(tower);
  else hud.hideTowerModal();
});


/***********************
* MOUSE HOVER
***********************/
let mouseX = 0;
let mouseY = 0;

const fx = document.getElementById("cursor-fx");
let cursorAngle = 0;

canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;

  window.mouseX = mouseX;
  window.mouseY = mouseY;

  const tower = getTowerAtPosition(mouseX, mouseY);
  const enemy = gameState.enemies.find(enemy => {
    const size = enemy.size;
    return (
      mouseX >= enemy.x - size / 2 &&
      mouseX <= enemy.x + size / 2 &&
      mouseY >= enemy.y - size / 2 &&
      mouseY <= enemy.y + size / 2
    );
  });

  const hovering = tower || enemy;

  // Toggle hover class
  canvas.classList.toggle("selectable-hover", !!hovering);
  fx.classList.toggle("active", !!hovering);

  // Move cursor
  fx.style.left = e.clientX + "px";
  fx.style.top = e.clientY + "px";

  // Rotate if hovering
  if (hovering) {
    cursorAngle += 5; // degrees per frame
    fx.style.transform = `translate(-50%, -50%) rotate(${cursorAngle}deg)`;
  } else {
    fx.style.transform = "translate(-50%, -50%) rotate(0deg)";
    cursorAngle = 0; // reset when not hovering
  }
});





/***********************
* ESC KEY
***********************/
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') window.selectedTowerType = null;
});

/***********************
* START GAME
***********************/
function startGame() {
  if (gameStarted) return;
  gameStarted = true;

  const startButton = document.getElementById("startButton");
  const skipButton = document.getElementById("skipButton");

  // Hide the start button
  startButton.style.display = "none";

  // Begin countdown for next wave
  waveState.status = "countdown";
  startNextWave(gameState, path, gridSize, ctx, canvas, waveText, skipButton);

  // Start the main game loop
  gameLoop(ctx, canvas, gridCols, gridRows, gridSize, gameState, hud);
}

/***********************
* HUD BUTTONS
***********************/
const startButton = document.getElementById("startButton");
const skipButton = document.getElementById("skipButton");

// Start button listener
startButton.addEventListener("click", startGame);

// Skip button listener
skipButton.addEventListener("click", () => {
  if (waveState.countdownInterval) {
    clearInterval(waveState.countdownInterval); // stop the countdown
    startWave(gameState, path, gridSize, ctx, canvas, waveText, skipButton); // start wave immediately
    skipButton.disabled = true; // optional: disable after skipping
  }
});

/***********************
* EXPOSE GLOBALS
***********************/
window.gridOccupied = gridOccupied;
window.pathOccupied = pathOccupied;

