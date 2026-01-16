export function showMoneyPopup(amount, x = null, y = null, text = null) {
    const popup = document.createElement("div");

    popup.textContent = text ?? `+$${amount}`;
    popup.style.position = "fixed";
    popup.style.color = "lime";
    popup.style.fontWeight = "bold";
    popup.style.fontSize = "24px"; // bigger for wave income
    popup.style.pointerEvents = "none";
    popup.style.opacity = "1";
    popup.style.zIndex = 9999;
    popup.style.textAlign = "center";
    popup.style.textShadow = "0 0 8px black";
    popup.style.left = (x ?? window.innerWidth / 2) + "px";
    popup.style.top = (y ?? window.innerHeight / 2) + "px";
    popup.style.transform = "translate(-50%, 0)";

    // Add a unique class for animation
    popup.classList.add("wave-income-popup");

    document.body.appendChild(popup);

    // Remove after animation
    setTimeout(() => popup.remove(), 1400);
}
