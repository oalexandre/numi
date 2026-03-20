import { readFileSync } from "node:fs";
import vm from "node:vm";

import { FunctionRegistry } from "../functions/index.js";
import type { EntityRegistry } from "../registry/entity-registry.js";
import type { UnitDefinition } from "../units/registry.js";
import { UnitRegistry } from "../units/registry.js";

export interface PluginInfo {
  path: string;
  loaded: boolean;
  error?: string;
}

export class PluginHost {
  private unitRegistry: UnitRegistry;
  private functionRegistry: FunctionRegistry;
  private entityRegistry?: EntityRegistry;
  private plugins: PluginInfo[] = [];

  constructor(entityOrUnit: EntityRegistry | UnitRegistry, functionRegistry?: FunctionRegistry) {
    if ("getKnownFunctions" in entityOrUnit) {
      // EntityRegistry
      this.entityRegistry = entityOrUnit;
      this.unitRegistry = entityOrUnit.getUnitRegistry();
      this.functionRegistry = new FunctionRegistry();
    } else {
      // UnitRegistry (backward compat)
      this.unitRegistry = entityOrUnit;
      this.functionRegistry = functionRegistry ?? new FunctionRegistry();
    }
  }

  loadPlugin(filePath: string): PluginInfo {
    const info: PluginInfo = { path: filePath, loaded: false };

    try {
      const code = readFileSync(filePath, "utf-8");
      this.executePlugin(code, filePath);
      info.loaded = true;
    } catch (err) {
      info.error = extractErrorMessage(err);
    }

    this.plugins.push(info);
    return info;
  }

  loadPluginCode(code: string, name?: string): PluginInfo {
    const info: PluginInfo = { path: name ?? "<inline>", loaded: false };

    try {
      this.executePlugin(code, name ?? "<inline>");
      info.loaded = true;
    } catch (err) {
      info.error = extractErrorMessage(err);
    }

    this.plugins.push(info);
    return info;
  }

  getPlugins(): PluginInfo[] {
    return [...this.plugins];
  }

  private executePlugin(code: string, filename: string): void {
    const unitReg = this.unitRegistry;
    const funcReg = this.functionRegistry;
    const entityReg = this.entityRegistry;

    const numiProxy = {
      addUnit(definition: UnitDefinition): void {
        unitReg.addUnit(definition);
        // Also register in EntityRegistry if available (keeps it in sync)
      },

      addFunction(
        definition: { id: string; phrases: string },
        callback: (values: Array<{ double: number; unitId?: string }>) => {
          double: number;
          unitId?: string;
        } | undefined,
      ): void {
        const phrases = definition.phrases.split(",").map((p) => p.trim().toLowerCase());
        const fnName = phrases[0] ?? definition.id;

        const wrappedFn = (...args: number[]) => {
          const values = args.map((double) => ({ double }));
          const result = callback(values);
          if (result === undefined) return 0;
          return result.double;
        };

        if (entityReg) {
          entityReg.registerFunction(fnName, wrappedFn);
        } else {
          funcReg.register(fnName, wrappedFn);
        }

        // Register additional phrase aliases
        for (let i = 1; i < phrases.length; i++) {
          const alias = phrases[i];
          if (alias) {
            if (entityReg) {
              entityReg.registerFunction(alias, wrappedFn);
            } else {
              funcReg.register(alias, wrappedFn);
            }
          }
        }
      },
    };

    const context = vm.createContext({
      numi: numiProxy,
      Math,
      console: {
        log: () => {},
        warn: () => {},
        error: () => {},
      },
      parseFloat,
      parseInt,
      isNaN,
      isFinite,
      Number,
      String,
      Array,
      Object,
      JSON,
    });

    vm.runInContext(code, context, {
      filename,
      timeout: 5000,
    });
  }
}

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return String(err);
}
