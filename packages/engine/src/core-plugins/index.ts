import type { PluginManifest } from "./types.js";
import { mathFunctionsPlugin } from "./math-functions/index.js";
import { mathConstantsPlugin } from "./math-constants/index.js";
import { unitsLengthPlugin } from "./units-length/index.js";
import { unitsWeightPlugin } from "./units-weight/index.js";
import { unitsVolumePlugin } from "./units-volume/index.js";
import { unitsTemperaturePlugin } from "./units-temperature/index.js";
import { unitsAreaPlugin } from "./units-area/index.js";
import { unitsDataPlugin } from "./units-data/index.js";
import { unitsCssPlugin } from "./units-css/index.js";
import { unitsDurationPlugin } from "./units-duration/index.js";
import { lineReferencesPlugin } from "./line-references/index.js";
import { dateLiteralsPlugin } from "./date-literals/index.js";
import { baseConversionPlugin } from "./base-conversion/index.js";
import { timezonePlugin } from "./timezone/index.js";

export { createCurrencyPlugin } from "./units-currency/index.js";
export { runPluginTests } from "./plugin-test-runner.js";
export type { TestResult } from "./plugin-test-runner.js";

export type {
  PluginManifest,
  PluginTest,
  MathFn,
  LineRefHandler,
  LineRefContext,
  LineResultEntry,
  HelpSection,
  HelpExample,
} from "./types.js";

/** All core plugins except currency (which requires a CurrencyFetcher). */
export const corePlugins: PluginManifest[] = [
  mathFunctionsPlugin,
  mathConstantsPlugin,
  unitsLengthPlugin,
  unitsWeightPlugin,
  unitsVolumePlugin,
  unitsTemperaturePlugin,
  unitsAreaPlugin,
  unitsDataPlugin,
  unitsCssPlugin,
  unitsDurationPlugin,
  lineReferencesPlugin,
  dateLiteralsPlugin,
  baseConversionPlugin,
  timezonePlugin,
];
