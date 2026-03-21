import type { PluginManifest } from "../types.js";

export const unitsLengthPlugin: PluginManifest = {
  id: "core.units-length",
  name: "Length Units",
  description: "Length and distance units",
  units: [
    { id: "meter", phrases: "meter, meters, m", baseUnitId: "meter", format: "m", ratio: 1 },
    { id: "millimeter", phrases: "millimeter, millimeters, mm", baseUnitId: "meter", format: "mm", ratio: 0.001 },
    { id: "centimeter", phrases: "centimeter, centimeters, cm", baseUnitId: "meter", format: "cm", ratio: 0.01 },
    { id: "kilometer", phrases: "kilometer, kilometers, km", baseUnitId: "meter", format: "km", ratio: 1000 },
    { id: "inch", phrases: "inch, inches, in", baseUnitId: "meter", format: "in", ratio: 0.0254 },
    { id: "foot", phrases: "foot, feet, ft", baseUnitId: "meter", format: "ft", ratio: 0.3048 },
    { id: "yard", phrases: "yard, yards, yd", baseUnitId: "meter", format: "yd", ratio: 0.9144 },
    { id: "mile", phrases: "mile, miles, mi", baseUnitId: "meter", format: "mi", ratio: 1609.344 },
    { id: "nautical_mile", phrases: "nautical mile, nautical miles, nmi", baseUnitId: "meter", format: "nmi", ratio: 1852 },
  ],
  tests: [
    { description: "1 km = 1000 m", input: "1 km to m", expected: 1000 },
    { description: "1 mile ≈ 1.609 km", input: "1 mile to km", expected: 1.609344, tolerance: 0.001 },
    { description: "1 inch = 2.54 cm", input: "1 inch to cm", expected: 2.54, tolerance: 0.01 },
    { description: "1 foot ≈ 0.3048 m", input: "1 foot to m", expected: 0.3048, tolerance: 0.001 },
    { description: "1 nmi = 1852 m", input: "1 nmi to m", expected: 1852 },
  ],
};
