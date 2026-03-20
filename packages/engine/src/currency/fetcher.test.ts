import { describe, it, expect } from "vitest";

import { CurrencyFetcher } from "./fetcher.js";

describe("CurrencyFetcher", () => {
  it("should return fallback rates when no cache", () => {
    const fetcher = new CurrencyFetcher();
    const rates = fetcher.getRates();
    expect(rates.base).toBe("USD");
    expect(rates.rates["USD"]).toBe(1);
    expect(rates.rates["EUR"]).toBeDefined();
    expect(rates.rates["BRL"]).toBeDefined();
  });

  it("should return rate by currency code", () => {
    const fetcher = new CurrencyFetcher();
    expect(fetcher.getRate("USD")).toBe(1);
    expect(fetcher.getRate("eur")).toBeDefined();
    expect(fetcher.getRate("UNKNOWN")).toBeUndefined();
  });

  it("should be stale without cache", () => {
    const fetcher = new CurrencyFetcher();
    expect(fetcher.isStale()).toBe(true);
  });

  it("should support 30+ currencies", () => {
    const fetcher = new CurrencyFetcher();
    const rates = fetcher.getRates();
    expect(Object.keys(rates.rates).length).toBeGreaterThanOrEqual(30);
  });
});
