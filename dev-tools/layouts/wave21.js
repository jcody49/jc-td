import { stopAllWaveIntervals, waveState, startNextWave } from "../../waveManager.js";

import { CannonTower } from "../../towers/CannonTower.js";
import { FrostTower } from "../../towers/FrostTower.js";
import { TankTower } from "../../towers/TankTower.js";
import { AntiAirTower } from "../../towers/AntiAir.js";
import { BoosterTower } from "../../towers/BoosterTower.js";
import { DetectionTower } from "../../towers/DetectionTower.js";
import { AcidTower } from "../../towers/AcidTower.js";

export function loadWave21Layout({
    gameState,
    ctx,
    canvas,
    gridSize,
    gridOccupied,
    waveTextEl
}) {

    stopAllWaveIntervals();

    gameState.enemies = [];
    gameState.projectiles = [];
    gameState.towers = [];

    waveState.currentWave = 20;
    waveState.countdown = 40;
    waveState.status = "countdown";

    gameState.money = 39;

    function placeTower(TowerClass, col, row, level = 1) {

        const x = col * gridSize + gridSize / 2;
        const y = row * gridSize + gridSize / 2;

        const tower = new TowerClass({
            x,
            y,
            ctx,
            gameState
        });

        if (level > 1) {
            tower.level = level;
            tower.applyLevel();
        }

        gameState.towers.push(tower);

        gridOccupied[col][row] = true;
    }

    // ======================
    // TEST TOWER LAYOUT
    // ======================

    placeTower(CannonTower, 5, 6, 2);
    placeTower(CannonTower, 7, 7, 2);
    placeTower(CannonTower, 9, 6, 2);

    placeTower(TankTower, 7, 6, 3);

    placeTower(FrostTower, 7, 8, 4);

    placeTower(AntiAirTower, 7, 5, 2);

    placeTower(DetectionTower, 5, 7);

    placeTower(AntiAirTower, 9, 5, 1);

    placeTower(BoosterTower, 9, 7, 1);

    startNextWave(
        gameState,
        gridSize,
        ctx,
        canvas,
        waveTextEl
    );

    console.log("🚀 Wave 21 dev layout loaded");
}