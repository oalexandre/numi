import { describe, it, expect } from "vitest";

import { evaluate } from "../index.js";

function evalLine(input: string): number | null {
  const results = evaluate(input);
  return results[0]?.value ?? null;
}

describe("bitwise operations", () => {
  describe("AND", () => {
    it("should perform bitwise AND", () => {
      expect(evalLine("0xFF AND 0x0F")).toBe(0x0f);
      expect(evalLine("12 AND 10")).toBe(8);
    });
  });

  describe("OR", () => {
    it("should perform bitwise OR", () => {
      expect(evalLine("0xF0 OR 0x0F")).toBe(0xff);
      expect(evalLine("12 OR 10")).toBe(14);
    });
  });

  describe("XOR", () => {
    it("should perform bitwise XOR", () => {
      expect(evalLine("0xFF XOR 0x0F")).toBe(0xf0);
      expect(evalLine("12 XOR 10")).toBe(6);
    });
  });

  describe("NOT", () => {
    it("should perform bitwise NOT", () => {
      expect(evalLine("NOT 0")).toBe(4294967295); // 0xFFFFFFFF
      expect(evalLine("NOT 0xFF")).toBe(0xffffff00);
    });
  });

  describe("shift operators", () => {
    it("should perform left shift", () => {
      expect(evalLine("1 << 4")).toBe(16);
      expect(evalLine("0xFF << 8")).toBe(0xff00);
    });

    it("should perform right shift", () => {
      expect(evalLine("256 >> 4")).toBe(16);
      expect(evalLine("0xFF00 >> 8")).toBe(0xff);
    });
  });

  describe("truncation", () => {
    it("should truncate decimal operands to integer", () => {
      expect(evalLine("5.7 AND 3.2")).toBe(5 & 3);
      expect(evalLine("7.9 << 1.5")).toBe(14);
    });
  });

  describe("combined", () => {
    it("should chain bitwise operations", () => {
      expect(evalLine("0xFF AND 0x0F OR 0xF0")).toBe(0xff);
    });
  });
});
