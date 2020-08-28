import { ErrorHandler } from "./ErrorHandler";
import { HackLangKeyword, JavaScriptKeyword, Keyword } from "./grammer/Keyword";
import { Language } from "./grammer/Language";
import { HackLangPunctuator, JavaScriptPunctuator, Punctuator } from "./grammer/Punctuator";
import { Location, Token } from "./grammer/Token";
import { TokenType } from "./grammer/TokenType";

export class Tokenizer {
  static specialChars = ["/", '"', "'", "`"];
  bag: Token[] = [];
  line = 0;
  char = 0;
  codeChar = 0;
  code: string;
  errorHandler: ErrorHandler;
  punctuator: {
    from: Punctuator;
    to: Punctuator;
  };
  keyword: {
    from: Keyword;
    to: Keyword;
  };

  constructor(code: string, errorHandler: ErrorHandler, language: Language) {
    this.code = code;
    this.errorHandler = errorHandler;
    this.punctuator = {
      from: language === Language.JAVASCRIPT ? JavaScriptPunctuator : HackLangPunctuator,
      to: language === Language.JAVASCRIPT ? HackLangPunctuator : JavaScriptPunctuator,
    };
    this.keyword = {
      from: language === Language.JAVASCRIPT ? JavaScriptKeyword : HackLangKeyword,
      to: language === Language.JAVASCRIPT ? HackLangKeyword : JavaScriptKeyword,
    };
  }

  tokenize(): void {
    const lines = this.code.split("\n");
    const punctuatorValues = Object.values(this.punctuator.from);
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
          punctuatorValues.some((punc) => punc.startsWith(nextChar))
        ) {
          this.flush([...toilet, char], startLoc);
          toilet = [];
          continue;
        }

        if (
          punctuatorValues.some((punc) => punc === currentString) &&
          !punctuatorValues.some((punc) => punc.startsWith(currentString + char))
        ) {
          this.flush(toilet, startLoc);
          toilet = [char];
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
    const punctuatorValues = Object.values(this.punctuator.from);
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
      startLocation.column = this.char;
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
    if (punctuatorValues.some((punc) => punc === string)) {
      bagPush(TokenType.Punctuator);
      return;
    }
    if ([this.keyword.from.TRUE, this.keyword.from.FALSE].includes(string)) {
      bagPush(TokenType.BooleanLiteral);
      return;
    }
    if (string === this.keyword.from.NULL) {
      bagPush(TokenType.NullLiteral);
      return;
    }
    if (Object.values(this.keyword.from).includes(string)) {
      bagPush(TokenType.Keyword);
      return;
    }
    if (string.match(/^\d+$/)) {
      bagPush(TokenType.NumericLiteral);
      return;
    }
    if (!string.match(/^[A-Za-z]+\w*$/)) {
      this.errorHandler.createError("Invalid Identifier: " + string, startLocation);
    }
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
          this.errorHandler.createError("Unexpected end of line", startLocation);
        }
        if (this.line + 1 > lines.length) {
          this.errorHandler.createError("Unexpected end of file", startLocation);
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
      startLocation.column = this.char;
    };

    switch (startChar) {
      case '"':
      case "'":
        bagPush(TokenType.StringLiteral);
        break;
      case "/": // TODO support comments
        bagPush(TokenType.RegularExpression);
        break;
      case "`":
        bagPush(TokenType.Template);
        break;
      default:
        this.errorHandler.createError("Unexpected character: " + startChar, startLocation);
    }
  }
}
