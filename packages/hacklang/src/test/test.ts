import { compile } from "../api";

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

const result = compile(testString);
console.info(result.ast);
console.info(result.code);
