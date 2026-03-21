import { describe, it, expect } from "vitest";

import { EntityRegistry } from "../registry/entity-registry.js";

import { PluginHost } from "./host.js";

function createHost(): { host: PluginHost; registry: EntityRegistry } {
  const registry = new EntityRegistry();
  const host = new PluginHost(registry);
  return { host, registry };
}

describe("PluginHost", () => {
  describe("addUnit", () => {
    it("should register units via numi.addUnit()", () => {
      const { host, registry } = createHost();
      host.loadPluginCode(`
        numi.addUnit({
          id: "custom_unit",
          phrases: "custom, cst",
          baseUnitId: "meter",
          format: "cst",
          ratio: 42
        });
      `);

      const unitReg = registry.getUnitRegistry();
      expect(unitReg.findByPhrase("custom")).toBeDefined();
      expect(unitReg.findByPhrase("cst")).toBeDefined();
    });
  });

  describe("addFunction", () => {
    it("should register functions via numi.addFunction()", () => {
      const { host, registry } = createHost();
      host.loadPluginCode(`
        numi.addFunction(
          { id: "double", phrases: "double, dbl" },
          function(values) {
            return { double: values[0].double * 2 };
          }
        );
      `);

      expect(registry.hasFunction("double")).toBe(true);
      expect(registry.hasFunction("dbl")).toBe(true);
      expect(registry.callFunction("double", [5])).toBe(10);
    });

    it("should handle multi-arg functions", () => {
      const { host, registry } = createHost();
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

      expect(registry.callFunction("pchange", [100, 120])).toBe(20);
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
      const { host, registry } = createHost();

      host.loadPluginCode(`throw new Error("fail");`);
      host.loadPluginCode(`
        numi.addFunction(
          { id: "working", phrases: "working" },
          function(values) { return { double: values[0].double }; }
        );
      `);

      expect(registry.hasFunction("working")).toBe(true);
      expect(host.getPlugins()).toHaveLength(2);
      expect(host.getPlugins()[0]?.loaded).toBe(false);
      expect(host.getPlugins()[1]?.loaded).toBe(true);
    });
  });

  describe("JS execution", () => {
    it("should support loops for programmatic unit generation", () => {
      const { host, registry } = createHost();
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

      const unitReg = registry.getUnitRegistry();
      expect(unitReg.findByPhrase("kilowatt")).toBeDefined();
      expect(unitReg.findByPhrase("megawatt")).toBeDefined();
      expect(unitReg.findByPhrase("gigawatt")).toBeDefined();
    });

    it("should support closures and persistent state", () => {
      const { host, registry } = createHost();
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

      expect(registry.callFunction("vpush", [10])).toBe(1);
      expect(registry.callFunction("vpush", [20])).toBe(2);
      expect(registry.callFunction("vsum", [])).toBe(30);
    });
  });
});
