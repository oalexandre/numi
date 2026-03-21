import { describe, it, expect } from "vitest";

import { createEntityRegistry } from "../index.js";

describe("built-in units", () => {
  const registry = createEntityRegistry();
  const unitReg = registry.getUnitRegistry();

  describe("length", () => {
    it("should convert km to m", () => {
      expect(unitReg.convert(1, "kilometer", "meter")).toBeCloseTo(1000);
    });

    it("should convert inches to cm", () => {
      expect(unitReg.convert(1, "inch", "centimeter")).toBeCloseTo(2.54);
    });

    it("should convert miles to km", () => {
      expect(unitReg.convert(1, "mile", "kilometer")).toBeCloseTo(1.60934);
    });

    it("should convert feet to meters", () => {
      expect(unitReg.convert(1, "foot", "meter")).toBeCloseTo(0.3048);
    });
  });

  describe("weight", () => {
    it("should convert kg to pounds", () => {
      expect(unitReg.convert(1, "kilogram", "pound")).toBeCloseTo(2.20462);
    });

    it("should convert grams to ounces", () => {
      expect(unitReg.convert(28.3495, "gram", "ounce")).toBeCloseTo(1, 0);
    });
  });

  describe("volume", () => {
    it("should convert liters to gallons", () => {
      expect(unitReg.convert(3.78541, "liter", "gallon")).toBeCloseTo(1);
    });

    it("should convert cups to ml", () => {
      expect(unitReg.convert(1, "cup", "milliliter")).toBeCloseTo(236.588);
    });
  });

  describe("temperature", () => {
    it("should convert celsius to fahrenheit", () => {
      expect(unitReg.convert(0, "celsius", "fahrenheit")).toBeCloseTo(32);
      expect(unitReg.convert(100, "celsius", "fahrenheit")).toBeCloseTo(212);
    });

    it("should convert fahrenheit to celsius", () => {
      expect(unitReg.convert(32, "fahrenheit", "celsius")).toBeCloseTo(0);
      expect(unitReg.convert(212, "fahrenheit", "celsius")).toBeCloseTo(100);
    });

    it("should convert celsius to kelvin", () => {
      expect(unitReg.convert(0, "celsius", "kelvin")).toBeCloseTo(273.15);
      expect(unitReg.convert(100, "celsius", "kelvin")).toBeCloseTo(373.15);
    });

    it("should convert kelvin to fahrenheit", () => {
      expect(unitReg.convert(273.15, "kelvin", "fahrenheit")).toBeCloseTo(32);
    });
  });

  describe("area", () => {
    it("should convert sqft to sqm", () => {
      expect(unitReg.convert(1, "sqfoot", "sqmeter")).toBeCloseTo(0.092903);
    });

    it("should convert acres to hectares", () => {
      expect(unitReg.convert(1, "acre", "hectare")).toBeCloseTo(0.404686);
    });
  });

  describe("data", () => {
    it("should convert bytes to bits", () => {
      expect(unitReg.convert(1, "byte", "bit")).toBeCloseTo(8);
    });

    it("should convert GB to MB", () => {
      expect(unitReg.convert(1, "gigabyte", "megabyte")).toBeCloseTo(1000);
    });

    it("should convert GiB to MiB (binary)", () => {
      expect(unitReg.convert(1, "gibibyte", "mebibyte")).toBeCloseTo(1024);
    });

    it("should convert KB to KiB", () => {
      expect(unitReg.convert(1000, "kilobyte", "kibibyte")).toBeCloseTo(976.5625);
    });
  });

  describe("phrase lookup", () => {
    it("should find by abbreviation", () => {
      expect(unitReg.findByPhrase("km")).toBeDefined();
      expect(unitReg.findByPhrase("lb")).toBeDefined();
      expect(unitReg.findByPhrase("°C")).toBeDefined();
    });

    it("should find by full name", () => {
      expect(unitReg.findByPhrase("kilometer")).toBeDefined();
      expect(unitReg.findByPhrase("pounds")).toBeDefined();
    });

    it("should be case-insensitive", () => {
      expect(unitReg.findByPhrase("KM")).toBeDefined();
      expect(unitReg.findByPhrase("Celsius")).toBeDefined();
    });
  });
});
