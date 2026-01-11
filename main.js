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
import { distance, getHoveredEnemy, getTowerAtPosition } from './utils.js';
import { pathCells, pathOccupied, buildPath } from './pathing.js';
import { Tower } from './towers/Tower.js';
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
let gameStarted = false; // <<< add this line


// ======================
// CURSOR FX
// ======================
const fx = document.getElementById("cursor-fx");
const fxImg = fx.querySelector("img");

const CURSOR_DEFAULT = "../assets/select-crosshair.png";
const CURSOR_ATTACK  = "../assets/crosshair.png";

let cursorMode = "default";
let angle = 0;

function applyCursor() {
    if (window.selectedTowerType) {
        fx.style.display = "none"; // hide when tower placement ghost active
    } else {
        fx.style.display = "block";
        fxImg.src = cursorMode === "attack" ? CURSOR_ATTACK : CURSOR_DEFAULT;
        fx.classList.toggle("active", cursorMode === "attack");
    }
}

// Animate cursor rotation & scaling
function animateCursor() {
    angle += 3;
    let scale = 1;

    if (cursorMode === "attack" && window.hoveredEnemy) scale = 1.25;

    fx.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`;
    requestAnimationFrame(animateCursor);
}
animateCursor();

// ======================
// INIT GRID + PATH
// ======================
initGrid(canvas, 25, 15);
const path = buildPath(pathCells, gridSize);

// ======================
// INIT HUD
// ======================
const hud = initHUD({ gameState, path, gridSize, ctx, canvas, waveText: document.getElementById("waveText"), waveState, startWave });
window.showTowerModal = tower => hud.showTowerModal(tower);
window.hideTowerModal = () => hud.hideTowerModal();

// ======================
// TOWER PLACEMENT
// ======================
setupTowerPlacement({ hud, gridSize });

document.querySelectorAll(".towerCard").forEach(card => {
    card.addEventListener("click", () => {
        const cost = parseInt(card.querySelector(".towerCost").textContent.replace("$",""));
        const name = card.querySelector(".towerName").textContent.replace(":", "").trim();

        if (gameState.money >= cost) {
            gameState.money -= cost;
            hud.update();
            window.selectedTowerType = name; // triggers ghost tower in gameLoop
            console.log("[Main] Tower selected for placement:", name);
        }
    });
});

// ======================
// CURSOR & MOUSE
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
        if (window.hoveredEnemy) fx.classList.add("active", "locked");
        else fx.classList.remove("locked");
        return;
    }

    const hoverTower = getTowerAtPosition(gameState.towers, window.mouseX, window.mouseY, gridSize);
    fx.classList.toggle("active", !!(hoverTower || window.hoveredEnemy));
});

// Force attack on click
canvas.addEventListener("click", () => {
    if (cursorMode !== "attack") return;
    if (!window.selectedTower) return;

    if (window.hoveredEnemy) {
        window.selectedTower.setForcedTarget(window.hoveredEnemy);
        console.log("[Main] Forced attack activated on enemy:", window.hoveredEnemy);
    }
});

// ======================
// ATTACK BUTTON
// ======================
document.getElementById("towerAttackOption").addEventListener("click", () => {
    cursorMode = "attack";
    applyCursor();
    console.log("[Main] Attack mode toggled via button");
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
        console.log("[Main] Escape pressed, attack/placement canceled");
    }

    if (e.key.toLowerCase() === "a" && window.selectedTower) {
        if (cursorMode === "attack") {
            cursorMode = "default";
            window.selectedTower.clearForcedTarget();
            console.log("[Main] Attack mode canceled via 'A'");
        } else {
            cursorMode = "attack";
            console.log("[Main] Attack mode toggled via 'A'");
        }
        applyCursor();
    }
});

// ======================
// WAVE TEXT
// ======================
function updateWaveText() {
    if (waveState.status === "countdown") waveText.innerText = `Next wave in: ${waveState.countdown}s`;
    else if (waveState.status === "spawning") waveText.innerText = `Wave ${waveState.currentWave} in progress`;
    else if (waveState.status === "done") waveText.innerText = `Wave ${waveState.currentWave} complete`;
    else waveText.innerText = "";

    requestAnimationFrame(updateWaveText);
}
updateWaveText();

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
    console.log("[Main] Game started");
});

skipButton.addEventListener("click", () => {
    if (!skipButton.disabled) {
        startSound.currentTime = 0;
        startSound.play();
    }
    clearInterval(waveState.countdownInterval);
    startWave(gameState, path, gridSize, ctx, canvas, waveText, skipButton);
    skipButton.disabled = true;
    console.log("[Main] Wave skipped");
});

// ======================
// GLOBAL EXPORTS
// ======================
window.gridOccupied = gridOccupied;
window.pathOccupied = pathOccupied;
