import { Enemy } from './enemies.js';

export const waveState = {
  currentWave: 0,
  countdown: 5, // shorter for testing
  countdownInterval: null,
  status: "idle" // idle | countdown | spawning
};

let spawnInterval;

export function startWave(gameState, path, gridSize, ctx, canvas) {
  waveState.status = "spawning";
  let enemiesSpawned = 0;
  const maxEnemies = 20; // smaller for testing

  spawnInterval = setInterval(() => {
    if (enemiesSpawned >= maxEnemies) {
      clearInterval(spawnInterval);
      waveState.status = "done";
      return;
    }

    gameState.enemies.push(
      new Enemy({ path, gridSize, ctx, canvas, reward: 1 })
    );

    enemiesSpawned++;
  }, 1300);
}

export function startNextWave(gameState, path, gridSize, ctx, canvas) {
  waveState.currentWave++;
  waveState.countdown = 40;
  waveState.status = "countdown";

  if (waveState.countdownInterval) clearInterval(waveState.countdownInterval);

  waveState.countdownInterval = setInterval(() => {
    waveState.countdown--;

    if (waveState.countdown <= 0) {
        clearInterval(waveState.countdownInterval);
        startWave(gameState, path, gridSize, ctx, canvas);
    }
  }, 1000);
}
