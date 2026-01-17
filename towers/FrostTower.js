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
                    damage: 30,
                    range: 117,
                    fireRate: 45,
                    slowMultiplier: 0.5,
                    slowDuration: 210,
                    sprite: "frost-tower.png"
                },
                2: {
                    damage: 40,
                    range: 117,
                    fireRate: 42,
                    slowMultiplier: 0.55,
                    slowDuration: 230,
                    sprite: "frost-tower2.png"
                },
                3: {
                    damage: 75,
                    range: 130,
                    fireRate: 40,
                    slowMultiplier: 0.4,
                    slowDuration: 250,
                    sprite: "frost-tower2.png"
                },
                4: {
                    damage: 100,
                    range: 135,
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
