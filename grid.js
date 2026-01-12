export let gridCols;
export let gridRows;
export let gridSize;
export let gridOccupied;

/**
 * Initializes the grid system.
 * Call this ONCE from main.js after canvas is ready.
 */
export function initGrid(canvas, cols, rows) {
    gridCols = cols;
    gridRows = rows;

    // Step 1: calculate integer cell size (floor ensures no fractional pixels)
    const cellSizeX = Math.floor(canvas.width / gridCols);
    const cellSizeY = Math.floor(canvas.height / gridRows);
    gridSize = Math.min(cellSizeX, cellSizeY);

    // Step 2: snap canvas size to exact grid dimensions
    canvas.width = gridCols * gridSize;
    canvas.height = gridRows * gridSize;

    // Step 3: create occupancy array
    gridOccupied = Array.from({ length: gridCols }, () =>
        Array(gridRows).fill(false)
    );
}

/**
 * Helpers (used by placement, selling, etc.)
 */
export function isCellOccupied(col, row) {
    return gridOccupied[col]?.[row];
}

export function occupyCell(col, row) {
    if (gridOccupied[col]) {
        gridOccupied[col][row] = true;
    }
}

export function freeCell(col, row) {
    if (gridOccupied[col]) {
        gridOccupied[col][row] = false;
    }
}
