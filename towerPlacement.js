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
  window.selectedTowerType = null;
  window.selectedTower = null;

  canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // SELECT EXISTING TOWER
    const tower = getTowerAtPosition(gameState.towers, x, y, gridSize);
    if (tower) {
      window.selectedTower = tower;
      hud.showTowerModal(tower);
      return;
    }

    // PLACE NEW TOWER
    if (!window.selectedTowerType) return;

    const col = Math.floor(x / gridSize);
    const row = Math.floor(y / gridSize);
    const key = `${col},${row}`;

    if (gridOccupied[col][row] || pathOccupied.includes(key)) return;

    const px = col * gridSize + gridSize / 2;
    const py = row * gridSize + gridSize / 2;

    let newTower;
    switch (window.selectedTowerType) {
      case "Cannon": newTower = new CannonTower({ x: px, y: py, ctx: canvas.getContext("2d") }); break;
      case "Frost": newTower = new FrostTower({ x: px, y: py, ctx: canvas.getContext("2d") }); break;
      case "Acid": newTower = new AcidTower({ x: px, y: py, ctx: canvas.getContext("2d") }); break;
      case "Tank": newTower = new TankTower({ x: px, y: py, ctx: canvas.getContext("2d") }); break;
    }

    if (newTower) {
      gameState.towers.push(newTower);
      gridOccupied[col][row] = true;
      window.selectedTowerType = null;
      hud.update?.();
    }
  });
}
