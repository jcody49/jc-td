/**********************
 * GRID SETTINGS
 **********************/
export const gridCols = 25;
export const gridRows = 15;

/**********************
 * GAME STATE
 **********************/
export const gameState = {
  enemies: [],
  towers: [],
  projectiles: [],
  money: 90,
  lives: 10,
  score: 0,
  difficulty: "normal"
};

/**********************
 * GRID OCCUPANCY
 **********************/
export const gridOccupied = Array.from({ length: gridCols }, () =>
  Array(gridRows).fill(false)
);