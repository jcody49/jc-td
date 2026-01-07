export function initHUD({ gameState, path, gridSize, ctx, canvas, waveText, waveState, startWave }) {
    const towerInteractionMenu = document.getElementById("towerInteractionMenu");
    const modalTitle = document.getElementById("modalTitle");
    const modalInfo = document.getElementById("modalInfo");
    const towerUpgradeOption = document.getElementById("towerUpgradeOption");
    const towerAttackOption = document.getElementById("towerAttackOption");
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
    

    function updateUpgradeOption(tower) {
        if (tower.canUpgrade && tower.canUpgrade()) towerUpgradeOption.classList.remove("disabled");
        else towerUpgradeOption.classList.add("disabled");

        towerUpgradeOption.onclick = () => {
            if (!tower.canUpgrade || !tower.canUpgrade()) return;
            tower.upgrade();
            updateTowerModal();
        };
    }

    function updateSellOption(tower) {
        towerAttackOption.onclick = () => {
            tower.sell();
            hideTowerModal();
        };
    }

    function updateAttackOption(tower) {
        towerAttackOption.onclick = () => {
            tower.toggleAttackMode && tower.toggleAttackMode();
            updateTowerModal();
        };
    }

    // NEW: update money & lives
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
