import { Tower } from './Tower.js';

export class CannonTower extends Tower {
    static description = "Deals strong single-target damage to ground enemies.";
    
    constructor(opts) {
        super({
            ...opts,
            type: "cannon",
            description: "Deals strong single-target damage to ground enemies.",
            maxLevel: 5,
            upgradeCosts: [50, 400, 500, 4000],
            levelData: {
                1: { damage: 55, range: 125, fireRate: 78, sprite: "cannon.png" }, //LOCKED
                2: { damage: 75, range: 125, fireRate: 41, sprite: "cannon2.png" },
                3: { damage: 450, range: 125, fireRate: 42, sprite: "cannon3.png" },
                4: { damage: 650, range: 125, fireRate: 41, sprite: "cannon4.png" },
                5: { damage: 3000, range: 125, fireRate: 40, sprite: "cannon5.png" }
            }
        });

        // Add this line so the tower knows about the game state
        this.gameState = opts.gameState;
    }
}
/*
2) 1.35
3) 7.27
4) 9.09
5) 60
*/