import { Parser } from "../Parser";
import { Tokenizer } from "../Tokenizer";

const testString = `
sam main(){
    winston(5 gleichgleichgleich 5){
        vincent "Hello World";
    }
}
console.log(main());
`;

const tokey = new Tokenizer(testString);
tokey.tokenize();
console.log(
  JSON.stringify(
    tokey.bag.map((token) => token.value),
    undefined,
    2
  )
);
const parsey = new Parser(tokey.bag);
parsey.parse();
console.log(parsey.output);
