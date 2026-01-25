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

    // ---------------------------
    // CENTER RELATIVE TO CANVAS
    // ---------------------------
    const container = document.getElementById("gameWrapper"); // parent of canvas
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

    // remove after animation
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

    // 👇 offset upward so it doesn't overlap money
    posY -= 28;

    popup.style.left = posX + "px";
    popup.style.top = posY + "px";

    popup.style.transform = "translate(-50%, 0)";
    popup.classList.add("wave-income-popup");

    container.appendChild(popup);
    setTimeout(() => popup.remove(), 1600);
}
