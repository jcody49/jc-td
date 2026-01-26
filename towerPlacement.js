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
  console.log("[towerPlacement] setupTowerPlacement CALLED", {
    canvas,
    gridSize,
    hud
  });

  // ======================
  // HELPER: BASE RANGE
  // ======================
  function getBaseRange(towerType) {
    console.log("[towerPlacement] getBaseRange", towerType);
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

  console.log("[towerPlacement] global selection state initialized");

  // ======================
  // DRAWING HELPERS
  // ======================
  function drawGhostTower(x, y, towerType) {
    console.log("[towerPlacement] drawGhostTower ENTER", {
      x, y, towerType,
      money: gameState.money,
      cost: window.selectedTowerCost
    });

    const ctx = canvas.getContext("2d");
    ctx.save();

    const col = Math.floor(x / gridSize);
    const row = Math.floor(y / gridSize);
    const key = `${col},${row}`;

    console.log("[towerPlacement] ghost grid calc", {
      col, row, key,
      gridOccupied: gridOccupied[col]?.[row],
      pathBlocked: pathOccupied.includes(key)
    });

    let color = "rgba(0,255,0,0.4)";
    if (
      gridOccupied[col]?.[row] ||
      pathOccupied.includes(key) ||
      gameState.money < window.selectedTowerCost
    ) {
      color = "rgba(255,0,0,0.4)";
    }

    console.log("[towerPlacement] ghost color", color);

    ctx.fillStyle = color;
    ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);

    const range = getBaseRange(towerType);
    const centerX = col * gridSize + gridSize / 2;
    const centerY = row * gridSize + gridSize / 2;

    console.log("[towerPlacement] drawing range circle", {
      range, centerX, centerY
    });

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
    console.log("[towerPlacement] mousemove event fired");

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    window.mouseX = mouseX;
    window.mouseY = mouseY;

    console.log("[towerPlacement] mouse coords", {
      mouseX,
      mouseY,
      selectedTowerType: window.selectedTowerType
    });

    if (window.selectedTowerType) {
      drawGhostTower(mouseX, mouseY, window.selectedTowerType);
    }
  });

  // ======================
  // MOUSE CLICK (PLACE TOWER)
  // ======================
  canvas.addEventListener("click", e => {
    console.log("[towerPlacement] click event fired");

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    console.log("[towerPlacement] click coords", { x, y });

    const existingTower = getTowerAtPosition(gameState.towers, x, y, gridSize);
    if (existingTower) {
      console.log("[towerPlacement] existing tower selected", existingTower);
      window.selectedTower = existingTower;
      hud.showTowerModal(existingTower);
      return;
    }

    if (!window.selectedTowerType) {
      console.log("[towerPlacement] click ignored — no selectedTowerType");
      return;
    }

    if (typeof window.selectedTowerCost !== "number") {
      console.log("[towerPlacement] click ignored — invalid cost", window.selectedTowerCost);
      return;
    }

    const col = Math.floor(x / gridSize);
    const row = Math.floor(y / gridSize);
    const key = `${col},${row}`;

    console.log("[towerPlacement] placement attempt", {
      col,
      row,
      key,
      occupied: gridOccupied[col]?.[row],
      pathBlocked: pathOccupied.includes(key),
      money: gameState.money,
      cost: window.selectedTowerCost
    });

    if (gridOccupied[col]?.[row]) return;
    if (pathOccupied.includes(key)) return;
    if (gameState.money < window.selectedTowerCost) return;

    const px = col * gridSize + gridSize / 2;
    const py = row * gridSize + gridSize / 2;

    console.log("[towerPlacement] instantiating tower", {
      type: window.selectedTowerType,
      px,
      py
    });

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

    console.log("[towerPlacement] newTower result", newTower);

    if (!newTower) return;

    gameState.money -= window.selectedTowerCost;
    hud.updateMoneyLives();

    gameState.towers.push(newTower);
    gridOccupied[col][row] = true;

    console.log("[towerPlacement] tower committed", {
      remainingMoney: gameState.money,
      totalTowers: gameState.towers.length
    });

    window.selectedTowerType = null;
    window.selectedTowerCost = null;

    hud.update?.();
  });
}
