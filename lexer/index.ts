import {Lexer} from './lexer';
import {IntegerMachine, StringMachine} from './machines';

const code = 'aaa 15 6a9 9aa3 0x2B2  47u   0X1A4U';

const intMachine = new IntegerMachine(code);
const stringMachine = new StringMachine(code);
const lexer = new Lexer([intMachine]);
lexer.source = code;
lexer.registerOnMachineChange(m => console.log(m.name));

for (const token of lexer.tokenStream()) {
  console.log(token);
}

lexer.unregisterOnMachineChange();
