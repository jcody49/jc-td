// waves.js
import { Enemy } from './enemies.js';

export const waveState = {
  currentWave: 0,
  countdown: 40,
  countdownInterval: null,
  status: "idle" // idle | countdown | spawning
};

let spawnInterval; // keep this local to the file, used in startWave

export function startWave(gameState, path, gridSize, ctx, canvas, waveText, skipButton) {
  waveState.status = "spawning";
  waveText.textContent = `Wave ${waveState.currentWave} in progress`;
  skipButton.disabled = true;

  let enemiesSpawned = 0;
  const maxEnemies = 20;

  spawnInterval = setInterval(() => {
    if (enemiesSpawned >= maxEnemies) {
      clearInterval(spawnInterval);
      return;
    }

    gameState.enemies.push(
      new Enemy({ path, gridSize, ctx, canvas })
    );

    enemiesSpawned++;
  }, 1500);
}

export function startNextWave(gameState, path, gridSize, ctx, canvas, waveText, skipButton) {
  waveState.currentWave++;
  waveState.countdown = 40;
  waveState.status = "countdown";

  skipButton.disabled = false;

  if (waveState.countdownInterval) clearInterval(waveState.countdownInterval);

  waveText.textContent = `Wave ${waveState.currentWave} starting in: ${waveState.countdown}`;

  waveState.countdownInterval = setInterval(() => {
    waveState.countdown--;
    waveText.textContent = `Wave ${waveState.currentWave} starting in: ${waveState.countdown}`;

    if (waveState.countdown <= 0) {
      clearInterval(waveState.countdownInterval);
      startWave(gameState, path, gridSize, ctx, canvas, waveText, skipButton);
    }
  }, 1000);
}
