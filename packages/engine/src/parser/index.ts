import peggy from "peggy";

import type { ASTNode } from "../ast.js";

import grammarSource from "./arithmetic.pegjs?raw";

const parser = peggy.generate(grammarSource);

export interface ParseOptions {
  knownUnits?: Set<string>;
}

export function parse(input: string, options?: ParseOptions): ASTNode {
  return parser.parse(input, options) as ASTNode;
}
