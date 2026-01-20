// =========================
// waveManager.js
// =========================

import { Enemy } from './enemies/enemies.js';
import { enemiesData } from './enemies/enemyData.js';
import { waves } from './waves.js';
import { showMoneyPopup } from './ui-effects.js';

// =========================
// WAVE STATE
// =========================
export const waveState = {
  currentWave: 0,        // 0-based index
  countdown: 40,
  countdownInterval: null,
  status: "idle",        // idle | countdown | spawning | done
  path: null             // pixel path from main.js
};

// =========================
// INTERNAL FLAGS
// =========================
let spawnInterval = null;
let spawningFinished = false;

// =========================
// START WAVE (SPAWNING)
// =========================
export function startWave(gameState, gridSize, ctx, canvas, waveTextEl) {
  if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) throw new Error("Invalid ctx passed to startWave");
  if (!waveState.path || !waveState.path.length) throw new Error("startWave called with invalid path");

  const waveData = waves[waveState.currentWave];
  if (!waveData) return;

  waveState.status = "spawning";
  spawningFinished = false;

  if (waveTextEl) waveTextEl.innerText = `Wave ${waveState.currentWave + 1} in progress`;

  const spawnQueue = [];
  waveData.enemies.forEach(e => {
    for (let i = 0; i < e.count; i++) {
      const enemyConfig = enemiesData[e.id];
      if (enemyConfig) spawnQueue.push(enemyConfig);
    }
  });

  let enemiesSpawned = 0;
  if (spawnInterval) clearInterval(spawnInterval);

  spawnInterval = setInterval(() => {
    if (window.gamePaused) return; // ⬅ pause spawning if modal open

    if (enemiesSpawned >= spawnQueue.length) {
      clearInterval(spawnInterval);
      spawningFinished = true;
      return;
    }

    const config = spawnQueue[enemiesSpawned];
    gameState.enemies.push(
      new Enemy({
        path: waveState.path,
        gridSize,
        ctx,
        canvas,
        config
      })
    );

    enemiesSpawned++;
  }, waveData.spawnInterval);
}

// =========================
// START NEXT WAVE (COUNTDOWN)
// =========================
export function startNextWave(gameState, gridSize, ctx, canvas, waveTextEl) {
  waveState.countdown = 40;
  waveState.status = "countdown";

  // enable skip
  const skipButton = document.getElementById("skipButton");
  if (skipButton) {
    skipButton.disabled = false;
  }

  if (waveTextEl) waveTextEl.innerText = `Next wave in: ${waveState.countdown}`;

  if (waveState.countdownInterval) clearInterval(waveState.countdownInterval);

  waveState.countdownInterval = setInterval(() => {
    if (window.gamePaused) {
      if (waveTextEl) waveTextEl.innerText = "Paused"; // ⬅ show paused text
      return;
    }

    waveState.countdown--;

    if (waveTextEl) waveTextEl.innerText = `Next wave in: ${waveState.countdown}`;

    if (waveState.countdown <= 0) {
      clearInterval(waveState.countdownInterval);
      waveState.countdownInterval = null;

      startWave(gameState, gridSize, ctx, canvas, waveTextEl);
    }
  }, 1000);
}

// =========================
// UPDATE WAVE COMPLETION
// =========================
let completionLocked = false;

export function updateWaveCompletion(gameState, gridSize, ctx, canvas, waveTextEl) {
  if (waveState.status !== "spawning" || completionLocked) return;

  if (spawningFinished && gameState.enemies.length === 0) {
    if (window.gamePaused) return; // ⬅ pause wave completion if modal open

    completionLocked = true;
    waveState.status = "done";

    const currentWaveData = waves[waveState.currentWave];

    // --- Award income ---
    if (currentWaveData?.income) {
      gameState.money = (gameState.money || 0) + currentWaveData.income;

      // Show centered popup for wave income
      showMoneyPopup(
        currentWaveData.income,
        window.innerWidth / 2,        // middle horizontally
        window.innerHeight / 2,       // middle vertically
        `Wave income: +${currentWaveData.income}`
      );
    }

    if (waveTextEl) waveTextEl.innerText = `Wave ${waveState.currentWave + 1} complete!`;

    setTimeout(() => {
      waveState.currentWave++;
      completionLocked = false;
      startNextWave(gameState, gridSize, ctx, canvas, waveTextEl);
    }, 2000);
  }
}
