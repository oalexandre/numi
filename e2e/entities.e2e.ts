import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { test, expect, type ElectronApplication, type Page } from "@playwright/test";
import { _electron as electron } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));

let app: ElectronApplication;
let page: Page;

test.beforeAll(async () => {
  app = await electron.launch({
    args: [resolve(__dirname, "../out/main/main.js")],
  });
  page = await app.firstWindow();
  await page.waitForSelector(".cm-editor", { timeout: 10000 });
  await page.waitForTimeout(500);
});

test.afterAll(async () => {
  await app.close();
});

async function evalInApp(text: string): Promise<Array<{ value: number | null; formatted: string; error?: string }>> {
  return page.evaluate(async (input: string) => {
    return window.numi.evaluate(input);
  }, text);
}

function expectClose(actual: number | null | undefined, expected: number, tolerance = 0.01): void {
  expect(actual).not.toBeNull();
  expect(Math.abs(actual! - expected)).toBeLessThanOrEqual(tolerance);
}

// ─── Math Functions ──────────────────────────────────────────────────────────

test.describe("Entity: Math Functions", () => {
  test("sqrt(16) = 4", async () => {
    const r = await evalInApp("sqrt(16)");
    expect(r[0]?.value).toBe(4);
  });

  test("cbrt(27) = 3", async () => {
    const r = await evalInApp("cbrt(27)");
    expect(r[0]?.value).toBe(3);
  });

  test("abs(-42) = 42", async () => {
    const r = await evalInApp("abs(-42)");
    expect(r[0]?.value).toBe(42);
  });

  test("ceil(4.1) = 5", async () => {
    const r = await evalInApp("ceil(4.1)");
    expect(r[0]?.value).toBe(5);
  });

  test("floor(4.9) = 4", async () => {
    const r = await evalInApp("floor(4.9)");
    expect(r[0]?.value).toBe(4);
  });

  test("round(4.5) = 5", async () => {
    const r = await evalInApp("round(4.5)");
    expect(r[0]?.value).toBe(5);
  });

  test("trunc(4.9) = 4", async () => {
    const r = await evalInApp("trunc(4.9)");
    expect(r[0]?.value).toBe(4);
  });

  test("sin(0) = 0", async () => {
    const r = await evalInApp("sin(0)");
    expect(r[0]?.value).toBe(0);
  });

  test("cos(0) = 1", async () => {
    const r = await evalInApp("cos(0)");
    expect(r[0]?.value).toBe(1);
  });

  test("log10(100) = 2", async () => {
    const r = await evalInApp("log10(100)");
    expectClose(r[0]?.value, 2, 0.0001);
  });

  test("log2(8) = 3", async () => {
    const r = await evalInApp("log2(8)");
    expectClose(r[0]?.value, 3, 0.0001);
  });

  test("min(5, 2, 8) = 2", async () => {
    const r = await evalInApp("min(5, 2, 8)");
    expect(r[0]?.value).toBe(2);
  });

  test("max(5, 2, 8) = 8", async () => {
    const r = await evalInApp("max(5, 2, 8)");
    expect(r[0]?.value).toBe(8);
  });

  test("space syntax: sqrt 9 = 3", async () => {
    const r = await evalInApp("sqrt 9");
    expect(r[0]?.value).toBe(3);
  });
});

// ─── Constants ───────────────────────────────────────────────────────────────

test.describe("Entity: Constants", () => {
  test("pi ≈ 3.14159", async () => {
    const r = await evalInApp("pi");
    expectClose(r[0]?.value, 3.14159, 0.001);
  });

  test("e ≈ 2.71828", async () => {
    const r = await evalInApp("e");
    expectClose(r[0]?.value, 2.71828, 0.001);
  });

  test("tau ≈ 6.28318", async () => {
    const r = await evalInApp("tau");
    expectClose(r[0]?.value, 6.28318, 0.001);
  });
});

// ─── Unit Conversions ────────────────────────────────────────────────────────

test.describe("Entity: Length Units", () => {
  test("1 km = 1000 m", async () => {
    const r = await evalInApp("1 km to m");
    expect(r[0]?.value).toBe(1000);
    expect(r[0]?.formatted).toBe("1,000 m");
  });

  test("1 mile ≈ 1.609 km", async () => {
    const r = await evalInApp("1 mile to km");
    expectClose(r[0]?.value, 1.609, 0.001);
  });

  test("1 inch = 2.54 cm", async () => {
    const r = await evalInApp("1 inch to cm");
    expectClose(r[0]?.value, 2.54, 0.01);
  });
});

test.describe("Entity: Weight Units", () => {
  test("1 kg ≈ 2.205 lb", async () => {
    const r = await evalInApp("1 kg to lb");
    expectClose(r[0]?.value, 2.205, 0.01);
  });

  test("1 kg = 1000 g", async () => {
    const r = await evalInApp("1 kg to g");
    expect(r[0]?.value).toBe(1000);
  });
});

test.describe("Entity: Volume Units", () => {
  test("1 gallon ≈ 3.785 L", async () => {
    const r = await evalInApp("1 gal to L");
    expectClose(r[0]?.value, 3.785, 0.01);
  });
});

test.describe("Entity: Temperature Units", () => {
  test("0 °C = 32 °F", async () => {
    const r = await evalInApp("0 celsius to fahrenheit");
    expect(r[0]?.value).toBe(32);
  });

  test("100 °C = 212 °F", async () => {
    const r = await evalInApp("100 celsius to fahrenheit");
    expect(r[0]?.value).toBe(212);
  });

  test("0 °C = 273.15 K", async () => {
    const r = await evalInApp("0 celsius to kelvin");
    expectClose(r[0]?.value, 273.15, 0.01);
  });
});

test.describe("Entity: Area Units", () => {
  test("1 acre ≈ 0.405 ha", async () => {
    const r = await evalInApp("1 acre to ha");
    expectClose(r[0]?.value, 0.405, 0.001);
  });
});

test.describe("Entity: Data Units", () => {
  test("1 byte = 8 bits", async () => {
    const r = await evalInApp("1 byte to bits");
    expect(r[0]?.value).toBe(8);
  });

  test("1 GB = 1000 MB", async () => {
    const r = await evalInApp("1 GB to MB");
    expect(r[0]?.value).toBe(1000);
  });

  test("1 GiB = 1024 MiB", async () => {
    const r = await evalInApp("1 GiB to MiB");
    expect(r[0]?.value).toBe(1024);
  });
});

test.describe("Entity: CSS Units", () => {
  test("32 px = 2 rem", async () => {
    const r = await evalInApp("32 px to rem");
    expect(r[0]?.value).toBe(2);
    expect(r[0]?.formatted).toBe("2 rem");
  });

  test("16 px = 12 pt", async () => {
    const r = await evalInApp("16 px to pt");
    expect(r[0]?.value).toBe(12);
  });
});

test.describe("Entity: Duration Units", () => {
  test("2 hours = 120 minutes", async () => {
    const r = await evalInApp("2 hours to minutes");
    expect(r[0]?.value).toBe(120);
  });

  test("1 day = 24 hours", async () => {
    const r = await evalInApp("1 day to hours");
    expect(r[0]?.value).toBe(24);
  });

  test("2 weeks = 14 days", async () => {
    const r = await evalInApp("2 weeks to days");
    expect(r[0]?.value).toBe(14);
  });
});

// ─── Line References ─────────────────────────────────────────────────────────

test.describe("Entity: Line References", () => {
  test("sum of lines", async () => {
    const r = await evalInApp("10\n20\n30\nsum");
    expect(r[3]?.value).toBe(60);
  });

  test("total alias", async () => {
    const r = await evalInApp("10\n20\ntotal");
    expect(r[2]?.value).toBe(30);
  });

  test("avg of lines", async () => {
    const r = await evalInApp("10\n20\n30\navg");
    expect(r[3]?.value).toBe(20);
  });

  test("average alias", async () => {
    const r = await evalInApp("100\n200\naverage");
    expect(r[2]?.value).toBe(150);
  });

  test("prev returns previous value", async () => {
    const r = await evalInApp("42\nprev");
    expect(r[1]?.value).toBe(42);
  });

  test("previous alias", async () => {
    const r = await evalInApp("99\nprevious");
    expect(r[1]?.value).toBe(99);
  });

  test("count of valued lines", async () => {
    const r = await evalInApp("10\n20\n30\ncount");
    expect(r[3]?.value).toBe(3);
  });

  test("count skips comments", async () => {
    const r = await evalInApp("10\n// skip\n20\ncount");
    expect(r[3]?.value).toBe(2);
  });
});

// ─── Date Literals ───────────────────────────────────────────────────────────

test.describe("Entity: Date Literals", () => {
  test("today returns a timestamp", async () => {
    const r = await evalInApp("today");
    expect(r[0]?.value).toBeGreaterThan(0);
  });

  test("now returns a timestamp", async () => {
    const r = await evalInApp("now");
    expect(r[0]?.value).toBeGreaterThan(0);
  });

  test("tomorrow > today", async () => {
    const r = await evalInApp("tomorrow - today");
    expect(r[0]?.value).toBeGreaterThan(80000000); // ~24h in ms
  });

  test("today > yesterday", async () => {
    const r = await evalInApp("today - yesterday");
    expect(r[0]?.value).toBeGreaterThan(80000000);
  });
});

// ─── Base Conversions ────────────────────────────────────────────────────────

test.describe("Entity: Base Conversions", () => {
  test("255 in hex = 0xFF", async () => {
    const r = await evalInApp("255 in hex");
    expect(r[0]?.formatted).toBe("0xFF");
  });

  test("255 in hexadecimal = 0xFF", async () => {
    const r = await evalInApp("255 in hexadecimal");
    expect(r[0]?.formatted).toBe("0xFF");
  });

  test("10 in binary = 0b1010", async () => {
    const r = await evalInApp("10 in binary");
    expect(r[0]?.formatted).toBe("0b1010");
  });

  test("10 in bin = 0b1010", async () => {
    const r = await evalInApp("10 in bin");
    expect(r[0]?.formatted).toBe("0b1010");
  });

  test("8 in octal = 0o10", async () => {
    const r = await evalInApp("8 in octal");
    expect(r[0]?.formatted).toBe("0o10");
  });

  test("8 in oct = 0o10", async () => {
    const r = await evalInApp("8 in oct");
    expect(r[0]?.formatted).toBe("0o10");
  });

  test("0xFF in decimal = 255", async () => {
    const r = await evalInApp("0xFF in decimal");
    expect(r[0]?.formatted).toBe("255");
  });

  test("0xFF in dec = 255", async () => {
    const r = await evalInApp("0xFF in dec");
    expect(r[0]?.formatted).toBe("255");
  });

  test("expression to hex: 200 + 55 in hex", async () => {
    const r = await evalInApp("200 + 55 in hex");
    expect(r[0]?.formatted).toBe("0xFF");
  });
});

// ─── All Entity Types Produce Correct Format ─────────────────────────────────

test.describe("Entity output formats", () => {
  test("functions return plain numbers", async () => {
    const r = await evalInApp("sqrt(16)");
    expect(r[0]?.formatted).toBe("4");
    expect(r[0]?.error).toBeUndefined();
  });

  test("constants return plain numbers", async () => {
    const r = await evalInApp("pi");
    expect(r[0]?.formatted).toMatch(/^3\.14159/);
    expect(r[0]?.error).toBeUndefined();
  });

  test("unit conversions return value + unit", async () => {
    const r = await evalInApp("1 km to m");
    expect(r[0]?.formatted).toBe("1,000 m");
    expect(r[0]?.error).toBeUndefined();
  });

  test("base conversions return formatted base", async () => {
    const r = await evalInApp("255 in hex");
    expect(r[0]?.formatted).toBe("0xFF");
    expect(r[0]?.error).toBeUndefined();
  });

  test("line refs return plain numbers", async () => {
    const r = await evalInApp("10\n20\nsum");
    expect(r[2]?.formatted).toBe("30");
    expect(r[2]?.error).toBeUndefined();
  });

  test("date literals return formatted dates", async () => {
    const r = await evalInApp("today");
    expect(r[0]?.formatted).toMatch(/\w{3}, \w{3} \d{1,2}, \d{4}/); // e.g. "Fri, Mar 20, 2026"
    expect(r[0]?.error).toBeUndefined();
  });
});
