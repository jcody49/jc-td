// cursor.js

let cursorMode = "default"; // "default" | "hover" | "attack"
let cursorEl = null;
let cursorImg = null;
let gameState = null;

// =========================
// IMAGE PATHS
// =========================
const CURSOR_DEFAULT = "../assets/cursor-default.png";     // default everywhere
const CURSOR_HOVER   = "../assets/select-crosshair.png";  // hover over towers/enemies
const CURSOR_ATTACK  = "../assets/crosshair.png";         // red attack

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
    window.mouseX = e.clientX - rect.left;
    window.mouseY = e.clientY - rect.top;

    // hover detection over enemies or towers
    const hoveredEnemy = getHoveredEnemy(gameState.enemies, window.mouseX, window.mouseY, 65);
    const hoveredTower = getTowerAtPosition(gameState.towers, window.mouseX, window.mouseY, gameState.gridSize);

    if (cursorMode !== "attack" && !window.selectedTowerType) {
      if (hoveredEnemy || hoveredTower) {
        cursorMode = "hover";
      } else {
        cursorMode = "default";
      }
    }

    applyCursor();
  });

  animate();
}

// =========================
// SET / GET MODE
// =========================
export function setCursorMode(mode) {
  console.log("[cursor] setCursorMode:", mode);
  cursorMode = mode;
  applyCursor();
}

export function getCursorMode() {
  return cursorMode;
}

// =========================
// APPLY CURSOR IMAGE / STATE
// =========================
function applyCursor() {
  if (!cursorEl || !cursorImg) return;

  cursorEl.style.display = "block";
  cursorEl.className = "";
  let scale = 1;

  if (cursorMode === "attack") {
    cursorImg.src = CURSOR_ATTACK;
    cursorEl.style.opacity = "1";

    // scale up if hovering enemy
    if (gameState) {
      const enemy = gameState.enemies?.find(e => {
        return Math.hypot((window.mouseX || 0) - e.x, (window.mouseY || 0) - e.y) < 50;
      });
      if (enemy) scale = 1.3;
      console.log("[cursor] attack hover over enemy:", !!enemy);
    }

  } else if (cursorMode === "hover") {
    cursorImg.src = CURSOR_HOVER;
    cursorEl.style.opacity = "1";
  } else {
    cursorImg.src = CURSOR_DEFAULT;
    cursorEl.style.opacity = "1";
  }

  cursorEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

// =========================
// ANIMATE CURSOR ROTATION
// =========================
let angle = 0;
function animate() {
  if (cursorEl) {
    angle += 2;
    const scale = 1; // scale handled in applyCursor
    cursorEl.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`;
  }
  requestAnimationFrame(animate);
}

// =========================
// UTILITY: Check Hover Functions
// =========================
function getHoveredEnemy(enemies, x, y, radius) {
  return enemies.find(e => Math.hypot(e.x - x, e.y - y) < radius);
}

function getTowerAtPosition(towers, x, y, size) {
  return towers.find(t => Math.hypot(t.x - x, t.y - y) < size/2);
}
