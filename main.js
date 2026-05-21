// ======================
// IMPORTS
// ======================
import { startGameLoop, stopGameLoop, startGameWaves, resetGame } from './game-engine.js';
import { startWave, startNextWave, waveState, updateWavePreview, stopWaveSpawning, stopAllWaveIntervals, adjustWaveSpeed } from './waveManager.js';
import { initHUD } from './hud.js';
import { canvas, ctx } from './canvas.js';
import { gameState } from './gameState.js';
import { initGrid, gridSize, gridOccupied } from './grid.js';
import { pathCells, buildPath } from './pathing.js';
import { setupTowerPlacement } from './towerPlacement.js';
import { getHoveredEnemy, getTowerAtPosition } from './utils.js';
import { loadEnemyImages } from './enemies/enemies.js';
import { enemiesData } from './enemies/enemyData.js';
import { initTowerTooltip, showTowerTooltip, hideTowerTooltip } from './ui-effects.js';
import { TOWER_REGISTRY } from "./towers/towerRegistry.js";
import { showDifficultyMenu } from "./difficulty.js";
import { initCursor, startCursorAnimation } from './cursor.js';
import { showTip } from "./tips.js";

import { CannonTower } from './towers/CannonTower.js';
import { TankTower } from './towers/TankTower.js';
import { FrostTower } from './towers/FrostTower.js';
import { BoosterTower } from './towers/BoosterTower.js';
import { DetectionTower } from './towers/DetectionTower.js';
import { AntiAirTower } from './towers/AntiAir.js';
import { AcidTower } from './towers/AcidTower.js';

import { devLayouts } from "./dev-tools/layouts/index.js";

// ======================
// PRELOAD ENEMY IMAGES
// ======================
loadEnemyImages(enemiesData);


// ======================
// AUTO PAUSE ON TAB SWITCH
// ======================
window.gamePaused = false;

document.addEventListener("visibilitychange", () => {
    window.gamePaused = document.hidden;
});


// ======================
// GLOBALS
// ======================
let gameStarted = false;
window.hoveredEnemy = null;
window.hoveredTower = null;
window.selectedTower = null;
window.selectedTowerType = null;

// ======================
// INIT GRID + PATH
// ======================
initGrid(canvas, 25, 15);
const { pathOccupied: pathCellsOccupied, pixelPath } = buildPath(pathCells, gridSize);
waveState.path = pixelPath;
window.gridOccupied = gridOccupied;
window.pathOccupied = pathCellsOccupied;

// ======================
// INIT HUD
// ======================
export const waveTextEl = document.getElementById("waveText");
const hud = initHUD({ gameState, gridSize, ctx, canvas, waveText: waveTextEl, waveState, startWave });
window.showTowerModal = tower => hud.showTowerModal(tower);
window.hideTowerModal = () => hud.hideTowerModal();

// ======================
// TOWER PLACEMENT
// ======================
setupTowerPlacement({ hud, gridSize });

// ======================
// INIT CURSOR
// ======================
initCursor({ canvas });

startCursorAnimation();


// ======================
// TOWER TOOLTIP
// ======================
const towerTooltipEl = initTowerTooltip(); // initialize tooltip

document.querySelectorAll(".towerCard").forEach(card => {

    card.addEventListener("mouseover", () => {
        const rect = card.getBoundingClientRect();
    
        const type = card.dataset.type;
        const key = type.charAt(0).toLowerCase() + type.slice(1);
        const TowerClass = TOWER_REGISTRY[key];
    
        const title = TowerClass?.name || "Tower";        
        const description = TowerClass?.description || "No description";
    
        // x = right edge of tooltip aligns to left edge of card
        const x = rect.left;                
        const y = rect.top + rect.height / 2;  // vertically center
    
        showTowerTooltip(title, description, x, y);
    });
    
    
    
    

    card.addEventListener("mouseout", hideTowerTooltip);

    card.addEventListener("click", () => {
        const costText = card.querySelector(".towerCost")?.textContent || "$0";
        const cost = parseInt(costText.replace("$", ""));
        const type = card.dataset.type;
    
        // Capitalize type and assign together
        window.selectedTowerType = type.charAt(0).toUpperCase() + type.slice(1);
        window.selectedTowerCost = cost;
    });
    
    
});


// ======================
// PRE-GAME OVERLAY
// ======================
const gameContainer = document.getElementById("gameContainer");
gameContainer.style.position = "relative";

const overlay = document.createElement("div");
overlay.id = "preGameOverlay";
overlay.style.position = "absolute";
overlay.style.top = "0";
overlay.style.left = "50%";
overlay.style.transform = "translateX(-50%)";
overlay.style.width = "1330px";
overlay.style.height = "100%";
overlay.style.backgroundColor = "rgba(0,0,0,0.7)";
overlay.style.zIndex = "50";
overlay.style.pointerEvents = "none";
gameContainer.appendChild(overlay);

// ======================
// START + SKIP BUTTONS
// ======================
const startButton = document.getElementById("startButton");
const skipButton = document.getElementById("skipButton");
const startSound = new Audio('assets/audio/Start game.wav');
const livesDisplay = document.getElementById("lives");
const moneyDisplay = document.getElementById("money");

skipButton.disabled = true;
skipButton.style.display = "none";
livesDisplay.style.display = "none";
moneyDisplay.style.display = "none";

function enableGlow(button) { button.classList.add("glow"); }
function disableGlow(button) { button.classList.remove("glow"); }

// Start button styling
startButton.style.position = "absolute";
startButton.style.zIndex = "100";
startButton.style.left = "50%";
startButton.style.top = "50%";
startButton.style.transform = "translate(-50%, -50%)";
startButton.style.width = "300px";
startButton.style.height = "120px";
startButton.style.fontSize = "2.5em";
startButton.style.padding = "20px 40px";
enableGlow(startButton);


// Hook into START BUTTON CLICK — only show menu for now
// ======================
// START BUTTON CLICK — SHOW DIFFICULTY
// ======================
startButton.addEventListener("click", () => {
    if (gameStarted) return;
    gameStarted = true;
    startSound.play();

    // Hide pre-game overlay
    overlay.style.transition = "opacity 0.5s ease";
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 500);

    // Hide start button
    startButton.style.display = "none";
    disableGlow(startButton);

    showDifficultyMenu();
});

// ======================
// DIFFICULTY BUTTON LISTENERS
// Attach after DOM content is loaded
// ======================
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("#difficultyMenu .difficultyButton");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const selected = btn.dataset.difficulty;
            if (!selected) return;

            // Apply difficulty
            gameState.difficulty = selected;
            window.tipsEnabled = selected === "beginner";

            const tipsToggle = document.getElementById("toggleTips");

            if (tipsToggle) {
                tipsToggle.checked = window.tipsEnabled;
            }

            console.log(gameState.difficulty)
            // Hide difficulty menu
            if (difficultyMenu) difficultyMenu.style.display = "none";

            // Show skip button + HUD
            skipButton.disabled = false;
            enableGlow(skipButton);
            skipButton.style.display = "inline-block";

            livesDisplay.style.display = "block";
            moneyDisplay.style.display = "block";
            startGameLoop(ctx, canvas, gameState, hud);
            startGameWaves(gameState, ctx, canvas);

            if (window.tipsEnabled) {
                showTip("startGame");
            }
        });
    });
});


// ======================
// SKIP BUTTON CLICK
// ======================
skipButton.addEventListener("click", () => {
    if (!waveState.countdownInterval) return;
    startSound.play();

    clearInterval(waveState.countdownInterval);
    waveState.countdownInterval = null;

    skipButton.disabled = true;
    disableGlow(skipButton);

    const tip = document.getElementById("tipPopup");
    if (tip) {
        tip.classList.remove("visible");
        clearTimeout(tip.hideTimeout);
    }

    document.querySelectorAll(".towerCard.attention-glow")
        .forEach(card => card.classList.remove("attention-glow"));

    startWave(gameState, gridSize, ctx, canvas, waveTextEl);
    updateWavePreview();
});

// ======================
// WAVE TEXT UPDATE
// ======================
/*
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
}
updateWaveText(); // call once; will be updated elsewhere by waveManager
*/

// ======================
// ATTACK / ESC / UPGRADE / SELL KEYS
// ======================
document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();

    if (key === "u" && window.selectedTower) {
        const tower = window.selectedTower;

        if (tower.upgrade(gameState)) {
            if (window.hud?.update) {
                window.hud.update();
            }
        }
    }

    else if (key === "s" && window.selectedTower) {
        const sellBtn = document.querySelector(".tower-sell");
        if (sellBtn?.onclick) sellBtn.onclick();
    }
});


// ======================
// TOGGLE GRID
// ======================
const toggleGridCheckbox = document.getElementById("toggleGrid");
window.showGrid = false;
toggleGridCheckbox.addEventListener("change", e => {
    window.showGrid = e.target.checked;
});

// ======================
// SETTINGS MODAL LOGIC
// ======================
const settingsOption = document.getElementById("settingsOption");
const settingsModal = document.getElementById("settingsModal");
const closeSettings = document.getElementById("closeSettings");
const returnButton = document.getElementById("returnToGame");
const pauseOverlay = document.getElementById("pauseOverlay");

let closeModal = () => {};
if (settingsOption && settingsModal && closeSettings && pauseOverlay && returnButton) {
    const openModal = () => {
        settingsModal.classList.remove("hidden");
        pauseOverlay.classList.remove("hidden");
        window.gamePaused = true;
        console.log(window.gamePaused)
    };

    closeModal = () => {
        settingsModal.classList.add("hidden");
        pauseOverlay.classList.add("hidden");
        window.gamePaused = false;
    };
    settingsOption.addEventListener("click", openModal);
    closeSettings.addEventListener("click", closeModal);
    returnButton.addEventListener("click", closeModal);
    settingsModal.addEventListener("click", e => {
        if (e.target === settingsModal) closeModal();
    });
}


const tipToggle = document.getElementById("toggleTips");

if (tipToggle) {
  tipToggle.checked = window.tipsEnabled;

  tipToggle.addEventListener("change", (e) => {
    window.tipsEnabled = e.target.checked;
  });
}


// ======================
// FAST FORWARD
// ======================
const fastForwardBtn = document.getElementById("fastForwardBtn");

fastForwardBtn?.addEventListener("click", () => {
    window.gameSpeed = window.gameSpeed === 1 ? 2 : 1;
    fastForwardBtn.classList.toggle("active");

    adjustWaveSpeed(gameState, gridSize, ctx, canvas, waveTextEl);

    console.log("🚀 Fast forward toggled. Current speed:", window.gameSpeed);
});


// ======================
// RESTART GAME BUTTON (PAUSE / SETTINGS)
// ======================
const restartGameBtn = document.getElementById("restartGameBtn");
if (restartGameBtn) {
    restartGameBtn.addEventListener("click", () => {
        const confirmed = confirm("Restart the game? Progress will be lost.");
        if (!confirmed) return;
  
        // Hide overlays first
        settingsModal?.classList.add("hidden");
        pauseOverlay?.classList.add("hidden");
        document.getElementById("gameOverOverlay")?.classList.add("hidden");
        closeModal();
        
    
        // ✅ Clear difficulty
        gameState.difficulty = null;
    
        // Pause the game
        window.gamePaused = false;
        if (waveTextEl) waveTextEl.innerText = "";

        console.log("🚦 window.gamePaused before reset:", window.gamePaused);

        // ✅ Stop ALL wave timers
        stopAllWaveIntervals();

        // ✅ Stop the old game loop before restarting
        stopGameLoop();

        // ✅ Clear all wave timers before resetting
        stopWaveSpawning();

        hud.hideTowerModal();

        resetGame(gameState, ctx, canvas);
        console.log("🚦 window.gamePaused after reset:", window.gamePaused);
        startGameLoop(ctx, canvas, gameState, hud);
    });
    
}


// ======================
// GAME OVER
// ======================
// Elements
const gameOverEl = document.getElementById("gameOverOverlay");
const retryBtn = document.getElementById("retryButton");

// Expose overlay function globally
window.showGameOverUI = function() {
    gameOverEl.classList.remove("hidden");
}

// Retry button
retryBtn?.addEventListener("click", () => {
    // Hide ALL overlays
    settingsModal?.classList.add("hidden");
    pauseOverlay?.classList.add("hidden");
    gameOverEl.classList.add("hidden");
    closeModal();

    // Clear difficulty
    gameState.difficulty = null;

    // Reset paused flag / HUD
    window.gamePaused = false;
    if (waveTextEl) waveTextEl.innerText = "";

    // Stop all timers
    stopAllWaveIntervals();
    stopGameLoop();
    stopWaveSpawning();
    hud.hideTowerModal();

    // Reset everything
    resetGame(gameState, ctx, canvas);

    // Restart loop
    startGameLoop(ctx, canvas, gameState, hud);
});



// =========================
// DEBUG COMMANDS
// =========================
window.devWave = function(wave, money = 99999) {

    // kill current wave activity
    stopAllWaveIntervals();
  
    // clear enemies/projectiles
    gameState.enemies = [];
    gameState.projectiles = [];
  
    // set wave
    waveState.currentWave = wave - 1;
  
    // reset countdown
    waveState.countdown = 40;
    waveState.status = "countdown";
  
    // give money
    gameState.money = money;
  
    // restart wave countdown
    startNextWave(
      gameState,
      gridSize,
      ctx,
      canvas,
      waveTextEl
    );
  
    console.log(`🚀 Jumped to wave ${wave} with $${money}`);
  };



  window.devLayoutTest = function(wave = 28) {

    const loadLayout =
        devLayouts[wave] ||
        devLayouts[28];

    loadLayout({
        gameState,
        ctx,
        canvas,
        gridSize,
        gridOccupied,
        waveTextEl
    });

};

  





// ======================
// GLOBALS
// ======================
window.gridOccupied = gridOccupied;
window.tipsEnabled = false;

// Normal speed
window.gameSpeed = 1;
