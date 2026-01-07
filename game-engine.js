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
// GAME LOOP
// =========================
export function gameLoop(ctx, canvas, gridCols, gridRows, gridSize, gameState, hud) {
    const mouseX = window.mouseX || 0;
    const mouseY = window.mouseY || 0;

    // Check game over
    if (gameState.lives <= 0) {
        alert("Game Over!");
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // =========================
    // GHOST TOWER (visual only)
    // =========================
    if (window.selectedTowerType) {
        let col = Math.floor(mouseX / gridSize);
        let row = Math.floor(mouseY / gridSize);

        // clamp indices to grid
        col = Math.max(0, Math.min(col, gridCols - 1));
        row = Math.max(0, Math.min(row, gridRows - 1));

        const cellKey = `${col},${row}`;
        const validPlacement = !window.gridOccupied[col][row] && !window.pathOccupied.includes(cellKey);

        let imgToDraw;
        switch (window.selectedTowerType) {
            case "Cannon": imgToDraw = cannonImg; break;
            case "Frost": imgToDraw = frostImg; break;
            case "Acid": imgToDraw = acidImg; break;
            case "Tank": imgToDraw = tankImg; break;
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
    // DRAW GRID
    // =========================
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    for (let c = 0; c < gridCols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * gridSize, 0);
        ctx.lineTo(c * gridSize, canvas.height);
        ctx.stroke();
    }
    for (let r = 0; r < gridRows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * gridSize);
        ctx.lineTo(canvas.width, r * gridSize);
        ctx.stroke();
    }

    // =========================
    // UPDATE ENEMIES
    // =========================
    gameState.enemies.forEach(enemy => {
        enemy.update(gameState);
        enemy.draw();
    });

    // Cleanup enemies & give money
    gameState.enemies = gameState.enemies.filter(enemy => {
        if (enemy.remove) {
            if (!enemy.escaped) gameState.money += enemy.reward || 1;
            return false;
        }
        return true;
    });

    // =========================
    // UPDATE TOWERS
    // =========================
    gameState.towers.forEach(tower => {
        const hoverRadius = 25; // adjust if needed
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

    // Cleanup projectiles
    gameState.projectiles = gameState.projectiles.filter(p => !p.hit);

    // =========================
    // UPDATE HUD
    // =========================
    if (hud) {
        if (hud.updateMoneyLives) hud.updateMoneyLives(); // money & lives
        if (hud.update) hud.update();                     // tower modal
    }

    // =========================
    // LOOP
    // =========================
    requestAnimationFrame(() =>
        gameLoop(ctx, canvas, gridCols, gridRows, gridSize, gameState, hud)
    );
}
