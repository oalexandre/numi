export type ASTNode =
  | EmptyNode
  | CommentNode
  | AssignmentNode
  | NumberNode
  | BinaryNode
  | UnaryNode
  | VariableNode;

export interface EmptyNode {
  type: "empty";
}

export interface CommentNode {
  type: "comment";
  text: string;
}

export interface AssignmentNode {
  type: "assignment";
  name: string;
  value: ASTNode;
}

export interface NumberNode {
  type: "number";
  value: number;
}

export interface BinaryNode {
  type: "binary";
  op: string;
  left: ASTNode;
  right: ASTNode;
}

export interface UnaryNode {
  type: "unary";
  op: string;
  value: ASTNode;
}

export interface VariableNode {
  type: "variable";
  name: string;
}
