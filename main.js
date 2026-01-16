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
      const cost = parseInt(
        card.querySelector(".towerCost").textContent.replace("$", "")
      );
      const name = card.querySelector(".towerName").textContent
        .replace(":", "")
        .trim();
  
      if (gameState.money >= cost) {
        window.selectedTowerType = name;
        window.selectedTowerCost = cost;
      }
    });
  });
  

    // CREATE DARK OVERLAY
    const overlay = document.createElement("div");
    overlay.id = "preGameOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.7)"; // dark semi-transparent
    overlay.style.zIndex = "999"; // sit below the start button (which should be higher z)
    overlay.style.pointerEvents = "none"; // allow clicks to pass through if needed
    document.body.appendChild(overlay);



// ======================
// START + SKIP BUTTONS
// ======================
const startButton = document.getElementById("startButton");
const skipButton  = document.getElementById("skipButton");
const startSound  = new Audio('assets/audio/Start game.wav');

// INITIAL STATE
skipButton.disabled = true;
skipButton.style.display = "none";

// Add glow class for animation
function enableGlow(button) {
  button.classList.add("glow");
}
function disableGlow(button) {
  button.classList.remove("glow");
}

// Start button should glow from the start
enableGlow(startButton);
startButton.style.position = "relative"; // or "fixed" if you want it floating
startButton.style.zIndex = "1000";       // higher than overlay
startButton.style.width = "300px";     // make the button wider
startButton.style.height = "120px";    // make the button taller
startButton.style.fontSize = "2.5em";  // bigger text
startButton.style.padding = "20px 40px"; // extra internal space



skipButton.disabled = true;
const livesDisplay = document.getElementById("lives");
const moneyDisplay = document.getElementById("money");

livesDisplay.style.display = "none";
moneyDisplay.style.display = "none";

startButton.addEventListener("click", () => {
    if (gameStarted) return;
    gameStarted = true;
  
    startSound.play();
  
    // remove overlay
    overlay.style.transition = "opacity 0.5s ease";
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 500);
  
    // hide start button
    startButton.style.display = "none";
    disableGlow(startButton);
  
    // enable skip button & glow
    skipButton.disabled = false;
    enableGlow(skipButton);
    skipButton.style.display = "inline-block";
  
    // show HUD info
    livesDisplay.style.display = "block";
    moneyDisplay.style.display = "block";
  
    // Start waves and game loop
    const waveTextEl = document.getElementById("waveText");
    startGameWaves(gameState, ctx, canvas);
    gameLoop(ctx, canvas, gameState, hud);
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
  disableGlow(skipButton);

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
        waveTextEl.innerText = `Wave ${waveState.currentWave + 1} in: ${waveState.countdown}s`;
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
// FORCE ATTACK CLICK
// ======================
canvas.addEventListener("click", () => {
    if (cursorMode !== "attack") return;           // only in attack mode
    if (!window.selectedTower || !window.hoveredEnemy) return; // need tower + enemy

    console.log(
        "[FORCE ATTACK]",
        "Tower:", window.selectedTower,
        "Enemy:", window.hoveredEnemy
    );

    // ✅ assign forced target (don't call attack directly)
    window.selectedTower.setForcedTarget(window.hoveredEnemy);

    // exit attack mode after click
    cursorMode = "default";
    applyCursor(); // this is your existing cursor function, do NOT modify
});


// ======================
// ATTACK / ESC / UPGRADE / SELL KEYS
// ======================
document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    if (key === "escape") {
        cursorMode = "default";
      
        if (window.selectedTower) {
          window.selectedTower.clearForcedTarget();
        }
      
        window.selectedTowerType = null;
        window.selectedTowerCost = null; // ✅ REQUIRED
      
        applyCursor();
      }
       else if (key === "a" && window.selectedTower) {
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
