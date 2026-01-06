export function initHUD({ gameState }) {
    let selectedTower = null;
  
    // Update money and lives
    function updateHUD() {
      const moneyEl = document.getElementById('money');
      const livesEl = document.getElementById('lives');
  
      if (moneyEl) moneyEl.textContent = `Money: ${gameState.money}`;
      if (livesEl) livesEl.textContent = `Lives: ${gameState.lives}`;
    }
  
    // Update tower modal info
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
  
    // Show modal
    function showTowerModal(tower) {
      selectedTower = tower;
      const modal = document.querySelector('.tower-modal-content');
      if (modal) modal.style.display = 'flex';
      updateTowerMenu(tower);
    }
  
    // Hide modal
    function hideTowerModal() {
      selectedTower = null;
      updateTowerMenu(null);
      const modal = document.querySelector('.tower-modal-content');
      if (modal) modal.style.display = 'none';
    }
  
    // Initialize HUD values on start
    updateHUD();
  
    return {
      updateHUD,
      updateTowerMenu,
      showTowerModal,
      hideTowerModal
    };
  }
  