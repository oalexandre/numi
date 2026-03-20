import { describe, it, expect } from "vitest";

import { FunctionRegistry } from "../functions/index.js";
import { UnitRegistry } from "../units/registry.js";

import { PluginHost } from "./host.js";

function createHost(): { host: PluginHost; units: UnitRegistry; funcs: FunctionRegistry } {
  const units = new UnitRegistry();
  const funcs = new FunctionRegistry();
  const host = new PluginHost(units, funcs);
  return { host, units, funcs };
}

describe("PluginHost", () => {
  describe("addUnit", () => {
    it("should register units via numi.addUnit()", () => {
      const { host, units } = createHost();
      host.loadPluginCode(`
        numi.addUnit({
          id: "custom_unit",
          phrases: "custom, cst",
          baseUnitId: "meter",
          format: "cst",
          ratio: 42
        });
      `);

      expect(units.findByPhrase("custom")).toBeDefined();
      expect(units.findByPhrase("cst")).toBeDefined();
    });
  });

  describe("addFunction", () => {
    it("should register functions via numi.addFunction()", () => {
      const { host, funcs } = createHost();
      host.loadPluginCode(`
        numi.addFunction(
          { id: "double", phrases: "double, dbl" },
          function(values) {
            return { double: values[0].double * 2 };
          }
        );
      `);

      expect(funcs.has("double")).toBe(true);
      expect(funcs.has("dbl")).toBe(true);
      expect(funcs.call("double", [5])).toBe(10);
    });

    it("should handle multi-arg functions", () => {
      const { host, funcs } = createHost();
      host.loadPluginCode(`
        numi.addFunction(
          { id: "pchange", phrases: "percent change, pchange" },
          function(values) {
            var oldVal = values[0].double;
            var newVal = values[1].double;
            return { double: ((newVal - oldVal) / oldVal) * 100 };
          }
        );
      `);

      expect(funcs.call("pchange", [100, 120])).toBe(20);
    });
  });

  describe("error isolation", () => {
    it("should not crash on plugin errors", () => {
      const { host } = createHost();
      const info = host.loadPluginCode(`throw new Error("broken plugin");`);
      expect(info.loaded).toBe(false);
      expect(info.error).toContain("broken plugin");
    });

    it("should load subsequent plugins after error", () => {
      const { host, funcs } = createHost();

      host.loadPluginCode(`throw new Error("fail");`);
      host.loadPluginCode(`
        numi.addFunction(
          { id: "working", phrases: "working" },
          function(values) { return { double: values[0].double }; }
        );
      `);

      expect(funcs.has("working")).toBe(true);
      expect(host.getPlugins()).toHaveLength(2);
      expect(host.getPlugins()[0]?.loaded).toBe(false);
      expect(host.getPlugins()[1]?.loaded).toBe(true);
    });
  });

  describe("JS execution", () => {
    it("should support loops for programmatic unit generation", () => {
      const { host, units } = createHost();
      host.loadPluginCode(`
        var prefixes = ["kilo", "mega", "giga"];
        var ratios = [1000, 1000000, 1000000000];
        for (var i = 0; i < prefixes.length; i++) {
          numi.addUnit({
            id: prefixes[i] + "watt",
            phrases: prefixes[i] + "watt, " + prefixes[i][0].toUpperCase() + "W",
            baseUnitId: "watt",
            format: prefixes[i][0].toUpperCase() + "W",
            ratio: ratios[i]
          });
        }
      `);

      expect(units.findByPhrase("kilowatt")).toBeDefined();
      expect(units.findByPhrase("megawatt")).toBeDefined();
      expect(units.findByPhrase("gigawatt")).toBeDefined();
    });

    it("should support closures and persistent state", () => {
      const { host, funcs } = createHost();
      host.loadPluginCode(`
        var store = [];
        numi.addFunction(
          { id: "vpush", phrases: "vpush" },
          function(values) {
            store.push(values[0].double);
            return { double: store.length };
          }
        );
        numi.addFunction(
          { id: "vsum", phrases: "vsum" },
          function() {
            var sum = 0;
            for (var i = 0; i < store.length; i++) sum += store[i];
            return { double: sum };
          }
        );
      `);

      expect(funcs.call("vpush", [10])).toBe(1);
      expect(funcs.call("vpush", [20])).toBe(2);
      expect(funcs.call("vsum", [])).toBe(30);
    });
  });
});
