export function initHUD({ gameState, path, gridSize, ctx, canvas, waveText, waveState, startWave }) {
    let selectedTower = null;

    // ------------------------------
    // Update tower info in the modal
    // ------------------------------
    function updateTowerMenu(tower) {
        const modalTitle = document.getElementById('modalTitle');
        const modalInfo = document.getElementById('modalInfo');
        const upgradeCost = document.getElementById('upgradeCost');

        if (!tower) {
            if (modalTitle) modalTitle.textContent = '';
            if (modalInfo) modalInfo.textContent = '';
            if (upgradeCost) upgradeCost.textContent = '';
            updateUpgradeButton(null);
            return;
        }

        if (modalTitle) modalTitle.textContent = tower.type;
        if (modalInfo) modalInfo.textContent = `Level: ${tower.level || 1}`;
        if (upgradeCost) upgradeCost.textContent = tower.upgradeCosts[tower.level - 1] ? `$${tower.upgradeCosts[tower.level - 1]}` : '';

        updateUpgradeButton(tower);
    }

    // ------------------------------
    // Show/hide tower modal
    // ------------------------------
    function showTowerModal(tower) {
        selectedTower = tower;
        const modalContainer = document.getElementById('towerInteractionMenu');
        if (modalContainer) modalContainer.style.display = 'flex';
        updateTowerMenu(tower);
    }

    function hideTowerModal() {
        selectedTower = null;
        const modalContainer = document.getElementById('towerInteractionMenu');
        if (modalContainer) modalContainer.style.display = 'none';
        updateTowerMenu(null);
    }

    // ------------------------------
    // Upgrade button logic
    // ------------------------------
    function setupUpgradeButton() {
        const upgradeBtn = document.getElementById("towerUpgradeOption");
        if (!upgradeBtn) return;

        upgradeBtn.addEventListener("click", () => {
            if (!selectedTower) return;

            const upgraded = selectedTower.upgrade(gameState);

            if (upgraded) {
                // Refresh HUD and modal info
                updateTowerMenu(selectedTower);
                updateMoneyLives();
            } else {
                alert("Cannot upgrade: not enough money or max level reached");
            }
        });
    }

    function updateUpgradeButton(tower) {
        const upgradeBtn = document.getElementById("towerUpgradeOption");
        if (!upgradeBtn) return;

        if (!tower || tower.level >= tower.maxLevel || gameState.money < tower.upgradeCosts[tower.level - 1]) {
            upgradeBtn.classList.add("disabled"); // optional CSS class
            upgradeBtn.disabled = true;
        } else {
            upgradeBtn.classList.remove("disabled");
            upgradeBtn.disabled = false;
        }
    }

    setupUpgradeButton(); // call once to attach event listener

    // ------------------------------
    // Update HUD money and lives
    // ------------------------------
    function updateMoneyLives() {
        const livesDiv = document.getElementById("lives");
        const moneyDiv = document.getElementById("money");

        if (livesDiv) livesDiv.textContent = `Lives: ${gameState.lives}`;
        if (moneyDiv) moneyDiv.textContent = `Money: ${gameState.money}`;
    }

    // ------------------------------
    // Return public HUD API
    // ------------------------------
    return {
        update: updateTowerMenu,
        updateTowerMenu,
        showTowerModal,
        hideTowerModal,
        updateMoneyLives
    };
  }
  