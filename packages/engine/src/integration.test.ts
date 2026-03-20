import { describe, it, expect } from "vitest";

import { evaluate } from "./index.js";

/** Helper: evaluate a single line and return its numeric value. */
function evalValue(input: string): number | null {
  const results = evaluate(input);
  if (results[0]?.error) {
    throw new Error(results[0].error);
  }
  return results[0]?.value ?? null;
}

/** Helper: evaluate a single line and return its formatted string. */
function evalFormatted(input: string): string {
  const results = evaluate(input);
  return results[0]?.formatted ?? "";
}

// ---------------------------------------------------------------------------
// 1. Basic arithmetic
// ---------------------------------------------------------------------------
describe("basic arithmetic", () => {
  it("should add: 1 + 1 = 2", () => {
    expect(evalValue("1 + 1")).toBe(2);
  });

  it("should subtract: 10 - 3 = 7", () => {
    expect(evalValue("10 - 3")).toBe(7);
  });

  it("should multiply: 4 * 5 = 20", () => {
    expect(evalValue("4 * 5")).toBe(20);
  });

  it("should divide: 20 / 4 = 5", () => {
    expect(evalValue("20 / 4")).toBe(5);
  });

  it("should exponentiate: 2 ^ 10 = 1024", () => {
    expect(evalValue("2 ^ 10")).toBe(1024);
  });

  it("should modulo: 10 mod 3 = 1", () => {
    expect(evalValue("10 mod 3")).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// 2. Variables
// ---------------------------------------------------------------------------
describe("variables", () => {
  it("should assign and reference variables: x + y = 3", () => {
    const results = evaluate("x = 1\ny = 2\nx + y");
    expect(results[0]?.value).toBe(1);
    expect(results[1]?.value).toBe(2);
    expect(results[2]?.value).toBe(3);
  });

  it("should handle price + tax = 108", () => {
    const results = evaluate("price = 100\ntax = 8\nprice + tax");
    expect(results[2]?.value).toBe(108);
  });

  it("should allow single-letter variables like a, b, c", () => {
    const results = evaluate("a = 1\nb = 2\na + b");
    expect(results[0]?.value).toBe(1);
    expect(results[1]?.value).toBe(2);
    expect(results[2]?.value).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// 3. Operator precedence
// ---------------------------------------------------------------------------
describe("operator precedence", () => {
  it("should respect multiplication before addition: 1 + 2 * 3 = 7", () => {
    expect(evalValue("1 + 2 * 3")).toBe(7);
  });

  it("should respect parentheses: (1 + 2) * 3 = 9", () => {
    expect(evalValue("(1 + 2) * 3")).toBe(9);
  });
});

// ---------------------------------------------------------------------------
// 4. Number formats
// ---------------------------------------------------------------------------
describe("number formats", () => {
  it("should parse hexadecimal: 0xFF = 255", () => {
    expect(evalValue("0xFF")).toBe(255);
  });

  it("should parse binary: 0b1010 = 10", () => {
    expect(evalValue("0b1010")).toBe(10);
  });

  it("should parse scientific notation: 1.5e3 = 1500", () => {
    expect(evalValue("1.5e3")).toBe(1500);
  });
});

// ---------------------------------------------------------------------------
// 5. Percentages
// ---------------------------------------------------------------------------
describe("percentages", () => {
  it("should evaluate standalone percent: 5% = 0.05", () => {
    expect(evalValue("5%")).toBe(0.05);
  });

  it("should add percentage: 100 + 5% = 105", () => {
    expect(evalValue("100 + 5%")).toBe(105);
  });

  it("should subtract percentage: 100 - 10% = 90", () => {
    expect(evalValue("100 - 10%")).toBe(90);
  });

  it("should evaluate percent-of: 5% of 200 = 10", () => {
    expect(evalValue("5% of 200")).toBe(10);
  });

  it("should evaluate percent-off: 10% off 50 = 45", () => {
    expect(evalValue("10% off 50")).toBe(45);
  });

  it("should evaluate percent-on: 10% on 50 = 55", () => {
    expect(evalValue("10% on 50")).toBe(55);
  });
});

// ---------------------------------------------------------------------------
// 6. Math functions
// ---------------------------------------------------------------------------
describe("math functions", () => {
  it("should evaluate sqrt(16) = 4", () => {
    expect(evalValue("sqrt(16)")).toBe(4);
  });

  it("should evaluate sin(0) = 0", () => {
    expect(evalValue("sin(0)")).toBe(0);
  });

  it("should evaluate cos(0) = 1", () => {
    expect(evalValue("cos(0)")).toBe(1);
  });

  it("should evaluate abs(-5) = 5", () => {
    expect(evalValue("abs(-5)")).toBe(5);
  });

  it("should evaluate floor(4.9) = 4", () => {
    expect(evalValue("floor(4.9)")).toBe(4);
  });

  it("should evaluate ceil(4.1) = 5", () => {
    expect(evalValue("ceil(4.1)")).toBe(5);
  });

  it("should evaluate min(3, 1, 2) = 1", () => {
    expect(evalValue("min(3, 1, 2)")).toBe(1);
  });

  it("should evaluate max(3, 1, 2) = 3", () => {
    expect(evalValue("max(3, 1, 2)")).toBe(3);
  });

  it("should evaluate log(100) = 2", () => {
    expect(evalValue("log(100)")).toBeCloseTo(2);
  });
});

// ---------------------------------------------------------------------------
// 7. Constants
// ---------------------------------------------------------------------------
describe("constants", () => {
  it("should provide pi ≈ 3.14159", () => {
    expect(evalValue("pi")).toBeCloseTo(3.14159, 4);
  });

  it("should provide e ≈ 2.71828", () => {
    expect(evalValue("e")).toBeCloseTo(2.71828, 4);
  });

  it("should provide tau ≈ 6.28318", () => {
    expect(evalValue("tau")).toBeCloseTo(6.28318, 4);
  });
});

// ---------------------------------------------------------------------------
// 8. Unit conversions
// ---------------------------------------------------------------------------
describe("unit conversions", () => {
  it("should convert 1 km to m = 1000", () => {
    expect(evalValue("1 km to m")).toBe(1000);
  });

  it("should convert 1 kg to pounds ≈ 2.205", () => {
    expect(evalValue("1 kg to pounds")).toBeCloseTo(2.205, 2);
  });

  it("should convert 100 celsius to fahrenheit = 212", () => {
    expect(evalValue("100 celsius to fahrenheit")).toBe(212);
  });

  it("should convert 32 px to rem = 2", () => {
    expect(evalValue("32 px to rem")).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// 9. Duration units
// ---------------------------------------------------------------------------
describe("duration units", () => {
  it("should convert 2 hours to minutes = 120", () => {
    expect(evalValue("2 hours to minutes")).toBe(120);
  });

  it("should convert 1 day to hours = 24", () => {
    expect(evalValue("1 day to hours")).toBe(24);
  });

  it("should convert 2 weeks to days = 14", () => {
    expect(evalValue("2 weeks to days")).toBe(14);
  });
});

// ---------------------------------------------------------------------------
// 10. Base conversion
// ---------------------------------------------------------------------------
describe("base conversion", () => {
  it("should convert 255 in hex = '0xFF'", () => {
    expect(evalFormatted("255 in hex")).toBe("0xFF");
  });

  it("should convert 10 in binary = '0b1010'", () => {
    expect(evalFormatted("10 in binary")).toBe("0b1010");
  });

  it("should convert 0xFF in decimal = '255'", () => {
    expect(evalFormatted("0xFF in decimal")).toBe("255");
  });
});

// ---------------------------------------------------------------------------
// 11. Bitwise operations
// ---------------------------------------------------------------------------
describe("bitwise operations", () => {
  it("should AND: 0xFF AND 0x0F = 15", () => {
    expect(evalValue("0xFF AND 0x0F")).toBe(15);
  });

  it("should OR: 0xF0 OR 0x0F = 255", () => {
    expect(evalValue("0xF0 OR 0x0F")).toBe(255);
  });

  it("should left shift: 1 << 4 = 16", () => {
    expect(evalValue("1 << 4")).toBe(16);
  });

  it("should NOT: NOT 0 = 4294967295", () => {
    expect(evalValue("NOT 0")).toBe(4294967295);
  });
});

// ---------------------------------------------------------------------------
// 12. Line references
// ---------------------------------------------------------------------------
describe("line references", () => {
  it("should compute sum of previous lines", () => {
    const results = evaluate("10\n20\n30\nsum");
    expect(results[3]?.value).toBe(60);
  });

  it("should compute avg of previous lines", () => {
    const results = evaluate("10\n20\n30\navg");
    expect(results[3]?.value).toBe(20);
  });

  it("should return previous line value with prev", () => {
    const results = evaluate("42\nprev");
    expect(results[1]?.value).toBe(42);
  });

  it("should count lines with results", () => {
    const results = evaluate("10\n20\n30\ncount");
    expect(results[3]?.value).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// 13. Comments
// ---------------------------------------------------------------------------
describe("comments", () => {
  it("should return null for // comments", () => {
    const results = evaluate("// this is a comment");
    expect(results[0]?.value).toBeNull();
  });

  it("should return null for # comments", () => {
    const results = evaluate("# this is a comment");
    expect(results[0]?.value).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 14. Empty lines
// ---------------------------------------------------------------------------
describe("empty lines", () => {
  it("should return null for empty input", () => {
    const results = evaluate("");
    expect(results[0]?.value).toBeNull();
  });

  it("should return null for blank lines in multi-line input", () => {
    const results = evaluate("1\n\n3");
    expect(results[1]?.value).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 15. Error handling
// ---------------------------------------------------------------------------
describe("error handling", () => {
  it("should report division by zero", () => {
    const results = evaluate("10 / 0");
    expect(results[0]?.error).toBe("Division by zero");
    expect(results[0]?.value).toBeNull();
  });

  it("should report undefined variables", () => {
    const results = evaluate("undefinedVar + 1");
    expect(results[0]?.error).toContain("Undefined variable");
    expect(results[0]?.value).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 16. Formatted output
// ---------------------------------------------------------------------------
describe("formatted output", () => {
  it("should format numbers with thousand separators", () => {
    expect(evalFormatted("1000")).toBe("1,000");
  });

  it("should format large numbers with grouping", () => {
    expect(evalFormatted("1000000")).toBe("1,000,000");
  });

  it("should include unit in formatted result", () => {
    expect(evalFormatted("1 km to m")).toBe("1,000 m");
  });
});
