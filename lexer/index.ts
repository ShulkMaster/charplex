import {SymbolTableManager} from './structs';
import {
  FloatMachine,
  IdentifiersMachine,
  IntegerMachine,
  KeywordMachine,
  OperatorsMachine,
  StringMachine,
} from './machines';
import {Lexer} from './lexer';

export * from './lexer';
export * from './machines';
export * from './structs';
export * from './lang';

// TODO: DFA comments
// TODO: DFA Operators rev
// TODO: Docs rev
// TODO: Symbols Table

const lines = 'void 5 Main" .47 + 4';
const table = new SymbolTableManager();
const intMachine = new IntegerMachine(lines);
const stringMachine = new StringMachine(lines);
const identifierMachine = new IdentifiersMachine(lines, table);
const floatMachine = new FloatMachine(lines);
const keywordsMachine = new KeywordMachine(lines);
const operatorsMachine = new OperatorsMachine(lines);

const lexer = new Lexer(
  table,
  keywordsMachine,
  floatMachine,
  operatorsMachine,
  intMachine,
  stringMachine,
  identifierMachine,
);
lexer.source = lines;
for (const token of lexer.tokenStream()) {
  console.log(token);
}
