/**********************
 * MATH
 **********************/
export function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }
  
  /**********************
   * ENEMY HOVER
   **********************/
  export function getHoveredEnemy(enemies, mouseX, mouseY, radius = 30) {
    for (const en of enemies) {
        const width = en.width ?? 40;
        const height = en.height ?? 40;

        // match visual center (drawY)
        const lift = en.gridSize * 0.1;
        const visualY = en.y - lift + (en.yOffset ?? 0);
        const visualX = en.x; // x is already centered

        const halfWidth = width / 2;
        const halfHeight = height / 2;

        // Rectangle hover check
        if (
            mouseX >= visualX - halfWidth &&
            mouseX <= visualX + halfWidth &&
            mouseY >= visualY - halfHeight &&
            mouseY <= visualY + halfHeight
        ) {
            return en;
        }

        // Circle check as fallback
        const dx = mouseX - visualX;
        const dy = mouseY - visualY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= radius) {
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