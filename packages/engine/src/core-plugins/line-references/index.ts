import type { PluginManifest, LineRefContext } from "../types.js";

function getAbove(ctx: LineRefContext): number[] {
  return ctx.previousResults
    .slice(0, ctx.currentLine)
    .filter((v): v is number => v !== null);
}

function sumHandler(ctx: LineRefContext): number {
  return getAbove(ctx).reduce((a, b) => a + b, 0);
}

function avgHandler(ctx: LineRefContext): number {
  const above = getAbove(ctx);
  return above.length > 0 ? above.reduce((a, b) => a + b, 0) / above.length : 0;
}

function prevHandler(ctx: LineRefContext): number {
  for (let i = ctx.currentLine - 1; i >= 0; i--) {
    const val = ctx.previousResults[i];
    if (val !== null && val !== undefined) return val;
  }
  return 0;
}

function countHandler(ctx: LineRefContext): number {
  return getAbove(ctx).length;
}

export const lineReferencesPlugin: PluginManifest = {
  id: "core.line-references",
  name: "Line References",
  description: "Reference previous line results (sum, avg, prev, count)",
  lineRefs: {
    sum: { handler: sumHandler, detail: "sum of lines above" },
    total: { handler: sumHandler, detail: "alias for sum" },
    avg: { handler: avgHandler, detail: "average of lines above" },
    average: { handler: avgHandler, detail: "average of lines above" },
    prev: { handler: prevHandler, detail: "previous line result" },
    previous: { handler: prevHandler, detail: "previous line result" },
    count: { handler: countHandler, detail: "count of lines with values" },
  },
};
