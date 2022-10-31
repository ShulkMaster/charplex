import { Lexer } from './lexer';
import {IntegerMachine} from './machines';
import {StringMachine} from './machines/StringMachine';

const code = ' 1a5 0x2B2  47u   0X1A4U';

const intMachine = new IntegerMachine(code);
const stringMachine = new StringMachine(code);
const lexer = new Lexer(intMachine);
lexer.source = code;

for (const token of lexer.tokenStream()){
  console.log(token);
}
