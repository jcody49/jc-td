import { showMoneyPopup } from './ui-effects.js';

export function initHUD({ gameState, path, gridSize, ctx, canvas, waveText, waveState, startWave }) {
    const towerInteractionMenu = document.getElementById("towerInteractionMenu");
    const modalTitle = document.getElementById("modalTitle");
    const modalInfo = document.getElementById("modalInfo");
    const towerUpgradeOption = document.getElementById("towerUpgradeOption");
    const towerAttackOption = document.getElementById("towerAttackOption");
    const towerSellOption = document.querySelector(".tower-sell");
    const settingsOption = document.getElementById("settingsOption");
    const livesDisplay = document.getElementById("lives");
    const moneyDisplay = document.getElementById("money");

    let selectedTower = null;

    // ------------------------------
    // Show/hide tower modal
    // ------------------------------
    function showTowerModal(tower) {
        selectedTower = tower;
        updateTowerModal();
    }

    function hideTowerModal() {
        selectedTower = null;
        towerInteractionMenu.style.display = "none";
    }

    function updateTowerModal() {
        if (!selectedTower) return;

        towerInteractionMenu.style.display = "flex";
        modalTitle.textContent = selectedTower.getDisplayName ? selectedTower.getDisplayName() : selectedTower.type;
        modalInfo.textContent = getTowerInfoText(selectedTower);

        updateUpgradeOption(selectedTower);
        updateSellOption(selectedTower);
        updateAttackOption(selectedTower);
    }

    function getTowerInfoText(tower) {
        return [
            `Damage: ${tower.damage}`,
            `Range: ${tower.range}`,
            `Fire Rate: ${tower.fireRate}`,
            `Level: ${tower.level}`
        ].join(" | ");
    }

    // ------------------------------
    // Upgrade logic
    // ------------------------------
    function updateUpgradeOption(tower) {
        if (!tower) return;

        if (tower.canUpgrade(gameState)) towerUpgradeOption.classList.remove("disabled");
        else towerUpgradeOption.classList.add("disabled");

        towerUpgradeOption.onclick = () => {
            if (!tower.canUpgrade(gameState)) return;

            tower.upgrade(gameState);
            updateTowerModal();
            updateMoneyLives();
        };
    }

    // ------------------------------
    // Sell logic
    // ------------------------------
    function updateSellOption(tower) {
        if (!tower) return;

        towerSellOption.onclick = () => {
            if (!tower) return;

            // Total money spent on tower including upgrades
            const totalSpent = tower.upgradeCosts
                .slice(0, tower.level)
                .reduce((sum, cost) => sum + cost, 0);
            const refund = Math.floor(totalSpent * 0.5);

            // Show money popup at tower location
            const yOffset = 20;
            showMoneyPopup(refund, tower.x, tower.y + yOffset);

            // Remove tower from game state
            const index = gameState.towers.indexOf(tower);
            if (index !== -1) gameState.towers.splice(index, 1);

            // Free grid cell
            const col = Math.floor(tower.x / gridSize);
            const row = Math.floor(tower.y / gridSize);
            window.gridOccupied[col][row] = false;

            // Hide modal and update HUD
            hideTowerModal();
            gameState.money += refund;
            updateMoneyLives();
        };
    }

    // ------------------------------
    // Attack option
    // ------------------------------
    function updateAttackOption(tower) {
        if (!tower) return;

        towerAttackOption.onclick = () => {
            tower.toggleAttackMode && tower.toggleAttackMode();
            updateTowerModal();
        };
    }

    // ------------------------------
    // HUD money/lives update
    // ------------------------------
    function updateMoneyLives() {
        if (livesDisplay) livesDisplay.textContent = `Lives: ${gameState.lives}`;
        if (moneyDisplay) moneyDisplay.textContent = `Money: ${gameState.money}`;
    }

    // ------------------------------
    // Public API
    // ------------------------------
    return {
        showTowerModal,
        hideTowerModal,
        update: updateTowerModal,
        updateMoneyLives
    };
}
