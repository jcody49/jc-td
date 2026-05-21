import { Tower } from './Tower.js';

export class FrostTower extends Tower {
    static description = "Slows enemies in range with icy attacks--maximizes splash damage potential.";

    constructor(opts) {
        super({
            ...opts,
            type: "frost",
            description: "Slows enemies in range with icy attacks--maximizes splash damage potential.",
            maxLevel: 5,
            upgradeCosts: [50, 400, 500, 4000],
            opts: {
                targetingMode: "unslowedFirst",
                canHitFlying: true
            },
            levelData: {
                1: {
                    damage: 24,
                    range: 125,
                    fireRate: 48,
                    slowMultiplier: 0.61,
                    slowDuration: 195,
                    sprite: "frost-tower.png"
                },
                2: {
                    damage: 42,
                    range: 125,
                    fireRate: 45,
                    slowMultiplier: 0.56,
                    slowDuration: 200,
                    sprite: "frost-tower2.png"
                },
                3: {
                    damage: 174,
                    range: 125,
                    fireRate: 37,
                    slowMultiplier: 0.51,
                    slowDuration: 235,
                    sprite: "frost-tower3.png"
                },
                4: {
                    damage: 218,
                    range: 125,
                    fireRate: 35,
                    slowMultiplier: 0.45,
                    slowDuration: 280,
                    sprite: "frost-tower4.png"
                },
                5: {
                    damage: 1440,
                    range: 145,
                    fireRate: 33,
                    slowMultiplier: 0.3,
                    slowDuration: 300,
                    sprite: "frost-tower5.png"
                }
            }
        });
    }
}
