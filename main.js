// ======================
// IMPORTS
// ======================
import { gameLoop } from './game-engine.js';
import { Enemy } from './enemies.js';
import { Tower } from './towers/Tower.js';
import { startWave, startNextWave, waveState } from './waves.js';
import { initHUD } from './hud.js';
import { canvas, ctx, mouse } from './canvas.js';
import { gameState } from './gameState.js';
import { initGrid, gridCols, gridRows, gridSize, gridOccupied } from './grid.js';
import { setupTowerPlacement } from './towerPlacement.js';
import { distance, getHoveredEnemy, getTowerAtPosition } from './utils.js';
import { pathCells, pathOccupied, buildPath } from './pathing.js';

// TOWER IMPORTS
import { CannonTower } from './towers/CannonTower.js';
import { FrostTower } from './towers/FrostTower.js';
import { AcidTower } from './towers/AcidTower.js';
import { TankTower } from './towers/TankTower.js';

// ======================
// GLOBALS
// ======================
window.hoveredEnemy = null;
window.selectedTowerType = null;
window.selectedTower = null;

// ======================
// CONSTANTS
// ======================
const ENEMY_INTERACT_RADIUS = 55;
const ATTACK_CURSOR_SCALE = 1.23;

// ======================
// GAME CONTROL
// ======================
let gameStarted = false;

// ======================
// WAVE TEXT
// ======================
const waveText = document.getElementById("waveText");
waveText.style.display = "block";
waveText.style.zIndex = "1000";
waveText.innerText = "Wave 1";

// ======================
// INIT GRID + PATH
// ======================
initGrid(canvas, 25, 15);
const path = buildPath(pathCells, gridSize);

// ======================
// INIT HUD
// ======================
const hud = initHUD({ gameState, path, gridSize, ctx, canvas, waveText, waveState, startWave });
window.showTowerModal = tower => hud.showTowerModal(tower);
window.hideTowerModal = () => hud.hideTowerModal();

// ======================
// SETUP TOWER PLACEMENT
// ======================
setupTowerPlacement({ hud, gridSize });

// ======================
// TOWER CARD SELECTION
// ======================
document.querySelectorAll(".towerCard").forEach(card => {
    card.addEventListener("click", () => {
        const cost = parseInt(card.querySelector(".towerCost").textContent.replace("$",""));
        const name = card.querySelector(".towerName").textContent.replace(":", "").trim();

        if (gameState.money >= cost) {
            gameState.money -= cost;
            hud.update();
            window.selectedTowerType = name; // triggers ghost tower
        }
    });
});

// ======================
// WAVE TEXT LOOP
// ======================
function updateWaveText() {
  if (waveState.status === "countdown") {
    waveText.innerText = `Next wave in: ${waveState.countdown}s`;
  } else if (waveState.status === "spawning") {
    waveText.innerText = `Wave ${waveState.currentWave} in progress`;
  } else if (waveState.status === "done") {
    waveText.innerText = `Wave ${waveState.currentWave} complete`;
  } else {
    waveText.innerText = "";
  }

  requestAnimationFrame(updateWaveText);
}
updateWaveText();

// ======================
// CURSOR FX
// ======================
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

// ======================
// MOUSE MOVE
// ======================
canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  window.mouseX = e.clientX - rect.left;
  window.mouseY = e.clientY - rect.top;

  fx.style.left = e.clientX + "px";
  fx.style.top = e.clientY + "px";

  applyCursor();

  window.hoveredEnemy = getHoveredEnemy(gameState.enemies, window.mouseX, window.mouseY, 65);

  if (cursorMode === "attack") {
    if (window.hoveredEnemy) {
      fx.classList.add("active", "locked");
    } else {
      fx.classList.remove("locked");
    }
    return;
  }

  const hoverTower = getTowerAtPosition(gameState.towers, window.mouseX, window.mouseY, gridSize);
  fx.classList.toggle("active", !!(hoverTower || window.hoveredEnemy));
});

// ======================
// CANVAS CLICK (FOR FORCE ATTACK)
// ======================
canvas.addEventListener("mousedown", e => {
    if (!window.selectedTower) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const hoveredEnemy = getHoveredEnemy(gameState.enemies, mouseX, mouseY, 65);

    if (cursorMode === "attack" && hoveredEnemy) {
        // Assign forced target
        window.selectedTower.setForcedTarget(hoveredEnemy);

        // Immediately revert cursor to normal
        cursorMode = "default";
        applyCursor();
    }
});

// ======================
// ATTACK BUTTON
// ======================
document.getElementById("towerAttackOption").addEventListener("click", () => {
  cursorMode = "attack";
  applyCursor();
});

// ======================
// ESC & ATTACK TOGGLE
// ======================
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    cursorMode = "default";
    if (window.selectedTower) window.selectedTower.clearForcedTarget();
    window.selectedTowerType = null;
    applyCursor();
  }

  if (e.key.toLowerCase() === "a" && window.selectedTower) {
    cursorMode = cursorMode === "attack" ? "default" : "attack";
    applyCursor();
  }
});

// ======================
// START GAME BUTTONS
// ======================
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
  if (!skipButton.disabled) {
    startSound.currentTime = 0;
    startSound.play();
  }
  clearInterval(waveState.countdownInterval);
  startWave(gameState, path, gridSize, ctx, canvas, waveText, skipButton);
  skipButton.disabled = true;
});

// ======================
// GLOBALS
// ======================
window.gridOccupied = gridOccupied;
window.pathOccupied = pathOccupied;
