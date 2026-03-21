export interface StoredValue {
  value: number;
  unit?: string;
  isPercent?: boolean;
}

export class EvalContext {
  private variables = new Map<string, StoredValue>();

  get(name: string): StoredValue | undefined {
    return this.variables.get(name);
  }

  set(name: string, stored: StoredValue): void {
    this.variables.set(name, stored);
  }

  has(name: string): boolean {
    return this.variables.has(name);
  }

  clear(): void {
    this.variables.clear();
  }
}
