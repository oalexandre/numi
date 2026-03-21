import type { PluginManifest } from "../types.js";

export const mathConstantsPlugin: PluginManifest = {
  id: "core.math-constants",
  name: "Math Constants",
  description: "Built-in mathematical constants",
  constants: {
    pi: { value: Math.PI, detail: "3.14159..." },
    e: { value: Math.E, detail: "2.71828..." },
    tau: { value: Math.PI * 2, detail: "6.28318..." },
  },
  tests: [
    { description: "pi ≈ 3.14159", input: "pi", expected: Math.PI, tolerance: 0.00001 },
    { description: "e ≈ 2.71828", input: "e", expected: Math.E, tolerance: 0.00001 },
    { description: "tau ≈ 6.28318", input: "tau", expected: Math.PI * 2, tolerance: 0.00001 },
    { description: "2 * pi = tau", input: "2 * pi", expected: Math.PI * 2, tolerance: 0.00001 },
  ],
};
