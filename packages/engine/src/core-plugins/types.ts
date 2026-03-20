import type { UnitDefinition } from "../units/registry.js";

export type MathFn = (...args: number[]) => number;

export interface LineRefContext {
  previousResults: (number | null)[];
  currentLine: number;
}

export type LineRefHandler = (ctx: LineRefContext) => number;

export interface PluginManifest {
  id: string;
  name: string;
  description?: string;
  functions?: Record<string, { fn: MathFn; detail?: string }>;
  constants?: Record<string, { value: number; detail?: string }>;
  units?: UnitDefinition[];
  lineRefs?: Record<string, { handler: LineRefHandler; detail?: string }>;
  dateLiterals?: Record<string, { resolver: () => Date; detail?: string }>;
  baseConversions?: Record<
    string,
    { formatter: (n: number) => string; detail?: string; aliases?: string[] }
  >;
}
