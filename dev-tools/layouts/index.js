import { loadWave28Layout } from "./wave28.js";
import { loadWave18Layout } from "./wave18.js";
import { loadWave19Layout } from "./wave19.js";
import { loadWave20Layout } from "./wave20.js";
import { loadWave21Layout } from "./wave21.js";
import { loadWave22Layout } from "./wave22.js";
import { loadWave23Layout } from "./wave23.js";
import { loadWave24Layout } from "./wave24.js";
import { loadWave25Layout } from "./wave25.js";
import { loadWave26Layout } from "./wave26.js";
import { loadWave27Layout } from "./wave27.js";

export const devLayouts = {
    18: loadWave18Layout,
    19: loadWave19Layout,
    20: loadWave20Layout,
    21: loadWave21Layout,
    22: loadWave22Layout,
    23: loadWave23Layout,
    24: loadWave24Layout,
    25: loadWave25Layout,
    26: loadWave26Layout,
    27: loadWave27Layout,
    28: loadWave28Layout
};