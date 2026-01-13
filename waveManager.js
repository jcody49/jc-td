// waveManager.js
import { Enemy } from './enemies/enemies.js';
import { enemiesData } from './enemies/enemyData.js';
import { waves } from './waves.js';

// =========================
// WAVE STATE
// =========================
export const waveState = {
  currentWave: 0,
  countdown: 40,
  countdownInterval: null,
  status: "idle" // idle | countdown | spawning | done
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

  const waveData = waves[waveState.currentWave];
  if (!waveData) return;

  // Create spawn queue
  const spawnQueue = [];
  waveData.enemies.forEach(e => {
    for (let i = 0; i < e.count; i++) {
      spawnQueue.push(enemiesData[e.id]);
    }
  });

  if (waveTextEl) waveTextEl.innerText = `Wave ${waveState.currentWave + 2} in progress`;

  let enemiesSpawned = 0;

  spawnInterval = setInterval(() => {
    if (enemiesSpawned >= spawnQueue.length) {
      clearInterval(spawnInterval);
      spawningFinished = true;
      return;
    }

    const config = spawnQueue[enemiesSpawned];
    gameState.enemies.push(
    new Enemy({
        path,
        gridSize,
        ctx,
        canvas,
        config: {
        ...config,   // copy all stats
        img: config.img // pass the preloaded image
        }
    })
    );


    enemiesSpawned++;
  }, waveData.spawnInterval);
}

// =========================
// START NEXT WAVE (COUNTDOWN)
// =========================
export function startNextWave(gameState, path, gridSize, ctx, canvas, waveTextEl) {
    waveState.countdown = 40;
    waveState.status = "countdown";
  
    if (waveTextEl) {
      waveTextEl.innerText = `Next wave in: ${waveState.countdown}s`;
    }
  
    if (waveState.countdownInterval) {
      clearInterval(waveState.countdownInterval);
    }
  
    waveState.countdownInterval = setInterval(() => {
      waveState.countdown--;
  
      if (waveTextEl) {
        waveTextEl.innerText = `Next wave in: ${waveState.countdown}s`;
      }
  
      if (waveState.countdown <= 0) {
        clearInterval(waveState.countdownInterval);
        startWave(gameState, path, gridSize, ctx, canvas, waveTextEl);
      }
    }, 1000);
  }
  

// =========================
// UPDATE WAVE COMPLETION
export function updateWaveCompletion(gameState, path, gridSize, ctx, canvas, waveTextEl, skipButton) {
  if (spawningFinished && gameState.enemies.length === 0 && waveState.status === "spawning") {
    waveState.status = "done";

    if (waveTextEl) {
      waveTextEl.innerText = `Wave ${waveState.currentWave + 2} complete!`;
    }

    setTimeout(() => {
      // increment AFTER wave finishes
      waveState.currentWave++;

      // start next wave countdown
      startNextWave(gameState, path, gridSize, ctx, canvas, waveTextEl, skipButton);
    }, 2500);
  }
}

