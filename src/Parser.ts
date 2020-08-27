import { HackLangKeyword, JavaScriptKeyword, Keyword } from "./grammer/Keyword";
import { Language } from "./grammer/Language";
import { HackLangPunctuator, JavaScriptPunctuator, Punctuator } from "./grammer/Punctuator";
import { Token } from "./grammer/Token";
import { TokenType } from "./grammer/TokenType";

export class Parser {
  bag: Token[];
  output: string | null = null;
  punctuator: {
    from: Punctuator;
    to: Punctuator;
  };
  keyword: {
    from: Keyword;
    to: Keyword;
  };

  constructor(bag: Token[], language: Language) {
    this.bag = bag;
    this.punctuator = {
      from: language === Language.JAVASCRIPT ? JavaScriptPunctuator : HackLangPunctuator,
      to: language === Language.JAVASCRIPT ? HackLangPunctuator : JavaScriptPunctuator,
    };
    this.keyword = {
      from: language === Language.JAVASCRIPT ? JavaScriptKeyword : HackLangKeyword,
      to: language === Language.JAVASCRIPT ? HackLangKeyword : JavaScriptKeyword,
    };
  }

  parse(): void {
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
        return this.keyword.to[getKeyFromValue(this.keyword.from, token.value) as never];
      case TokenType.Punctuator:
        return this.punctuator.to[getKeyFromValue(this.punctuator.from, token.value) as never];
      default:
        return token.value;
    }
  }
}
