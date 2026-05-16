// towerMenu.js
document.addEventListener("DOMContentLoaded", () => {
    const towerCards = document.querySelectorAll('.towerCard');  // Select all the tower cards
  
    towerCards.forEach(card => {
      card.addEventListener('click', () => {
        const towerType = card.dataset.type; // Get the data-type attribute from the clicked card
        const towerCost = parseInt(card.querySelector('.towerCost').textContent.replace('$', '')); // Get the cost
  
        // Set the global selected tower type and cost
        window.selectedTowerType = towerType;
        window.selectedTowerCost = towerCost;
  
        // Optionally, add visual feedback like highlighting the selected card
        updateTowerCardSelection(card);
      });
    });
  });
  
  // Function to visually highlight the selected tower card
  function updateTowerCardSelection(selectedCard) {
    // Remove 'selected' class from all cards
    document.querySelectorAll('.towerCard').forEach(card => card.classList.remove('selected'));
  
    // Add 'selected' class to the clicked card
    selectedCard.classList.add('selected');
  }



  // =========================
  // TIP HIGHLIGHT
  // =========================
  export function glowTowerCard(type) {
    const card = document.querySelector(
      `.towerCard[data-type="${type}"], .towerCard[data-type="${type.charAt(0).toUpperCase() + type.slice(1)}"]`
    );
  
    if (!card) return;
  
    card.classList.add("attention-glow");
  
    setTimeout(() => {
      card.classList.remove("attention-glow");
    }, 4000);
  }