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

export function setupTowerPlacement({ hud, gridSize }) {
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
  // GLOBAL SELECTION STATE
  // ======================
  window.selectedTowerType = null;
  window.selectedTowerCost = null;
  window.selectedTower = null;

  // ======================
  // DRAWING HELPERS
  // ======================
  function drawGhostTower(x, y, towerType) {
    const ctx = canvas.getContext("2d");
    ctx.save();

    // determine square color
    const col = Math.floor(x / gridSize);
    const row = Math.floor(y / gridSize);
    const key = `${col},${row}`;

    let color = "rgba(0,255,0,0.4)";
    if (gridOccupied[col]?.[row] || pathOccupied.includes(key) || gameState.money < window.selectedTowerCost) {
      color = "rgba(255,0,0,0.4)";
    }

    // draw ghost square
    ctx.fillStyle = color;
    ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);

    // draw range circle
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

  // ======================
  // MOUSE MOVE
  // ======================
  canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    window.mouseX = mouseX;
    window.mouseY = mouseY;

    // redraw tower placement ghost
    if (window.selectedTowerType) {
      // clear canvas or just the overlay layer if you have one
      // canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      drawGhostTower(mouseX, mouseY, window.selectedTowerType);
    }
  });

  // ======================
  // MOUSE CLICK (PLACE TOWER)
  // ======================
  canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // SELECT EXISTING TOWER
    const existingTower = getTowerAtPosition(gameState.towers, x, y, gridSize);
    if (existingTower) {
      window.selectedTower = existingTower;
      hud.showTowerModal(existingTower);
      return;
    }

    // NO TOWER SELECTED FOR PLACEMENT
    if (!window.selectedTowerType) return;

    // SAFETY: cost must exist
    if (typeof window.selectedTowerCost !== "number") return;

    const col = Math.floor(x / gridSize);
    const row = Math.floor(y / gridSize);
    const key = `${col},${row}`;

    if (gridOccupied[col]?.[row]) return;
    if (pathOccupied.includes(key)) return;
    if (gameState.money < window.selectedTowerCost) return;

    const px = col * gridSize + gridSize / 2;
    const py = row * gridSize + gridSize / 2;

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

    // deduct money
    gameState.money -= window.selectedTowerCost;
    hud.updateMoneyLives();

    // commit tower
    gameState.towers.push(newTower);
    gridOccupied[col][row] = true;

    // clear selection state
    window.selectedTowerType = null;
    window.selectedTowerCost = null;

    hud.update?.();
  });
}
