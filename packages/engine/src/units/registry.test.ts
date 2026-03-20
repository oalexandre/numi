import { describe, it, expect, beforeEach } from "vitest";

import { UnitRegistry } from "./registry.js";

describe("UnitRegistry", () => {
  let registry: UnitRegistry;

  beforeEach(() => {
    registry = new UnitRegistry();
  });

  describe("addUnit", () => {
    it("should accept Numi-format unit definitions", () => {
      registry.addUnit({
        id: "meter",
        phrases: "meter, meters, m",
        baseUnitId: "meter",
        format: "m",
        ratio: 1,
      });

      const unit = registry.findByPhrase("meter");
      expect(unit).toBeDefined();
      expect(unit?.id).toBe("meter");
    });

    it("should index all phrase aliases", () => {
      registry.addUnit({
        id: "kilometer",
        phrases: "kilometer, kilometers, km",
        baseUnitId: "meter",
        format: "km",
        ratio: 1000,
      });

      expect(registry.findByPhrase("kilometer")).toBeDefined();
      expect(registry.findByPhrase("kilometers")).toBeDefined();
      expect(registry.findByPhrase("km")).toBeDefined();
    });
  });

  describe("lookup", () => {
    it("should be case-insensitive", () => {
      registry.addUnit({
        id: "meter",
        phrases: "meter, meters, m",
        baseUnitId: "meter",
        format: "m",
        ratio: 1,
      });

      expect(registry.findByPhrase("Meter")).toBeDefined();
      expect(registry.findByPhrase("METERS")).toBeDefined();
      expect(registry.findByPhrase("M")).toBeDefined();
    });

    it("should return undefined for unknown phrases", () => {
      expect(registry.findByPhrase("unknown")).toBeUndefined();
    });

    it("should find by id", () => {
      registry.addUnit({
        id: "meter",
        phrases: "meter, meters, m",
        baseUnitId: "meter",
        format: "m",
        ratio: 1,
      });

      expect(registry.getById("meter")).toBeDefined();
    });
  });

  describe("convert", () => {
    beforeEach(() => {
      registry.addUnit({
        id: "meter",
        phrases: "meter, meters, m",
        baseUnitId: "meter",
        format: "m",
        ratio: 1,
      });
      registry.addUnit({
        id: "kilometer",
        phrases: "kilometer, kilometers, km",
        baseUnitId: "meter",
        format: "km",
        ratio: 1000,
      });
      registry.addUnit({
        id: "centimeter",
        phrases: "centimeter, centimeters, cm",
        baseUnitId: "meter",
        format: "cm",
        ratio: 0.01,
      });
    });

    it("should convert between units of same dimension", () => {
      expect(registry.convert(1, "kilometer", "meter")).toBeCloseTo(1000);
      expect(registry.convert(100, "centimeter", "meter")).toBeCloseTo(1);
      expect(registry.convert(1, "kilometer", "centimeter")).toBeCloseTo(100000);
    });

    it("should convert to same unit", () => {
      expect(registry.convert(5, "meter", "meter")).toBe(5);
    });

    it("should throw for incompatible units", () => {
      registry.addUnit({
        id: "kilogram",
        phrases: "kilogram, kg",
        baseUnitId: "kilogram",
        format: "kg",
        ratio: 1,
      });

      expect(() => registry.convert(1, "meter", "kilogram")).toThrow("incompatible units");
    });

    it("should throw for unknown units", () => {
      expect(() => registry.convert(1, "meter", "unknown")).toThrow('Unknown unit "unknown"');
    });
  });

  describe("non-linear conversion", () => {
    beforeEach(() => {
      registry.addUnit({
        id: "celsius",
        phrases: "celsius, °C, C",
        baseUnitId: "celsius",
        format: "°C",
        ratio: 1,
      });
      registry.addUnit({
        id: "fahrenheit",
        phrases: "fahrenheit, °F, F",
        baseUnitId: "celsius",
        format: "°F",
        ratio: 1,
        toBase: (f: number) => (f - 32) * (5 / 9),
        fromBase: (c: number) => c * (9 / 5) + 32,
      });
    });

    it("should convert temperature correctly", () => {
      expect(registry.convert(100, "celsius", "fahrenheit")).toBeCloseTo(212);
      expect(registry.convert(32, "fahrenheit", "celsius")).toBeCloseTo(0);
      expect(registry.convert(212, "fahrenheit", "celsius")).toBeCloseTo(100);
    });
  });
});
