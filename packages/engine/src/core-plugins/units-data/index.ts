import type { PluginManifest } from "../types.js";

export const unitsDataPlugin: PluginManifest = {
  id: "core.units-data",
  name: "Data Units",
  description: "Digital data storage units",
  units: [
    { id: "bit", phrases: "bit, bits", baseUnitId: "bit", format: "bit", ratio: 1 },
    { id: "byte", phrases: "byte, bytes, B", baseUnitId: "bit", format: "B", ratio: 8 },
    { id: "kilobyte", phrases: "kilobyte, kilobytes, KB", baseUnitId: "bit", format: "KB", ratio: 8000 },
    { id: "megabyte", phrases: "megabyte, megabytes, MB", baseUnitId: "bit", format: "MB", ratio: 8000000 },
    { id: "gigabyte", phrases: "gigabyte, gigabytes, GB", baseUnitId: "bit", format: "GB", ratio: 8000000000 },
    { id: "terabyte", phrases: "terabyte, terabytes, TB", baseUnitId: "bit", format: "TB", ratio: 8000000000000 },
    { id: "petabyte", phrases: "petabyte, petabytes, PB", baseUnitId: "bit", format: "PB", ratio: 8000000000000000 },
    // Binary (IEC)
    { id: "kibibyte", phrases: "kibibyte, kibibytes, KiB", baseUnitId: "bit", format: "KiB", ratio: 8192 },
    { id: "mebibyte", phrases: "mebibyte, mebibytes, MiB", baseUnitId: "bit", format: "MiB", ratio: 8388608 },
    { id: "gibibyte", phrases: "gibibyte, gibibytes, GiB", baseUnitId: "bit", format: "GiB", ratio: 8589934592 },
    { id: "tebibyte", phrases: "tebibyte, tebibytes, TiB", baseUnitId: "bit", format: "TiB", ratio: 8796093022208 },
  ],
  tests: [
    { description: "1 byte = 8 bits", input: "1 byte to bits", expected: 8 },
    { description: "1 GB = 1000 MB", input: "1 GB to MB", expected: 1000 },
    { description: "1 GiB = 1024 MiB", input: "1 GiB to MiB", expected: 1024 },
  ],
};
