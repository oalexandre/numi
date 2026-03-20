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

/**
 * Type text into the editor, wait for evaluation, then read results via IPC.
 */
async function evalInApp(text: string): Promise<Array<{ value: number | null; formatted: string; error?: string }>> {
  // Use the exposed numi.evaluate IPC to get results directly
  const results = await page.evaluate(async (input: string) => {
    return window.numi.evaluate(input);
  }, text);
  return results;
}

test.describe("Numi Calculator E2E", () => {
  test("app window opens with correct title", async () => {
    const title = await page.title();
    expect(title).toBe("Numi Calculator");
  });

  test("CodeMirror editor is visible", async () => {
    const editor = page.locator(".cm-editor");
    await expect(editor).toBeVisible();
  });

  test("basic arithmetic: 1 + 1 = 2", async () => {
    const results = await evalInApp("1 + 1");
    expect(results[0]?.value).toBe(2);
    expect(results[0]?.formatted).toBe("2");
  });

  test("multiplication: 6 * 7 = 42", async () => {
    const results = await evalInApp("6 * 7");
    expect(results[0]?.value).toBe(42);
  });

  test("division: 100 / 4 = 25", async () => {
    const results = await evalInApp("100 / 4");
    expect(results[0]?.value).toBe(25);
  });

  test("exponentiation: 2 ^ 10 = 1024", async () => {
    const results = await evalInApp("2 ^ 10");
    expect(results[0]?.value).toBe(1024);
  });

  test("modulo: 10 mod 3 = 1", async () => {
    const results = await evalInApp("10 mod 3");
    expect(results[0]?.value).toBe(1);
  });

  test("variables: x=1, y=2, x+y=3", async () => {
    const results = await evalInApp("x = 1\ny = 2\nx + y");
    expect(results[0]?.value).toBe(1);
    expect(results[1]?.value).toBe(2);
    expect(results[2]?.value).toBe(3);
  });

  test("variables: price + tax = 108", async () => {
    const results = await evalInApp("price = 100\ntax = 8\nprice + tax");
    expect(results[2]?.value).toBe(108);
  });

  test("operator precedence: 1 + 2 * 3 = 7", async () => {
    const results = await evalInApp("1 + 2 * 3");
    expect(results[0]?.value).toBe(7);
  });

  test("parentheses: (1 + 2) * 3 = 9", async () => {
    const results = await evalInApp("(1 + 2) * 3");
    expect(results[0]?.value).toBe(9);
  });

  test("hex number: 0xFF = 255", async () => {
    const results = await evalInApp("0xFF");
    expect(results[0]?.value).toBe(255);
  });

  test("binary number: 0b1010 = 10", async () => {
    const results = await evalInApp("0b1010");
    expect(results[0]?.value).toBe(10);
  });

  test("scientific notation: 1.5e3 = 1500", async () => {
    const results = await evalInApp("1.5e3");
    expect(results[0]?.value).toBe(1500);
  });

  test("percentage literal: 5% = 0.05", async () => {
    const results = await evalInApp("5%");
    expect(results[0]?.value).toBeCloseTo(0.05);
  });

  test("percentage addition: 100 + 5% = 105", async () => {
    const results = await evalInApp("100 + 5%");
    expect(results[0]?.value).toBe(105);
  });

  test("percentage subtraction: 100 - 10% = 90", async () => {
    const results = await evalInApp("100 - 10%");
    expect(results[0]?.value).toBe(90);
  });

  test("percent of: 5% of 200 = 10", async () => {
    const results = await evalInApp("5% of 200");
    expect(results[0]?.value).toBe(10);
  });

  test("percent off: 10% off 50 = 45", async () => {
    const results = await evalInApp("10% off 50");
    expect(results[0]?.value).toBe(45);
  });

  test("percent on: 10% on 50 = 55", async () => {
    const results = await evalInApp("10% on 50");
    expect(results[0]?.value).toBe(55);
  });

  test("sqrt(16) = 4", async () => {
    const results = await evalInApp("sqrt(16)");
    expect(results[0]?.value).toBe(4);
  });

  test("abs(-5) = 5", async () => {
    const results = await evalInApp("abs(-5)");
    expect(results[0]?.value).toBe(5);
  });

  test("min(3, 1, 2) = 1", async () => {
    const results = await evalInApp("min(3, 1, 2)");
    expect(results[0]?.value).toBe(1);
  });

  test("constant pi ≈ 3.14159", async () => {
    const results = await evalInApp("pi");
    expect(results[0]?.value).toBeCloseTo(3.14159, 4);
  });

  test("unit conversion: 1 km to m = 1000", async () => {
    const results = await evalInApp("1 km to m");
    expect(results[0]?.value).toBe(1000);
    expect(results[0]?.formatted).toContain("m");
  });

  test("unit conversion: 100 celsius to fahrenheit = 212", async () => {
    const results = await evalInApp("100 celsius to fahrenheit");
    expect(results[0]?.value).toBeCloseTo(212);
  });

  test("unit conversion: 1 kg to pounds ≈ 2.205", async () => {
    const results = await evalInApp("1 kg to pounds");
    expect(results[0]?.value).toBeCloseTo(2.205, 2);
  });

  test("CSS units: 32 px to rem = 2", async () => {
    const results = await evalInApp("32 px to rem");
    expect(results[0]?.value).toBe(2);
    expect(results[0]?.formatted).toContain("rem");
  });

  test("duration: 2 hours to minutes = 120", async () => {
    const results = await evalInApp("2 hours to minutes");
    expect(results[0]?.value).toBe(120);
  });

  test("duration: 2 weeks to days = 14", async () => {
    const results = await evalInApp("2 weeks to days");
    expect(results[0]?.value).toBeCloseTo(14);
  });

  test("base conversion: 255 in hex = 0xFF", async () => {
    const results = await evalInApp("255 in hex");
    expect(results[0]?.formatted).toBe("0xFF");
  });

  test("base conversion: 10 in binary = 0b1010", async () => {
    const results = await evalInApp("10 in binary");
    expect(results[0]?.formatted).toBe("0b1010");
  });

  test("base conversion: 0xFF in decimal = 255", async () => {
    const results = await evalInApp("0xFF in decimal");
    expect(results[0]?.formatted).toBe("255");
  });

  test("bitwise AND: 0xFF AND 0x0F = 15", async () => {
    const results = await evalInApp("0xFF AND 0x0F");
    expect(results[0]?.value).toBe(15);
  });

  test("bitwise OR: 0xF0 OR 0x0F = 255", async () => {
    const results = await evalInApp("0xF0 OR 0x0F");
    expect(results[0]?.value).toBe(255);
  });

  test("bitwise shift: 1 << 4 = 16", async () => {
    const results = await evalInApp("1 << 4");
    expect(results[0]?.value).toBe(16);
  });

  test("line references: sum", async () => {
    const results = await evalInApp("10\n20\n30\nsum");
    expect(results[3]?.value).toBe(60);
  });

  test("line references: avg", async () => {
    const results = await evalInApp("10\n20\n30\navg");
    expect(results[3]?.value).toBe(20);
  });

  test("line references: prev", async () => {
    const results = await evalInApp("42\nprev");
    expect(results[1]?.value).toBe(42);
  });

  test("line references: count", async () => {
    const results = await evalInApp("10\n20\n30\ncount");
    expect(results[3]?.value).toBe(3);
  });

  test("comments return null", async () => {
    const results = await evalInApp("// this is a comment");
    expect(results[0]?.value).toBeNull();
  });

  test("empty lines return null", async () => {
    const results = await evalInApp("");
    expect(results[0]?.value).toBeNull();
  });

  test("error: division by zero", async () => {
    const results = await evalInApp("10 / 0");
    expect(results[0]?.error).toBe("Division by zero");
    expect(results[0]?.value).toBeNull();
  });

  test("error: undefined variable", async () => {
    const results = await evalInApp("unknownVar + 1");
    expect(results[0]?.error).toContain("Undefined variable");
  });

  test("formatted output: thousand separators", async () => {
    const results = await evalInApp("1000000");
    expect(results[0]?.formatted).toBe("1,000,000");
  });

  test("formatted output: unit in result", async () => {
    const results = await evalInApp("1 km to m");
    expect(results[0]?.formatted).toBe("1,000 m");
  });

  test("complex multi-line calculation", async () => {
    const results = await evalInApp("price = 100\ndiscount = 10% off price\ntax = 8\ndiscount + tax\nsum");
    expect(results[0]?.value).toBe(100);       // price
    expect(results[1]?.value).toBe(90);         // 10% off 100
    expect(results[2]?.value).toBe(8);          // tax
    expect(results[3]?.value).toBe(98);         // discount + tax
    expect(results[4]?.value).toBe(296);        // sum of all
  });
});
