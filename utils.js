/**********************
 * MATH
 **********************/
export function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }
  
  /**********************
   * ENEMY HOVER
   **********************/
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