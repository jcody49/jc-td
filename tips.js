// tips.js

export const tips = {

    flyingEnemies: {
        title: "Flying Enemies",
        body: "Flying enemies require anti-air towers."
    },

    giantEnemies: {
        title: "Giant Enemies",
        body: "Giant enemies can also be targeted by anti-air towers."
    },

    armor: {
        title: "Armor",
        body: "Armor absorbs damage before HP."
    }

};

// =========================
// SESSION TRACKING
// =========================
const shownTips = new Set();

// =========================
// SHOW TIP
// =========================
export function showTip(id) {

    // already shown
    if (shownTips.has(id)) return;

    const tip = tips[id];

    if (!tip) return;

    shownTips.add(id);

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