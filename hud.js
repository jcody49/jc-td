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
  
    // Show modal
    function showTowerModal(tower) {
      selectedTower = tower;
  
      const modalContainer = document.getElementById('towerInteractionMenu');
      if (modalContainer) modalContainer.style.display = 'flex';
  
      updateTowerMenu(tower);
    }
  
    // Hide modal
    function hideTowerModal() {
      selectedTower = null;
  
      const modalContainer = document.getElementById('towerInteractionMenu');
      if (modalContainer) modalContainer.style.display = 'none';
  
      updateTowerMenu(null);
    }
  
    return {
      update: updateTowerMenu,
      updateTowerMenu,
      showTowerModal,
      hideTowerModal
    };
  }
  