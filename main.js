import { gameLoop } from './game-engine.js';
import { Enemy } from './enemies.js';
import { Tower } from './towers/Tower.js';
import { startWave, startNextWave, waveState } from './waves.js';
import { initHUD } from './hud.js';
import { canvas, ctx, mouse } from './canvas.js';
import { gameState, gridCols, gridRows, gridOccupied } from './gameState.js';
import {
  distance,
  getHoveredEnemy,
  getTowerAtPosition
} from './utils.js';
import {
  pathCells,
  pathOccupied,
  buildPath
} from './pathing.js';




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



const gridSizeX = canvas.width / gridCols;
const gridSizeY = canvas.height / gridRows;
const gridSize = Math.min(gridSizeX, gridSizeY);

const path = buildPath(pathCells, gridSize);


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

  // =========================
  // SINGLE-TOWER FORCE ATTACK
  // =========================
  if (
    cursorMode === "attack" &&
    window.selectedTower &&
    window.hoveredEnemy
  ) {
    window.selectedTower.setForcedTarget(window.hoveredEnemy);

    cursorMode = "default";
    applyCursor();
    return; // IMPORTANT: stop here
  }

  // =========================
  // TOWER SELECT
  // =========================
  const tower = getTowerAtPosition(
    gameState.towers,
    x,
    y,
    gridSize
  );
  
  if (tower) {
    window.selectedTower = tower;
    hud.showTowerModal(tower);
    return;
  }

  // =========================
  // TOWER PLACEMENT
  // =========================
  if (window.selectedTowerType) {
    const col = Math.floor(x / gridSize);
    const row = Math.floor(y / gridSize);
    const key = `${col},${row}`;

    if (gridOccupied[col][row] || pathOccupied.includes(key)) return;

    const px = col * gridSize + gridSize / 2;
    const py = row * gridSize + gridSize / 2;

    switch (window.selectedTowerType) {
      case "Cannon":
        gameState.towers.push(new CannonTower({ x: px, y: py, ctx }));
        break;
      case "Frost":
        gameState.towers.push(new FrostTower({ x: px, y: py, ctx }));
        break;
      case "Acid":
        gameState.towers.push(new AcidTower({ x: px, y: py, ctx }));
        break;
      case "Tank":
        gameState.towers.push(new TankTower({ x: px, y: py, ctx }));
        break;
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
    gameState.enemies,
    window.mouseX,
    window.mouseY,
    65
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
  const hoverTower = getTowerAtPosition(
    gameState.towers,
    window.mouseX,
    window.mouseY,
    gridSize
  );
  
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
  
    if (window.selectedTower) {
      window.selectedTower.clearForcedTarget();
    }
  
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
    if (!window.selectedTower) return;
  
    cursorMode = cursorMode === "attack" ? "default" : "attack";
    applyCursor();
  }  
});



/***********************
 * START GAME
 ***********************/
const startButton = document.getElementById("startButton");
const skipButton = document.getElementById("skipButton");
const startSound = new Audio('assets/audio/Start game.wav');

startButton.addEventListener("click", () => {
  if (gameStarted) return;
  gameStarted = true;

  startNextWave(gameState, path, gridSize, ctx, canvas, waveText, skipButton);
  gameLoop(ctx, canvas, gridCols, gridRows, gridSize, gameState, hud);
});

skipButton.addEventListener("click", () => {
  // Only play sound if the button is not already disabled
  if (!skipButton.disabled) {
    startSound.currentTime = 0; // reset sound in case it was already playing
    startSound.play();
  }

  // Existing logic
  clearInterval(waveState.countdownInterval);
  startWave(gameState, path, gridSize, ctx, canvas, waveText, skipButton);

  // Disable button after click
  skipButton.disabled = true;
});

/***********************
 * GLOBALS
 ***********************/
window.gridOccupied = gridOccupied;
window.pathOccupied = pathOccupied;
