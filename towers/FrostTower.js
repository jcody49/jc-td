import { Tower } from './Tower.js';

export class FrostTower extends Tower {
    constructor(opts) {
        super({
            ...opts,
            type: "frost",
            maxLevel: 5,
            upgradeCosts: [50, 50, 300, 600, 3000],
            opts: {
                targetingMode: "unslowedFirst"
            },
            levelData: {
                1: {
                    damage: 25,
                    range: 125,
                    fireRate: 47,
                    slowMultiplier: 0.48,
                    slowDuration: 185,
                    sprite: "frost-tower.png"
                },
                2: {
                    damage: 33,
                    range: 125,
                    fireRate: 43,
                    slowMultiplier: 0.52,
                    slowDuration: 210,
                    sprite: "frost-tower2.png"
                },
                3: {
                    damage: 75,
                    range: 125,
                    fireRate: 40,
                    slowMultiplier: 0.4,
                    slowDuration: 250,
                    sprite: "frost-tower2.png"
                },
                4: {
                    damage: 100,
                    range: 125,
                    fireRate: 38,
                    slowMultiplier: 0.35,
                    slowDuration: 270,
                    sprite: "frost-tower2.png"
                },
                5: {
                    damage: 140,
                    range: 145,
                    fireRate: 35,
                    slowMultiplier: 0.3,
                    slowDuration: 300,
                    sprite: "frost-tower2.png"
                }
            }
        });
    }
}
