import { Tower } from './Tower.js';

export class AntiAirTower extends Tower {
    static description = "Targets flying enemies with rapid-fire aerial attacks.";

    constructor(opts) {
        super({
            ...opts,
            type: "antiAir",
            description: "Targets flying enemies with rapid-fire aerial attacks.",
            maxLevel: 5,

            upgradeCosts: [50, 100, 250, 600, 3000],

            levelData: {
                1: {
                    damage: 40,
                    range: 180,
                    fireRate: 24,
                    sprite: "Anti-Air.png"
                },

                2: {
                    damage: 60,
                    range: 190,
                    fireRate: 22,
                    sprite: "Anti-Air2.png"
                },

                3: {
                    damage: 85,
                    range: 205,
                    fireRate: 19,
                    sprite: "antiair3.png"
                },

                4: {
                    damage: 120,
                    range: 220,
                    fireRate: 16,
                    sprite: "antiair4.png"
                },

                5: {
                    damage: 170,
                    range: 240,
                    fireRate: 13,
                    sprite: "antiair5.png"
                }
            }
        });
    }
}