// cursor.js
import { getTowerAtPosition, getHoveredEnemy } from './utils.js';
import { gameState } from './gameState.js'; // optional, if needed for direct access

// =========================
// IMAGE PATHS
// =========================
const CURSOR_DEFAULT = "./assets/cursor-default.png";
const CURSOR_HOVER   = "./assets/select-crosshair.png";
const CURSOR_ATTACK  = "./assets/crosshair.png";

// =========================
// INTERNAL STATE
// =========================
let cursorEl = null;
let cursorImg = null;
let cursorMode = "default"; // "default" | "hover" | "attack"
let angle = 0;
let animationRAF = null;
let canvasRef = null;

// =========================
// INIT CURSOR
// =========================
export function initCursor({ canvas }) {
    canvasRef = canvas;

    // Create cursor element
    cursorEl = document.createElement("div");
    cursorEl.id = "cursor-fx";
    cursorEl.style.position = "fixed";
    cursorEl.style.width = "50px";
    cursorEl.style.height = "50px";
    cursorEl.style.pointerEvents = "none";
    cursorEl.style.zIndex = "9999";
    cursorEl.style.opacity = "1";
    document.body.appendChild(cursorEl);

    // Create image
    cursorImg = document.createElement("img");
    cursorImg.src = CURSOR_DEFAULT;
    cursorImg.style.width = "100%";
    cursorImg.style.height = "100%";
    cursorEl.appendChild(cursorImg);

    // Hide system cursor
    document.body.style.cursor = "none";

    // Mousemove updates
    canvas.addEventListener("mousemove", handleMouseMove);

    // Click handlers
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("contextmenu", handleRightClick);

    // Keyboard shortcuts
    document.addEventListener("keydown", handleKeyDown);

    // Start animation loop
    startCursorAnimation();
}

// =========================
// MOUSE & CURSOR HANDLERS
// =========================
function handleMouseMove(e) {
    const rect = canvasRef.getBoundingClientRect();
    const scaleX = canvasRef.width / rect.width;
    const scaleY = canvasRef.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    window.mouseX = mouseX;
    window.mouseY = mouseY;

    // Position the cursor element
    if (cursorEl) {
        cursorEl.style.left = `${e.clientX}px`;
        cursorEl.style.top = `${e.clientY}px`;
    }

    // Hover detection
    window.hoveredEnemy = getHoveredEnemy(gameState.enemies, mouseX, mouseY, 65);
    window.hoveredTower = getTowerAtPosition(gameState.towers, mouseX, mouseY, 25); // 25 = gridSize

    // Update mode if not attacking or placing tower
    if (!window.selectedTowerType && cursorMode !== "attack") {
        cursorMode = (window.hoveredEnemy || window.hoveredTower) ? "hover" : "default";
    }

    applyCursor();
}

function handleClick() {
    if (cursorMode !== "attack") return;
    if (!window.selectedTower || !window.hoveredEnemy) return;

    window.selectedTower.setForcedTarget(window.hoveredEnemy);
    cursorMode = "default";
    applyCursor();
}

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
// CURSOR IMAGE LOGIC
// =========================
export function applyCursor() {
    if (!cursorEl || !cursorImg) return;

    // 1️⃣ Tower placement hides cursor
    if (window.selectedTowerType) {
        cursorEl.style.display = "none";
        return;
    }

    // 2️⃣ Attack mode
    if (cursorMode === "attack") {
        cursorEl.style.display = "block";
        cursorImg.src = CURSOR_ATTACK;
        return;
    }

    // 3️⃣ Hover mode
    if (window.hoveredTower) {
        cursorEl.style.display = "block";
        cursorImg.src = CURSOR_HOVER;
        return;
    }

    // 4️⃣ Hover over enemy
    if (window.hoveredEnemy) {
        cursorEl.style.display = "block";
        cursorImg.src = CURSOR_ATTACK;
        return;
    }

    // 5️⃣ Default
    cursorEl.style.display = "block";
    cursorImg.src = CURSOR_DEFAULT;
}

// =========================
// ROTATION / ANIMATION LOOP
// =========================
function animateCursor() {
    if (!cursorEl) return;

    angle += 3;
    let scale = 1;
    if (cursorMode === "attack" && window.hoveredEnemy) scale = 1.23;

    cursorEl.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`;
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
// SET / GET MODE EXPORTED
// =========================
export function setCursorMode(mode) {
    cursorMode = mode;
    applyCursor();
}

export function getCursorMode() {
    return cursorMode;
}
