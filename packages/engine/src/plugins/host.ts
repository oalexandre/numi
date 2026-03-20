import { readFileSync } from "node:fs";
import vm from "node:vm";

import { FunctionRegistry } from "../functions/index.js";
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
  private plugins: PluginInfo[] = [];

  constructor(unitRegistry: UnitRegistry, functionRegistry: FunctionRegistry) {
    this.unitRegistry = unitRegistry;
    this.functionRegistry = functionRegistry;
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

    const numiProxy = {
      addUnit(definition: UnitDefinition): void {
        unitReg.addUnit(definition);
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

        funcReg.register(fnName, (...args: number[]) => {
          const values = args.map((double) => ({ double }));
          const result = callback(values);
          if (result === undefined) return 0;
          return result.double;
        });

        // Register additional phrase aliases
        for (let i = 1; i < phrases.length; i++) {
          const alias = phrases[i];
          if (alias) {
            funcReg.register(alias, (...args: number[]) => {
              const values = args.map((double) => ({ double }));
              const result = callback(values);
              if (result === undefined) return 0;
              return result.double;
            });
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
