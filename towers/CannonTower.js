import { Tower } from './Tower.js';

export class CannonTower extends Tower {
    constructor(opts) {
        super({
            ...opts,
            type: "cannon",
            maxLevel: 5,
            upgradeCosts: [50, 50, 400, 500, 4000],
            levelData: {
                1: { damage: 55, range: 115, fireRate: 60, sprite: "cannon.png" },
                2: { damage: 65, range: 120, fireRate: 58, sprite: "cannon2.png" },
                3: { damage: 80, range: 125, fireRate: 55, sprite: "cannon3.png" },
                4: { damage: 110, range: 130, fireRate: 50, sprite: "cannon4.png" },
                5: { damage: 150, range: 140, fireRate: 45, sprite: "cannon5.png" }
              }              
        });
    }
}
