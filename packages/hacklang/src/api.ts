import { ErrorHandler } from "./ErrorHandler";
import { Language } from "./grammer/Language";
import { Parser } from "./Parser";
import { Tokenizer } from "./Tokenizer";

interface HacklangResult {
  ast: Record<string, any>;
  code: string | null;
}

export function compile(input: string): HacklangResult {
  const tokey = new Tokenizer(input, new ErrorHandler(input), Language.JAVASCRIPT);
  tokey.tokenize();

  const parsey = new Parser(tokey.bag, Language.JAVASCRIPT);
  parsey.parse();

  return {
    ast: tokey.bag,
    code: parsey.output,
  };
}
