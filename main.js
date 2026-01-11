// ======================
// IMPORTS
// ======================
import { gameLoop } from './game-engine.js';
import { startWave, startNextWave, waveState } from './waves.js';
import { initHUD } from './hud.js';
import { canvas, ctx } from './canvas.js';
import { gameState } from './gameState.js';
import { initGrid, gridCols, gridRows, gridSize, gridOccupied } from './grid.js';
import { setupTowerPlacement } from './towerPlacement.js';
import { getHoveredEnemy, getTowerAtPosition, distance } from './utils.js';
import { pathCells, pathOccupied, buildPath } from './pathing.js';

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
            console.log("[main] Tower selected for placement:", name);
        } else {
            console.log("[main] Not enough money to select:", name);
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

// Cursor image paths
const CURSOR_DEFAULT = "../assets/cursor-default.png";       // default
const CURSOR_HOVER   = "../assets/select-crosshair.png";     // hovering tower/enemy
const CURSOR_ATTACK  = "../assets/crosshair.png";           // red attack

let cursorMode = "default"; // "default" | "hover" | "attack"
let angle = 0;

// Apply cursor appearance based on mode
function applyCursor() {
    if (!fx || !fxImg) return;

    if (cursorMode === "attack") fxImg.src = CURSOR_ATTACK;
    else if (cursorMode === "hover") fxImg.src = CURSOR_HOVER;
    else fxImg.src = CURSOR_DEFAULT;

    // Hide cursor if placing a tower
    if (window.selectedTowerType) {
        fx.style.display = "none";
    } else {
        fx.style.display = "block";
        fx.classList.toggle("active", cursorMode === "attack" || cursorMode === "hover");
    }

    console.log("[cursor] applyCursor:", cursorMode, "selectedTowerType:", window.selectedTowerType);
}

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
// MOUSE MOVE (canvas hover logic)
// ======================
canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    window.mouseX = e.clientX - rect.left;
    window.mouseY = e.clientY - rect.top;

    fx.style.left = e.clientX + "px";
    fx.style.top = e.clientY + "px";

    window.hoveredEnemy = getHoveredEnemy(gameState.enemies, window.mouseX, window.mouseY, 65);
    const hoverTower = getTowerAtPosition(gameState.towers, window.mouseX, window.mouseY, gridSize);

    // Tower placement takes priority: hide cursor
    if (window.selectedTowerType) {
        cursorMode = "default";
        fx.style.display = "none";
        console.log("[cursor] tower placement active, cursor hidden");
    } else if (cursorMode === "attack") {
        // Attack mode: red cursor
        fx.classList.toggle("locked", !!window.hoveredEnemy);
        console.log("[cursor] attack mode, hoveredEnemy:", !!window.hoveredEnemy);
    } else {
        // Hover over tower/enemy?
        if (window.hoveredEnemy || hoverTower) {
            cursorMode = "hover";
            console.log("[cursor] hovering over:", window.hoveredEnemy ? "enemy" : "tower");
        } else {
            cursorMode = "default";
        }
    }

    applyCursor();
});

// ======================
// ATTACK BUTTON
// ======================
document.getElementById("towerAttackOption").addEventListener("click", () => {
    cursorMode = "attack";
    applyCursor();
    console.log("[cursor] attack mode triggered via button");
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
        console.log("[cursor] Escape pressed: reset cursor & cancel tower placement");
    }

    if (e.key.toLowerCase() === "a" && window.selectedTower) {
        cursorMode = cursorMode === "attack" ? "default" : "attack";
        applyCursor();
        console.log("[cursor] Attack mode toggled via 'A' key:", cursorMode);
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
    console.log("[main] Starting game");
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
    console.log("[main] Wave skipped");
});

// ======================
// EXPORTS
// ======================
window.gridOccupied = gridOccupied;
window.pathOccupied = pathOccupied;

console.log("[main] main.js fully loaded");
