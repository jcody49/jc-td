/**********************
 * MATH
 **********************/
export function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }
  
  /**********************
   * ENEMY HOVER
   **********************/
  // hover detection: check mouse over enemy visually
  export function getHoveredEnemy(enemies, mouseX, mouseY, radius = 30) {
    for (const en of enemies) {
        const width = en.width ?? 40;   // default width if undefined
        const height = en.height ?? 40; // default height if undefined

        // Check if mouse is over enemy rectangle
        if (mouseX >= en.x && mouseX <= en.x + width &&
            mouseY >= en.y && mouseY <= en.y + height) {
            return en;
        }

        // Optional: circle check around enemy center
        const centerX = en.x + width / 2;
        const centerY = en.y + height / 2;
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= radius) {
          console.log("Hovered enemy (radius):", en);
            return en;
        }
    }
    return null;
}

  /* delete the getHoveredEnemy function below once attack logic and enemy hover logic are fully stable again */
  /*
  export function getHoveredEnemy(enemies, x, y, radius = 55) {
    let closest = null;
    let closestDist = Infinity;
  
    for (const en of enemies) {
      const d = distance(en, { x, y });
      if (d < radius && d < closestDist) {
        closest = en;
        closestDist = d;
      }
    }
  
    return closest;
  }
  */
  
  /**********************
   * TOWER LOOKUP
   **********************/
  export function getTowerAtPosition(towers, x, y, gridSize) {
    for (const tower of towers) {
      const size = gridSize * 0.8;
      if (
        x >= tower.x - size / 2 &&
        x <= tower.x + size / 2 &&
        y >= tower.y - size / 2 &&
        y <= tower.y + size / 2
      ) {
        return tower;
      }
    }
    return null;
  }