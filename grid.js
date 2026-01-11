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

    const gridSizeX = canvas.width / gridCols;
    const gridSizeY = canvas.height / gridRows;
    gridSize = Math.min(gridSizeX, gridSizeY);

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
