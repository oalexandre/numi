type MathFn = (...args: number[]) => number;

const BUILT_IN_FUNCTIONS: Record<string, MathFn> = {
  // Basic
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  abs: Math.abs,
  ceil: Math.ceil,
  floor: Math.floor,
  round: Math.round,
  trunc: Math.trunc,
  sign: Math.sign,
  exp: Math.exp,

  // Trigonometric
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,

  // Logarithmic
  log: Math.log10,
  log10: Math.log10,
  ln: Math.log,
  log2: Math.log2,

  // Multi-arg
  min: Math.min,
  max: Math.max,
};

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
  tau: Math.PI * 2,
};

export class FunctionRegistry {
  private functions: Map<string, MathFn>;

  constructor() {
    this.functions = new Map(Object.entries(BUILT_IN_FUNCTIONS));
  }

  call(name: string, args: number[]): number {
    const fn = this.functions.get(name);
    if (!fn) {
      throw new Error(`Unknown function "${name}"`);
    }
    return fn(...args);
  }

  has(name: string): boolean {
    return this.functions.has(name);
  }
}

export function getConstant(name: string): number | undefined {
  return CONSTANTS[name];
}
