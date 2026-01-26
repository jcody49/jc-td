// cursor.js
import { getTowerAtPosition, getHoveredEnemy } from './utils.js';

let cursorMode = "default"; // "default" | "hover" | "attack"
let cursorEl = null;
let cursorImg = null;
let gameState = null;

// =========================
// IMAGE PATHS
// =========================
const CURSOR_DEFAULT = "./assets/cursor-default.png";     // default everywhere
const CURSOR_HOVER   = "./assets/select-crosshair.png";  // hover over towers/enemies
const CURSOR_ATTACK  = "./assets/crosshair.png";         // red attack

// =========================
// INIT CURSOR
// =========================
export function initCursor({ canvas, gameState: gs }) {
  console.log("[cursor] initCursor called");
  gameState = gs;

  // create cursor element
  cursorEl = document.createElement("div");
  cursorEl.id = "cursor-fx";
  cursorEl.style.position = "fixed";
  cursorEl.style.width = "50px";
  cursorEl.style.height = "50px";
  cursorEl.style.pointerEvents = "none";
  cursorEl.style.zIndex = "9999";
  cursorEl.style.opacity = "1";
  document.body.appendChild(cursorEl);

  // create image
  cursorImg = document.createElement("img");
  cursorImg.src = CURSOR_DEFAULT;
  cursorImg.style.width = "100%";
  cursorImg.style.height = "100%";
  cursorEl.appendChild(cursorImg);

  // hide system cursor
  document.body.style.cursor = "none";

  // mouse move updates cursor position
  canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    window.mouseX = mouseX;
    window.mouseY = mouseY;

    // hover detection over enemies or towers
    const hoveredEnemy = getHoveredEnemy(gameState.enemies, mouseX, mouseY, 65);
    const hoveredTower = getTowerAtPosition(gameState.towers, mouseX, mouseY, gameState.gridSize);

    // update cursor mode
    if (cursorMode !== "attack" && !window.selectedTowerType) {
      cursorMode = hoveredEnemy || hoveredTower ? "hover" : "default";
    }

    applyCursor(hoveredTower, hoveredEnemy);
  });

  animate();
}

// =========================
// SET / GET MODE
// =========================
export function setCursorMode(mode) {
  cursorMode = mode;
  applyCursor();
}

export function getCursorMode() {
  return cursorMode;
}

// =========================
// APPLY CURSOR IMAGE / STATE
// =========================
function applyCursor(hoverTower = null, hoveredEnemy = null) {
  if (!cursorEl || !cursorImg) return;

  // 1️⃣ Attack mode
  if (cursorMode === "attack") {
    cursorEl.style.display = "block";
    cursorImg.src = CURSOR_ATTACK;
    cursorEl.classList.add("active");
    return;
  }

  // 2️⃣ Tower placement mode
  if (window.selectedTowerType) {
    cursorEl.style.display = "none"; // ghost tower drawn in gameLoop
    cursorEl.classList.remove("active");
    return;
  }

  // 3️⃣ Default / hover
  cursorEl.style.display = "block";
  cursorImg.src = CURSOR_DEFAULT;
  cursorEl.classList.toggle("active", !!(hoverTower || hoveredEnemy));
}

// =========================
// ANIMATE CURSOR ROTATION
// =========================
let angle = 0;
function animate() {
  if (cursorEl) {
    angle += 2;
    cursorEl.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(1)`;
  }
  requestAnimationFrame(animate);
}
