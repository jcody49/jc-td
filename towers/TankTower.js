import { Tower } from './Tower.js';

export class TankTower extends Tower {
    static description = "Slow fire rate, lower direct damage, but causes splash damage and destructive to armor.";

    constructor(opts) {
        super({
            ...opts,
            type: "tank",
            description: "Slow fire rate, lower direct damage, but causes splash damage and destructive to armor.",
            maxLevel: 5,
            upgradeCosts: [65, 400, 500, 4000],
            levelData: {
                1: {
                    damage: 56,
                    range: 125,
                    fireRate: 142,
                    splashRadius: 75,
                    sprite: "tank-tower.png"
                },
                2: {
                    damage: 63,
                    range: 125,
                    fireRate: 134,
                    splashRadius: 75,
                    sprite: "tank-tower2.png"
                },
                3: {
                    damage: 85,
                    range: 125,
                    fireRate: 127,
                    splashRadius: 77,
                    sprite: "tank-tower3.png"
                },
                4: {
                    damage: 110,
                    range: 125,
                    fireRate: 115,
                    splashRadius: 75,
                    sprite: "tank-tower4.png"
                },
                5: {
                    damage: 150,
                    range: 145,
                    fireRate: 80,
                    splashRadius: 78,
                    sprite: "tank-tower5.png"
                }
            }
        });
    }
}
