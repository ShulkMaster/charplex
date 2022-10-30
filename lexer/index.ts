import { Lexer } from './lexer';
import {IntegerMachine} from './machines';

const code = ' 15 0x2B2  47u   0X1A4U'

const intMachine = new IntegerMachine(code);
const lexer = new Lexer(intMachine);
lexer.source = code;

for (const token of lexer.tokenStream()){
  console.log(token);
}
