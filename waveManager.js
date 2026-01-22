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
let completionLocked = false;

// =========================
// WAVE PREVIEW (HUD)
// =========================
export function updateWavePreview() {
  const currentEl = document.getElementById("waveCurrent");
  const nextEl = document.getElementById("waveNext");
  const soonEl = document.getElementById("waveSoon");

  if (!currentEl || !nextEl || !soonEl) return;

  const getWaveEnemyType = (index) => {
    const wave = waves[index];
    if (!wave || !wave.enemies?.length) return "—";
    const enemyId = wave.enemies[0].id;
    return enemiesData[enemyId]?.type || enemyId;
  };

  currentEl.textContent = getWaveEnemyType(waveState.currentWave);
  nextEl.textContent    = getWaveEnemyType(waveState.currentWave + 1);
  soonEl.textContent    = getWaveEnemyType(waveState.currentWave + 2);
}

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

  updateWavePreview(); // update preview as wave starts

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
    if (window.gamePaused) return; // pause spawning if modal open

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

  // show skip button
  const skipButton = document.getElementById("skipButton");
  if (skipButton) {
    skipButton.disabled = false;
    skipButton.style.display = "block";
  }

  if (waveTextEl) waveTextEl.innerText = `Next wave in: ${waveState.countdown}`;

  if (waveState.countdownInterval) clearInterval(waveState.countdownInterval);

  waveState.countdownInterval = setInterval(() => {
    if (window.gamePaused) {
      if (waveTextEl) waveTextEl.innerText = "Paused";
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

  updateWavePreview(); // ensure preview shows upcoming waves during countdown
}

// =========================
// UPDATE WAVE COMPLETION
// =========================
export function updateWaveCompletion(gameState, gridSize, ctx, canvas, waveTextEl) {
  if (waveState.status !== "spawning" || completionLocked) return;

  if (spawningFinished && gameState.enemies.length === 0) {
    if (window.gamePaused) return;

    completionLocked = true;
    waveState.status = "done";

    const currentWaveData = waves[waveState.currentWave];

    // award income
    if (currentWaveData?.income) {
      gameState.money = (gameState.money || 0) + currentWaveData.income;
      showMoneyPopup(
        currentWaveData.income,
        window.innerWidth / 2,
        window.innerHeight / 2,
        `Wave income: +${currentWaveData.income}`
      );
    }

    if (waveTextEl) waveTextEl.innerText = `Wave ${waveState.currentWave + 1} complete!`;

    setTimeout(() => {
      waveState.currentWave++;
      updateWavePreview();
      completionLocked = false;
      startNextWave(gameState, gridSize, ctx, canvas, waveTextEl);
    }, 2000);
  }
}
