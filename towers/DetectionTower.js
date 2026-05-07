import { Tower } from './Tower.js';

export class DetectionTower extends Tower {
  static description = "Reveals invisible enemies in range so they can be targeted.";

  constructor(opts) {
    super({
      ...opts,
      type: "detection",
      description: "Reveals invisible enemies in range so they can be targeted.",
      maxLevel: 1,
      upgradeCosts: [],

      opts: {
        isDetectionTower: true
      },

      levelData: {
        1: {
          range: 150,
          fireRate: 9999,
          sprite: "detection.png"
        }
      }
    });
  }

  // =========================
  // DETECTION LOGIC (CORRECT PLACE)
  // =========================
  update(enemies = []) {
    if (!Array.isArray(enemies)) return;

    for (const e of enemies) {
      const d = Math.hypot(this.x - e.x, this.y - e.y);

      if (d <= this.range) {
        e.isRevealed = true;
      }
    }
  }
}