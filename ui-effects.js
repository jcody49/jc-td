export function showMoneyPopup(amount, x = null, y = null, text = null) {
    const popup = document.createElement("div");

    popup.textContent = text ?? `+$${amount}`;
    popup.style.position = "fixed";
    popup.style.color = "lime";
    popup.style.fontWeight = "bold";
    popup.style.fontSize = "24px"; 
    popup.style.pointerEvents = "none";
    popup.style.opacity = "1";
    popup.style.zIndex = 9999;
    popup.style.textAlign = "center";
    popup.style.textShadow = "0 0 8px black";
    
    // center relative to canvas
    const canvas = document.getElementById("game");
    const rect = canvas.getBoundingClientRect();
    popup.style.left = (x ?? (rect.left + rect.width/2)) + "px";
    popup.style.top = (y ?? (rect.top + rect.height/2)) + "px";

    popup.style.transform = "translate(-50%, 0)";
    popup.classList.add("wave-income-popup");

    document.body.appendChild(popup);

    // remove after animation finishes
    setTimeout(() => popup.remove(), 1400);
}
