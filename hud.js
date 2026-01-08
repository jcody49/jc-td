export function initHUD({ gameState, path, gridSize, ctx, canvas, waveText, waveState, startWave }) {
    const towerInteractionMenu = document.getElementById("towerInteractionMenu");
    const modalTitle = document.getElementById("modalTitle");
    const modalInfo = document.getElementById("modalInfo");
    const towerUpgradeOption = document.getElementById("towerUpgradeOption");
    const towerAttackOption = document.getElementById("towerAttackOption");
    const towerSellOption = document.querySelector(".tower-sell"); // <---- here
    const settingsOption = document.getElementById("settingsOption");
    const livesDisplay = document.getElementById("lives");
    const moneyDisplay = document.getElementById("money");

    let selectedTower = null;

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
        updateSellOption(selectedTower);   // <---- update sell button
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

    function updateUpgradeOption(tower) {
        if (!tower) return;
    
        // Enable/disable button based on gameState
        if (tower.canUpgrade(gameState)) towerUpgradeOption.classList.remove("disabled");
        else towerUpgradeOption.classList.add("disabled");
    
        towerUpgradeOption.onclick = () => {
            if (!tower.canUpgrade(gameState)) return;
    
            tower.upgrade(gameState);
            updateTowerModal();     // refresh modal
            updateMoneyLives();     // refresh money/lives in HUD
        };
    }
    

    function updateSellOption(tower) {
        towerSellOption.onclick = () => {
            if (!tower) return;
    
            // Calculate total spent
            const totalSpent = tower.upgradeCosts.slice(0, tower.level).reduce((a, b) => a + b, 0);
            const refund = Math.floor(totalSpent * 0.5);
            gameState.money += refund;
    
            // Remove tower from gameState
            const index = gameState.towers.indexOf(tower);
            if (index !== -1) gameState.towers.splice(index, 1);
    
            hideTowerModal();
            updateMoneyLives();
        };
    }
    
    

    function updateAttackOption(tower) {
        if (!tower) return;

        towerAttackOption.onclick = () => {
            tower.toggleAttackMode && tower.toggleAttackMode();
            updateTowerModal();
        };
    }

    function updateMoneyLives() {
        if (livesDisplay) livesDisplay.textContent = `Lives: ${gameState.lives}`;
        if (moneyDisplay) moneyDisplay.textContent = `Money: ${gameState.money}`;
    }

    return {
        showTowerModal,
        hideTowerModal,
        update: updateTowerModal,
        updateMoneyLives
    };
}
