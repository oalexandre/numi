import type { PluginManifest } from "../types.js";

export const mathFunctionsPlugin: PluginManifest = {
  id: "core.math-functions",
  name: "Math Functions",
  description: "Built-in mathematical functions",
  functions: {
    // Basic
    sqrt: { fn: Math.sqrt, detail: "square root" },
    cbrt: { fn: Math.cbrt, detail: "cube root" },
    abs: { fn: Math.abs, detail: "absolute value" },
    ceil: { fn: Math.ceil, detail: "round up" },
    floor: { fn: Math.floor, detail: "round down" },
    round: { fn: Math.round, detail: "round nearest" },
    trunc: { fn: Math.trunc, detail: "truncate decimals" },
    sign: { fn: Math.sign, detail: "sign (-1, 0, 1)" },
    exp: { fn: Math.exp, detail: "e^x" },

    // Trigonometric
    sin: { fn: Math.sin, detail: "sine" },
    cos: { fn: Math.cos, detail: "cosine" },
    tan: { fn: Math.tan, detail: "tangent" },
    asin: { fn: Math.asin, detail: "arc sine" },
    acos: { fn: Math.acos, detail: "arc cosine" },
    atan: { fn: Math.atan, detail: "arc tangent" },

    // Logarithmic
    log: { fn: Math.log10, detail: "log base 10" },
    log10: { fn: Math.log10, detail: "log base 10" },
    ln: { fn: Math.log, detail: "natural log" },
    log2: { fn: Math.log2, detail: "log base 2" },

    // Multi-arg
    min: { fn: Math.min, detail: "minimum" },
    max: { fn: Math.max, detail: "maximum" },
  },
};
