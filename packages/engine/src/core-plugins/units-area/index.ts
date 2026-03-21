import type { PluginManifest } from "../types.js";

export const unitsAreaPlugin: PluginManifest = {
  id: "core.units-area",
  name: "Area Units",
  description: "Area measurement units",
  units: [
    { id: "sqmeter", phrases: "square meter, square meters, m², m2, sqm", baseUnitId: "sqmeter", format: "m²", ratio: 1 },
    { id: "sqmillimeter", phrases: "square millimeter, square millimeters, mm², mm2", baseUnitId: "sqmeter", format: "mm²", ratio: 0.000001 },
    { id: "sqcentimeter", phrases: "square centimeter, square centimeters, cm², cm2", baseUnitId: "sqmeter", format: "cm²", ratio: 0.0001 },
    { id: "sqkilometer", phrases: "square kilometer, square kilometers, km², km2", baseUnitId: "sqmeter", format: "km²", ratio: 1000000 },
    { id: "sqinch", phrases: "square inch, square inches, in², in2, sqin", baseUnitId: "sqmeter", format: "in²", ratio: 0.00064516 },
    { id: "sqfoot", phrases: "square foot, square feet, ft², ft2, sqft", baseUnitId: "sqmeter", format: "ft²", ratio: 0.092903 },
    { id: "acre", phrases: "acre, acres", baseUnitId: "sqmeter", format: "acre", ratio: 4046.86 },
    { id: "hectare", phrases: "hectare, hectares, ha", baseUnitId: "sqmeter", format: "ha", ratio: 10000 },
  ],
  tests: [
    { description: "1 acre ≈ 0.405 ha", input: "1 acre to ha", expected: 0.404686, tolerance: 0.001 },
    { description: "1 sqft ≈ 0.0929 m²", input: "1 sqft to sqm", expected: 0.092903, tolerance: 0.001 },
  ],
  help: [{
    title: "Area",
    examples: [
      { input: "1 acre to m²", output: "4,046.856 m²" },
      { input: "100 ft² to m²", output: "9.29 m²" },
    ],
  }],
};
