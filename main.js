// ======================
// IMPORTS
// ======================
import { gameLoop } from './game-engine.js';
import { Enemy } from './enemies.js';
import { Tower } from './towers/Tower.js';
import { startWave, startNextWave, waveState } from './waves.js';
import { initHUD } from './hud.js';
import { canvas, ctx } from './canvas.js';
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
window.hoveredTower = null;
window.selectedTower = null;
window.selectedTowerType = null;

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
initGrid(canvas, 25, 15);                // for enemy movement
const { pathOccupied: pathCellsOccupied, pixelPath } = buildPath(pathCells, gridSize);
window.pathOccupied = pathCellsOccupied; // for tile drawing & ghost tower
const path = pixelPath;                  // for enemy movement


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
            window.selectedTowerType = name; // triggers ghost tower in gameLoop
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
const CURSOR_SELECT = "../assets/select-crosshair.png"; // hover only
const CURSOR_ATTACK = "../assets/crosshair.png";        // red
let cursorMode = "default";
let angle = 0;

// always hide fx during tower placement
function applyCursor() {
    if (window.selectedTowerType) {
        fx.style.display = "none"; // ghost tower handles drawing
        return;
    }

    fx.style.display = "block";

    if (cursorMode === "attack") {
        fxImg.src = CURSOR_ATTACK; 
        fx.style.opacity = "1";
    } else {
        // only show hover cursor when hovering tower/enemy
        if (window.hoveredEnemy || window.hoveredTower) {
            fxImg.src = CURSOR_SELECT;
            fx.style.opacity = "1";
        } else {
            fx.style.opacity = "0"; // hide select-crosshair when nothing hovered
        }
    }
}

// rotate / scale cursor
function animateCursor() {
    angle += 3;
    let scale = 1;
    if (cursorMode === "attack" && window.hoveredEnemy) {
        scale = ATTACK_CURSOR_SCALE;
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

    // cursor follows mouse
    fx.style.left = e.clientX + "px";
    fx.style.top  = e.clientY + "px";

    // hover detection
    window.hoveredEnemy = getHoveredEnemy(gameState.enemies, window.mouseX, window.mouseY, 65);
    window.hoveredTower = getTowerAtPosition(gameState.towers, window.mouseX, window.mouseY, gridSize);

    // immediately update cursor
    applyCursor();
});

// ======================
// FORCE ATTACK CLICK
// ======================
canvas.addEventListener("click", e => {
    if (cursorMode !== "attack") return;
    if (!window.selectedTower) return;

    const enemy = window.hoveredEnemy;
    if (!enemy) return;

    // stop auto-attack, set forced target
    window.selectedTower.setForcedTarget(enemy);
});

// ======================
// ATTACK BUTTON
// ======================
document.getElementById("towerAttackOption").addEventListener("click", () => {
    cursorMode = "attack";
    applyCursor();
});

// ======================
// ESC, ATTACK, UPGRADE, SELL
// ======================
document.addEventListener("keydown", e => {
  const key = e.key.toLowerCase();

  // Escape cancels placement or attack
  if (key === "escape") {
      cursorMode = "default";
      if (window.selectedTower) window.selectedTower.clearForcedTarget();
      window.selectedTowerType = null;
      applyCursor();
  }

  // "A" toggles attack mode if a tower is selected
  else if (key === "a" && window.selectedTower) {
      cursorMode = cursorMode === "attack" ? "default" : "attack";
      applyCursor();
  }

  // "U" upgrades tower if a tower is selected
  else if (key === "u" && window.selectedTower) {
      const tower = window.selectedTower;
      if (tower.upgrade(gameState)) {
          console.log(`[upgrade] Tower upgraded to level ${tower.level}`);
          if (hud.update) hud.update(); // update money display
      } else {
          console.log(`[upgrade] Cannot upgrade tower (level ${tower.level})`);
      }
  }

  // "S" triggers sell if tower is selected
  else if (key === "s" && window.selectedTower) {
      // Find the sell button in HUD and call its onclick
      const sellBtn = document.querySelector(".tower-sell");
      if (sellBtn && typeof sellBtn.onclick === "function") {
          sellBtn.onclick(); // runs the existing confirmation & sell logic
      }
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
    // Correct
    gameLoop(ctx, canvas, gameState, hud);

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


