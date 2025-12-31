export function initHUD({ gameState, path, gridSize, ctx, canvas, waveText, waveState, startWave }) {
    const hud = document.getElementById('hud');
    const skipButton = document.getElementById("skipButton");
    hud.style.display = 'none';

    skipButton.addEventListener("click", () => {
        if (waveState.status === "countdown") {
            clearInterval(waveState.countdownInterval);
            startWave(gameState, path, gridSize, ctx, canvas, waveText, skipButton);
        }
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
