// AcidTower.js
import { Tower } from './Tower.js';

export class AcidTower extends Tower {
    static description = "Corrodes tough enemies over time. Slow fire rate and weak damage per shot. Most effective against high-health targets.";

    constructor(opts = {}) {
        super({
            ...opts,
            type: "acid",
            description: "Corrodes tough enemies over time. Slow fire rate and weak damage per shot. Most effective against high-health targets.",
            maxLevel: 5,
            opts: {
                canHitFlying: true
            },
            upgradeCosts: [50, 400, 500, 4000],
            levelData: {
                1: { damage: 14, range: 120, fireRate: 110, dotDuration: 560, dotDamage: 48, sprite: "acid-tower.png" },
                2: { damage: 20, range: 120, fireRate: 85, dotDuration: 520, dotDamage: 200, sprite: "acid-tower2.png" },
                3: { damage: 102, range: 120, fireRate: 78, dotDuration: 465, dotDamage: 460, sprite: "acid-tower3.png" },
                4: { damage: 127, range: 120, fireRate: 75, dotDuration: 400, dotDamage: 615, sprite: "acid-tower4.png" },
                5: { damage: 840, range: 120, fireRate: 71, dotDuration: 280, dotDamage: 2880, sprite: "acid-tower5.png" }
            },
            opts
        });
    }
}
