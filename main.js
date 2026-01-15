// ======================
// IMPORTS
// ======================
// main.js
import { gameLoop, startGameWaves } from './game-engine.js';
import { startWave, startNextWave, updateWaveCompletion, waveState } from './waveManager.js';
import { initHUD } from './hud.js';
import { canvas, ctx } from './canvas.js';
import { gameState } from './gameState.js';
import { initGrid, gridSize, gridOccupied } from './grid.js';
import { pathCells, buildPath } from './pathing.js';
import { setupTowerPlacement } from './towerPlacement.js';
import { getHoveredEnemy, getTowerAtPosition } from './utils.js';
import { loadEnemyImages } from './enemies/enemies.js';
import { enemiesData } from './enemies/enemyData.js';

// preload all enemy images
loadEnemyImages(enemiesData);

// ======================
// GLOBALS
// ======================
let gameStarted = false;
window.hoveredEnemy = null;
window.hoveredTower = null;
window.selectedTower = null;
window.selectedTowerType = null;

// INIT GRID + PATH
initGrid(canvas, 25, 15);
const { pathOccupied: pathCellsOccupied, pixelPath } = buildPath(pathCells, gridSize);
waveState.path = pixelPath;        // set path in waveState
window.gridOccupied = gridOccupied;
window.pathOccupied = pathCellsOccupied;



// ======================
// START FIRST WAVE
// ======================
startGameWaves(gameState, ctx, canvas);
console.log(ctx)


// ======================
// INIT HUD
// ======================
const waveTextEl = document.getElementById("waveText");
const hud = initHUD({ gameState, gridSize, ctx, canvas, waveText: waveTextEl, waveState, startWave });
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
        const cost = parseInt(card.querySelector(".towerCost").textContent.replace("$", ""));
        const name = card.querySelector(".towerName").textContent.replace(":", "").trim();

        if (gameState.money >= cost) {
            gameState.money -= cost;
            hud.updateMoneyLives();
            window.selectedTowerType = name; // triggers ghost tower in gameLoop
        }
    });
});

// ======================
// START + SKIP BUTTONS
// ======================
const startButton = document.getElementById("startButton");
const skipButton  = document.getElementById("skipButton");
const startSound  = new Audio('assets/audio/Start game.wav');

skipButton.disabled = false; // ready from the start

startButton.addEventListener("click", () => {
  if (gameStarted) return;
  gameStarted = true;

  const waveTextEl = document.getElementById("waveText");
  skipButton.disabled = false;
  startNextWave(gameState, gridSize, ctx, canvas, waveTextEl);
  gameLoop(ctx, canvas, gameState, hud);
  console.log("START", ctx);
});


skipButton.addEventListener("click", () => {
  const waveTextEl = document.getElementById("waveText");

  // only skip if a countdown is active
  if (!waveState.countdownInterval) return;

  startSound.play();

  // stop countdown
  clearInterval(waveState.countdownInterval);
  waveState.countdownInterval = null;

  skipButton.disabled = true;

  // start spawning immediately
  startWave(gameState, gridSize, ctx, canvas, waveTextEl);
  console.log("SKIP CLICKED", waveState);
});







// ======================
// WAVE TEXT LOOP
// ======================
function updateWaveText() {
    if (!waveTextEl) return;

    if (waveState.status === "countdown") {
        waveTextEl.innerText = `Next wave in: ${waveState.countdown}s`;
    } else if (waveState.status === "spawning") {
        waveTextEl.innerText = `Wave ${waveState.currentWave + 1} in progress`;
    } else if (waveState.status === "done") {
        waveTextEl.innerText = `Wave ${waveState.currentWave + 1} complete!`;
    } else {
        waveTextEl.innerText = "";
    }

    requestAnimationFrame(updateWaveText);
}
updateWaveText();

// ======================
// CURSOR FX + MOUSE
// ======================
const fx = document.getElementById("cursor-fx");
const fxImg = fx.querySelector("img");
const CURSOR_SELECT = "./assets/select-crosshair.png";
const CURSOR_ATTACK = "./assets/crosshair.png";
let cursorMode = "default";
let angle = 0;

function applyCursor() {
    if (window.selectedTowerType) {
        fx.style.display = "none";
        return;
    }
    fx.style.display = "block";

    if (cursorMode === "attack") {
        fxImg.src = CURSOR_ATTACK; 
        fx.style.opacity = "1";
    } else {
        if (window.hoveredEnemy || window.hoveredTower) {
            fxImg.src = CURSOR_SELECT;
            fx.style.opacity = "1";
        } else {
            fx.style.opacity = "0";
        }
    }
}

function animateCursor() {
    angle += 3;
    let scale = 1;
    if (cursorMode === "attack" && window.hoveredEnemy) scale = 1.23;
    fx.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`;
    requestAnimationFrame(animateCursor);
}
animateCursor();

canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    window.mouseX = (e.clientX - rect.left) * scaleX;
    window.mouseY = (e.clientY - rect.top) * scaleY;

    fx.style.left = e.clientX + "px";
    fx.style.top  = e.clientY + "px";

    window.hoveredEnemy = getHoveredEnemy(gameState.enemies, window.mouseX, window.mouseY, 65);
    window.hoveredTower = getTowerAtPosition(gameState.towers, window.mouseX, window.mouseY, gridSize);
    applyCursor();
});

// ======================
// ATTACK / ESC / UPGRADE / SELL KEYS
// ======================
document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    if (key === "escape") {
        cursorMode = "default";
        if (window.selectedTower) window.selectedTower.clearForcedTarget();
        window.selectedTowerType = null;
        applyCursor();
    } else if (key === "a" && window.selectedTower) {
        cursorMode = cursorMode === "attack" ? "default" : "attack";
        applyCursor();
    } else if (key === "u" && window.selectedTower) {
        const tower = window.selectedTower;
        if (tower.upgrade(gameState)) hud.update();
    } else if (key === "s" && window.selectedTower) {
        const sellBtn = document.querySelector(".tower-sell");
        if (sellBtn && typeof sellBtn.onclick === "function") sellBtn.onclick();
    }
});

// ======================
// GLOBALS
// ======================
window.gridOccupied = gridOccupied;
