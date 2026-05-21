import { Tower } from './Tower.js';

export class TankTower extends Tower {
    static description = "Slow fire rate, lower direct damage, but causes splash damage and destructive to armor.";

    constructor(opts) {
        super({
            ...opts,
            type: "tank",
            description: "Slow fire rate, lower direct damage, but causes splash damage and destructive to armor.",
            maxLevel: 5,
            upgradeCosts: [65, 475, 650, 4000],
            levelData: {
                1: {
                    damage: 52,
                    range: 125,
                    fireRate: 142,
                    splashRadius: 75,
                    sprite: "tank-tower.png"
                },
                2: {
                    damage: 70,
                    range: 125,
                    fireRate: 134,
                    splashRadius: 75,
                    sprite: "tank-tower2.png"
                },
                3: {
                    damage: 378,
                    range: 120,
                    fireRate: 127,
                    splashRadius: 78,
                    sprite: "tank-tower3.png"
                },
                4: {
                    damage: 473,
                    range: 125,
                    fireRate: 112,
                    splashRadius: 75,
                    sprite: "tank-tower4.png"
                },
                5: {
                    damage: 3120,
                    range: 145,
                    fireRate: 80,
                    splashRadius: 78,
                    sprite: "tank-tower5.png"
                }
            }
        });
    }
}
