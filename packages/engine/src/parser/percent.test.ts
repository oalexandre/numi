import { describe, it, expect } from "vitest";

import { evaluate } from "../index.js";

function evalLine(input: string): number | null {
  const results = evaluate(input);
  if (results[0]?.error) {
    throw new Error(results[0].error);
  }
  return results[0]?.value ?? null;
}

describe("percentages", () => {
  describe("percent literal", () => {
    it("should convert 5% to 0.05", () => {
      expect(evalLine("5%")).toBeCloseTo(0.05);
    });

    it("should convert 100% to 1", () => {
      expect(evalLine("100%")).toBe(1);
    });

    it("should convert 50% to 0.5", () => {
      expect(evalLine("50%")).toBe(0.5);
    });

    it("should handle decimal percentages", () => {
      expect(evalLine("8.5%")).toBeCloseTo(0.085);
    });
  });

  describe("addition with percent", () => {
    it("should calculate 100 + 5% = 105", () => {
      expect(evalLine("100 + 5%")).toBe(105);
    });

    it("should calculate 200 + 10% = 220", () => {
      expect(evalLine("200 + 10%")).toBeCloseTo(220);
    });

    it("should calculate 100 - 5% = 95", () => {
      expect(evalLine("100 - 5%")).toBe(95);
    });

    it("should calculate 200 - 25% = 150", () => {
      expect(evalLine("200 - 25%")).toBe(150);
    });

    it("should calculate 50 + 100% = 100", () => {
      expect(evalLine("50 + 100%")).toBe(100);
    });
  });

  describe("percent of", () => {
    it("should calculate 5% of 200 = 10", () => {
      expect(evalLine("5% of 200")).toBe(10);
    });

    it("should calculate 50% of 80 = 40", () => {
      expect(evalLine("50% of 80")).toBe(40);
    });

    it("should calculate 100% of 42 = 42", () => {
      expect(evalLine("100% of 42")).toBe(42);
    });
  });

  describe("percent off", () => {
    it("should calculate 10% off 50 = 45", () => {
      expect(evalLine("10% off 50")).toBe(45);
    });

    it("should calculate 25% off 200 = 150", () => {
      expect(evalLine("25% off 200")).toBe(150);
    });

    it("should calculate 100% off 50 = 0", () => {
      expect(evalLine("100% off 50")).toBe(0);
    });
  });

  describe("percent on", () => {
    it("should calculate 10% on 50 = 55", () => {
      expect(evalLine("10% on 50")).toBe(55);
    });

    it("should calculate 20% on 100 = 120", () => {
      expect(evalLine("20% on 100")).toBe(120);
    });
  });

  describe("percent with variables", () => {
    it("should work with variables", () => {
      const results = evaluate("price = 200\ntax = 10\nprice + tax%");
      expect(results[2]?.value).toBeCloseTo(220);
    });
  });
});
