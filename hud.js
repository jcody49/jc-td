export function initHUD({ gameState, path, gridSize, ctx, canvas, waveText, waveState, startWave }) {
    let selectedTower = null;
  
    // Update tower info in the modal
    function updateTowerMenu(tower) {
      const modalTitle = document.getElementById('modalTitle');
      const modalInfo = document.getElementById('modalInfo');
      const upgradeCost = document.getElementById('upgradeCost');
  
      if (!tower) {
        if (modalTitle) modalTitle.textContent = '';
        if (modalInfo) modalInfo.textContent = '';
        if (upgradeCost) upgradeCost.textContent = '';
        return;
      }
  
      if (modalTitle) modalTitle.textContent = tower.type;
      if (modalInfo) modalInfo.textContent = `Level: ${tower.level || 1}`;
      if (upgradeCost) upgradeCost.textContent = tower.upgradeCost ? `$${tower.upgradeCost}` : '';
    }
  
    // Show tower modal
    function showTowerModal(tower) {
      selectedTower = tower;
  
      const modalContainer = document.getElementById('towerInteractionMenu');
      if (modalContainer) modalContainer.style.display = 'flex';
  
      updateTowerMenu(tower);
    }
  
    // Hide tower modal
    function hideTowerModal() {
      selectedTower = null;
  
      const modalContainer = document.getElementById('towerInteractionMenu');
      if (modalContainer) modalContainer.style.display = 'none';
  
      updateTowerMenu(null);
    }

    // ✅ New function: update money & lives
    function updateMoneyLives() {
      const moneyEl = document.getElementById('money');
      const livesEl = document.getElementById('lives');
      if (moneyEl) moneyEl.textContent = `Money: ${gameState.money}`;
      if (livesEl) livesEl.textContent = `Lives: ${gameState.lives}`;
    }
  
    return {
      update: updateTowerMenu,
      updateTowerMenu,
      showTowerModal,
      hideTowerModal,
      updateMoneyLives  // <- expose it
    };
}
