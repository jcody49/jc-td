// difficulty.js

const difficultyMenu = document.getElementById("difficultyMenu");
const difficultyButtons = difficultyMenu?.querySelectorAll(".difficultyButton");

// Hide by default
if (difficultyMenu) {
    difficultyMenu.style.display = "none";
}

export function showDifficultyMenu() {
    if (!difficultyMenu) return;
    difficultyMenu.style.display = "flex";
}
