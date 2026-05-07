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
}