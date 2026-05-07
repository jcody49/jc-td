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
import { AntiAirTower } from './towers/AntiAir.js';
import { DetectionTower } from './towers/DetectionTower.js';

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
    case "Frost":  return 125;
    case "Acid":   return 125;
    case "Tank":   return 125;
    case "AntiAir": return 125;
    case "Detection": return 150;
    default:       return 0;
  }
}

// ======================
// DRAW GHOST TOWER
// ======================

// towerPlacement.js

export function drawGhostTower(mouseX, mouseY, selectedTowerType, gridSize) {
  const ctx = canvas.getContext("2d");
  ctx.save();

  // Convert mouse position to grid coordinates
  const col = Math.floor(mouseX / gridSize);
  const row = Math.floor(mouseY / gridSize);
  const key = `${col},${row}`;

  // Check if placement is valid (not occupied and enough money)
  let color = "rgba(0,255,0,0.4)"; // Green (valid)
  if (
    gridOccupied[col]?.[row] ||  // Check if grid cell is occupied
    pathOccupied.includes(key) || // Check if the path is occupied
    gameState.money < window.selectedTowerCost // Check if the player has enough money
  ) {
    color = "rgba(255,0,0,0.4)"; // Red if invalid
  }

  // Draw the square (ghost tower placeholder)
  ctx.fillStyle = color;
  ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);

  // Get the correct range based on the selected tower type
  const range = getBaseRange(selectedTowerType); // <-- Use selectedTowerType here
  const centerX = col * gridSize + gridSize / 2;
  const centerY = row * gridSize + gridSize / 2;

  // Draw the range circle (arc)
  ctx.strokeStyle = "rgba(0,255,255,0.5)"; // Light cyan color for the range ring
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, range, 0, Math.PI * 2); // Create the range circle
  ctx.stroke(); // Actually draw the arc

  // Get the correct tower image based on the selected tower type
  const towerImage = getTowerImage(selectedTowerType);
  if (!towerImage) {
    console.error("No tower image found for:", selectedTowerType);
    ctx.restore();
    return;
  }

  // Set the global alpha for the ghost effect (semi-transparent)
  ctx.globalAlpha = 0.5; // 50% opacity for ghost effect

  // Draw the ghost tower image centered within the grid cell
  ctx.drawImage(
    towerImage,
    col * gridSize, // x position (left corner)
    row * gridSize, // y position (top corner)
    gridSize, // width of the image (matches grid size)
    gridSize // height of the image (matches grid size)
  );

  // Restore the context state to remove globalAlpha effect for other drawings
  ctx.restore();
}

// Function to get the image for the selected tower type
// Modify to use global images set in the game engine
function getTowerImage(towerType) {

  switch (towerType) {
    case "Cannon":
      return window.cannonImg;  // Use global cannonImg
    case "Frost":
      return window.frostImg;  // Use global frostImg
    case "Acid":
      return window.acidImg;  // Use global acidImg
    case "Tank":
      return window.tankImg;  // Use global tankImg
    case "AntiAir":
      return window.antiAirImg;
    case "Detection":
      return window.detectionImg;
    default:
      console.error("Unknown tower type:", towerType);  // Log error if no match
      return null;  // Return null if no valid type is found
  }
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
      case "AntiAir":
        newTower = new AntiAirTower({
          x: px,
          y: py,
          ctx: canvas.getContext("2d")
        });
        break;
      case "Detection":
        newTower = new DetectionTower({
          x: px,
          y: py,
          ctx: canvas.getContext("2d")
        });
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
