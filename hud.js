// hud.js / initHUD.js
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
    let sellHandler = null; // reference to sell logic for keyboard shortcut

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
        modalInfo.innerHTML = getTowerInfoText(selectedTower);

        updateUpgradeOption(selectedTower);
        updateSellOption(selectedTower);
        updateAttackOption(selectedTower);
    }

    function getTowerInfoText(tower) {
        return [
            `<span style="color: white;
                text-shadow:
                0 0 1px #792BFB,                 
                0 0 2px #FF5DFF,                  
                0 0 4px #FF80FF,                  
                0 0 6px rgba(121, 43, 251, 0.7),  
                0 0 10px rgba(121, 43, 251, 0.5);
            ">Level: ${tower.level}</span>`,
            `Damage: ${tower.damage}`,
            `Range: ${tower.range}`,
            `Fire Rate: ${tower.fireRate}`
        ].join("<br>");
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
        sellHandler = () => {
            if (!tower) return;

            const confirmed = window.confirm(
                `Are you sure you want to sell this ${tower.type}? You'll get 50% of the money spent.`
            );
            if (!confirmed) return;

            const totalSpent = tower.upgradeCosts
                .slice(0, tower.level)
                .reduce((sum, cost) => sum + cost, 0);
            const refund = Math.floor(totalSpent * 0.5);

            gameState.money += refund;

            const yOffset = 20;
            showMoneyPopup(refund, tower.x, tower.y + yOffset);

            const towerIndex = gameState.towers.indexOf(tower);
            if (towerIndex !== -1) gameState.towers.splice(towerIndex, 1);

            const col = Math.floor(tower.x / gridSize);
            const row = Math.floor(tower.y / gridSize);
            window.gridOccupied[col][row] = false;

            hideTowerModal();
            updateMoneyLives();
        };

        towerSellOption.onclick = sellHandler;
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
        updateMoneyLives,
        sellHandler // expose sellHandler for keyboard shortcut
    };
}
