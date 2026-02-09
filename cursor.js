// cursor.js
import { getTowerAtPosition, getHoveredEnemy } from './utils.js';
import { gameState } from './gameState.js';

// =========================
// IMAGE PATHS
// =========================
const CURSOR_DEFAULT       = "./assets/cursor-default.png";
const CURSOR_DEFAULT_HOVER = "./assets/cursor-default-hover.png";
const CURSOR_SELECT        = "./assets/select-crosshair.png";
const CURSOR_ATTACK        = "./assets/crosshair.png";

// =========================
// INTERNAL STATE
// =========================
let spinningCursorEl = null;
let spinningCursorImg = null;
let staticCursorEl = null;
let cursorMode = "default"; // "default" | "hover" | "attack"
let angle = 0;
let animationRAF = null;
let canvasRef = null;

// =========================
// INIT CURSOR
// =========================
export function initCursor({ canvas }) {
    canvasRef = canvas;

    // -------------------------
    // STATIC CURSOR (default)
    // -------------------------
    staticCursorEl = document.createElement("div");
    staticCursorEl.id = "cursor-static";
    staticCursorEl.style.position = "fixed";
    staticCursorEl.style.width = "50px";
    staticCursorEl.style.height = "50px";
    staticCursorEl.style.pointerEvents = "none";
    staticCursorEl.style.zIndex = "9998";
    staticCursorEl.style.background = `url(${CURSOR_DEFAULT}) center center no-repeat`;
    staticCursorEl.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(staticCursorEl);

    // -------------------------
    // SPINNING CURSOR (attack / hover / select)
    // -------------------------
    spinningCursorEl = document.createElement("div");
    spinningCursorEl.id = "cursor-spinning";
    spinningCursorEl.style.position = "fixed";
    spinningCursorEl.style.width = "50px";
    spinningCursorEl.style.height = "50px";
    spinningCursorEl.style.pointerEvents = "none";
    spinningCursorEl.style.zIndex = "9999";
    spinningCursorEl.style.opacity = "1";
    document.body.appendChild(spinningCursorEl);

    spinningCursorImg = document.createElement("img");
    spinningCursorImg.style.width = "100%";
    spinningCursorImg.style.height = "100%";
    spinningCursorEl.appendChild(spinningCursorImg);

    // -------------------------
    // HIDE SYSTEM CURSOR OVER CANVAS
    // -------------------------
    canvas.addEventListener("mouseenter", () => {
        document.body.style.cursor = "none";
    });
    canvas.addEventListener("mouseleave", () => {
      document.body.style.cursor = `url('./assets/cursor-default.png'), auto`;
  });
  

    // -------------------------
    // MOUSE MOVE
    // -------------------------
    canvas.addEventListener("mousemove", handleMouseMove);

    // -------------------------
    // CLICK HANDLERS
    // -------------------------
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("contextmenu", handleRightClick);

    // -------------------------
    // KEYBOARD SHORTCUTS
    // -------------------------
    document.addEventListener("keydown", handleKeyDown);

    // -------------------------
    // START ANIMATION LOOP
    // -------------------------
    startCursorAnimation();
}

// =========================
// MOUSE MOVE HANDLER
// =========================
function handleMouseMove(e) {
    const rect = canvasRef.getBoundingClientRect();
    const scaleX = canvasRef.width / rect.width;
    const scaleY = canvasRef.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    window.mouseX = mouseX;
    window.mouseY = mouseY;

    // Position cursors
    if (staticCursorEl) {
        staticCursorEl.style.left = `${e.clientX}px`;
        staticCursorEl.style.top = `${e.clientY}px`;
    }
    if (spinningCursorEl) {
        spinningCursorEl.style.left = `${e.clientX}px`;
        spinningCursorEl.style.top = `${e.clientY}px`;
    }

    // Hover detection
    window.hoveredEnemy = getHoveredEnemy(gameState.enemies, mouseX, mouseY, 65);
    window.hoveredTower = getTowerAtPosition(gameState.towers, mouseX, mouseY, 25); // gridSize

    // Update cursor mode if not in attack mode or placing tower
    if (!window.selectedTowerType && cursorMode !== "attack") {
        cursorMode = (window.hoveredEnemy || window.hoveredTower) ? "hover" : "default";
    }

    applyCursor();
}

// =========================
// CLICK HANDLER
// =========================
function handleClick() {
    if (cursorMode === "attack" && window.selectedTower && window.hoveredEnemy) {
        window.selectedTower.setForcedTarget(window.hoveredEnemy);
        cursorMode = "default";
        applyCursor();
    }
}

// =========================
// RIGHT CLICK HANDLER
// =========================
function handleRightClick(e) {
    e.preventDefault();
    if (!window.selectedTower) return;

    const rect = canvasRef.getBoundingClientRect();
    const scaleX = canvasRef.width / rect.width;
    const scaleY = canvasRef.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const target = gameState.enemies.find(
        enemy => Math.hypot(enemy.x - mouseX, enemy.y - mouseY) <= (enemy.radius ?? 20)
    );

    if (target) {
        window.selectedTower.setForcedTarget(target);
        cursorMode = "default";
        applyCursor();
    }
}

// =========================
// KEYBOARD HANDLER
// =========================
function handleKeyDown(e) {
    const key = e.key.toLowerCase();

    if (key === "escape") {
        cursorMode = "default";
        if (window.selectedTower) window.selectedTower.clearForcedTarget();
        window.selectedTowerType = null;
        window.selectedTowerCost = null;
    } else if (key === "a" && window.selectedTower) {
        cursorMode = cursorMode === "attack" ? "default" : "attack";
    } else if (key === "u" && window.selectedTower) {
        const tower = window.selectedTower;
        if (tower.upgrade(gameState)) window.hud?.update();
    } else if (key === "s" && window.selectedTower) {
        const sellBtn = document.querySelector(".tower-sell");
        if (sellBtn && typeof sellBtn.onclick === "function") sellBtn.onclick();
    }

    applyCursor();
}

// =========================
// APPLY CURSOR LOGIC
// =========================
export function applyCursor() {
    if (!spinningCursorEl || !spinningCursorImg || !staticCursorEl) return;

    // -------------------------
    // TOWER PLACEMENT → hide spinning cursor, ghost handles placement
    // -------------------------
    if (window.selectedTowerType) {
        spinningCursorEl.style.display = "none";
        staticCursorEl.style.display = "none"; // optional: hide static when placing tower
        return;
    }

    // -------------------------
    // ATTACK MODE / HOVER / SELECT
    // -------------------------
    if (cursorMode === "attack" || window.hoveredEnemy || window.hoveredTower) {
        spinningCursorEl.style.display = "block"; // show spinning
        staticCursorEl.style.display = "none";   // hide default

        if (cursorMode === "attack" || window.hoveredEnemy) spinningCursorImg.src = CURSOR_ATTACK;
        else if (window.hoveredTower) spinningCursorImg.src = CURSOR_SELECT;
    } else {
        spinningCursorEl.style.display = "none";
        staticCursorEl.style.display = "block"; // show default
        staticCursorEl.style.background = `url(${CURSOR_DEFAULT}) center center no-repeat`;
    }
}

// =========================
// SPINNING CURSOR ANIMATION
// =========================
function animateCursor() {
    if (!spinningCursorEl) return;

    if (spinningCursorEl.style.display === "block") {
        angle += 3;
        spinningCursorEl.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    }

    animationRAF = requestAnimationFrame(animateCursor);
}

export function startCursorAnimation() {
    if (!animationRAF) animateCursor();
}

export function stopCursorAnimation() {
    if (animationRAF) {
        cancelAnimationFrame(animationRAF);
        animationRAF = null;
    }
}

// =========================
// MODE GET / SET
// =========================
export function setCursorMode(mode) {
    cursorMode = mode;
    applyCursor();
}

export function getCursorMode() {
    return cursorMode;
}
