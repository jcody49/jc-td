// ui-effects.js
export function showMoneyPopup(amount, x = null, y = null) {
    const popup = document.createElement("div");
    popup.textContent = `+$${amount}`;
    popup.style.position = "fixed";
    popup.style.color = "lime";
    popup.style.fontWeight = "bold";
    popup.style.fontSize = "18px";
    popup.style.pointerEvents = "none";
    popup.style.transition = "transform 1s ease-out, opacity 1s ease-out";
    popup.style.opacity = "1";
    popup.style.zIndex = 9999;

    // Default to money display position if x/y not provided
    if (x === null || y === null) {
        const moneyEl = document.getElementById("money");
        const rect = moneyEl.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top - 20;
    }

    popup.style.left = x + "px";
    popup.style.top = y + "px";

    document.body.appendChild(popup);

    // Animate upwards and fade out
    requestAnimationFrame(() => {
        popup.style.transform = "translateY(-30px)";
        popup.style.opacity = "0";
    });

    setTimeout(() => popup.remove(), 1000);
}
