export function initHUD({ gameState }) {
    // --- DOM elements ---
    const towerInteractionMenu = document.getElementById("towerInteractionMenu");
    const modalTitle = document.getElementById("modalTitle");
    const modalInfo = document.getElementById("modalInfo");
    const towerUpgradeOption = document.getElementById("towerUpgradeOption");
    const towerAttackOption = document.getElementById("towerAttackOption");
    const livesDisplay = document.getElementById("lives");
    const moneyDisplay = document.getElementById("money");

    let selectedTower = null;

    // ------------------------------
    // Show tower modal
    // ------------------------------
    function showTowerModal(tower) {
        selectedTower = tower;
        updateTowerModal();
    }

    // ------------------------------
    // Hide tower modal
    // ------------------------------
    function hideTowerModal() {
        selectedTower = null;
        towerInteractionMenu.style.display = "none";
    }

    // ------------------------------
    // Update tower modal content
    // ------------------------------
    function updateTowerModal() {
        if (!selectedTower) return;

        towerInteractionMenu.style.display = "flex";
        modalTitle.textContent = selectedTower.getDisplayName?.() || selectedTower.type;
        modalInfo.textContent = getTowerInfoText(selectedTower);

        updateUpgradeOption(selectedTower);
        updateAttackOption(selectedTower);
    }

    // ------------------------------
    // Build tower info string
    // ------------------------------
    function getTowerInfoText(tower) {
        return [
            `Damage: ${tower.damage}`,
            `Range: ${tower.range}`,
            `Fire Rate: ${tower.fireRate}`,
            `Level: ${tower.level}`
        ].join(" | ");
    }

    // ------------------------------
    // Upgrade button logic
    // ------------------------------
    function updateUpgradeOption(tower) {
        // Enable/disable button
        if (tower.canUpgrade(gameState)) {
            towerUpgradeOption.classList.remove("disabled");
        } else {
            towerUpgradeOption.classList.add("disabled");
        }

        towerUpgradeOption.onclick = () => {
            if (!tower.canUpgrade(gameState)) return;

            const upgraded = tower.upgrade(gameState);
            if (upgraded) {
                updateTowerModal();
                updateMoneyLives();
            }
        };
    }

    // ------------------------------
    // Attack button logic
    // ------------------------------
    function updateAttackOption(tower) {
        towerAttackOption.onclick = () => {
            tower.toggleAttackMode?.();
            updateTowerModal();
        };
    }

    // ------------------------------
    // Update HUD for money and lives
    // ------------------------------
    function updateMoneyLives() {
        if (livesDisplay) livesDisplay.textContent = `Lives: ${gameState.lives}`;
        if (moneyDisplay) moneyDisplay.textContent = `Money: ${gameState.money}`;
    }

    // ------------------------------
    // Initialize HUD
    // ------------------------------
    updateMoneyLives();

    // ------------------------------
    // Return HUD API
    // ------------------------------
    return {
        showTowerModal,
        hideTowerModal,
        update: updateTowerModal,
        updateMoneyLives
    };
}
