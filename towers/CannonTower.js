import { Tower } from './Tower.js';

export class CannonTower extends Tower {
    constructor(opts) {
        super({
            ...opts,
            type: "cannon",
            maxLevel: 5,
            upgradeCosts: [50, 50, 400, 500, 4000],
            levelData: {
                1: { damage: 55, range: 115, fireRate: 54, sprite: "cannon.png" },
                2: { damage: 72, range: 115, fireRate: 49, sprite: "cannon2.png" },
                3: { damage: 90, range: 125, fireRate: 45, sprite: "cannon3.png" },
                4: { damage: 120, range: 130, fireRate: 42, sprite: "cannon4.png" },
                5: { damage: 170, range: 140, fireRate: 38, sprite: "cannon5.png" }
            }
        });

        // Add this line so the tower knows about the game state
        this.gameState = opts.gameState;
    }
}
