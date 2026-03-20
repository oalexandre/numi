import { describe, it, expect } from "vitest";

import { createDefaultRegistry } from "./built-in.js";

describe("built-in units", () => {
  const registry = createDefaultRegistry();

  describe("length", () => {
    it("should convert km to m", () => {
      expect(registry.convert(1, "kilometer", "meter")).toBeCloseTo(1000);
    });

    it("should convert inches to cm", () => {
      expect(registry.convert(1, "inch", "centimeter")).toBeCloseTo(2.54);
    });

    it("should convert miles to km", () => {
      expect(registry.convert(1, "mile", "kilometer")).toBeCloseTo(1.60934);
    });

    it("should convert feet to meters", () => {
      expect(registry.convert(1, "foot", "meter")).toBeCloseTo(0.3048);
    });
  });

  describe("weight", () => {
    it("should convert kg to pounds", () => {
      expect(registry.convert(1, "kilogram", "pound")).toBeCloseTo(2.20462);
    });

    it("should convert grams to ounces", () => {
      expect(registry.convert(28.3495, "gram", "ounce")).toBeCloseTo(1, 0);
    });
  });

  describe("volume", () => {
    it("should convert liters to gallons", () => {
      expect(registry.convert(3.78541, "liter", "gallon")).toBeCloseTo(1);
    });

    it("should convert cups to ml", () => {
      expect(registry.convert(1, "cup", "milliliter")).toBeCloseTo(236.588);
    });
  });

  describe("temperature", () => {
    it("should convert celsius to fahrenheit", () => {
      expect(registry.convert(0, "celsius", "fahrenheit")).toBeCloseTo(32);
      expect(registry.convert(100, "celsius", "fahrenheit")).toBeCloseTo(212);
    });

    it("should convert fahrenheit to celsius", () => {
      expect(registry.convert(32, "fahrenheit", "celsius")).toBeCloseTo(0);
      expect(registry.convert(212, "fahrenheit", "celsius")).toBeCloseTo(100);
    });

    it("should convert celsius to kelvin", () => {
      expect(registry.convert(0, "celsius", "kelvin")).toBeCloseTo(273.15);
      expect(registry.convert(100, "celsius", "kelvin")).toBeCloseTo(373.15);
    });

    it("should convert kelvin to fahrenheit", () => {
      expect(registry.convert(273.15, "kelvin", "fahrenheit")).toBeCloseTo(32);
    });
  });

  describe("area", () => {
    it("should convert sqft to sqm", () => {
      expect(registry.convert(1, "sqfoot", "sqmeter")).toBeCloseTo(0.092903);
    });

    it("should convert acres to hectares", () => {
      expect(registry.convert(1, "acre", "hectare")).toBeCloseTo(0.404686);
    });
  });

  describe("data", () => {
    it("should convert bytes to bits", () => {
      expect(registry.convert(1, "byte", "bit")).toBeCloseTo(8);
    });

    it("should convert GB to MB", () => {
      expect(registry.convert(1, "gigabyte", "megabyte")).toBeCloseTo(1000);
    });

    it("should convert GiB to MiB (binary)", () => {
      expect(registry.convert(1, "gibibyte", "mebibyte")).toBeCloseTo(1024);
    });

    it("should convert KB to KiB", () => {
      expect(registry.convert(1000, "kilobyte", "kibibyte")).toBeCloseTo(976.5625);
    });
  });

  describe("phrase lookup", () => {
    it("should find by abbreviation", () => {
      expect(registry.findByPhrase("km")).toBeDefined();
      expect(registry.findByPhrase("lb")).toBeDefined();
      expect(registry.findByPhrase("°C")).toBeDefined();
    });

    it("should find by full name", () => {
      expect(registry.findByPhrase("kilometer")).toBeDefined();
      expect(registry.findByPhrase("pounds")).toBeDefined();
    });

    it("should be case-insensitive", () => {
      expect(registry.findByPhrase("KM")).toBeDefined();
      expect(registry.findByPhrase("Celsius")).toBeDefined();
    });
  });
});
