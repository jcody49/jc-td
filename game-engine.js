// game-engine.js
import { showMoneyPopup } from './ui-effects.js';
import { pathOccupied } from './pathing.js';
import { gridCols, gridRows, gridSize } from './grid.js';

// =========================
// TILE IMAGES
// =========================
const grassTile = new Image();
grassTile.src = 'assets/grass-tile.png';

const roadTile = new Image();
roadTile.src = 'assets/road-tile.png';

let tilesReady = 0;
grassTile.onload = () => tilesReady++;
roadTile.onload  = () => tilesReady++;

// =========================
// TOWER IMAGE EXPORTS
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
// TILE DRAW FUNCTION
// =========================
function drawGridTiles(ctx, gridCols, gridRows, gridSize) {
    // Skip drawing until both tile images are loaded
    if (tilesReady < 2) return;

    ctx.imageSmoothingEnabled = false;

    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            const x = col * gridSize;
            const y = row * gridSize;
            const key = `${col},${row}`;

            if (pathOccupied.includes(key)) {
                ctx.drawImage(roadTile, x, y, gridSize, gridSize);
            } else {
                ctx.drawImage(grassTile, x, y, gridSize, gridSize);
            }
        }
    }
}

// =========================
// GAME LOOP
// =========================
export function gameLoop(ctx, canvas, gridCols, gridRows, gridSize, gameState, hud) {
    const mouseX = window.mouseX || 0;
    const mouseY = window.mouseY || 0;

    // =========================
    // CHECK TILE LOAD
    // =========================
    if (tilesReady < 2) {
        // Wait until images are loaded
        requestAnimationFrame(() => gameLoop(ctx, canvas, gridCols, gridRows, gridSize, gameState, hud));
        return;
    }

    // =========================
    // CHECK GAME OVER
    // =========================
    if (gameState.lives <= 0) {
        alert("Game Over!");
        return;
    }

    // =========================
    // CLEAR CANVAS
    // =========================
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // =========================
    // DRAW GRID TILES (BACKGROUND)
    // =========================
    drawGridTiles(ctx, gridCols, gridRows, gridSize);

    // =========================
    // GHOST TOWER (MOUSE HOVER)
    // =========================
    if (window.selectedTowerType) {
        let col = Math.floor(mouseX / gridSize);
        let row = Math.floor(mouseY / gridSize);

        col = Math.max(0, Math.min(col, gridCols - 1));
        row = Math.max(0, Math.min(row, gridRows - 1));

        const cellKey = `${col},${row}`;
        const validPlacement = !window.gridOccupied[col][row] && !window.pathOccupied.includes(cellKey);

        let imgToDraw;
        switch (window.selectedTowerType) {
            case "Cannon": imgToDraw = cannonImg; break;
            case "Frost":  imgToDraw = frostImg;  break;
            case "Acid":   imgToDraw = acidImg;   break;
            case "Tank":   imgToDraw = tankImg;   break;
        }

        if (imgToDraw) {
            const centerX = col * gridSize + gridSize / 2;
            const centerY = row * gridSize + gridSize / 2;

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.globalAlpha = 0.35;

            if (!validPlacement) {
                ctx.fillStyle = "red";
                ctx.fillRect(-gridSize / 2, -gridSize / 2, gridSize, gridSize);
            }

            ctx.drawImage(imgToDraw, -gridSize / 2, -gridSize / 2, gridSize, gridSize);
            ctx.restore();
        }
    }

    // =========================
    // SELECTED TOWER HIGHLIGHT
    // =========================
    if (window.selectedTower) {
        const tower = window.selectedTower;
        const size = gridSize;

        const col = Math.floor(tower.x / gridSize);
        const row = Math.floor(tower.y / gridSize);

        ctx.fillStyle = 'rgba(128, 0, 128, 0.5)';
        ctx.fillRect(col * gridSize, row * gridSize, size, size);
    }

    // =========================
    // UPDATE ENEMIES
    // =========================
    gameState.enemies.forEach(enemy => {
        enemy.update(gameState);
        enemy.draw();
    });

    // Cleanup enemies & rewards
    gameState.enemies = gameState.enemies.filter(enemy => {
        if (enemy.remove) {
            if (!enemy.escaped) {
                const reward = enemy.reward || 1;
                gameState.money += reward;
                showMoneyPopup(reward, enemy.x, enemy.y);
            }
            return false;
        }
        return true;
    });

    // =========================
    // UPDATE TOWERS
    // =========================
    gameState.towers.forEach(tower => {
        const hoverRadius = 25;
        tower.isHovered = Math.hypot(mouseX - tower.x, mouseY - tower.y) < hoverRadius;

        tower.update(gameState);
        tower.draw();
    });

    // =========================
    // UPDATE PROJECTILES
    // =========================
    gameState.projectiles.forEach(p => {
        p.update(gameState);
        p.draw();
    });
    gameState.projectiles = gameState.projectiles.filter(p => !p.hit);

    // =========================
    // UPDATE HUD
    // =========================
    if (hud) {
        if (hud.updateMoneyLives) hud.updateMoneyLives();
        if (hud.update) hud.update();
    }

    // =========================
    // NEXT FRAME
    // =========================
    requestAnimationFrame(() => gameLoop(ctx, canvas, gridCols, gridRows, gridSize, gameState, hud));
}
