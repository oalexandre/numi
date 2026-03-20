import type { PluginManifest } from "../types.js";

export const unitsTemperaturePlugin: PluginManifest = {
  id: "core.units-temperature",
  name: "Temperature Units",
  description: "Temperature units with custom conversions",
  units: [
    { id: "celsius", phrases: "celsius, °C, degC", baseUnitId: "celsius", format: "°C", ratio: 1 },
    {
      id: "fahrenheit",
      phrases: "fahrenheit, °F, degF",
      baseUnitId: "celsius",
      format: "°F",
      ratio: 1,
      toBase: (f: number) => (f - 32) * (5 / 9),
      fromBase: (c: number) => c * (9 / 5) + 32,
    },
    {
      id: "kelvin",
      phrases: "kelvin, K",
      baseUnitId: "celsius",
      format: "K",
      ratio: 1,
      toBase: (k: number) => k - 273.15,
      fromBase: (c: number) => c + 273.15,
    },
  ],
};
