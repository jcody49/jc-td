import { Tower } from './Tower.js';

export class TankTower extends Tower {
    constructor(opts) {
        super({
            ...opts,
            type: "tank",
            maxLevel: 5,
            upgradeCosts: [60, 65, 400, 500, 4000],
            levelData: {
                1: {
                    damage: 300,
                    range: 120,
                    fireRate: 100,
                    splashRadius: 60,
                    sprite: "tank-tower.png"
                },
                2: {
                    damage: 45,
                    range: 125,
                    fireRate: 95,
                    splashRadius: 70,
                    sprite: "tank-tower2.png"
                },
                3: {
                    damage: 70,
                    range: 130,
                    fireRate: 90,
                    splashRadius: 80,
                    sprite: "tank-tower2.png"
                },
                4: {
                    damage: 105,
                    range: 135,
                    fireRate: 85,
                    splashRadius: 90,
                    sprite: "tank-tower2.png"
                },
                5: {
                    damage: 150,
                    range: 145,
                    fireRate: 80,
                    splashRadius: 100,
                    sprite: "tank-tower2.png"
                }
            }
        });
    }
}
