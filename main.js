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


window.hoveredEnemy = null;


/**********************
 * CONSTANTS
 **********************/
const ENEMY_INTERACT_RADIUS = 55;
const ATTACK_CURSOR_SCALE = 1.23;

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

window.selectedTowerType = null;

/**********************
 * GAME CONTROL
 **********************/
let gameStarted = false;

/**********************
 * WAVE TEXT
 **********************/
const waveText = document.getElementById("waveText");
waveText.style.display = "block";       // make sure it's visible
waveText.style.zIndex = "1000";         // ensure it’s above canvas
waveText.innerText = "Wave 1";          // initial placeholder text

// Wave timer updater
function updateWaveText() {
  if (waveState.status === "countdown") {
    waveText.innerText = `Next wave in: ${waveState.countdown}s`;
  } else if (waveState.status === "spawning") {
    waveText.innerText = `Wave ${waveState.currentWave} in progress`;
  } else if (waveState.status === "done") {
    waveText.innerText = `Wave ${waveState.currentWave} complete`;
  } else {
    waveText.innerText = ""; // idle
  }

  requestAnimationFrame(updateWaveText);
}

updateWaveText();

/**********************
 * UTILS
 **********************/
function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getHoveredEnemy(x, y, radius = 55) {
  let closest = null;
  let closestDist = Infinity;

  for (const en of gameState.enemies) {
    const d = distance(en, { x, y });
    if (d < radius && d < closestDist) {
      closest = en;
      closestDist = d;
    }
  }

  return closest;
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
  { col: 11, row: 7 }, { col: 12, row: 7 }, { col: 13, row: 7 }, { col: 14, row: 7 },
  { col: 15, row: 7 }, { col: 16, row: 7 }, { col: 17, row: 7 },
  { col: 18, row: 7 }, { col: 19, row: 7 }, { col: 20, row: 7 },
  { col: 21, row: 7 }, { col: 22, row: 7 }, { col: 23, row: 7 }, { col: 24, row: 7 }
];

const pathOccupied = pathCells.map(c => `${c.col},${c.row}`);
const path = pathCells.map(c => ({
  x: c.col * gridSize + gridSize / 2,
  y: c.row * gridSize + gridSize / 2
}));

const gridOccupied = Array.from({ length: gridCols }, () =>
  Array(gridRows).fill(false)
);

/**********************
 * TOWER LOOKUP
 **********************/
function getTowerAtPosition(x, y) {
  for (let tower of gameState.towers) {
    const size = gridSize * 0.8;
    if (
      x >= tower.x - size / 2 &&
      x <= tower.x + size / 2 &&
      y >= tower.y - size / 2 &&
      y <= tower.y + size / 2
    ) {
      return tower;
    }
  }
  return null;
}

/***********************
 * INIT HUD
 ***********************/
const hud = initHUD({ gameState, path, gridSize, ctx, canvas, waveText, waveState, startWave });
window.showTowerModal = tower => hud.showTowerModal(tower);
window.hideTowerModal = () => hud.hideTowerModal();

/***********************
 * TOWER CARD SELECTION
 ***********************/
document.querySelectorAll(".towerCard").forEach(card => {
  card.addEventListener("click", () => {
    const cost = parseInt(card.querySelector(".towerCost").textContent.replace("$", ""));
    const name = card.querySelector(".towerName").textContent.replace(":", "").trim();

    if (gameState.money >= cost) {
      gameState.money -= cost;
      hud.update();
      window.selectedTowerType = name;
    }
  });
});

/***********************
 * CANVAS CLICK
 ***********************/
canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Tower select
  const tower = getTowerAtPosition(x, y);
  if (tower) {
    hud.showTowerModal(tower);
    return;
  }

  // Tower placement
  if (window.selectedTowerType) {
    const col = Math.floor(x / gridSize);
    const row = Math.floor(y / gridSize);
    const key = `${col},${row}`;

    if (gridOccupied[col][row] || pathOccupied.includes(key)) return;

    const px = col * gridSize + gridSize / 2;
    const py = row * gridSize + gridSize / 2;

    switch (window.selectedTowerType) {
      case "Cannon": gameState.towers.push(new CannonTower({ x: px, y: py, ctx })); break;
      case "Frost":  gameState.towers.push(new FrostTower({ x: px, y: py, ctx })); break;
      case "Acid":   gameState.towers.push(new AcidTower({ x: px, y: py, ctx })); break;
      case "Tank":   gameState.towers.push(new TankTower({ x: px, y: py, ctx })); break;
    }

    gridOccupied[col][row] = true;
    window.selectedTowerType = null;
    hud.update();
  }
});

/***********************
 * CURSOR FX
 ***********************/
const fx = document.getElementById("cursor-fx");
const fxImg = fx.querySelector("img");

const CURSOR_DEFAULT = "../assets/select-crosshair.png";
const CURSOR_ATTACK = "../assets/crosshair.png";

let cursorMode = "default";
let angle = 0;

function applyCursor() {
  fxImg.src = cursorMode === "attack" ? CURSOR_ATTACK : CURSOR_DEFAULT;

  if (window.selectedTowerType) {
    fx.style.display = "none";
    fx.classList.remove("active");
  } else {
    fx.style.display = "block";
    fx.classList.toggle("active", cursorMode === "attack");
  }
}

applyCursor();

/***********************
 * SPIN + SCALE LOOP
 ***********************/
function animateCursor() {
  angle += 3;

  let scale = 1;
  if (cursorMode === "attack") {
    const hoverEnemy = gameState.enemies.find(en =>
      distance(en, { x: window.mouseX || 0, y: window.mouseY || 0 }) < ENEMY_INTERACT_RADIUS
    );
    if (hoverEnemy) scale = ATTACK_CURSOR_SCALE;
  }

  fx.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

/***********************
 * MOUSE MOVE
 ***********************/
canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  window.mouseX = e.clientX - rect.left;
  window.mouseY = e.clientY - rect.top;

  fx.style.left = e.clientX + "px";
  fx.style.top  = e.clientY + "px";

  applyCursor();

  // =========================
  // ENEMY HOVER (STABLE)
  // =========================
  window.hoveredEnemy = getHoveredEnemy(
    window.mouseX,
    window.mouseY,
    65 // ← clickable radius (this ACTUALLY works now)
  );

  // =========================
  // ATTACK MODE
  // =========================
  if (cursorMode === "attack") {
    if (window.hoveredEnemy) {
      fx.classList.add("active", "locked");
    } else {
      fx.classList.remove("locked");
    }
    return;
  }

  // =========================
  // NORMAL HOVER
  // =========================
  const hoverTower = getTowerAtPosition(window.mouseX, window.mouseY);
  fx.classList.toggle("active", !!(hoverTower || window.hoveredEnemy));
});



/***********************
 * ATTACK BUTTON
 ***********************/
document.getElementById("towerAttackOption").addEventListener("click", () => {
  cursorMode = "attack";
  applyCursor();
});

/***********************
 * ESC KEY
 ***********************/
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    cursorMode = "default";
    window.selectedTowerType = null;
    applyCursor();
  }
});


document.addEventListener("keydown", e => {
  // Escape resets everything
  if (e.key === "Escape") {
    cursorMode = "default";
    window.selectedTowerType = null;
    applyCursor();
  }

  // "A" toggles attack mode
  if (e.key.toLowerCase() === "a") {
    cursorMode = cursorMode === "attack" ? "default" : "attack";
    applyCursor();
  }
});



/***********************
 * START GAME
 ***********************/
const startButton = document.getElementById("startButton");
const skipButton = document.getElementById("skipButton");

startButton.addEventListener("click", () => {
  if (gameStarted) return;
  gameStarted = true;

  startNextWave(gameState, path, gridSize, ctx, canvas, waveText, skipButton);
  gameLoop(ctx, canvas, gridCols, gridRows, gridSize, gameState, hud);
});

skipButton.addEventListener("click", () => {
  clearInterval(waveState.countdownInterval);
  startWave(gameState, path, gridSize, ctx, canvas, waveText, skipButton);
  skipButton.disabled = true;
});

/***********************
 * GLOBALS
 ***********************/
window.gridOccupied = gridOccupied;
window.pathOccupied = pathOccupied;
