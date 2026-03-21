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
  tests: [
    { description: "0 °C = 32 °F", input: "0 celsius to fahrenheit", expected: 32 },
    { description: "100 °C = 212 °F", input: "100 celsius to fahrenheit", expected: 212 },
    { description: "0 °C = 273.15 K", input: "0 celsius to kelvin", expected: 273.15, tolerance: 0.01 },
    { description: "32 °F = 0 °C", input: "32 fahrenheit to celsius", expected: 0, tolerance: 0.01 },
  ],
};
