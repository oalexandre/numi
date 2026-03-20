# Ilumi Plugin System

Ilumi supports two types of plugins: **Core Plugins** (TypeScript, built-in) and **Community Plugins** (JavaScript, user-installable). Both use the same entity registration system and their entities automatically appear in the parser, evaluator, autocomplete, and syntax highlighting.

## Architecture

All entities flow through the central **EntityRegistry**:

```
CorePlugins (TS manifests)  ──► EntityRegistry ──► Parser (known names)
CommunityPlugins (JS/VM)    ──►                ──► Evaluator (handlers)
                                               ──► Autocomplete (labels)
                                               ──► Syntax Highlighting (sets)
```

## Plugin Types

### Core Plugins (TypeScript)

Located in `packages/engine/src/core-plugins/`. Each module exports a `PluginManifest`:

```typescript
import type { PluginManifest } from "../types.js";

export const myPlugin: PluginManifest = {
  id: "core.my-plugin",
  name: "My Plugin",
  description: "Does something useful",
  functions: { /* ... */ },
  constants: { /* ... */ },
  units: [ /* ... */ ],
};
```

After creating a core plugin, add it to `core-plugins/index.ts`.

### Community Plugins (JavaScript)

Located in `plugins/CommunityPlugins/` or `~/.ilumi-calc/plugins/`. Each plugin is a `.js` file (or a directory containing a `.js` file) that uses the `numi` API:

```javascript
numi.addFunction(
  { id: "double", phrases: "double, dbl" },
  function(values) {
    return { double: values[0].double * 2 };
  }
);

numi.addUnit({
  id: "custom_unit",
  phrases: "custom, cst",
  baseUnitId: "meter",
  format: "cst",
  ratio: 42,
});
```

Community plugins run in a sandboxed VM with access to `Math`, `JSON`, `Number`, `String`, `Array`, `Object`, `parseFloat`, `parseInt`, `isNaN`, `isFinite`, and `console` (no-op). Timeout is 5 seconds.

## Entity Types

### Functions

Math functions that take one or more numeric arguments.

```typescript
// Core plugin
functions: {
  sqrt: { fn: Math.sqrt, detail: "square root" },
  clamp: {
    fn: (x, min, max) => Math.min(Math.max(x, min), max),
    detail: "clamp value to range",
  },
}

// Community plugin
numi.addFunction(
  { id: "factorial", phrases: "factorial, fact" },
  function(values) {
    var n = values[0].double;
    var result = 1;
    for (var i = 2; i <= n; i++) result *= i;
    return { double: result };
  }
);
```

### Constants

Named numeric values.

```typescript
constants: {
  phi: { value: 1.618033988749895, detail: "golden ratio" },
}
```

### Units

Physical or abstract units with conversion ratios.

```typescript
units: [
  { id: "meter", phrases: "meter, meters, m", baseUnitId: "meter", format: "m", ratio: 1 },
  { id: "foot", phrases: "foot, feet, ft", baseUnitId: "meter", format: "ft", ratio: 0.3048 },
]
```

Units with the same `baseUnitId` are convertible to each other. For non-linear conversions (e.g., temperature), use `toBase` and `fromBase`:

```typescript
{
  id: "fahrenheit",
  phrases: "fahrenheit, °F",
  baseUnitId: "celsius",
  format: "°F",
  ratio: 1,
  toBase: (f) => (f - 32) * (5 / 9),
  fromBase: (c) => c * (9 / 5) + 32,
}
```

### Line References

Aggregate functions that reference previous line results.

```typescript
lineRefs: {
  median: {
    handler: (ctx) => {
      const above = ctx.previousResults
        .slice(0, ctx.currentLine)
        .filter((v) => v !== null)
        .sort((a, b) => a - b);
      if (above.length === 0) return 0;
      const mid = Math.floor(above.length / 2);
      return above.length % 2 ? above[mid] : (above[mid - 1] + above[mid]) / 2;
    },
    detail: "median of lines above",
  },
}
```

### Date Literals

Keywords that resolve to a `Date` object.

```typescript
dateLiterals: {
  "next-monday": {
    resolver: () => { /* compute next Monday */ },
    detail: "next Monday's date",
  },
}
```

### Base Conversions

Number formatting into different bases (used with `in`/`to` keywords).

```typescript
baseConversions: {
  hex: {
    formatter: (n) => "0x" + Math.trunc(n).toString(16).toUpperCase(),
    detail: "hexadecimal",
    aliases: ["hexadecimal"],
  },
}
```

## PluginManifest Interface

```typescript
interface PluginManifest {
  id: string;                    // Unique identifier (e.g., "core.math-functions")
  name: string;                  // Human-readable name
  description?: string;          // Brief description
  functions?: Record<string, { fn: MathFn; detail?: string }>;
  constants?: Record<string, { value: number; detail?: string }>;
  units?: UnitDefinition[];
  lineRefs?: Record<string, { handler: LineRefHandler; detail?: string }>;
  dateLiterals?: Record<string, { resolver: () => Date; detail?: string }>;
  baseConversions?: Record<string, {
    formatter: (n: number) => string;
    detail?: string;
    aliases?: string[];
  }>;
}
```

## Directory Structure

```
packages/engine/src/
  core-plugins/
    types.ts                     # PluginManifest, MathFn, LineRefHandler types
    index.ts                     # Aggregates all core plugins
    math-functions/index.ts      # sqrt, sin, cos, log, etc.
    math-constants/index.ts      # pi, e, tau
    units-length/index.ts        # meter, km, inch, etc.
    units-weight/index.ts        # kg, lb, oz, etc.
    units-volume/index.ts        # liter, gallon, etc.
    units-temperature/index.ts   # celsius, fahrenheit, kelvin
    units-area/index.ts          # m², ft², acre, etc.
    units-data/index.ts          # byte, KB, MB, etc.
    units-css/index.ts           # px, rem, em, pt
    units-duration/index.ts      # second, minute, hour, etc.
    units-currency/index.ts      # USD, EUR, BRL (factory, needs fetcher)
    line-references/index.ts     # sum, avg, prev, count
    date-literals/index.ts       # today, now, tomorrow, yesterday
    base-conversion/index.ts     # hex, binary, octal, decimal
  registry/
    entity-registry.ts           # Central EntityRegistry class
    plugin-registrar.ts          # Loads PluginManifest into EntityRegistry
    index.ts                     # Exports
plugins/
  CommunityPlugins/              # Community-contributed JS plugins
```

## How Loading Works

1. `createEntityRegistry()` creates an `EntityRegistry` and loads all core plugins via `registerPlugin()`
2. `PluginHost` is created with the `EntityRegistry`
3. `PluginLoader` discovers `.js` files in `CommunityPlugins/` and user plugins directory
4. Each community plugin runs in a VM sandbox with the `numi` API
5. `numi.addUnit()` / `numi.addFunction()` register directly into the `EntityRegistry`
6. After loading, `Document.refreshParseOptions()` rebuilds parser options from the registry
7. The renderer receives entity info via IPC (`numi:getEntityNames`) and updates syntax highlighting/autocomplete dynamically

## Adding a New Core Plugin

1. Create a new directory under `packages/engine/src/core-plugins/`
2. Export a `PluginManifest` from `index.ts`
3. Import and add it to the `corePlugins` array in `core-plugins/index.ts`
4. All entity types in the manifest will automatically be available in parser, evaluator, autocomplete, and highlighting
