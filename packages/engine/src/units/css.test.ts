import { describe, it, expect } from "vitest";

import { evaluate } from "../index.js";

function evalLine(input: string): { value: number | null; formatted: string } {
  const results = evaluate(input);
  const r = results[0];
  return { value: r?.value ?? null, formatted: r?.formatted ?? "" };
}

describe("CSS units", () => {
  it("should convert px to rem (base 16)", () => {
    const r = evalLine("32 px to rem");
    expect(r.value).toBeCloseTo(2);
    expect(r.formatted).toContain("rem");
  });

  it("should convert rem to px", () => {
    const r = evalLine("2 rem to px");
    expect(r.value).toBeCloseTo(32);
  });

  it("should convert px to pt", () => {
    const r = evalLine("16 px to pt");
    expect(r.value).toBeCloseTo(12);
  });

  it("should convert em to px", () => {
    const r = evalLine("1.5 em to px");
    expect(r.value).toBeCloseTo(24);
  });

  it("should display unit in result", () => {
    const r = evalLine("24 px to rem");
    expect(r.formatted).toBe("1.5 rem");
  });
});
