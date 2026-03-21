import type { MathFn, LineRefHandler, LineRefContext, HelpSection } from "../core-plugins/types.js";
import type { UnitDefinition } from "../units/registry.js";
import { UnitRegistry } from "../units/registry.js";

export interface EntityInfo {
  name: string;
  type: "function" | "constant" | "unit" | "lineRef" | "dateLiteral" | "baseConversion";
  detail?: string;
}

export class EntityRegistry {
  private unitRegistry: UnitRegistry;
  private functions = new Map<string, MathFn>();
  private functionDetails = new Map<string, string>();
  private constants = new Map<string, number>();
  private constantDetails = new Map<string, string>();
  private lineRefs = new Map<string, LineRefHandler>();
  private lineRefDetails = new Map<string, string>();
  private dateLiterals = new Map<string, () => Date>();
  private dateLiteralDetails = new Map<string, string>();
  private baseConversions = new Map<string, (n: number) => string>();
  private baseConversionDetails = new Map<string, string>();
  private coreHelpSections: HelpSection[] = [];
  private communityHelpSections: HelpSection[] = [];

  constructor(unitRegistry?: UnitRegistry) {
    this.unitRegistry = unitRegistry ?? new UnitRegistry();
  }

  // --- Registration ---

  registerFunction(name: string, fn: MathFn, detail?: string): void {
    this.functions.set(name, fn);
    if (detail) this.functionDetails.set(name, detail);
  }

  registerConstant(name: string, value: number, detail?: string): void {
    this.constants.set(name, value);
    if (detail) this.constantDetails.set(name, detail);
  }

  registerLineRef(name: string, handler: LineRefHandler, detail?: string): void {
    this.lineRefs.set(name, handler);
    if (detail) this.lineRefDetails.set(name, detail);
  }

  registerDateLiteral(name: string, resolver: () => Date, detail?: string): void {
    this.dateLiterals.set(name, resolver);
    if (detail) this.dateLiteralDetails.set(name, detail);
  }

  registerBaseConversion(name: string, formatter: (n: number) => string, detail?: string): void {
    this.baseConversions.set(name, formatter);
    if (detail) this.baseConversionDetails.set(name, detail);
  }

  addUnit(definition: UnitDefinition): void {
    this.unitRegistry.addUnit(definition);
  }

  registerHelpSections(sections: HelpSection[], source: "core" | "community"): void {
    if (source === "core") {
      this.coreHelpSections.push(...sections);
    } else {
      this.communityHelpSections.push(...sections);
    }
  }

  getHelpSections(): { core: HelpSection[]; community: HelpSection[] } {
    return {
      core: [...this.coreHelpSections],
      community: [...this.communityHelpSections],
    };
  }

  // --- Query methods for parser ---

  getKnownFunctions(): Set<string> {
    return new Set(this.functions.keys());
  }

  getKnownConstants(): Set<string> {
    return new Set(this.constants.keys());
  }

  getKnownDateLiterals(): Set<string> {
    return new Set(this.dateLiterals.keys());
  }

  getKnownLineRefs(): Set<string> {
    return new Set(this.lineRefs.keys());
  }

  getKnownBaseKeywords(): Set<string> {
    return new Set(this.baseConversions.keys());
  }

  getKnownUnits(): Set<string> {
    return new Set(this.unitRegistry.getAllPhrases());
  }

  // --- Eval methods ---

  callFunction(name: string, args: number[]): number {
    const fn = this.functions.get(name);
    if (!fn) throw new Error(`Unknown function "${name}"`);
    return fn(...args);
  }

  hasFunction(name: string): boolean {
    return this.functions.has(name);
  }

  getConstantValue(name: string): number | undefined {
    return this.constants.get(name);
  }

  resolveDateLiteral(keyword: string): Date {
    const resolver = this.dateLiterals.get(keyword.toLowerCase());
    if (!resolver) throw new Error(`Unknown date literal "${keyword}"`);
    return resolver();
  }

  resolveLineRef(ref: string, previousResults: (number | null)[], currentLine: number): number {
    const handler = this.lineRefs.get(ref);
    if (!handler) throw new Error(`Unknown line reference "${ref}"`);
    return handler({ previousResults, currentLine });
  }

  getBaseFormatter(keyword: string): ((n: number) => string) | undefined {
    return this.baseConversions.get(keyword.toLowerCase());
  }

  // --- Unit delegation ---

  getUnitRegistry(): UnitRegistry {
    return this.unitRegistry;
  }

  // --- Info for renderer ---

  getAllEntityInfo(): EntityInfo[] {
    const info: EntityInfo[] = [];

    for (const name of this.functions.keys()) {
      info.push({ name, type: "function", detail: this.functionDetails.get(name) });
    }
    for (const name of this.constants.keys()) {
      info.push({ name, type: "constant", detail: this.constantDetails.get(name) });
    }
    for (const name of this.lineRefs.keys()) {
      info.push({ name, type: "lineRef", detail: this.lineRefDetails.get(name) });
    }
    for (const name of this.dateLiterals.keys()) {
      info.push({ name, type: "dateLiteral", detail: this.dateLiteralDetails.get(name) });
    }
    for (const name of this.baseConversions.keys()) {
      info.push({ name, type: "baseConversion", detail: this.baseConversionDetails.get(name) });
    }

    return info;
  }
}
