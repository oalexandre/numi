import type { PluginManifest } from "../types.js";

const toHex = (n: number) => "0x" + Math.trunc(n).toString(16).toUpperCase();
const toBin = (n: number) => "0b" + (Math.trunc(n) >>> 0).toString(2);
const toOct = (n: number) => "0o" + Math.trunc(n).toString(8);
const toDec = (n: number) => String(Math.trunc(n));

export const baseConversionPlugin: PluginManifest = {
  id: "core.base-conversion",
  name: "Base Conversion",
  description: "Number base conversions (hex, binary, octal, decimal)",
  baseConversions: {
    hex: { formatter: toHex, detail: "hexadecimal", aliases: ["hexadecimal"] },
    binary: { formatter: toBin, detail: "binary", aliases: ["bin"] },
    octal: { formatter: toOct, detail: "octal", aliases: ["oct"] },
    decimal: { formatter: toDec, detail: "decimal", aliases: ["dec"] },
  },
};
