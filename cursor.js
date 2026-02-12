// cursor.js
import { getTowerAtPosition, getHoveredEnemy } from './utils.js';
import { gameState } from './gameState.js';

// =========================
// IMAGE PATHS
// =========================
const CURSOR_DEFAULT = "./assets/cursor-default.png";
const CURSOR_SELECT  = "./assets/select-crosshair.png";
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
// EVENT HANDLERS
// =========================
function handleClick() {
    if (cursorMode === "attack" && window.selectedTower && window.hoveredEnemy) {
        window.selectedTower.setForcedTarget(window.hoveredEnemy);
        cursorMode = "default";
        applyCursor();
    }
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
        if (window.selectedTower.upgrade(gameState)) window.hud?.update();
    } else if (key === "s" && window.selectedTower) {
        const sellBtn = document.querySelector(".tower-sell");
        if (sellBtn && typeof sellBtn.onclick === "function") sellBtn.onclick();
    }

    applyCursor();
}

function handleMouseMove(e) {
    const rect = canvasRef.getBoundingClientRect();
    const scaleX = canvasRef.width / rect.width;
    const scaleY = canvasRef.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    window.mouseX = mouseX;
    window.mouseY = mouseY;

    // Hover detection
    window.hoveredEnemy = getHoveredEnemy(gameState.enemies, mouseX, mouseY, 65);
    window.hoveredTower = getTowerAtPosition(gameState.towers, mouseX, mouseY, 25);

    if (!window.selectedTowerType && cursorMode !== "attack") {
        cursorMode = (window.hoveredEnemy || window.hoveredTower) ? "hover" : "default";
    }

    applyCursor();
}

// =========================
// INIT CURSOR
// =========================
export function initCursor({ canvas }) {
    canvasRef = canvas;

    cursorEl = document.createElement('div');
    cursorEl.style.position = 'fixed';
    cursorEl.style.width = '50px';
    cursorEl.style.height = '50px';
    cursorEl.style.pointerEvents = 'none';
    cursorEl.style.zIndex = '9999';
    cursorEl.style.transform = 'translate(-50%, -50%)';
    
    cursorImg = document.createElement('img');
    cursorImg.src = CURSOR_DEFAULT;
    cursorImg.style.width = '100%';
    cursorImg.style.height = '100%';
    
    cursorEl.appendChild(cursorImg);
    document.body.appendChild(cursorEl);

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', () => cursorEl.style.display = 'none');
    canvas.addEventListener('mouseenter', () => cursorEl.style.display = 'block');
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('contextmenu', handleRightClick);
    document.addEventListener('keydown', handleKeyDown);

    startCursorAnimation();
}

// =========================
// APPLY CURSOR
// =========================
export function applyCursor() {
    if (!cursorEl || !cursorImg) return;

    if (window.selectedTowerType) {
        cursorEl.style.display = "none";
        return;
    }

    cursorEl.style.display = "block";

    if (cursorMode === "attack" || window.hoveredEnemy) cursorImg.src = CURSOR_ATTACK;
    else if (window.hoveredTower) cursorImg.src = CURSOR_SELECT;
    else cursorImg.src = CURSOR_DEFAULT;
}

// =========================
// CURSOR ANIMATION
// =========================
function animateCursor() {
    if (cursorMode === "attack" || window.hoveredEnemy) {
        angle += 3;
        cursorEl.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    } else {
        cursorEl.style.transform = `translate(-50%, -50%) rotate(0deg)`;
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
