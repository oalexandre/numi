import type { PluginManifest } from "../types.js";

export const unitsWeightPlugin: PluginManifest = {
  id: "core.units-weight",
  name: "Weight Units",
  description: "Weight and mass units",
  units: [
    { id: "kilogram", phrases: "kilogram, kilograms, kg", baseUnitId: "kilogram", format: "kg", ratio: 1 },
    { id: "milligram", phrases: "milligram, milligrams, mg", baseUnitId: "kilogram", format: "mg", ratio: 0.000001 },
    { id: "gram", phrases: "gram, grams, g", baseUnitId: "kilogram", format: "g", ratio: 0.001 },
    { id: "ton", phrases: "ton, tons, tonne, tonnes, t", baseUnitId: "kilogram", format: "t", ratio: 1000 },
    { id: "ounce", phrases: "ounce, ounces, oz", baseUnitId: "kilogram", format: "oz", ratio: 0.0283495 },
    { id: "pound", phrases: "pound, pounds, lb, lbs", baseUnitId: "kilogram", format: "lb", ratio: 0.453592 },
    { id: "stone", phrases: "stone, stones, st", baseUnitId: "kilogram", format: "st", ratio: 6.35029 },
  ],
};
