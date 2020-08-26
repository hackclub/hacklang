import { HackLangKeyword, JavaScriptKeyword } from "./grammer/Keyword";
import { HackLangPunctuator, JavaScriptPunctuator } from "./grammer/Punctuator";
import { Token } from "./grammer/Token";
import { TokenType } from "./grammer/TokenType";

export class Parser {
  bag: Token[];
  output: string | null = null;

  constructor(bag: Token[]) {
    this.bag = bag;
  }

  parse() {
    this.output = this.bag.reduce(
      (previousValue, currentValue) => (previousValue += this.getValue(currentValue)),
      ""
    );
  }

  getValue(token: Token): string {
    const getKeyFromValue = (obj: any, value: string) => {
      return Object.keys(obj).find((key) => obj[key] === value);
    };

    switch (token.type) {
      case TokenType.Keyword:
        return JavaScriptKeyword[getKeyFromValue(HackLangKeyword, token.value) as never];
      case TokenType.Punctuator:
        return JavaScriptPunctuator[getKeyFromValue(HackLangPunctuator, token.value) as never];
      default:
        return token.value;
    }
  }
}
