export function gameLoop(ctx, canvas, gridCols, gridRows, gridSize, gameState, hud) {
    // Check game over first
    if (gameState.lives <= 0) {
        alert("Game Over!");
        return; // stop the loop
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // --- Ghost tower (visual only) ---
    // --- Ghost tower (visual only) ---
// --- Ghost tower (visual only) ---
if (window.selectedTowerType) {
    const col = Math.floor(window.mouseX / gridSize);
    const row = Math.floor(window.mouseY / gridSize);

    const cellKey = `${col},${row}`;
    const validPlacement =
        window.gridOccupied[col] &&
        window.gridOccupied[col][row] === false &&
        !window.pathOccupied.includes(cellKey);

    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = validPlacement ? "cyan" : "red";

    ctx.beginPath();
    ctx.arc(
        col * gridSize + gridSize / 2,
        row * gridSize + gridSize / 2,
        10,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
}


  

    // Draw grid lines
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

    // Update and draw enemies
    gameState.enemies.forEach(enemy => {
        enemy.update(gameState);
        enemy.draw();
    });

    // Cleanup enemies and give money for killed ones
    gameState.enemies = gameState.enemies.filter(enemy => {
        if (enemy.remove) {
            if (!enemy.escaped) {
                gameState.money += enemy.reward || 1; // only give money for kills
            }
            return false; // remove from array
        }
        return true; // keep alive
    });


    // Update and draw towers
    gameState.towers.forEach(tower => {
        tower.update(gameState);
        tower.draw();
    });

    // Update and draw projectiles
    gameState.projectiles.forEach(p => {
        p.update();
        p.draw();
    });

    // Cleanup projectiles
    gameState.projectiles = gameState.projectiles.filter(p => !p.hit);

    // Update HUD
    if (hud) hud.update();

    // Continue the loop
    requestAnimationFrame(() =>
        gameLoop(ctx, canvas, gridCols, gridRows, gridSize, gameState, hud)
    );
}
