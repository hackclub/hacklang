import { HackLangKeyword } from "./grammer/Keyword";
import { HackLangPunctuator } from "./grammer/Punctuator";
import { Location, Token } from "./grammer/Token";
import { TokenType } from "./grammer/TokenType";

const PunctuatorValues = Object.values(HackLangPunctuator);

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

        const nextChar = line[this.char];
        const currentString = toilet.join("");

        if (char.match(/\s/)) {
          if (currentString.length === 0 || currentString.match(/^\s+$/)) {
            toilet.push(char);
          }
          if (!nextChar.match(/\s/)) {
            this.flush(toilet, startLoc);
            if (!currentString.match(/^\s+$/)) {
              toilet = [char];
            } else {
              toilet = [];
            }
          }
          continue;
        }

        if (currentString.match(/^\s+$/)) {
          this.flush(toilet, startLoc);
          toilet = [];
        }

        if (
          nextChar &&
          !nextChar.match(/\d|\w/) &&
          PunctuatorValues.some((punc) => punc.startsWith(nextChar))
        ) {
          this.flush([...toilet, char], startLoc);
          toilet = [];
          continue;
        }

        if (
          PunctuatorValues.some((punc) => punc === currentString) &&
          !PunctuatorValues.some((punc) => punc.startsWith(currentString + char))
        ) {
          this.flush(toilet, startLoc);
          toilet = [char];
          continue;
        }

        /*const hasRelatingPunctators =
          currentString && PunctuatorValues.some((punc) => punc.startsWith(currentString));

        const lookForwardRelatingPunctators =
          nextChar &&
          PunctuatorValues.some((punc) => punc.startsWith(currentString + char + nextChar)); // support multichar puncs

        if (hasRelatingPunctators && !lookForwardRelatingPunctators) {
          this.flush(toilet, startLoc);
          toilet = [char];
          continue;
        }

        if (!hasRelatingPunctators && PunctuatorValues.some((punc) => punc.startsWith(nextChar))) {
          this.flush([...toilet, char], startLoc);
          toilet = [];
          continue;
        }*/

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
      this.bag.push({
        type: TokenType.WHITESPACE,
        value: "\n",
        loc: {
          start: { ...startLoc },
          end: {
            line: this.line,
            column: this.char + 1,
          },
        },
      });
      this.line++;
      this.codeChar++;
    }
  }

  flush(buffer: string[], startLocation: Location): void {
    const bagPush = (type: TokenType) => {
      this.bag.push({
        type,
        value: string,
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
    if (string.match(/^\s+$/)) {
      //                       ^^ all whitespace
      bagPush(TokenType.WHITESPACE);
      return;
    }
    if (PunctuatorValues.some((punc) => punc === string)) {
      bagPush(TokenType.Punctuator);
      return;
    }
    if ([HackLangKeyword.TRUE, HackLangKeyword.FALSE].includes(string)) {
      bagPush(TokenType.BooleanLiteral);
      return;
    }
    if (string === HackLangKeyword.NULL) {
      bagPush(TokenType.NullLiteral);
      return;
    }
    if (Object.values(HackLangKeyword).includes(string)) {
      bagPush(TokenType.Keyword);
      return;
    }
    if (string.match(/\d+/)) {
      bagPush(TokenType.NumericLiteral);
      return;
    }
    // TODO invalid identifier (must be alphanumeric and start with letter)
    bagPush(TokenType.Identifier);
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
