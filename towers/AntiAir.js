import { Tower } from './Tower.js';

export class AntiAirTower extends Tower {
    static description = "Targets flying enemies with rapid-fire aerial attacks.";

    constructor(opts) {
        super({
            ...opts,
            type: "antiAir",
            description: "Targets flying enemies with rapid-fire aerial attacks.",
            maxLevel: 5,
            upgradeCosts: [50, 400, 500, 4000],

            levelData: {
                1: {
                    damage: 61,
                    range: 125,
                    fireRate: 27,
                    sprite: "Anti-Air.png"
                },

                2: {
                    damage: 82,
                    range: 125,
                    fireRate: 22,
                    sprite: "Anti-Air2.png"
                },

                3: {
                    damage: 443,
                    range: 125,
                    fireRate: 19,
                    sprite: "antiair3.png"
                },

                4: {
                    damage: 554,
                    range: 125,
                    fireRate: 16,
                    sprite: "antiair4.png"
                },

                5: {
                    damage: 3660,
                    range: 125,
                    fireRate: 13,
                    sprite: "antiair5.png"
                }
            }
        });
    }
}