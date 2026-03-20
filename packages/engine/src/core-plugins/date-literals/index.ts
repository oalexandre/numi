import type { PluginManifest } from "../types.js";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const dateLiteralsPlugin: PluginManifest = {
  id: "core.date-literals",
  name: "Date Literals",
  description: "Date keywords: today, now, tomorrow, yesterday",
  dateLiterals: {
    today: { resolver: () => new Date(), detail: "current date" },
    now: { resolver: () => new Date(), detail: "current date/time" },
    tomorrow: {
      resolver: () => new Date(Date.now() + MS_PER_DAY),
      detail: "tomorrow's date",
    },
    yesterday: {
      resolver: () => new Date(Date.now() - MS_PER_DAY),
      detail: "yesterday's date",
    },
  },
};
