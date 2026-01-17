// AcidTower.js
import { Tower } from './Tower.js';

export class AcidTower extends Tower {
    constructor(opts = {}) {
        super({
            ...opts,
            type: "acid",
            maxLevel: 5,
            upgradeCosts: [50, 50, 400, 500, 4000],
            levelData: {
                1: { damage: 14, range: 120, fireRate: 110, dotDuration: 560, dotDamage: 42, sprite: "acid-tower.png" },
                2: { damage: 17, range: 120, fireRate: 85, dotDuration: 620, dotDamage: 50, sprite: "acid-tower2.png" },
                3: { damage: 20, range: 120, fireRate: 80, dotDuration: 700, dotDamage: 60, sprite: "acid-tower3.png" },
                4: { damage: 20, range: 120, fireRate: 77, dotDuration: 750, dotDamage: 80, sprite: "acid-tower4.png" },
                5: { damage: 20, range: 120, fireRate: 75, dotDuration: 800, dotDamage: 120, sprite: "acid-tower5.png" }
            },
            opts
        });
    }
}
