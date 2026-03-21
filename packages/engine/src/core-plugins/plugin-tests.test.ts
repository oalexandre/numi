import { describe, it, expect } from "vitest";

import { evaluate } from "../index.js";

import { corePlugins } from "./index.js";
import { runPluginTests } from "./plugin-test-runner.js";

describe("core plugin self-tests", () => {
  for (const plugin of corePlugins) {
    if (!plugin.tests || plugin.tests.length === 0) continue;

    describe(plugin.name, () => {
      const results = runPluginTests(plugin.tests!, evaluate);

      for (const result of results) {
        it(result.test.description, () => {
          if (!result.passed) {
            throw new Error(result.error ?? "Test failed");
          }
          expect(result.passed).toBe(true);
        });
      }
    });
  }
});
