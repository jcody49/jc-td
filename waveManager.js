// =========================
// waveManager.js
// =========================

import { Enemy } from './enemies/enemies.js';
import { enemiesData } from './enemies/enemyData.js';
import { waves } from './waves.js';
import { showMoneyPopup } from './ui-effects.js';

import { showTip, checkUpgradeTip } from './tips.js';


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
let spawnQueue = [];
let enemiesSpawned = 0;
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
    const enemy = enemiesData[enemyId];
  
    if (!enemy) return enemyId;
  
    // prefer new system
    if (enemy.types?.length) {
      return enemy.types.join(", ");
    }
  
    return enemy.type || enemyId;
  };

  currentEl.textContent = getWaveEnemyType(waveState.currentWave);
  nextEl.textContent    = getWaveEnemyType(waveState.currentWave + 1);
  soonEl.textContent    = getWaveEnemyType(waveState.currentWave + 2);
}

// =========================
// STOP / RESET INTERVALS
// =========================
export function stopAllWaveIntervals() {
  if (spawnInterval) {
    clearInterval(spawnInterval);
    spawnInterval = null;
  }

  if (waveState.countdownInterval) {
    clearInterval(waveState.countdownInterval);
    waveState.countdownInterval = null;
  }

  spawningFinished = false;
  completionLocked = false;
  spawnQueue = [];
  enemiesSpawned = 0;

  console.log("🛑 WaveManager intervals cleared");
}

// Alias for clarity
export const stopWaveSpawning = stopAllWaveIntervals;

// =========================
// SPAWN HELPERS
// =========================
function applyDifficulty(config, difficulty) {
  const copy = { ...config };
  switch (difficulty) {
    case "beginner":
      copy.maxHp *= 0.63;
      copy.score = Math.round((copy.score ?? 5) * 0.55);
      copy.speed = (copy.speed ?? 1) * 0.88;
      break;
    case "easy":
      copy.maxHp *= 0.77;
      copy.score = Math.round((copy.score ?? 5) * 0.8);
      break;
    case "hard":
      copy.maxHp *= 1.09;
      copy.score = Math.round((copy.score ?? 5) * 1.2);
      break;
    default:
      copy.score = copy.score ?? 5;
  }
  return copy;
}

// =========================
// START WAVE (SPAWNING)
// =========================
export function startWave(gameState, gridSize, ctx, canvas, waveTextEl) {
  if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) throw new Error("Invalid ctx");
  if (!waveState.path || !waveState.path.length) throw new Error("Invalid path");

  const waveData = waves[waveState.currentWave];
  if (!waveData) return;

  waveState.status = "spawning";
  spawningFinished = false;

  // Build spawn queue
  spawnQueue = [];
  waveData.enemies.forEach(e => {
    for (let i = 0; i < e.count; i++) {
      const config = enemiesData[e.id];
      if (config) spawnQueue.push(config);
    }
  });
  enemiesSpawned = 0;

  if (waveTextEl) {
    const enemyId = waveData.enemies[0]?.id;
    const enemyName = enemiesData[enemyId]?.name || enemyId;
    waveTextEl.innerHTML = `Wave ${waveState.currentWave + 1} in progress:<br><span class="wave-text-neon">${enemyName}</span>`;
  }

  updateWavePreview();

  if (spawnInterval) clearInterval(spawnInterval);

  spawnInterval = setInterval(() => {
    if (window.gamePaused) return;

    if (enemiesSpawned >= spawnQueue.length) {
      clearInterval(spawnInterval);
      spawningFinished = true;
      return;
    }

    const config = applyDifficulty(spawnQueue[enemiesSpawned], gameState.difficulty);

    

    gameState.enemies.push(new Enemy({
      path: waveState.path,
      gridSize,
      ctx,
      canvas,
      config
    }));

    enemiesSpawned++;
  }, waveData.spawnInterval / window.gameSpeed);
}

// =========================
// COUNTDOWN TO NEXT WAVE
// =========================
export function startNextWave(gameState, gridSize, ctx, canvas, waveTextEl) {
  if (!gameState.difficulty) return;
  waveState.countdown = 40;
  waveState.status = "countdown";

  const skipButton = document.getElementById("skipButton");
  if (skipButton) {
    skipButton.disabled = false;
    skipButton.style.display = "block";
  }

  if (waveTextEl) waveTextEl.innerText = `Wave ${waveState.currentWave + 1} in: ${waveState.countdown}`;
  updateWavePreview();

  const nextWave = waves[waveState.currentWave];

  if (nextWave?.enemies?.length) {

      const enemyId = nextWave.enemies[0].id;

      const enemy = enemiesData[enemyId];

      if (enemy?.isFlying) {
          showTip("flyingEnemies");
      }

      if (enemy?.canBeTargetedByAntiAir) {
          showTip("giantEnemies");
      }

      if (enemy?.armor > 0) {
          showTip("armor");
      }
  }

  if (waveState.countdownInterval) clearInterval(waveState.countdownInterval);

  waveState.countdownInterval = setInterval(() => {
    if (window.gamePaused) return;

    waveState.countdown--;
    if (waveTextEl) waveTextEl.innerText = `Wave ${waveState.currentWave + 1} in: ${waveState.countdown}`;

    if (waveState.countdown <= 0) {
      clearInterval(waveState.countdownInterval);
      waveState.countdownInterval = null;
      startWave(gameState, gridSize, ctx, canvas, waveTextEl);
    }
  }, 1000 / window.gameSpeed);
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
    if (currentWaveData?.income) {
      gameState.money = (gameState.money || 0) + currentWaveData.income;
      checkUpgradeTip(gameState);
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
      completionLocked = false;
      updateWavePreview();
      startNextWave(gameState, gridSize, ctx, canvas, waveTextEl);
    }, 2000);
  }
}

// =========================
// FAST-FORWARD SUPPORT
// =========================
export function adjustWaveSpeed(gameState, gridSize, ctx, canvas, waveTextEl) {
  // Restart countdown interval
  if (waveState.countdownInterval) {
    clearInterval(waveState.countdownInterval);

    waveState.countdownInterval = setInterval(() => {
      if (window.gamePaused) return;

      waveState.countdown--;
      if (waveTextEl) waveTextEl.innerText = `Wave ${waveState.currentWave + 1} in: ${waveState.countdown}`;

      if (waveState.countdown <= 0) {
        clearInterval(waveState.countdownInterval);
        waveState.countdownInterval = null;
        startWave(gameState, gridSize, ctx, canvas, waveTextEl);
      }
    }, 1000 / window.gameSpeed);
  }

  // Restart enemy spawn interval
  if (spawnInterval && !spawningFinished) {
    const waveData = waves[waveState.currentWave];
    clearInterval(spawnInterval);

    spawnInterval = setInterval(() => {
      if (window.gamePaused) return;

      if (enemiesSpawned >= spawnQueue.length) {
        clearInterval(spawnInterval);
        spawningFinished = true;
        return;
      }

      const config = applyDifficulty(spawnQueue[enemiesSpawned], gameState.difficulty);

      gameState.enemies.push(new Enemy({
        path: waveState.path,
        gridSize,
        ctx,
        canvas,
        config
      }));

      enemiesSpawned++;
    }, waveData.spawnInterval / window.gameSpeed);
  }
}