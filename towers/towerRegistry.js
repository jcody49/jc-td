import { CannonTower } from "./towers/CannonTower.js";
import { FrostTower } from "./towers/FrostTower.js";
import { AcidTower } from "./towers/AcidTower.js";
import { TankTower } from "./towers/TankTower.js";
import { AntiAirTower } from "./towers/AntiAir.js";
import { DetectionTower } from "./towers/DetectionTower.js";
import { BoosterTower } from "./towers/BoosterTower.js";

export const TOWER_REGISTRY = {
    cannon: CannonTower,
    frost: FrostTower,
    acid: AcidTower,
    tank: TankTower,
    antiAir: AntiAirTower,
    detection: DetectionTower,
    booster: BoosterTower
};
