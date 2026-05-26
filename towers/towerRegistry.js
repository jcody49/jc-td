import { CannonTower } from "./CannonTower.js";
import { FrostTower } from "./FrostTower.js";
import { AcidTower } from "./AcidTower.js";
import { TankTower } from "./TankTower.js";
import { AntiAirTower } from "./AntiAir.js";
import { DetectionTower } from "./DetectionTower.js";
import { BoosterTower } from "./BoosterTower.js";

export const TOWER_REGISTRY = {
    cannon: CannonTower,
    frost: FrostTower,
    acid: AcidTower,
    tank: TankTower,
    antiAir: AntiAirTower,
    detection: DetectionTower,
    booster: BoosterTower
};