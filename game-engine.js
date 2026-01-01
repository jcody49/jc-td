export const cannonImg = new Image();
cannonImg.src = './assets/cannon.png';

export function gameLoop(ctx, canvas, gridCols, gridRows, gridSize, gameState, hud) {
    // Check game over first
    if (gameState.lives <= 0) {
        alert("Game Over!");
        return; // stop the loop
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);




// --- Ghost tower (visual only) ---
if (window.selectedTowerType === "Cannon") {
    const col = Math.floor(window.mouseX / gridSize);
    const row = Math.floor(window.mouseY / gridSize);

    const cellKey = `${col},${row}`;
    const validPlacement =
        gridOccupied[col] &&
        gridOccupied[col][row] === false &&
        !pathOccupied.includes(cellKey);

    ctx.save();

    // move origin to center of cell
    const centerX = col * gridSize + gridSize / 2;
    const centerY = row * gridSize + gridSize / 2;
    ctx.translate(centerX, centerY);

    // rotate so the cannon faces left (+90 degrees from down)
    ctx.rotate(Math.PI / 2);

    // make semi-transparent
    ctx.globalAlpha = 0.35;

    // draw red background if invalid
    if (!validPlacement) {
        ctx.fillStyle = "red";
        ctx.fillRect(-gridSize / 2, -gridSize / 2, gridSize, gridSize);
    }

    // draw the cannon image
    ctx.drawImage(
        cannonImg,
        -gridSize / 2,
        -gridSize / 2,
        gridSize,
        gridSize
    );

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
