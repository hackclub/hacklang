import { ErrorHandler } from "../ErrorHandler";
import { Language } from "../grammer/Language";
import { Parser } from "../Parser";
import { Tokenizer } from "../Tokenizer";

const testString = `
function main(){
    if(5 === 5){
        return "Hello World";
    }
}
console.log(main());
const x = {
 test: "test"
};
`;

const tokey = new Tokenizer(testString, new ErrorHandler(testString), Language.JAVASCRIPT);
tokey.tokenize();
console.log(JSON.stringify(tokey.bag, undefined, 2));
const parsey = new Parser(tokey.bag, Language.JAVASCRIPT);
parsey.parse();
console.log(parsey.output);
