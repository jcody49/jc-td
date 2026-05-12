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
                    fireRate: 49,
                    slowMultiplier: 0.61,
                    slowDuration: 193,
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
                    damage: 112,
                    range: 125,
                    fireRate: 40,
                    slowMultiplier: 0.43,
                    slowDuration: 235,
                    sprite: "frost-tower3.png"
                },
                4: {
                    damage: 127,
                    range: 125,
                    fireRate: 38,
                    slowMultiplier: 0.35,
                    slowDuration: 270,
                    sprite: "frost-tower4.png"
                },
                5: {
                    damage: 140,
                    range: 145,
                    fireRate: 35,
                    slowMultiplier: 0.3,
                    slowDuration: 300,
                    sprite: "frost-tower5.png"
                }
            }
        });
    }
}
