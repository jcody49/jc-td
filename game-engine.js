//TEST
// game-engine.js
import { showMoneyPopup, showLifePopup } from "./ui-effects.js";
import { pathCells, buildPath } from './pathing.js';
import { gridCols, gridRows, gridSize } from './grid.js';
import { updateWaveCompletion, startWave, startNextWave, waveState, updateWavePreview } from './waveManager.js';
import { applyCursor } from './cursor.js';
import { showDifficultyMenu } from "./difficulty.js";
import {waveTextEl} from "./main.js";

// =========================
// TILE LOAD TRACKING
// =========================
let tilesReady = 0;

// =========================
// ROAD TILE IMAGES
// =========================
export const roadImages = {};

function loadRoadTile(key, src) {
    const img = new Image();
    img.src = src;
    img.onload = () => tilesReady++;
    roadImages[key] = img;
}

// Base
loadRoadTile('horizontal', 'assets/road-tile-horizontal.png');
loadRoadTile('vertical',   'assets/road-tile-vertical.png');

// Corners (ENTER → EXIT)
loadRoadTile('cornerRD', 'assets/road-tile-right-down.png');
loadRoadTile('cornerDR', 'assets/road-tile-down-right.png');
loadRoadTile('cornerLD', 'assets/road-tile-left-down.png');
loadRoadTile('cornerDL', 'assets/road-tile-down-left.png');
loadRoadTile('cornerLU', 'assets/road-tile-left-up.png');
loadRoadTile('cornerUR', 'assets/road-tile-up-right.png');

// =========================
// GRASS TILE
// =========================
const grassTile = new Image();
grassTile.src = 'assets/grass-tile.png';
grassTile.onload = () => tilesReady++;

// =========================
// TOWER IMAGES
// =========================

export const cannonImg = new Image();
cannonImg.src = 'assets/cannon.png';

export const frostImg = new Image();
frostImg.src = 'assets/frost-tower.png';

export const acidImg = new Image();
acidImg.src = 'assets/acid-tower.png';

export const tankImg = new Image();
tankImg.src = 'assets/tank-tower.png';

// Attach images globally so towerPlacement.js can access them
window.cannonImg = cannonImg;
window.frostImg = frostImg;
window.acidImg = acidImg;
window.tankImg = tankImg;


// Check if all images are loaded before drawing
function checkImagesLoaded() {
    if (cannonImg.complete && frostImg.complete && acidImg.complete && tankImg.complete) {
      // Now the images are ready to be used in the game loop
      console.log("All images loaded!");
    }
  }

// =========================
// DRAW GRID TILES
// =========================
function drawGridTiles(ctx) {
    if (tilesReady < 1 + Object.keys(roadImages).length) return;

    ctx.imageSmoothingEnabled = false;

    const cellMap = new Map(
        pathCells.map(c => [`${c.col},${c.row}`, c])
    );

    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            const x = col * gridSize;
            const y = row * gridSize;
            const key = `${col},${row}`;
            const cell = cellMap.get(key);

            if (cell) {
                const img = roadImages[cell.roadType];
                if (!img) {
                    console.error('❌ Missing road image:', cell.roadType);
                    ctx.drawImage(grassTile, x, y, gridSize, gridSize);
                    continue;
                }
                ctx.drawImage(img, x, y, gridSize, gridSize);
            } else {
                ctx.drawImage(grassTile, x, y, gridSize, gridSize);
            }
        }
    }
}

// =========================
// DRAW START / END LABELS
// =========================
function drawStartEnd(ctx, path, gridSize) {
    if (!path || path.length === 0) return;

    const start = path[0];
    const end = path[path.length - 1];

    const drawLabel = (x, y, text, color, marginX = 0) => {
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = "bold 15px 'Audiowide', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(text, x + marginX, y + gridSize + 4);
        ctx.restore();
    };

    drawLabel(start.x, start.y, "START", "lime", 15);
    drawLabel(end.x, end.y, "FINISH", "red", -15);
}

// =========================
// GAME OVER HANDLING
// =========================

export function showGameOver(gameState, ctx, canvas) {
    window.gamePaused = true;

    // Clear enemies/projectiles
    gameState.enemies = [];
    gameState.projectiles = [];

    // Redraw the map so it doesn't disappear
    drawGridTiles(ctx);
    drawStartEnd(ctx, waveState.path, gridSize);

    // Show overlay
    const overlay = document.getElementById("gameOverOverlay");
    overlay.classList.remove("hidden");

    // Hide HUD wave text and countdown

    if (waveTextEl) waveTextEl.style.display = "none";

    const skipButton = document.getElementById("skipButton");
    if (skipButton) skipButton.style.display = "none";

    // Retry button logic
    const retryBtn = document.getElementById("retryButton");
    retryBtn.onclick = () => {
        overlay.classList.add("hidden");

        if (waveTextEl) waveTextEl.style.display = "block";
        if (skipButton) skipButton.style.display = "block";

        // Reset game state and redraw map
        resetGame(gameState, ctx, canvas);
        drawGridTiles(ctx);
        drawStartEnd(ctx, waveState.path, gridSize);
    };
}


// ======================
// HELPER: DRAW ENTIRE GRID
// ======================
export function drawEntireGrid(ctx, gridSize, gridOccupied, pathOccupied) {
    for (let col = 0; col < gridCols; col++) {
        for (let row = 0; row < gridRows; row++) {
            const x = col * gridSize;
            const y = row * gridSize;
            const key = `${col},${row}`;

            // Draw grass first
            if (grassTile.complete) { 
                ctx.drawImage(grassTile, x, y, gridSize, gridSize);
            } else {
                ctx.fillStyle = "#6b8e23"; // fallback
                ctx.fillRect(x, y, gridSize, gridSize);
            }

            // Optionally, draw path overlay
            if (pathOccupied.includes(key)) {
                ctx.fillStyle = "rgba(170,170,170,0.5)"; // light overlay for path
                ctx.fillRect(x, y, gridSize, gridSize);
            }
        }
    }
}


export function resetGame(gameState, ctx, canvas) {
    console.log("🌀 resetGame() called");

    // === CLEAR EVERYTHING ===
    window.hoveredEnemy = null;
    window.hoveredTower = null;


    waveState.currentWave = 0;
    waveState.status = "idle";
    waveState.countdown = 40;
    waveState.countdownInterval = null;

    gameState.enemies = [];
    gameState.projectiles = [];
    gameState.towers = [];
    gameState.money = 90;
    gameState.lives = 10;
    gameState.score = 0;
    gameState.difficulty = null;

    console.log("🌀 Reset arrays:");
    console.log("Enemies:", gameState.enemies);
    console.log("Projectiles:", gameState.projectiles);
    console.log("Towers:", gameState.towers);

    // Reset grid
    for (let col = 0; col < gridCols; col++) {
        for (let row = 0; row < gridRows; row++) {
            window.gridOccupied[col][row] = false;
        }
    }

    // Show difficulty menu
    showDifficultyMenu();
    console.log("Difficulty after reset:", gameState.difficulty); // null

    // ✅ Clear selection state / rebuild path / redraw grid
    window.selectedTower = null;
    window.selectedTowerType = null;
    window.selectedTowerCost = null;

    const { pathOccupied: newPathOccupied, pixelPath } = buildPath(pathCells, gridSize);
    waveState.path = pixelPath;
    window.pathOccupied = newPathOccupied;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGridTiles(ctx);
    drawStartEnd(ctx, waveState.path, gridSize);

    // UPDATE CURSOR
    applyCursor();

    console.log("resetGame() completed ✅");
}




// =========================
// GAME LOOP
// =========================
export let rafId = null;

export function startGameLoop(ctx, canvas, gameState, hud) {
    if (rafId !== null) return; // already running

    let lastTimestamp = 0;

    function loop(timestamp = 0) {
        const deltaTime = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        // Tiles not ready
        if (tilesReady < 1 + Object.keys(roadImages).length) {
            rafId = requestAnimationFrame(loop);
            return;
        }

        // Game over
        if (gameState.lives <= 0) {
            showGameOver(gameState, ctx, canvas);
            rafId = null; // stop loop
            return;
        }

        // Game paused
        if (window.gamePaused) {
            rafId = requestAnimationFrame(loop);
            return;
        }

        // Clear canvas & draw everything
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGridTiles(ctx);
        drawStartEnd(ctx, waveState.path, gridSize);

        // --- DRAW TOWERS ---
        gameState.towers.forEach(tower => {
            tower.update(gameState);  // Make sure this is called for every tower
            tower.draw();             // Then draw the tower
        });

        // --- UPDATE PROJECTILES ---
        gameState.projectiles.forEach(projectile => {
            projectile.update(gameState);
            projectile.draw();
        });
        
        // Remove dead projectiles
        gameState.projectiles = gameState.projectiles.filter(projectile => !projectile.remove);

        // --- DRAW ENEMIES ---
        // Game loop update logic (where enemies are processed)
        gameState.enemies.forEach(enemy => {
            enemy.update(gameState);  // Update the enemy's position, health, etc.
            enemy.draw();             // Draw the enemy on the canvas
        });

        // Remove dead enemies
        gameState.enemies = gameState.enemies.filter(enemy => !enemy.dead);
        

        updateWaveCompletion(gameState, gridSize, ctx, canvas, waveTextEl);

        // --- DRAW GHOST TOWER IF PLACING ---
        if (window.selectedTowerType) {
            const mouseX = window.mouseX ?? 0;
            const mouseY = window.mouseY ?? 0;
            window.drawGhostTower?.(mouseX, mouseY, window.selectedTowerType, gridSize);
        }
        
        // --- UPDATE HUD ---
        hud.updateMoneyLives();

        // --- UPDATE CURSOR ---
        applyCursor();

        rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
}

export function stopGameLoop() {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
}


// =========================
// START FIRST WAVE
// =========================
export function startGameWaves(gameState, ctx, canvas) {

    const skipButton = document.getElementById("skipButton");
    if (skipButton) {
        skipButton.style.display = "block";
        skipButton.disabled = false;
    }

    startNextWave(gameState, gridSize, ctx, canvas, waveTextEl);
    updateWavePreview();
}
