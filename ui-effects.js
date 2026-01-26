export function showMoneyPopup(amount, x = null, y = null, text = null) {
    const popup = document.createElement("div");
    popup.textContent = text ?? `+$${amount}`;
    popup.style.position = "absolute"; // <-- relative to parent container
    popup.style.color = "lime";
    popup.style.fontWeight = "bold";
    popup.style.fontSize = "24px";
    popup.style.pointerEvents = "none";
    popup.style.opacity = "1";
    popup.style.zIndex = 9999;
    popup.style.textAlign = "center";
    popup.style.textShadow = "0 0 8px black";

    const container = document.getElementById("gameWrapper");
    const rect = container.getBoundingClientRect();

    let posX = rect.width / 2;
    let posY = rect.height / 2;

    if (x !== null) posX = x;
    if (y !== null) posY = y;

    popup.style.left = posX + "px";
    popup.style.top = posY + "px";

    popup.style.transform = "translate(-50%, 0)";
    popup.classList.add("wave-income-popup");

    container.appendChild(popup);
    setTimeout(() => popup.remove(), 1600);
}

export function showLifePopup(amount, x = null, y = null) {
    const popup = document.createElement("div");
    popup.textContent = `+${amount} ❤️`;

    popup.style.position = "absolute";
    popup.style.color = "hotpink";
    popup.style.fontWeight = "bold";
    popup.style.fontSize = "26px";
    popup.style.pointerEvents = "none";
    popup.style.opacity = "1";
    popup.style.zIndex = 9999;
    popup.style.textAlign = "center";
    popup.style.textShadow = "0 0 8px black";

    const container = document.getElementById("gameWrapper");
    const rect = container.getBoundingClientRect();

    let posX = rect.width / 2;
    let posY = rect.height / 2;

    if (x !== null) posX = x;
    if (y !== null) posY = y;

    posY -= 28;

    popup.style.left = posX + "px";
    popup.style.top = posY + "px";

    popup.style.transform = "translate(-50%, 0)";
    popup.classList.add("wave-income-popup");

    container.appendChild(popup);
    setTimeout(() => popup.remove(), 1600);
}

// =========================
// TOWER TOOLTIP
// =========================
let towerTooltipEl = null;

// ======================
// TOWER TOOLTIP
// ======================
export function initTowerTooltip() {
    towerTooltipEl = document.createElement("div");
    towerTooltipEl.id = "tower-tooltip";
    towerTooltipEl.style.position = "fixed";      // fixed so it can escape overflow:hidden
    towerTooltipEl.style.pointerEvents = "none";
    towerTooltipEl.style.background = "rgba(0,0,0,0.85)";
    towerTooltipEl.style.color = "white";
    towerTooltipEl.style.padding = "8px 12px";
    towerTooltipEl.style.borderRadius = "6px";
    towerTooltipEl.style.fontSize = "14px";
    towerTooltipEl.style.fontFamily = "'Audiowide', monospace";  // audiowide font
    towerTooltipEl.style.zIndex = 9999;
    towerTooltipEl.style.opacity = "0";
    towerTooltipEl.style.transition = "opacity 0.2s, transform 0.2s";

    // purple border + glow
    towerTooltipEl.style.border = "2px solid #9b2cff";
    towerTooltipEl.style.boxShadow = `
        0 0 6px rgba(155, 44, 255, 0.6),
        0 0 12px rgba(155, 44, 255, 0.4),
        0 0 20px rgba(155, 44, 255, 0.2)
    `;

    document.body.appendChild(towerTooltipEl);

    return towerTooltipEl;
}

// ======================
// SHOW TOOLTIP
// ======================
export function showTowerTooltip(text, x, y) {
    if (!towerTooltipEl) return;
    towerTooltipEl.textContent = text;
    towerTooltipEl.style.left = x + "px";
    towerTooltipEl.style.top = y + "px";
    towerTooltipEl.style.opacity = "1";

    // optional: animate a slight pop
    towerTooltipEl.style.transform = "translate(-100%, 0) scale(1.05)";
}

// ======================
// HIDE TOOLTIP
// ======================
export function hideTowerTooltip() {
    if (!towerTooltipEl) return;
    towerTooltipEl.style.opacity = "0";
    towerTooltipEl.style.transform = "translate(-100%, 0) scale(1)";
}

