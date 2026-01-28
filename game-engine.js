// game-engine.js
import { showMoneyPopup, showLifePopup } from "./ui-effects.js";
import { pathCells } from './pathing.js';
import { gridCols, gridRows, gridSize } from './grid.js';
import { updateWaveCompletion, startWave, startNextWave, waveState, updateWavePreview } from './waveManager.js';

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
        ctx.fillText(text, x + marginX, y + gridSize + 4); // 4px below tile
        ctx.restore();
    };

    // Start label stays centered
    drawLabel(start.x, start.y, "START", "lime", 15);

    // Finish label gets margin-right 5px
    drawLabel(end.x, end.y, "FINISH", "red", -15);
}


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
export function gameLoop(ctx, canvas, gameState, hud) {
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

    if (window.gamePaused) {
        requestAnimationFrame(() => gameLoop(ctx, canvas, gameState, hud));
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- GRID & START/END ---
    drawGridTiles(ctx);
    drawStartEnd(ctx, waveState.path, gridSize);

    // --- GRID OVERLAY (optional) ---
    if (window.showGrid) {
        ctx.save();
        ctx.strokeStyle = "rgba(0,255,255,0.2)";
        for (let col = 0; col <= gridCols; col++) {
            ctx.beginPath();
            ctx.moveTo(col * gridSize, 0);
            ctx.lineTo(col * gridSize, gridRows * gridSize);
            ctx.stroke();
        }
        for (let row = 0; row <= gridRows; row++) {
            ctx.beginPath();
            ctx.moveTo(0, row * gridSize);
            ctx.lineTo(gridCols * gridSize, row * gridSize);
            ctx.stroke();
        }
        ctx.restore();
    }

    // --- GHOST TOWER ---
    if (window.selectedTowerType) {
        let col = Math.floor(mouseX / gridSize);
        let row = Math.floor(mouseY / gridSize);
        col = Math.max(0, Math.min(col, gridCols - 1));
        row = Math.max(0, Math.min(row, gridRows - 1));

        const validPlacement = !window.gridOccupied[col][row] &&
                               !pathCells.some(c => c.col === col && c.row === row);

        let img;
        switch (window.selectedTowerType) {
            case 'Cannon': img = cannonImg; break;
            case 'Frost':  img = frostImg; break;
            case 'Acid':   img = acidImg; break;
            case 'Tank':   img = tankImg; break;
        }

        if (img) {
            ctx.save();
            ctx.globalAlpha = 0.35;
            ctx.fillStyle = validPlacement ? 'rgba(0,255,0,0.3)' : 'rgba(255,0,0,0.3)';
            ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);

            const range = {
                'Cannon': 125,
                'Frost': 117,
                'Acid': 120,
                'Tank': 125
            }[window.selectedTowerType] || 0;

            const centerX = col * gridSize + gridSize / 2;
            const centerY = row * gridSize + gridSize / 2;

            ctx.strokeStyle = 'rgba(0,255,255,0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, range, 0, Math.PI * 2);
            ctx.stroke();

            ctx.drawImage(img, col * gridSize, row * gridSize, gridSize, gridSize);
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

            if (e.lifeReward > 0) {
                gameState.lives += e.lifeReward;
                showLifePopup?.(e.lifeReward, e.x, e.y);
            }

            const scoreReward = e.score || 5;
            gameState.score += scoreReward;
        }

        return false;
    });

    // --- HUD UPDATE ---
    if (hud?.updateMoneyLives) hud.updateMoneyLives();
    if (hud?.update) hud.update();

    // --- WAVE MANAGEMENT ---
    const waveTextEl = document.getElementById("waveText");
    updateWaveCompletion(gameState, gridSize, ctx, canvas, waveTextEl);

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

    requestAnimationFrame(() => gameLoop(ctx, canvas, gameState, hud));
}

// =========================
// START FIRST WAVE
// =========================
export function startGameWaves(gameState, ctx, canvas) {
    const waveTextEl = document.getElementById("waveText");
    
    const skipButton = document.getElementById("skipButton");
    if (skipButton) {
        skipButton.style.display = "block";
        skipButton.disabled = false;
    }

    startNextWave(gameState, gridSize, ctx, canvas, waveTextEl);
    updateWavePreview();
}
