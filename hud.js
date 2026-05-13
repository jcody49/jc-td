// hud.js / initHUD.js
import { showMoneyPopup } from './ui-effects.js';

export function initHUD({
    gameState,
    path,
    gridSize,
    ctx,
    canvas,
    waveText,
    waveState,
    startWave
}) {

    const towerInteractionMenu = document.getElementById("towerInteractionMenu");
    const modalTitle = document.getElementById("modalTitle");
    const modalInfo = document.getElementById("modalInfo");

    const towerUpgradeOption = document.getElementById("towerUpgradeOption");
    const towerAttackOption = document.getElementById("towerAttackOption");
    const towerSellOption = document.querySelector(".tower-sell");

    const livesDisplay = document.getElementById("lives");
    const moneyDisplay = document.getElementById("money");
    const scoreDisplay = document.getElementById("scoreText");

    let selectedTower = null;

    // =========================
    // OPEN / CLOSE
    // =========================
    function showTowerModal(tower) {
        selectedTower = tower;
        updateTowerModal();
    }

    function hideTowerModal() {
        selectedTower = null;
        towerInteractionMenu.style.display = "none";
    }

    // =========================
    // MAIN UPDATE
    // =========================
    function updateTowerModal() {
        if (!selectedTower) return;

        towerInteractionMenu.style.display = "flex";

        modalTitle.textContent =
            selectedTower.getDisplayName
                ? selectedTower.getDisplayName()
                : selectedTower.type;

        updateUpgradeOption(selectedTower);
        updateSellOption(selectedTower);
        updateAttackOption(selectedTower);

        if (selectedTower.type === "booster") {
            modalInfo.innerHTML = getBoosterInfoText(selectedTower);
            bindBoosterButtons(selectedTower);
        } else {
            modalInfo.innerHTML = getTowerInfoText(selectedTower);
        }

        updateMoneyLives();
    }

    // =========================
    // NORMAL TOWER INFO
    // =========================
    function getTowerInfoText(tower) {
        return [
            `<span style="color:white;text-shadow:0 0 6px #792BFB;">
                Level: ${tower.level}
            </span>`,
            `Damage: ${tower.damage}`,
            `Range: ${tower.range}`,
            `Fire Rate: ${tower.displayFireRate}`
        ].join("<br>");
    }

    // =========================
    // BOOSTER INFO UI
    // =========================
    function getBoosterInfoText(tower) {
        const isDamage = tower.boostMode === "damage";

        return `
            <div class="booster-mode-container">

                <div class="booster-mode-title">
                    Booster Mode
                </div>

                <div class="booster-toggle-row">

                    <button
                        id="damageBoostBtn"
                        class="booster-toggle-btn ${isDamage ? "active" : ""}"
                    >
                        ⚔ Damage
                    </button>

                    <button
                        id="fireRateBoostBtn"
                        class="booster-toggle-btn ${!isDamage ? "active" : ""}"
                    >
                        ⚡ Speed
                    </button>

                </div>

                <div class="booster-stats">
                    Boost: +${Math.round(tower.boostPercent * 100)}%
                </div>

            </div>
        `;
    }

    // =========================
    // BOOSTER EVENTS (ONLY HERE)
    // =========================
    function bindBoosterButtons(tower) {
        const damageBtn = document.getElementById("damageBoostBtn");
        const fireBtn = document.getElementById("fireRateBoostBtn");

        if (damageBtn) {
            damageBtn.onclick = () => {
                tower.boostMode = "damage";
                updateTowerModal();
            };
        }

        if (fireBtn) {
            fireBtn.onclick = () => {
                tower.boostMode = "fireRate";
                updateTowerModal();
            };
        }
    }

    // =========================
    // UPGRADE
    // =========================
    function updateUpgradeOption(tower) {
        if (!tower) return;

        towerUpgradeOption.classList.toggle(
            "disabled",
            !tower.canUpgrade(gameState)
        );

        towerUpgradeOption.onclick = () => {
            if (!tower.canUpgrade(gameState)) return;

            tower.upgrade(gameState);

            updateTowerModal();
            updateMoneyLives();
        };
    }

    // =========================
    // SELL
    // =========================
    function updateSellOption(tower) {
        towerSellOption.onclick = () => {
            const confirmed = window.confirm(
                `Sell ${tower.type}?`
            );
            if (!confirmed) return;

            const refund = Math.floor(tower.totalSpent * 0.5);

            gameState.money += refund;

            showMoneyPopup(refund, tower.x, tower.y);

            const idx = gameState.towers.indexOf(tower);
            if (idx !== -1) gameState.towers.splice(idx, 1);

            hideTowerModal();
            updateMoneyLives();
        };
    }

    // =========================
    // ATTACK MODE
    // =========================
    function updateAttackOption(tower) {
        towerAttackOption.onclick = () => {
            tower.toggleAttackMode?.();
            updateTowerModal();
        };
    }

    // =========================
    // HUD UPDATE
    // =========================
    function updateMoneyLives() {
        if (livesDisplay) livesDisplay.textContent = `Lives: ${gameState.lives}`;
        if (moneyDisplay) moneyDisplay.textContent = `Money: ${gameState.money}`;
        if (scoreDisplay) scoreDisplay.textContent = `Score: ${gameState.score}`;
    }

    // =========================
    // PUBLIC API
    // =========================
    return {
        showTowerModal,
        hideTowerModal,
        update: updateTowerModal,
        updateMoneyLives
    };
}