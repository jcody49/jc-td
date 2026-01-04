export function initHUD({ gameState, path, gridSize, ctx, canvas, waveText, waveState, startWave }) {
    const hud = document.getElementById('hud');
    const skipButton = document.getElementById("skipButton");

    // Ensure HUD is always visible
    hud.style.display = 'flex';

    // Skip button behavior
    skipButton.addEventListener("click", () => {
        if (waveState.status === "countdown") {
            clearInterval(waveState.countdownInterval);
            startWave(gameState, path, gridSize, ctx, canvas, waveText, skipButton);
        }
    });

    return {
        // Only keep update logic
        update: () => {
            document.getElementById('lives').textContent = `Lives: ${gameState.lives}`;
            document.getElementById('money').textContent = `Money: ${gameState.money}`;
        }
    };
}
