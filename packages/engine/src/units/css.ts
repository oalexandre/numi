import type { UnitDefinition } from "./registry.js";
import type { UnitRegistry } from "./registry.js";

const BASE_PX = 16; // default rem base

export function registerCssUnits(registry: UnitRegistry): void {
  const units: UnitDefinition[] = [
    { id: "px", phrases: "px, pixel, pixels", baseUnitId: "px", format: "px", ratio: 1 },
    { id: "rem", phrases: "rem", baseUnitId: "px", format: "rem", ratio: BASE_PX },
    { id: "em", phrases: "em", baseUnitId: "px", format: "em", ratio: BASE_PX },
    { id: "pt", phrases: "pt, point, points", baseUnitId: "px", format: "pt", ratio: 4 / 3 },
    { id: "vw", phrases: "vw", baseUnitId: "vw", format: "vw", ratio: 1 },
    { id: "vh", phrases: "vh", baseUnitId: "vh", format: "vh", ratio: 1 },
  ];

  for (const unit of units) {
    registry.addUnit(unit);
  }
}
