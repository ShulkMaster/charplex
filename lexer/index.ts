import {Lexer} from './lexer';
import {IdentifiersMachine, IntegerMachine, StringMachine} from './machines';
import fs from 'fs';

const code = fs.readFileSync('sample.txt').toString();

const intMachine = new IntegerMachine(code);
const stringMachine = new StringMachine(code);
const identifierMachine = new IdentifiersMachine(code);
const lexer = new Lexer([intMachine, stringMachine, identifierMachine]);
lexer.source = code;

for (const token of lexer.tokenStream()) {
  console.log(token);
}

lexer.unregisterOnMachineChange();
console.log(code.length);
