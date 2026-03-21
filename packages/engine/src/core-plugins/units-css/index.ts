import type { PluginManifest } from "../types.js";

const BASE_PX = 16;

export const unitsCssPlugin: PluginManifest = {
  id: "core.units-css",
  name: "CSS Units",
  description: "CSS length units (px, rem, em, pt)",
  units: [
    { id: "px", phrases: "px, pixel, pixels", baseUnitId: "px", format: "px", ratio: 1 },
    { id: "rem", phrases: "rem", baseUnitId: "px", format: "rem", ratio: BASE_PX },
    { id: "em", phrases: "em", baseUnitId: "px", format: "em", ratio: BASE_PX },
    { id: "pt", phrases: "pt, point, points", baseUnitId: "px", format: "pt", ratio: 4 / 3 },
    { id: "vw", phrases: "vw", baseUnitId: "vw", format: "vw", ratio: 1 },
    { id: "vh", phrases: "vh", baseUnitId: "vh", format: "vh", ratio: 1 },
  ],
  tests: [
    { description: "32 px = 2 rem", input: "32 px to rem", expected: 2 },
    { description: "1 rem = 16 px", input: "1 rem to px", expected: 16 },
    { description: "16 px = 12 pt", input: "16 px to pt", expected: 12 },
  ],
};
