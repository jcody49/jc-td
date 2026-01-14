// =========================
// waveManager.js
// =========================

import { Enemy } from './enemies/enemies.js';
import { enemiesData } from './enemies/enemyData.js';
import { waves } from './waves.js';



// =========================
// WAVE STATE
// =========================
export const waveState = {
  currentWave: 0,        // 0-based index
  countdown: 40,
  countdownInterval: null,
  status: "idle",        // idle | countdown | spawning | done
  path: null             // store pixelPath from main.js
};

// =========================
// INTERNAL FLAGS
// =========================
let spawnInterval = null;
let spawningFinished = false;

// =========================
// START WAVE (SPAWNING)
// =========================
// waveManager.js
export function startWave(gameState, gridSize, ctx, canvas, waveTextEl) {
    const path = waveState.path;
    if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) {
        throw new Error("Invalid ctx passed to startWave");
    }
    if (!path || !path.length) throw new Error("startWave called with invalid path");

    const waveData = waves[waveState.currentWave];
    if (!waveData) return;

    waveState.status = "spawning";
    spawningFinished = false;

    if (waveTextEl) {
        waveTextEl.innerText = `Wave ${waveState.currentWave + 1} in progress`;
    }

    const spawnQueue = [];
    waveData.enemies.forEach(e => {
        for (let i = 0; i < e.count; i++) spawnQueue.push(enemiesData[e.id]);
    });

    let enemiesSpawned = 0;
    if (spawnInterval) clearInterval(spawnInterval);

    spawnInterval = setInterval(() => {
        if (enemiesSpawned >= spawnQueue.length) {
            clearInterval(spawnInterval);
            spawningFinished = true;
            return;
        }

        const config = spawnQueue[enemiesSpawned];

        // ✅ Use the gridSize parameter
        gameState.enemies.push(
            new Enemy({
                path: waveState.path,
                gridSize, // must come from function argument
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
  waveState.countdown = 5; // or 40 for normal gameplay
  waveState.status = "countdown";

  if (waveTextEl) waveTextEl.innerText = `Next wave in: ${waveState.countdown}`;

  if (waveState.countdownInterval) clearInterval(waveState.countdownInterval);

  waveState.countdownInterval = setInterval(() => {
    waveState.countdown--;

    if (waveTextEl) waveTextEl.innerText = `Next wave in: ${waveState.countdown}`;

    if (waveState.countdown <= 0) {
      clearInterval(waveState.countdownInterval);
      startWave(gameState, gridSize, ctx, canvas, waveTextEl);
    }
  }, 1000);
}

// =========================
// UPDATE WAVE COMPLETION
// =========================
export function updateWaveCompletion(gameState, gridSize, ctx, canvas, waveTextEl) {
  if (spawningFinished && gameState.enemies.length === 0 && waveState.status === "spawning") {
    waveState.status = "done";

    if (waveTextEl) {
      waveTextEl.innerText = `Wave ${waveState.currentWave + 1} complete!`;
    }

    setTimeout(() => {
      waveState.currentWave++; // increment after wave completes
      startNextWave(gameState, gridSize, ctx, canvas, waveTextEl);
    }, 2000);
  }
}
