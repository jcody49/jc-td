import { CannonTower } from "./cannonTower.js";
import { FrostTower } from "./frostTower.js";
import { AcidTower } from "./acidTower.js";
import { TankTower } from "./tankTower.js";

export const TOWER_REGISTRY = {
    cannon: CannonTower,
    frost: FrostTower,
    acid: AcidTower,
    tank: TankTower
};
