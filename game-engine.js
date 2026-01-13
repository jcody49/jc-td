// game-engine.js
import { showMoneyPopup } from './ui-effects.js';
import { pathCells } from './pathing.js';
import { gridCols, gridRows, gridSize } from './grid.js';
import { updateWaveCompletion, startWave, startNextWave, waveState } from './waveManager.js';

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

// base
loadRoadTile('horizontal', 'assets/road-tile-horizontal.png');
loadRoadTile('vertical',   'assets/road-tile-vertical.png');

// corners (ENTER → EXIT)
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
// GAME LOOP
// =========================
export function gameLoop(ctx, canvas, gameState, hud, path, skipButton) {

    const mouseX = window.mouseX || 0;
    const mouseY = window.mouseY || 0;

    if (tilesReady < 1 + Object.keys(roadImages).length) {
        requestAnimationFrame(() => gameLoop(ctx, canvas, gameState, hud));
        return;
    }

    if (gameState.lives <= 0) {
        alert("Game Over!");
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // tiles
    drawGridTiles(ctx);

    // --- GHOST TOWER ---
    if (window.selectedTowerType) {
        let col = Math.floor(mouseX / gridSize);
        let row = Math.floor(mouseY / gridSize);

        col = Math.max(0, Math.min(col, gridCols - 1));
        row = Math.max(0, Math.min(row, gridRows - 1));

        const validPlacement =
            !window.gridOccupied[col][row] &&
            !pathCells.some(c => c.col === col && c.row === row);

        let img;
        if (window.selectedTowerType === 'Cannon') img = cannonImg;
        if (window.selectedTowerType === 'Frost')  img = frostImg;
        if (window.selectedTowerType === 'Acid')   img = acidImg;
        if (window.selectedTowerType === 'Tank')   img = tankImg;

        if (img) {
            ctx.save();
            ctx.globalAlpha = 0.35;

            if (!validPlacement) {
                ctx.fillStyle = 'red';
                ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
            }

            ctx.drawImage(
                img,
                col * gridSize,
                row * gridSize,
                gridSize,
                gridSize
            );

            ctx.restore();
        }
    }

    // --- SELECTED TOWER HIGHLIGHT ---
    if (window.selectedTower) {
        const t = window.selectedTower;
        const col = Math.floor(t.x / gridSize);
        const row = Math.floor(t.y / gridSize);

        ctx.fillStyle = 'rgba(128,0,128,0.5)';
        ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
    }

    // --- ENEMIES ---
    gameState.enemies.forEach(e => {
        e.update(gameState);
        e.draw();
    });

    gameState.enemies = gameState.enemies.filter(e => {
        if (!e.remove) return true;

        if (!e.escaped) {
            const reward = e.reward || 1;
            gameState.money += reward;
            showMoneyPopup(reward, e.x, e.y);
        }

        return false;
    });

    // --- WAVE MANAGEMENT ---
    const waveTextEl = document.getElementById("waveText"); // ensure you have this in DOM
    updateWaveCompletion(gameState, path, gridSize, ctx, canvas, waveTextEl, skipButton);


    // --- TOWERS ---
    gameState.towers.forEach(t => {
        t.isHovered = Math.hypot(mouseX - t.x, mouseY - t.y) < 25;
        t.update(gameState);
        t.draw();
    });

    // --- PROJECTILES ---
    gameState.projectiles.forEach(p => {
        p.update(gameState);
        p.draw();
    });
    gameState.projectiles = gameState.projectiles.filter(p => !p.hit);

    // --- HUD ---
    if (hud?.updateMoneyLives) hud.updateMoneyLives();
    if (hud?.update) hud.update();

    requestAnimationFrame(() => gameLoop(ctx, canvas, gameState, hud));
}

// =========================
// START FIRST WAVE
// =========================
export function startGameWaves(gameState, ctx, canvas) {
    const waveTextEl = document.getElementById("waveText");
    startNextWave(gameState, pathCells, gridSize, ctx, canvas, waveTextEl);
}
