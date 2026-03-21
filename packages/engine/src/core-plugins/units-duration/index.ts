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
  tests: [
    { description: "2 hours = 120 min", input: "2 hours to minutes", expected: 120 },
    { description: "1 day = 24 hours", input: "1 day to hours", expected: 24 },
    { description: "2 weeks = 14 days", input: "2 weeks to days", expected: 14 },
    { description: "1 hour = 3600 sec", input: "1 hour to seconds", expected: 3600 },
  ],
  help: [{
    title: "Duration",
    examples: [
      { input: "2 hours to minutes", output: "120 min" },
      { input: "90 minutes to hours", output: "1.5 hr" },
      { input: "1 week to days", output: "7 days" },
    ],
  }],
};
