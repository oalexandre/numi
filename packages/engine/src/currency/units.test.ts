import { describe, it, expect } from "vitest";

import { createEntityRegistry, registerPlugin, createCurrencyPlugin } from "../index.js";

import { CurrencyFetcher } from "./fetcher.js";

describe("currency units", () => {
  function registryWithCurrency() {
    const registry = createEntityRegistry();
    const fetcher = new CurrencyFetcher();
    registerPlugin(registry, createCurrencyPlugin(fetcher));
    return registry;
  }

  it("should register all currencies with correct phrases", () => {
    const registry = registryWithCurrency();
    const unitReg = registry.getUnitRegistry();

    expect(unitReg.findByPhrase("USD")).toBeDefined();
    expect(unitReg.findByPhrase("EUR")).toBeDefined();
    expect(unitReg.findByPhrase("dollar")).toBeDefined();
    expect(unitReg.findByPhrase("euro")).toBeDefined();
    expect(unitReg.findByPhrase("BRL")).toBeDefined();
  });

  it("should convert between currencies", () => {
    const registry = registryWithCurrency();
    const unitReg = registry.getUnitRegistry();

    const usdToEur = unitReg.convert(100, "currency_USD", "currency_EUR");
    expect(usdToEur).toBeGreaterThan(80);
    expect(usdToEur).toBeLessThan(110);
  });

  it("should convert BRL to USD", () => {
    const registry = registryWithCurrency();
    const unitReg = registry.getUnitRegistry();

    const result = unitReg.convert(100, "currency_BRL", "currency_USD");
    expect(result).toBeGreaterThan(15);
    expect(result).toBeLessThan(30);
  });

  it("should find currency by code", () => {
    const registry = registryWithCurrency();
    const unitReg = registry.getUnitRegistry();

    const usd = unitReg.findByPhrase("USD");
    expect(usd).toBeDefined();
    expect(usd?.format).toBe("USD");
  });
});
