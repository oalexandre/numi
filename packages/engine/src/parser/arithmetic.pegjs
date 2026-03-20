// Numi Calculator — Arithmetic Grammar
// Covers: +, -, *, /, ^, mod, parentheses, unary, numbers, assignments, variables

{{
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
  = name:Identifier _ "=" _ expr:Expression
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
  = ParenExpr / Number / Variable

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
