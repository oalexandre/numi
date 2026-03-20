// Numi Calculator — Arithmetic Grammar
// Covers: +, -, *, /, ^, mod, parentheses, unary, numbers, functions, constants, assignments, variables

{{
const KNOWN_FUNCTIONS = new Set([
  "sqrt", "cbrt", "abs", "ceil", "floor", "round", "trunc",
  "sin", "cos", "tan", "asin", "acos", "atan",
  "log", "ln", "log2", "log10",
  "exp", "sign",
  "min", "max",
]);

const KNOWN_CONSTANTS = new Set(["pi", "e", "tau"]);

function buildBinaryExpr(head, tail) {
  return tail.reduce((left, [, op, , right]) => ({
    type: "binary",
    op,
    left,
    right,
  }), head);
}
}}

Line
  = Comment / Assignment / Expression / Empty

Comment
  = "//" rest:$(.*)  { return { type: "comment", text: rest.trim() }; }
  / "#" rest:$(.*)   { return { type: "comment", text: rest.trim() }; }

Assignment
  = name:Identifier !{ return KNOWN_CONSTANTS.has(name) || KNOWN_FUNCTIONS.has(name); } _ "=" _ expr:Expression
    { return { type: "assignment", name, value: expr }; }

Empty
  = _  { return { type: "empty" }; }

// === EXPRESSIONS (precedence: low to high) ===

Expression
  = Addition

Addition
  = head:Multiplication tail:(_ ("+" / "-") _ Multiplication)*
    { return buildBinaryExpr(head, tail); }

Multiplication
  = head:Power tail:(_ ("*" / "/" / "mod") _ Power)*
    { return buildBinaryExpr(head, tail); }

Power
  = base:Unary _ "^" _ exp:Power
    { return { type: "binary", op: "^", left: base, right: exp }; }
  / Unary

Unary
  = op:("-" / "+") _ expr:Primary
    { return { type: "unary", op, value: expr }; }
  / Primary

Primary
  = FunctionCallParens / FunctionCallSpace / ParenExpr / Number / Constant / Variable

FunctionCallParens
  = name:FunctionName "(" _ args:ArgList _ ")"
    { return { type: "call", name, args }; }

FunctionCallSpace
  = name:FunctionName __ arg:Primary
    { return { type: "call", name, args: [arg] }; }

ArgList
  = head:Expression tail:(_ "," _ Expression)*
    { return [head, ...tail.map(t => t[3])]; }

FunctionName
  = name:$([a-zA-Z_] [a-zA-Z0-9_]*)
    &{ return KNOWN_FUNCTIONS.has(name); }
    { return name; }

Constant
  = name:$([a-zA-Z_] [a-zA-Z0-9_]*)
    &{ return KNOWN_CONSTANTS.has(name); }
    { return { type: "variable", name }; }

ParenExpr
  = "(" _ expr:Expression _ ")"  { return expr; }

// === NUMBERS ===

Number
  = Scientific / Hex / Binary / Float / Integer

Scientific
  = value:$([0-9]+ ("." [0-9]+)? [eE] [+-]? [0-9]+)
    { return { type: "number", value: parseFloat(value) }; }

Hex
  = "0x" digits:$([0-9a-fA-F]+)
    { return { type: "number", value: parseInt(digits, 16) }; }

Binary
  = "0b" digits:$([01]+)
    { return { type: "number", value: parseInt(digits, 2) }; }

Float
  = value:$([0-9]+ "." [0-9]+)
    { return { type: "number", value: parseFloat(value) }; }

Integer
  = value:$([0-9]+)
    { return { type: "number", value: parseInt(value, 10) }; }

// === VARIABLES ===

Variable
  = name:Identifier
    { return { type: "variable", name }; }

Identifier
  = $([a-zA-Z_] [a-zA-Z0-9_]*)

// === WHITESPACE ===
_ = [ \t]*
__ = [ \t]+
