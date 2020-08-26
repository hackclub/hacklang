import { Tokenizer } from "../tokenizer/Tokenizer";

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
console.log(JSON.stringify(tokey.bag, undefined, 2));
