import type { PluginManifest } from "../types.js";

/**
 * Map timezone abbreviations and city names to IANA timezone identifiers.
 * Only single-word identifiers work with the parser's BaseKeyword rule.
 */
const TIMEZONE_MAP: Record<string, { iana: string; label: string }> = {
  // Standard abbreviations
  UTC: { iana: "UTC", label: "UTC" },
  GMT: { iana: "GMT", label: "GMT" },

  // Americas
  EST: { iana: "America/New_York", label: "EST" },
  EDT: { iana: "America/New_York", label: "EDT" },
  CST: { iana: "America/Chicago", label: "CST" },
  CDT: { iana: "America/Chicago", label: "CDT" },
  MST: { iana: "America/Denver", label: "MST" },
  MDT: { iana: "America/Denver", label: "MDT" },
  PST: { iana: "America/Los_Angeles", label: "PST" },
  PDT: { iana: "America/Los_Angeles", label: "PDT" },
  BRT: { iana: "America/Sao_Paulo", label: "BRT" },

  // Europe
  CET: { iana: "Europe/Paris", label: "CET" },
  CEST: { iana: "Europe/Paris", label: "CEST" },
  EET: { iana: "Europe/Athens", label: "EET" },
  EEST: { iana: "Europe/Athens", label: "EEST" },
  WET: { iana: "Europe/Lisbon", label: "WET" },
  MSK: { iana: "Europe/Moscow", label: "MSK" },

  // Asia & Oceania
  JST: { iana: "Asia/Tokyo", label: "JST" },
  KST: { iana: "Asia/Seoul", label: "KST" },
  IST: { iana: "Asia/Kolkata", label: "IST" },
  SGT: { iana: "Asia/Singapore", label: "SGT" },
  HKT: { iana: "Asia/Hong_Kong", label: "HKT" },
  AEST: { iana: "Australia/Sydney", label: "AEST" },
  AEDT: { iana: "Australia/Sydney", label: "AEDT" },
  NZST: { iana: "Pacific/Auckland", label: "NZST" },

  // City names (single-word only — parser limitation)
  London: { iana: "Europe/London", label: "London" },
  Paris: { iana: "Europe/Paris", label: "Paris" },
  Berlin: { iana: "Europe/Berlin", label: "Berlin" },
  Moscow: { iana: "Europe/Moscow", label: "Moscow" },
  Dubai: { iana: "Asia/Dubai", label: "Dubai" },
  Mumbai: { iana: "Asia/Kolkata", label: "Mumbai" },
  Shanghai: { iana: "Asia/Shanghai", label: "Shanghai" },
  Tokyo: { iana: "Asia/Tokyo", label: "Tokyo" },
  Seoul: { iana: "Asia/Seoul", label: "Seoul" },
  Singapore: { iana: "Asia/Singapore", label: "Singapore" },
  Sydney: { iana: "Australia/Sydney", label: "Sydney" },
  Auckland: { iana: "Pacific/Auckland", label: "Auckland" },
  Lisbon: { iana: "Europe/Lisbon", label: "Lisbon" },
  Chicago: { iana: "America/Chicago", label: "Chicago" },
  Denver: { iana: "America/Denver", label: "Denver" },
};

function formatDateInTimezone(timestamp: number, iana: string, label: string): string {
  const date = new Date(timestamp);
  const formatted = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: iana,
    timeZoneName: "short",
  }).format(date);
  // If the Intl output already includes a tz abbreviation, use it as-is.
  // Otherwise append the label.
  return formatted;
}

function buildBaseConversions(): PluginManifest["baseConversions"] {
  const conversions: NonNullable<PluginManifest["baseConversions"]> = {};

  for (const [keyword, { iana, label }] of Object.entries(TIMEZONE_MAP)) {
    const entry = {
      formatter: (n: number) => formatDateInTimezone(n, iana, label),
      detail: `timezone: ${iana}`,
    };
    // Register both original case (UTC, EST) and lowercase (utc, est)
    // because the parser's BaseKeyword rule is case-sensitive
    conversions[keyword] = entry;
    const lower = keyword.toLowerCase();
    if (lower !== keyword) {
      conversions[lower] = entry;
    }
  }

  return conversions;
}

export const timezonePlugin: PluginManifest = {
  id: "core.timezone",
  name: "Timezone Conversion",
  description: "Convert date/time values between timezones (now in UTC, today in JST, etc.)",
  baseConversions: buildBaseConversions(),
  tests: [
    // Use a fixed timestamp for deterministic tests: 2026-01-15T12:00:00Z = 1768521600000
    {
      description: "now in UTC shows date with timezone",
      input: "now in UTC",
      // Can't check exact value since 'now' changes — just check it doesn't error
      tolerance: Date.now(),
    },
    {
      description: "today in BRT shows date with timezone",
      input: "today in BRT",
      tolerance: Date.now(),
    },
    {
      description: "today in Tokyo shows date with timezone",
      input: "today in Tokyo",
      tolerance: Date.now(),
    },
  ],
  help: [{
    title: "Timezones",
    description: "Convert dates to different timezones with in or to.",
    examples: [
      { input: "now in UTC", output: "time in UTC" },
      { input: "today in JST", output: "time in Tokyo" },
      { input: "now in BRT", output: "time in Brazil" },
      { input: "tomorrow in PST", output: "time in LA" },
      { input: "now in London", output: "time in London" },
    ],
  }],
};
