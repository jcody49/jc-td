// ======================
// pathing.js
// ======================

/*
  IMPORTANT CONVENTION (LOCK THIS IN):

  roadType means:
  - how the road CONNECTS in this cell
  - NOT where it came from historically
  - NOT inferred
  - EXPLICIT ONLY

  Allowed values (must match renderer exactly):

  horizontal
  vertical
  cornerLU  // connects Left + Up
  cornerUR  // connects Up + Right
  cornerDR  // connects Down + Right
  cornerLD  // connects Left + Down
*/

// ======================
// PATH GRID CELLS
// ======================
export const pathCells = [
    // ---- start: horizontal ----
    { col: 0, row: 7, roadType: 'horizontal' },
    { col: 1, row: 7, roadType: 'horizontal' },
    { col: 2, row: 7, roadType: 'horizontal' },
    { col: 3, row: 7, roadType: 'horizontal' },
  
    // turn: left -> up
    { col: 4, row: 7, roadType: 'cornerLU' },
  
    // ---- vertical up ----
    { col: 4, row: 6, roadType: 'vertical' },
    { col: 4, row: 5, roadType: 'vertical' },
    { col: 4, row: 4, roadType: 'vertical' },
  
    // turn: up -> right
    { col: 4, row: 3, roadType: 'cornerDR' },
  
    // ---- horizontal right ----
    { col: 5, row: 3, roadType: 'horizontal' },
    { col: 6, row: 3, roadType: 'cornerLD' },
  
    // ---- vertical down ----
    { col: 6, row: 4, roadType: 'vertical' },
    { col: 6, row: 5, roadType: 'vertical' },
    { col: 6, row: 6, roadType: 'vertical' },
    { col: 6, row: 7, roadType: 'vertical' },
    { col: 6, row: 8, roadType: 'vertical' },
    { col: 6, row: 9, roadType: 'vertical' },
    { col: 6, row: 10, roadType: 'vertical' },
  
    // turn: down -> right
    { col: 6, row: 11, roadType: 'cornerUR' },
  
    // ---- horizontal right ----
    { col: 7, row: 11, roadType: 'horizontal' },
    { col: 8, row: 11, roadType: 'cornerLU' },
  
    // ---- vertical up ----
    { col: 8, row: 10, roadType: 'vertical' },
    { col: 8, row: 9, roadType: 'vertical' },
    { col: 8, row: 8, roadType: 'vertical' },
    { col: 8, row: 7, roadType: 'vertical' },
    { col: 8, row: 6, roadType: 'vertical' },
    { col: 8, row: 5, roadType: 'vertical' },
    { col: 8, row: 4, roadType: 'vertical' },
  
    // turn: up -> right
    { col: 8, row: 3, roadType: 'cornerDR' },
  
    // ---- penultimate horizontal ----
    { col: 9,  row: 3, roadType: 'horizontal' },
    { col: 10, row: 3, roadType: 'cornerLD' },

    //--LAST DOWN--//
    { col: 10, row: 4, roadType: 'vertical' },
    { col: 10, row: 5, roadType: 'vertical' },
    { col: 10, row: 6, roadType: 'vertical' },
    { col: 10, row: 7, roadType: 'cornerUR' },

    //LAST HORIZONTAL//
    { col: 11, row: 7, roadType: 'horizontal' },
    { col: 12, row: 7, roadType: 'horizontal' },
    { col: 13, row: 7, roadType: 'horizontal' },
    { col: 14, row: 7, roadType: 'horizontal' },
    { col: 15, row: 7, roadType: 'horizontal' },
    { col: 16, row: 7, roadType: 'horizontal' },
    { col: 17, row: 7, roadType: 'horizontal' },
    { col: 18, row: 7, roadType: 'horizontal' },
    { col: 19, row: 7, roadType: 'horizontal' },
    { col: 20, row: 7, roadType: 'horizontal' },
    { col: 21, row: 7, roadType: 'horizontal' },
    { col: 22, row: 7, roadType: 'horizontal' },
    { col: 23, row: 7, roadType: 'horizontal' },
    { col: 24, row: 7, roadType: 'horizontal' }
  ];
  
  // ======================
  // PATH OCCUPANCY (for blocking)
  // ======================
  export const pathOccupied = pathCells.map(c => `${c.col},${c.row}`);
  
  // ======================
  // BUILD PIXEL PATH (enemy movement)
  // ======================
  export function buildPath(pathCells, gridSize) {
    const pixelPath = [];
  
    pathCells.forEach(c => {
      pixelPath.push({
        col: c.col,
        row: c.row,
        x: c.col * gridSize + gridSize / 2,
        y: c.row * gridSize + gridSize / 2
      });
    });
  
    return pixelPath;
  }
  