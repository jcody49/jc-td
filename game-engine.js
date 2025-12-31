export function gameLoop(ctx, canvas, gridCols, gridRows, gridSize, gameState) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
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
  
    // enemies
    gameState.enemies.forEach(enemy => {
      enemy.update();
      enemy.draw();
    });
  
    // towers
    gameState.towers.forEach(tower => {
      tower.update();
      tower.draw();
    });
  
    // projectiles
    gameState.projectiles.forEach(p => {
      p.update();
      p.draw();
    });
  
    // cleanup
    gameState.projectiles = gameState.projectiles.filter(p => !p.hit);
    gameState.enemies = gameState.enemies.filter(e => e.hp > 0);
  
    requestAnimationFrame(() => gameLoop(ctx, canvas, gridCols, gridRows, gridSize, gameState));
  }
  