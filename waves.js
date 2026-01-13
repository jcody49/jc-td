// waves.js
import { Enemy } from './enemies.js';

// =========================
// WAVE STATE
// =========================
export const waveState = {
  currentWave: 0,
  countdown: 40,       // for testing, seconds until next wave
  countdownInterval: null,
  status: "idle"      // idle | countdown | spawning | done
};

// =========================
// INTERNAL FLAGS
// =========================
let spawnInterval = null;
let spawningFinished = false;

// =========================
// START WAVE
// =========================
export function startWave(gameState, path, gridSize, ctx, canvas, waveTextEl) {
  waveState.status = "spawning";
  spawningFinished = false;

  let enemiesSpawned = 0;
  const maxEnemies = 20; // adjust per wave

  // Update waveText immediately
  if (waveTextEl) waveTextEl.innerText = `Wave ${waveState.currentWave} in progress`;

  spawnInterval = setInterval(() => {
    if (enemiesSpawned >= maxEnemies) {
      clearInterval(spawnInterval);
      spawningFinished = true; // all enemies spawned
      return;
    }

    gameState.enemies.push(
      new Enemy({ path, gridSize, ctx, canvas, reward: 1 })
    );

    enemiesSpawned++;
  }, 1300);
}

// =========================
// START NEXT WAVE (COUNTDOWN)
// =========================
export function startNextWave(gameState, path, gridSize, ctx, canvas, waveTextEl) {
  waveState.currentWave++;
  waveState.countdown = 10;  // countdown for next wave
  waveState.status = "countdown";

  // Update waveText immediately
  if (waveTextEl) waveTextEl.innerText = `Next wave in: ${waveState.countdown}s`;

  if (waveState.countdownInterval) clearInterval(waveState.countdownInterval);

  waveState.countdownInterval = setInterval(() => {
    waveState.countdown--;

    if (waveTextEl) waveTextEl.innerText = `Next wave in: ${waveState.countdown}s`;

    if (waveState.countdown <= 0) {
      clearInterval(waveState.countdownInterval);
      startWave(gameState, path, gridSize, ctx, canvas, waveTextEl);
    }
  }, 1000);
}

// =========================
// UPDATE WAVE COMPLETION
// Call this in gameLoop every frame
// =========================
export function updateWaveCompletion(gameState, path, gridSize, ctx, canvas, waveTextEl) {
  // Only mark "done" if all enemies spawned and all are dead
  if (
    spawningFinished &&
    gameState.enemies.length === 0 &&
    waveState.status === "spawning"
  ) {
    waveState.status = "done";

    // Show "Wave X complete!" for a short pause
    if (waveTextEl) waveTextEl.innerText = `Wave ${waveState.currentWave} complete!`;

    setTimeout(() => {
      // After pause, switch to countdown
      startNextWave(gameState, path, gridSize, ctx, canvas, waveTextEl);
    }, 2500); // 2.5 seconds pause
  }
}
