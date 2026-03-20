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
};
