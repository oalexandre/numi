import type { PluginManifest } from "../types.js";

export const unitsVolumePlugin: PluginManifest = {
  id: "core.units-volume",
  name: "Volume Units",
  description: "Volume and capacity units",
  units: [
    { id: "liter", phrases: "liter, liters, litre, litres, l, L", baseUnitId: "liter", format: "L", ratio: 1 },
    { id: "milliliter", phrases: "milliliter, milliliters, ml, mL", baseUnitId: "liter", format: "mL", ratio: 0.001 },
    { id: "gallon", phrases: "gallon, gallons, gal", baseUnitId: "liter", format: "gal", ratio: 3.78541 },
    { id: "quart", phrases: "quart, quarts, qt", baseUnitId: "liter", format: "qt", ratio: 0.946353 },
    { id: "pint", phrases: "pint, pints, pt", baseUnitId: "liter", format: "pt", ratio: 0.473176 },
    { id: "cup", phrases: "cup, cups", baseUnitId: "liter", format: "cup", ratio: 0.236588 },
    { id: "fluid_ounce", phrases: "fluid ounce, fluid ounces, fl oz", baseUnitId: "liter", format: "fl oz", ratio: 0.0295735 },
    { id: "tablespoon", phrases: "tablespoon, tablespoons, tbsp", baseUnitId: "liter", format: "tbsp", ratio: 0.0147868 },
    { id: "teaspoon", phrases: "teaspoon, teaspoons, tsp", baseUnitId: "liter", format: "tsp", ratio: 0.00492892 },
  ],
};
