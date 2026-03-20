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
};
