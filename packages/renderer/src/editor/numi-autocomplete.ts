import {
  autocompletion,
  type CompletionContext,
  type CompletionResult,
} from "@codemirror/autocomplete";

interface CompletionEntry {
  label: string;
  detail?: string;
  type: string;
}

// Dynamic entity completions (loaded from main process)
let entityCompletions: CompletionEntry[] = [];
let entityCompletionsLoaded = false;

// Static base targets (always available)
const BASE_TARGETS: CompletionEntry[] = [
  { label: "hex", detail: "hexadecimal", type: "keyword" },
  { label: "binary", detail: "binary", type: "keyword" },
  { label: "octal", detail: "octal", type: "keyword" },
  { label: "decimal", detail: "decimal", type: "keyword" },
];

// Cache for unit completions
let allUnitsCache: string[] | null = null;
const compatibleCache: Map<string, string[]> = new Map();

function mapEntityType(type: string): string {
  switch (type) {
    case "function": return "function";
    case "constant": return "constant";
    case "lineRef":
    case "dateLiteral":
    case "baseConversion": return "keyword";
    default: return "text";
  }
}

async function loadEntityCompletions(): Promise<CompletionEntry[]> {
  if (entityCompletionsLoaded) return entityCompletions;
  try {
    const entities = await window.numi.getEntityNames();
    entityCompletions = entities.map((e) => ({
      label: e.name,
      detail: e.detail,
      type: mapEntityType(e.type),
    }));
    entityCompletionsLoaded = true;
    return entityCompletions;
  } catch {
    return entityCompletions;
  }
}

/** Call this when entities change (e.g., after plugin reload). */
export function invalidateEntityCache(): void {
  entityCompletionsLoaded = false;
  allUnitsCache = null;
  compatibleCache.clear();
}

async function getAllUnits(): Promise<string[]> {
  if (allUnitsCache) return allUnitsCache;
  try {
    allUnitsCache = await window.numi.getAllUnits();
    return allUnitsCache;
  } catch {
    return [];
  }
}

async function getCompatible(unit: string): Promise<string[]> {
  const cached = compatibleCache.get(unit.toLowerCase());
  if (cached) return cached;
  try {
    const result = await window.numi.getCompletions(unit);
    compatibleCache.set(unit.toLowerCase(), result);
    return result;
  } catch {
    return [];
  }
}

async function numiCompletions(context: CompletionContext): Promise<CompletionResult | null> {
  // Get the current line text up to cursor
  const line = context.state.doc.lineAt(context.pos);
  const textBefore = line.text.slice(0, context.pos - line.from);

  // Check if we're after "in", "to", or "as" — offer compatible units
  const conversionMatch = textBefore.match(
    /(\S+)\s+(?:in|to|as)\s+(\S*)$/i,
  );
  if (conversionMatch) {
    const sourceUnit = conversionMatch[1] ?? "";
    const typed = conversionMatch[2] ?? "";
    const from = context.pos - typed.length;

    // Get compatible units for the source
    const compatible = await getCompatible(sourceUnit);
    const baseOptions = BASE_TARGETS.filter((b) =>
      b.label.startsWith(typed.toLowerCase()),
    );

    const unitOptions = compatible
      .filter((u) => u.toLowerCase().startsWith(typed.toLowerCase()))
      .map((u) => ({ label: u, type: "unit" as const }));

    const options = [...baseOptions, ...unitOptions];
    if (options.length === 0) return null;

    return { from, options, filter: false };
  }

  // Check if we're typing a word
  const wordMatch = textBefore.match(/([a-zA-Z_]\w*)$/);
  const word = wordMatch?.[1] ?? "";
  const from = context.pos - word.length;

  // If no word typed yet, only show full catalog on explicit Ctrl+Space
  if (word.length === 0 && !context.explicit) return null;

  // If typing but less than 2 chars, only show on explicit Ctrl+Space
  if (word.length === 1 && !context.explicit) return null;

  const [entries, allUnits] = await Promise.all([
    loadEntityCompletions(),
    getAllUnits(),
  ]);

  const filter = word.toLowerCase();
  const matchesFilter = (label: string) => filter === "" || label.toLowerCase().startsWith(filter);

  const options = [
    ...entries.filter((e) => matchesFilter(e.label)),
    ...allUnits
      .filter((u) => matchesFilter(u) && u.length > 1)
      .slice(0, 20)
      .map((u) => ({ label: u, type: "unit" as const })),
  ];

  if (options.length === 0) return null;

  return { from, options, filter: false };
}

export const numiAutocompletion = autocompletion({
  override: [numiCompletions],
  activateOnTyping: true,
  defaultKeymap: true,
});
