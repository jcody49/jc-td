// =========================
// MONEY POPUP
// =========================
export function showMoneyPopup(amount, x = null, y = null, text = null) {
    const popup = document.createElement("div");
    popup.textContent = text ?? `+$${amount}`;
    popup.style.position = "absolute";
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

    let posX = x ?? rect.width / 2;
    let posY = y ?? rect.height / 2;

    popup.style.left = posX + "px";
    popup.style.top = posY + "px";
    popup.style.transform = "translate(-50%, 0)";
    popup.classList.add("wave-income-popup");

    container.appendChild(popup);
    setTimeout(() => popup.remove(), 1600);
}

// =========================
// LIFE POPUP
// =========================
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

    let posX = x ?? rect.width / 2;
    let posY = (y ?? rect.height / 2) - 28;

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
let towerTooltipTitleEl = null;
let towerTooltipDescEl = null;

export function initTowerTooltip() {
    // container
    towerTooltipEl = document.createElement("div");
    towerTooltipEl.id = "tower-tooltip";

    Object.assign(towerTooltipEl.style, {
        position: "fixed",
        pointerEvents: "none",
        minWidth: "160px",
        maxWidth: "250px",
        padding: "8px 12px",
        fontFamily: "'Audiowide', monospace",
        background: "rgba(0,0,0,0.85)",
        color: "white",
        borderRadius: "6px",
        border: "2px solid #9b2cff",
        boxShadow: `
            0 0 6px rgba(155, 44, 255, 0.6),
            0 0 12px rgba(155, 44, 255, 0.4),
            0 0 20px rgba(155, 44, 255, 0.2)
        `,
        zIndex: 9999,
        opacity: "0",
        lineHeight: "1.2",
        wordWrap: "break-word",
        whiteSpace: "normal",
        transition: "opacity 0.2s, transform 0.2s",
        transform: "translate(calc(-100% - 10px), -50%)" // left offset +10px gap
    });

    // title element
    towerTooltipTitleEl = document.createElement("div");
    towerTooltipTitleEl.style.fontWeight = "bold";
    towerTooltipTitleEl.style.textDecoration = "underline";
    towerTooltipTitleEl.style.marginBottom = "6px"; // more space below title
    towerTooltipTitleEl.style.color = "#FFFFFF";    // neon cyan
    towerTooltipTitleEl.style.textShadow = `
        0 0 2px #00FFFF,
        0 0 4px #00FFFF,
        0 0 6px rgba(0, 255, 255, 0.25)
    `;
    towerTooltipEl.appendChild(towerTooltipTitleEl);

    // description element
    towerTooltipDescEl = document.createElement("div");
    towerTooltipDescEl.style.fontSize = "13px"; // slightly smaller
    towerTooltipEl.appendChild(towerTooltipDescEl);

    document.body.appendChild(towerTooltipEl);
    return towerTooltipEl;
}


// -------------------------
// SHOW TOOLTIP
// -------------------------
export function showTowerTooltip(title, description, x, y) {
    if (!towerTooltipEl) return;
    towerTooltipTitleEl.textContent = title;
    towerTooltipDescEl.textContent = description;

    towerTooltipEl.style.left = x + "px";
    towerTooltipEl.style.top = y + "px";
    towerTooltipEl.style.opacity = "1";

    // move fully left of the card minus 10px gap, vertically center
    towerTooltipEl.style.transform = "translate(calc(-100% - 10px), -50%)";
}




// -------------------------
// HIDE TOOLTIP
// -------------------------
export function hideTowerTooltip() {
    if (!towerTooltipEl) return;
    towerTooltipEl.style.opacity = "0";
    towerTooltipEl.style.transform = "translate(-45%, 0)";
}
