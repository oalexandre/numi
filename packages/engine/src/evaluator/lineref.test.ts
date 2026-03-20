import { describe, it, expect } from "vitest";

import { evaluate } from "../index.js";

describe("line references", () => {
  describe("sum / total", () => {
    it("should return sum of all results above", () => {
      const results = evaluate("10\n20\n30\nsum");
      expect(results[3]?.value).toBe(60);
    });

    it("should work with total alias", () => {
      const results = evaluate("10\n20\ntotal");
      expect(results[2]?.value).toBe(30);
    });

    it("should skip comments and empty lines", () => {
      const results = evaluate("10\n// comment\n20\n\nsum");
      expect(results[4]?.value).toBe(30);
    });
  });

  describe("avg / average", () => {
    it("should return average of results above", () => {
      const results = evaluate("10\n20\n30\navg");
      expect(results[3]?.value).toBe(20);
    });

    it("should work with average alias", () => {
      const results = evaluate("100\n200\naverage");
      expect(results[2]?.value).toBe(150);
    });

    it("should skip empty lines", () => {
      const results = evaluate("10\n\n30\navg");
      expect(results[3]?.value).toBe(20);
    });
  });

  describe("prev / previous", () => {
    it("should return result of previous line", () => {
      const results = evaluate("42\nprev");
      expect(results[1]?.value).toBe(42);
    });

    it("should skip empty lines to find previous", () => {
      const results = evaluate("42\n\nprev");
      expect(results[2]?.value).toBe(42);
    });

    it("should work with previous alias", () => {
      const results = evaluate("100\nprevious");
      expect(results[1]?.value).toBe(100);
    });

    it("should return 0 when no previous result", () => {
      const results = evaluate("prev");
      expect(results[0]?.value).toBe(0);
    });
  });

  describe("count", () => {
    it("should return count of lines with results", () => {
      const results = evaluate("10\n20\n30\ncount");
      expect(results[3]?.value).toBe(3);
    });

    it("should skip comments and empty lines", () => {
      const results = evaluate("10\n// comment\n20\n\ncount");
      expect(results[4]?.value).toBe(2);
    });
  });

  describe("line refs in expressions", () => {
    it("should use sum in arithmetic", () => {
      const results = evaluate("10\n20\nsum * 2");
      expect(results[2]?.value).toBe(60);
    });

    it("should use prev in assignment", () => {
      const results = evaluate("42\nx = prev + 8");
      expect(results[1]?.value).toBe(50);
    });
  });
});
