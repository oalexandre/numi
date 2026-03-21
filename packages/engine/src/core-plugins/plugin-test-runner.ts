import type { PluginTest } from "./types.js";
import type { LineResult } from "../index.js";

export interface TestResult {
  test: PluginTest;
  passed: boolean;
  actual?: { value: number | null; formatted: string };
  error?: string;
}

/**
 * Run a set of plugin self-tests against an evaluate function.
 * The evaluate function should match the signature of the engine's `evaluate()`.
 */
export function runPluginTests(
  tests: PluginTest[],
  evaluateFn: (input: string) => LineResult[],
): TestResult[] {
  return tests.map((test) => {
    try {
      const results = evaluateFn(test.input);
      const lineIdx = resolveLineIndex(test.line, results.length);
      const result = results[lineIdx];

      if (!result) {
        return { test, passed: false, error: `No result at line ${lineIdx}` };
      }

      if (result.error) {
        return {
          test,
          passed: false,
          actual: { value: result.value, formatted: result.formatted },
          error: `Evaluation error: ${result.error}`,
        };
      }

      // Check expected value
      if (test.expected !== undefined) {
        if (test.expected === null) {
          if (result.value !== null) {
            return {
              test,
              passed: false,
              actual: { value: result.value, formatted: result.formatted },
              error: `Expected null, got ${result.value}`,
            };
          }
        } else if (test.tolerance !== undefined) {
          if (result.value === null || Math.abs(result.value - test.expected) > test.tolerance) {
            return {
              test,
              passed: false,
              actual: { value: result.value, formatted: result.formatted },
              error: `Expected ≈${test.expected} (±${test.tolerance}), got ${result.value}`,
            };
          }
        } else {
          if (result.value !== test.expected) {
            return {
              test,
              passed: false,
              actual: { value: result.value, formatted: result.formatted },
              error: `Expected ${test.expected}, got ${result.value}`,
            };
          }
        }
      }

      // Check formatted output
      if (test.formatted !== undefined) {
        if (result.formatted !== test.formatted) {
          return {
            test,
            passed: false,
            actual: { value: result.value, formatted: result.formatted },
            error: `Expected formatted "${test.formatted}", got "${result.formatted}"`,
          };
        }
      }

      return { test, passed: true, actual: { value: result.value, formatted: result.formatted } };
    } catch (err) {
      return {
        test,
        passed: false,
        error: `Exception: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  });
}

function resolveLineIndex(line: number | undefined, total: number): number {
  if (line === undefined) return 0;
  if (line < 0) return Math.max(0, total + line);
  return line;
}
