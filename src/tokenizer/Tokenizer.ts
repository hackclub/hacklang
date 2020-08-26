import { Keyword } from "../Keyword";
import { TokenType } from "./enum/TokenType";
import { Punctators } from "./Punctuator";

interface Location {
  line: number;
  column: number;
}

interface Token {
  type: TokenType;
  value: string;
  loc?: {
    start: Location;
    end: Location;
  };
}

export class Tokenizer {
  static specialChars = ["/", '"', "'", "`"];
  bag: Token[] = [];
  line = 0;
  char = 0;
  codeChar = 0;
  code: string;

  constructor(code: string) {
    this.code = code;
  }

  tokenize(): void {
    const lines = this.code.split("\n");
    while (this.line < lines.length) {
      const line = lines[this.line];
      let toilet: string[] = []; // (buffer)
      this.char = 0;
      const startLoc: Location = {
        line: this.line,
        column: this.char,
      };

      while (this.char < line.length) {
        const char = line[this.char];
        this.char++;
        this.codeChar++;
        if (char.match(/\s/)) {
          if (toilet.length === 0) {
            continue;
          }
          this.flush(toilet, startLoc);
          toilet = [];
          continue;
        }
        const currentString = toilet.join("");
        const nextChar = line[this.char];
        const hasRelatingPunctators = Punctators.some((punc) => punc.startsWith(currentString));
        const lookForwardRelatingPunctators =
          nextChar && Punctators.some((punc) => punc.startsWith(currentString + nextChar)); // support multichar puncs

        if (currentString && hasRelatingPunctators && !lookForwardRelatingPunctators) {
          this.flush(toilet, startLoc);
          toilet = [char];
          continue;
        }

        if (Punctators.some((punc) => punc.startsWith(nextChar))) {
          this.flush([...toilet, char], startLoc);
          toilet = [];
          continue;
        }

        if (Tokenizer.specialChars.includes(char)) {
          this.flush(toilet, startLoc);
          toilet = [];
          this.char--;
          this.codeChar--;
          this.handleSpecialChar();
          this.char++;
          this.codeChar++;
          continue;
        }
        toilet.push(char);
      }
      if (toilet.length > 0) {
        this.flush(toilet, startLoc);
        toilet = [];
      }
      this.line++;
      this.codeChar++;
    }
  }

  flush(buffer: string[], startLocation: Location): void {
    const bagPush = (token: { type: TokenType; value: string }) => {
      this.bag.push({
        ...token,
        loc: {
          start: { ...startLocation },
          end: {
            line: this.line,
            column: this.char,
          },
        },
      });
    };

    const string = buffer.join("");
    if (string.length === 0) {
      return;
    }
    if (Punctators.some((punc) => punc === string)) {
      bagPush({
        type: TokenType.Punctuator,
        value: string,
      });
      return;
    }
    if (Object.keys(Keyword).includes(string)) {
      bagPush({
        type: TokenType.Keyword,
        value: string,
      });
      return;
    }
    if (["true", "false"].includes(string)) {
      bagPush({
        type: TokenType.BooleanLiteral,
        value: string,
      });
      return;
    }
    if (string === "null") {
      bagPush({
        type: TokenType.NullLiteral,
        value: string,
      });
      return;
    }
    if (string.match(/\d+/)) {
      bagPush({
        type: TokenType.NumericLiteral,
        value: string,
      });
      return;
    }
    // TODO invalid identifier (must be alphanumeric and start with letter)
    bagPush({
      type: TokenType.Identifier,
      value: string,
    });
  }

  handleSpecialChar(): void {
    const lines = this.code.split("\n");
    const startChar = lines[this.line][this.char];
    const startLocation: Location = {
      line: this.line,
      column: this.char,
    };
    const buffer: string[] = [];
    buffer.push(startChar);
    this.char++;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const line = lines[this.line];
      const char = line[this.char];
      buffer.push(char);
      if (char === startChar && line[this.char - 1] !== "\\") {
        break;
      }
      this.char++;
      this.codeChar++;
      if (this.char > line.length) {
        if (startChar !== "`") {
          // TODO error here, only ` supports multiline
        }
        if (this.line + 1 > lines.length) {
          // TODO error here, unexpected EOF
        }
        this.char = 0;
        this.line++;
        this.codeChar++;
      }
    }
    const bagPush = (type: TokenType) => {
      this.bag.push({
        type,
        value: buffer.join(""),
        loc: {
          start: { ...startLocation },
          end: {
            line: this.line,
            column: this.char,
          },
        },
      });
    };

    switch (startChar) {
      case '"':
      case "'":
        bagPush(TokenType.StringLiteral);
        break;
      case "/":
        bagPush(TokenType.RegularExpression);
        break;
      case "`":
        bagPush(TokenType.Template);
        break;
      default:
      // TODO uh oh spaghettio
    }
  }
}
