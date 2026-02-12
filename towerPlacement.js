// towerPlacement.js
import { canvas } from './canvas.js';
import { gridOccupied } from './grid.js';
import { pathOccupied } from './pathing.js';
import { getTowerAtPosition } from './utils.js';
import { gameState } from './gameState.js';

import { CannonTower } from './towers/CannonTower.js';
import { FrostTower } from './towers/FrostTower.js';
import { AcidTower } from './towers/AcidTower.js';
import { TankTower } from './towers/TankTower.js';

// ======================
// GLOBAL SELECTION STATE
// ======================
window.selectedTowerType = null;
window.selectedTowerCost = null;
window.selectedTower = null;

// ======================
// HELPER: BASE RANGE
// ======================
function getBaseRange(towerType) {
  switch (towerType) {
    case "Cannon": return 125;
    case "Frost":  return 117;
    case "Acid":   return 120;
    case "Tank":   return 125;
    default:       return 0;
  }
}

// ======================
// DRAW GHOST TOWER
// ======================
export function drawGhostTower(x, y, towerType, gridSize) {
  const ctx = canvas.getContext("2d");
  ctx.save();

  const col = Math.floor(x / gridSize);
  const row = Math.floor(y / gridSize);
  const key = `${col},${row}`;

  // Red if invalid, green if valid
  let color = "rgba(0,255,0,0.4)";
  if (
    gridOccupied[col]?.[row] ||
    pathOccupied.includes(key) ||
    gameState.money < window.selectedTowerCost
  ) {
    color = "rgba(255,0,0,0.4)";
  }

  // Draw the square
  ctx.fillStyle = color;
  ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);

  // Draw tower range
  const range = getBaseRange(towerType);
  const centerX = col * gridSize + gridSize / 2;
  const centerY = row * gridSize + gridSize / 2;

  ctx.strokeStyle = "rgba(0,255,255,0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, range, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// Make it globally accessible so the game loop can use it
window.drawGhostTower = drawGhostTower;

// ======================
// MOUSE TRACKING
// ======================
canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  window.mouseX = (e.clientX - rect.left) * scaleX;
  window.mouseY = (e.clientY - rect.top) * scaleY;
});

// ======================
// TOWER PLACEMENT
// ======================
export function setupTowerPlacement({ hud, gridSize }) {

  canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Check if clicking an existing tower
    const existingTower = getTowerAtPosition(gameState.towers, x, y, gridSize);
    if (existingTower) {
      window.selectedTower = existingTower;
      hud.showTowerModal(existingTower);
      return;
    }

    // No tower selected
    if (!window.selectedTowerType) return;
    if (typeof window.selectedTowerCost !== "number") return;

    const col = Math.floor(x / gridSize);
    const row = Math.floor(y / gridSize);
    const key = `${col},${row}`;

    // Invalid placement
    if (gridOccupied[col]?.[row]) return;
    if (pathOccupied.includes(key)) return;
    if (gameState.money < window.selectedTowerCost) return;

    // Calculate center position for tower
    const px = col * gridSize + gridSize / 2;
    const py = row * gridSize + gridSize / 2;

    // Create tower instance
    let newTower = null;
    switch (window.selectedTowerType) {
      case "Cannon":
        newTower = new CannonTower({ x: px, y: py, ctx: canvas.getContext("2d") });
        break;
      case "Frost":
        newTower = new FrostTower({ x: px, y: py, ctx: canvas.getContext("2d") });
        break;
      case "Acid":
        newTower = new AcidTower({ x: px, y: py, ctx: canvas.getContext("2d") });
        break;
      case "Tank":
        newTower = new TankTower({ x: px, y: py, ctx: canvas.getContext("2d") });
        break;
    }

    if (!newTower) return;

    // Deduct money
    gameState.money -= window.selectedTowerCost;
    hud.updateMoneyLives();

    // Add tower to game state and mark grid occupied
    gameState.towers.push(newTower);
    gridOccupied[col][row] = true;

    // Clear selection
    window.selectedTowerType = null;
    window.selectedTowerCost = null;

    hud.update?.();
  });
}
