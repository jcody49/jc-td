// tips.js

import { glowTowerCard } from "./towerMenu.js";

// =========================
// TIP DATA
// =========================
export const tips = {

    startGame: {
        title: "Welcome Dude...",
        body: "You'll want to begin this tower defense with a cannon, the best tower for direct damage..."
    },

    firstUpgrade: {
        title: "Upgrade your cannon...",
        body: "Select your cannon & press \"U\" or click Upgrade"
    },

    speedEnemies: {
        title: "Speed Enemies",
        body: "Slow speed enemies down with Frost Towers."
    },
    
    flyingEnemies: {
        title: "Flying Enemies",
        body: "Flying enemies require anti-air towers."
    },

    immuneEnemies: {
        title: "Immune Enemies",
        body: "Immune enemies can only be targeted by cannon and tank towers."
    },

    invisibleEnemies: {
        title: "Invisible Enemies",
        body: "Invisible enemies require Detection Towers to be revealed."
    },

    giantEnemies: {
        title: "Giant Enemies",
        body: "Giant enemies are huge targets that can also be targeted by anti-air."
    },

    armor: {
        title: "Armor",
        body: "Armor absorbs damage before HP, but tanks hit both..."
    }
};

// =========================
// TRACK SHOWN TIPS
// =========================
const shownTips = new Set();
let upgradeTipQueued = false;

// =========================
// TIP LOGIC MAP (clean + scalable)
// =========================
const tipActions = {
    startGame: () => glowTowerCard("Cannon"),
    speedEnemies: () => glowTowerCard("Frost"),
    flyingEnemies: () => glowTowerCard("AntiAir"),
    invisibleEnemies: () => glowTowerCard("Detection"),
    armor: () => glowTowerCard("Tank")
};

// =========================
// SHOW TIP
// =========================
export function showTip(id) {
    if (!window.tipsEnabled) return;

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
    }, 10000);
}


export function checkUpgradeTip(gameState) {
    if (!window.tipsEnabled) return;

    if (upgradeTipQueued) return;

    const hasCannon = gameState.towers?.some(t => t.type === "cannon");
    const canUpgrade = gameState.money >= 50;

    if (hasCannon && canUpgrade) {
        upgradeTipQueued = true;
        showTip("firstUpgrade");
    }
}