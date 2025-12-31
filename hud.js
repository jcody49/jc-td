// hud.js
export function initHUD(gameState) {
    const hud = document.getElementById('hud');
    const skipButton = document.getElementById('skipButton');
  
    skipButton.addEventListener('click', () => {
      // logic to skip the countdown
    });
  
    return {
      show: () => { hud.style.display = 'flex'; },
      hide: () => { hud.style.display = 'none'; },
      update: () => {
        document.getElementById('lives').textContent = `Lives: ${gameState.lives}`;
        document.getElementById('money').textContent = `Money: ${gameState.money}`;
      }
    };
  }
  