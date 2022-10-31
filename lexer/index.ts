import {Lexer} from './lexer';
import {IntegerMachine, StringMachine} from './machines';

const code = 'aaa "bb" "15" "6c\n" "" "ho\tla" 9dd3 0x2B2  47u   0X1A4U';

const intMachine = new IntegerMachine(code);
const stringMachine = new StringMachine(code);
const lexer = new Lexer([intMachine, stringMachine]);
lexer.source = code;
//lexer.registerOnMachineChange(m => console.log(m.name));

for (const token of lexer.tokenStream()) {
  console.log(token);
}

lexer.unregisterOnMachineChange();
