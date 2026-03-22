import { readFileSync } from "node:fs";
import vm from "node:vm";

import type { PluginTest } from "../core-plugins/types.js";
import type { EntityRegistry } from "../registry/entity-registry.js";
import type { UnitDefinition } from "../units/registry.js";

export interface PluginInfo {
  path: string;
  loaded: boolean;
  error?: string;
}

export class PluginHost {
  private entityRegistry: EntityRegistry;
  private plugins: PluginInfo[] = [];
  private communityTests: PluginTest[] = [];

  constructor(entityRegistry: EntityRegistry) {
    this.entityRegistry = entityRegistry;
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

  /** Get all test cases registered by community plugins via numi.addTest(). */
  getCommunityTests(): PluginTest[] {
    return [...this.communityTests];
  }

  private executePlugin(code: string, filename: string): void {
    const entityReg = this.entityRegistry;
    const tests = this.communityTests;

    const numiProxy = {
      addUnit(definition: UnitDefinition): void {
        entityReg.addUnit(definition);
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

        entityReg.registerFunction(fnName, wrappedFn);

        // Register additional phrase aliases
        for (let i = 1; i < phrases.length; i++) {
          const alias = phrases[i];
          if (alias) {
            entityReg.registerFunction(alias, wrappedFn);
          }
        }
      },

      addTest(test: { description: string; input: string; line?: number; expected?: number | null; formatted?: string; tolerance?: number }): void {
        tests.push(test);
      },

      addHelp(section: { title: string; description?: string; examples: Array<{ input: string; output: string; desc?: string }> }): void {
        entityReg.registerHelpSections([section], "community");
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
