import { Tower } from './Tower.js';

export class BoosterTower extends Tower {
  static description =
    "Boosts nearby towers with either increased damage or faster fire rate.";

  constructor(opts) {
    super({
      ...opts,
      type: "booster",
      description:
        "Boosts nearby towers with either increased damage or faster fire rate.",

      maxLevel: 6,

      upgradeCosts: [500, 1500, 8000, 15000, 25000],

      opts: {
        isBoosterTower: true
      },

      levelData: {
        1: {
          range: 125,
          boostPercent: 0.15,
          sprite: "booster.png"
        },

        2: {
          range: 125,
          boostPercent: 0.25,
          sprite: "booster2.png"
        },

        3: {
          range: 125,
          boostPercent: 0.4,
          sprite: "booster3.png"
        },

        4: {
          range: 125,
          boostPercent: 0.6,
          sprite: "booster4.png"
        },

        5: {
          range: 125,
          boostPercent: 0.68,
          sprite: "booster5.png"
        },

        6: {
            range: 125,
            boostPercent: 0.75,
            sprite: "booster5.png"
        },
      }
    });

    // damage | fireRate
    this.boostMode = "damage";
  }
}