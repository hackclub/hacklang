export const JavaScriptPunctuator = {
  // Other
  COLON: ":",
  COMMA: ",",
  PERIOD: ".",
  SEMI_COLON: ";",

  // Grouping
  OPEN_BRAC: "[",
  CLOSE_BRAC: "]",
  OPEN_BRACE: "{",
  CLOSE_BRACE: "}",
  OPEN_PAREN: "(",
  CLOSE_PAREN: ")",

  // Increment
  INCREMENT: "++",
  DECREMENT: "--",

  // Arithmetic
  UNARY_PLUS: "+",
  UNARY_MINUS: "-",
  DIVISION: "/",
  MULTIPLICATION: "*",
  REMAINDER: "%",
  EXPONENTIAL: "**",

  // Relational
  LESS_THAN: "<",
  GREATER_THAN: ">",
  GREATER_EQUAL_THAN: ">=",
  LESS_EQUAL_THAN: "<=",

  // Equality
  INEQUALITY: "!=",
  EQUAL: "==",
  NON_IDENTITY: "!==",
  STRICT_EQUAL: "===",

  // Bitwise
  BITWISE_NOT: "~",
  BITWISE_LEFT: "<<",
  BITWISE_RIGHT: ">>",
  BITWISE_UNSIGNED_RIGHT: ">>>",
  BITWISE_AND: "&",
  BITWISE_OR: "|",
  BITWISE_XOR: "^",

  // Logic
  LOGICAL_NOT: "!",
  LOGICAL_AND: "&&",
  LOGICAL_OR: "||",
  TERNARY: "?",

  // Assignment
  ASSIGNMENT: "=",
  MULTIPLICATION_ASSIGNMENT: "*=",
  ADDITION_ASSIGNMENT: "+=",
  DIVISION_ASSIGNMENT: "/=",
  SUBTRACTION_ASSIGNMENT: "-=",
  LEFT_SHIFT_ASSIGNMENT: "<<=",
  RIGHT_SHIFT_ASSIGNMENT: ">>=",
  UNSIGNED_RIGHT_SHIFT_ASSIGNMENT: ">>>=",
  BITWISE_AND_ASSIGNMENT: "&=",
  BITWISE_OR_ASSIGNMENT: "|=",
  BITWISE_XOR_ASSIGNMENT: "^=",
  LOGICAL_OR_ASSIGNMENT: "||=",
  LOGICAL_AND_ASSIGNMENT: "&&=",
  LOGICAL_NULLISH_ASSIGNMENT: "??=",
};

export const HackLangPunctuator: typeof JavaScriptPunctuator = {
  ...JavaScriptPunctuator,
  ASSIGNMENT: "gleich",
  EQUAL: "gleichgleich",
  STRICT_EQUAL: "gleichgleichgleich",
};
