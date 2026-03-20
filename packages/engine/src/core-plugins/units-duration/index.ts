import type { PluginManifest } from "../types.js";

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const MS_PER_WEEK = 7 * MS_PER_DAY;
const MS_PER_MONTH = 30.4375 * MS_PER_DAY;
const MS_PER_YEAR = 365.25 * MS_PER_DAY;

export const unitsDurationPlugin: PluginManifest = {
  id: "core.units-duration",
  name: "Duration Units",
  description: "Time duration units",
  units: [
    { id: "millisecond", phrases: "millisecond, milliseconds, ms", baseUnitId: "millisecond", format: "ms", ratio: 1 },
    { id: "second", phrases: "second, seconds, sec, secs", baseUnitId: "millisecond", format: "sec", ratio: MS_PER_SECOND },
    { id: "minute", phrases: "minute, minutes, min, mins", baseUnitId: "millisecond", format: "min", ratio: MS_PER_MINUTE },
    { id: "hour", phrases: "hour, hours, hr, hrs", baseUnitId: "millisecond", format: "hr", ratio: MS_PER_HOUR },
    { id: "day", phrases: "day, days", baseUnitId: "millisecond", format: "days", ratio: MS_PER_DAY },
    { id: "week", phrases: "week, weeks", baseUnitId: "millisecond", format: "weeks", ratio: MS_PER_WEEK },
    { id: "month", phrases: "month, months", baseUnitId: "millisecond", format: "months", ratio: MS_PER_MONTH },
    { id: "year", phrases: "year, years", baseUnitId: "millisecond", format: "years", ratio: MS_PER_YEAR },
  ],
};
