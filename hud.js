export function initHUD({ gameState, path, gridSize, ctx, canvas, waveText, waveState, startWave }) {
    const hud = document.getElementById('hud');
    const skipButton = document.getElementById("skipButton");

    // Ensure HUD is always visible
    hud.style.display = 'flex';

    // Skip button behavior
    skipButton.addEventListener("click", () => {
        if (waveState.status === "countdown") {
            clearInterval(waveState.countdownInterval);
            startWave(gameState, path, gridSize, ctx, canvas, waveText, skipButton);
        }
    });

    // -------------------------------
    // Tower modal update logic
    // -------------------------------
    function updateTowerModal(selectedTower) {
        if (!selectedTower) return; // no tower selected

        const modalTitle = document.getElementById('modalTitle');
        const modalInfo = document.getElementById('modalInfo');

        modalTitle.textContent = selectedTower.name;
        modalInfo.textContent = `Level: ${selectedTower.level}`;

        // Conditional Special option
        const specialOptionWrapper = document.querySelector('.tower-special').parentElement;
        if (selectedTower.hasSpecial) {
            specialOptionWrapper.style.display = 'flex';
        } else {
            specialOptionWrapper.style.display = 'none';
        }

        // Optional: update upgrade cost if needed
        const upgradeCost = document.getElementById('upgradeCost');
        if (upgradeCost && selectedTower.upgradeCost !== undefined) {
            upgradeCost.textContent = `$${selectedTower.upgradeCost}`;
        }
    }

    // -------------------------------
    // HUD update logic
    // -------------------------------
    function update() {
        document.getElementById('lives').textContent = `Lives: ${gameState.lives}`;
        document.getElementById('money').textContent = `Money: ${gameState.money}`;
    }

    return {
        update,
        updateTowerModal, // expose this so game logic can call it when a tower is selected
    };
}
