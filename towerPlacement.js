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
  // GLOBAL SELECTION STATE
  // ======================
  window.selectedTowerType = null;
  window.selectedTowerCost = null;
  window.selectedTower = null;

  canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // ======================
    // SELECT EXISTING TOWER
    // ======================
    const existingTower = getTowerAtPosition(
      gameState.towers,
      x,
      y,
      gridSize
    );

    if (existingTower) {
      window.selectedTower = existingTower;
      hud.showTowerModal(existingTower);
      return;
    }

    // ======================
    // PLACE NEW TOWER
    // ======================
    if (!window.selectedTowerType) return;

    // 🔒 HARD SAFETY: cost must exist
    if (typeof window.selectedTowerCost !== "number") return;

    const col = Math.floor(x / gridSize);
    const row = Math.floor(y / gridSize);
    const key = `${col},${row}`;

    if (gridOccupied[col][row]) return;
    if (pathOccupied.includes(key)) return;

    // 💰 CHECK FUNDS
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

    // ======================
    // 💰 DEDUCT MONEY (SAFE)
    // ======================
    gameState.money -= window.selectedTowerCost;
    hud.updateMoneyLives();

    // ======================
    // COMMIT TOWER
    // ======================
    gameState.towers.push(newTower);
    gridOccupied[col][row] = true;

    // ======================
    // CLEAR PLACEMENT STATE
    // ======================
    window.selectedTowerType = null;
    window.selectedTowerCost = null;

    hud.update?.();
  });
}
