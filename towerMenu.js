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
  
        // Log selection to the console (for debugging)
        console.log(`Selected Tower: ${towerType}, Cost: $${towerCost}`);
  
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