// tips.js

import { glowTowerCard } from "./towerMenu.js";

// =========================
// TIP DATA
// =========================
export const tips = {
    flyingEnemies: {
        title: "Flying Enemies",
        body: "Flying enemies require anti-air towers."
    },

    giantEnemies: {
        title: "Giant Enemies",
        body: "Giant enemies are heavy targets — high DPS recommended."
    },

    armor: {
        title: "Armor",
        body: "Armor absorbs damage before HP."
    }
};

// =========================
// TRACK SHOWN TIPS
// =========================
const shownTips = new Set();

// =========================
// TIP LOGIC MAP (clean + scalable)
// =========================
const tipActions = {
    flyingEnemies: () => glowTowerCard("antiAir"),
    giantEnemies: () => glowTowerCard("cannon"),
    armor: () => glowTowerCard("tank")
};

// =========================
// SHOW TIP
// =========================
export function showTip(id) {

    const tip = tips[id];
    if (!tip) return;

    // prevent repeat spam
    if (shownTips.has(id)) return;
    shownTips.add(id);

    // run contextual glow (if exists)
    const action = tipActions[id];
    if (action) action();

    // render UI
    const el = document.getElementById("tipPopup");
    if (!el) return;

    el.innerHTML = `
        <div class="tip-title">${tip.title}</div>
        <div class="tip-body">${tip.body}</div>
    `;

    el.classList.add("visible");

    clearTimeout(el.hideTimeout);

    el.hideTimeout = setTimeout(() => {
        el.classList.remove("visible");
    }, 5000);
}