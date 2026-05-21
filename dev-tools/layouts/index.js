import { loadWave28Layout } from "./wave28.js";
import { loadWave18Layout } from "./wave18.js";

export const devLayouts = {
    18: loadWave18Layout,
    28: loadWave28Layout
};