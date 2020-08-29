import { ErrorHandler } from "./ErrorHandler";
import { Language } from "./grammer/Language";
import { Parser } from "./Parser";
import { Tokenizer } from "./Tokenizer";

interface HacklangResult {
  code: string | null;
}

interface CompileOptions {
  outputLang?: "hacklang" | "javascript";
}

export function compile(input: string, options: CompileOptions = {}): HacklangResult {
  const toHacklang = (input: string): Parser => {
    const tokey = new Tokenizer(input, new ErrorHandler(input), Language.HACKLANG);
    tokey.tokenize();

    const parsey = new Parser(tokey.bag, Language.HACKLANG);
    parsey.parse();

    return parsey;
  };
  const toJavaScript = (input: string): Parser => {
    const tokey = new Tokenizer(input, new ErrorHandler(input), Language.JAVASCRIPT);
    tokey.tokenize();

    const parsey = new Parser(tokey.bag, Language.JAVASCRIPT);
    parsey.parse();

    return parsey;
  };

  let parser: Parser | Record<string, any> = {};
  if (options.outputLang === void 0) {
    parser = toJavaScript(input);
  } else if (options.outputLang === "hacklang") {
    parser = toHacklang(input);
  } else if (options.outputLang === "javascript") {
    parser = toJavaScript(input);
  }

  if (parser && parser.output === undefined) {
    parser.output = null;
  }

  return {
    code: parser.output,
  };
}
