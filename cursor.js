//TEST
// cursor.js
import { getTowerAtPosition, getHoveredEnemy } from './utils.js';
import { gameState } from './gameState.js';
import { canvas } from './canvas.js';

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

// =========================
// EVENT HANDLERS
// =========================
function handleClick() {
    if (cursorMode !== "attack" || !window.selectedTower) return;

    const tower = window.selectedTower;
    const enemy = window.hoveredEnemy; // ✅ use existing hover system

    if (!enemy) return;

    const dx = enemy.x - tower.x;
    const dy = enemy.y - tower.y;
    const distance = Math.hypot(dx, dy);

    if (
        distance <= tower.range &&
        tower.canTarget(enemy)
    ) {
        tower.setForcedTarget(enemy);

        enemy.forceFlashTimer = 12;
    }

    cursorMode = "default";
    applyCursor();
}

function handleRightClick(e) {
    e.preventDefault();
    if (!window.selectedTower) return;

    const tower = window.selectedTower;
    const enemy = window.hoveredEnemy; // already uses hover detection

    if (!enemy) return;

    // calculate distance to tower using visualY
    const lift = enemy.gridSize * 0.1;
    const visualY = enemy.y - lift + (enemy.yOffset ?? 0);
    const visualX = enemy.x;
    const dx = visualX - tower.x;
    const dy = visualY - tower.y;
    const distance = Math.hypot(dx, dy);

    // use the tower's actual range
    if (
        distance <= tower.range &&
        tower.canTarget(enemy)
    ) {
        tower.setForcedTarget(enemy);
    
        enemy.forceFlashTimer = 12;
    
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
    } else if (key === "s" && window.selectedTower) {
        const sellBtn = document.querySelector(".tower-sell");
        if (sellBtn && typeof sellBtn.onclick === "function") sellBtn.onclick();
    }

    applyCursor();
}

function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    window.mouseX = mouseX;
    window.mouseY = mouseY;

    // Update cursor position in viewport coordinates
    if (cursorEl) {
        cursorEl.style.left = `${e.clientX}px`;
        cursorEl.style.top = `${e.clientY}px`;
    }

    // Hover detection
    window.hoveredEnemy = getHoveredEnemy(gameState.enemies, mouseX, mouseY, 35);
    window.hoveredTower = getTowerAtPosition(gameState.towers, mouseX, mouseY, 60);

    if (!window.selectedTowerType && cursorMode !== "attack") {
        cursorMode = (window.hoveredEnemy || window.hoveredTower) ? "hover" : "default";
    }

    applyCursor();
}

// =========================
// INIT CURSOR
// =========================
export function initCursor() {
    if (cursorEl) return; // Prevent duplicates

    cursorEl = document.createElement('div');
    cursorEl.id = 'cursor-fx';
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
    window.addEventListener('keydown', handleKeyDown);
}

// =========================
// APPLY CURSOR
// =========================
export function applyCursor() {
    if (!cursorEl || !cursorImg) return;

    if (window.selectedTowerType) {
        cursorEl.classList.remove("active");
        return;
    }

    cursorEl.classList.add("active");


    let newSrc;
    if (window.hoveredEnemy) {
        newSrc = CURSOR_ATTACK;
    } else if (window.hoveredTower) {
        newSrc = CURSOR_SELECT;
    } else if (cursorMode === "attack") {
        newSrc = CURSOR_ATTACK;
    } else {
        newSrc = CURSOR_DEFAULT;
    }

    if (cursorImg.src !== newSrc) {

        const tempImg = new Image();
        tempImg.src = newSrc;
        tempImg.onload = () => {
            cursorImg.src = newSrc;

        };
    }
}
// =========================
// CURSOR ANIMATION
// =========================
function animateCursor() {
    if (!cursorEl) return;

    // Spin if hovering enemy OR tower, or in attack mode
    const shouldSpin = cursorMode === "attack" || window.hoveredEnemy || window.hoveredTower;

    if (shouldSpin) {
        angle += 3; // rotation speed
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