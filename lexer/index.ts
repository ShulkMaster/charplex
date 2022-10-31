import {Lexer} from './lexer';
import {IntegerMachine, StringMachine} from './machines';
import fs from 'fs';

const code = fs.readFileSync('sample.txt').toString();

const intMachine = new IntegerMachine(code);
const stringMachine = new StringMachine(code);
const lexer = new Lexer([intMachine, stringMachine]);
lexer.source = code;
lexer.registerOnMachineChange(m => console.log(code.substring(m.getPointer())));

for (const token of lexer.tokenStream()) {
  console.log(token);
}

lexer.unregisterOnMachineChange();
console.log(code.length);
