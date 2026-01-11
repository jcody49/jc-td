/**********************
 * PATH GRID CELLS
 **********************/
export const pathCells = [
    { col: 0, row: 7 }, { col: 1, row: 7 }, { col: 2, row: 7 }, { col: 3, row: 7 }, { col: 4, row: 7 },
    { col: 4, row: 6 }, { col: 4, row: 5 }, { col: 4, row: 4 }, { col: 4, row: 3 },
    { col: 5, row: 3 }, { col: 6, row: 3 },
    { col: 6, row: 4 }, { col: 6, row: 5 }, { col: 6, row: 6 }, { col: 6, row: 7 }, { col: 6, row: 8 },
    { col: 6, row: 9 }, { col: 6, row: 10 }, { col: 6, row: 11 },
    { col: 7, row: 11 }, { col: 8, row: 11 },
    { col: 8, row: 10 }, { col: 8, row: 9 }, { col: 8, row: 8 }, { col: 8, row: 7 }, { col: 8, row: 6 },
    { col: 8, row: 5 }, { col: 8, row: 4 }, { col: 8, row: 3 },
    { col: 9, row: 3 }, { col: 10, row: 3 },
    { col: 10, row: 4 }, { col: 10, row: 5 }, { col: 10, row: 6 }, { col: 10, row: 7 },
    { col: 11, row: 7 }, { col: 12, row: 7 }, { col: 13, row: 7 }, { col: 14, row: 7 },
    { col: 15, row: 7 }, { col: 16, row: 7 }, { col: 17, row: 7 },
    { col: 18, row: 7 }, { col: 19, row: 7 }, { col: 20, row: 7 },
    { col: 21, row: 7 }, { col: 22, row: 7 }, { col: 23, row: 7 }, { col: 24, row: 7 }
  ];
  
  /**********************
   * PATH OCCUPANCY (grid blocking)
   **********************/
  export const pathOccupied = pathCells.map(c => `${c.col},${c.row}`);
  
  /**********************
   * BUILD PIXEL PATH
   **********************/
  export function buildPath(pathCells, gridSize) {
    const pathOccupied = [];
    const pixelPath = [];
  
    pathCells.forEach(c => {
      // mark this grid cell as occupied
      pathOccupied.push(`${c.col},${c.row}`);
  
      // store the pixel center for enemies
      pixelPath.push({
        x: c.col * gridSize + gridSize / 2,
        y: c.row * gridSize + gridSize / 2
      });
    });
  
    return { pathOccupied, pixelPath };
  }
  
