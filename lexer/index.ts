import {
  CommentsMachine,
  FloatMachine,
  IdentifiersMachine,
  IntegerMachine,
  KeywordMachine,
  OperatorsMachine,
  StringMachine,
} from './machines/index.js';
import {SymbolTableManager} from './structs/index.js';
import {Lexer} from './lexer.js';

export * from './lexer.js';
export * from './machines/index.js';
export * from './structs/index.js';
export * from './lang.js';

const code = 'using System;\n' +
  'public class Addition\n' +
  '{\n' +
  '    public static void Main(string[] args)\n' +
  '    {\n' +
  '        int num1=35;\n' +
  '        int num2=30;\n' +
  '        int sum=num1+num2;\n' +
  '        Console.WriteLine ("The sum of two numbers: "+sum);\n' +
  '    }\n' +
  '}';


const table = new SymbolTableManager();
const intMachine = new IntegerMachine(code);
const cMachine = new CommentsMachine(code);
const stringMachine = new StringMachine(code);
const identifierMachine = new IdentifiersMachine(code, table);
const floatMachine = new FloatMachine(code);
const keywordsMachine = new KeywordMachine(code);
const operatorsMachine = new OperatorsMachine(code);

const lexer = new Lexer(
  table,
  cMachine,
  keywordsMachine,
  floatMachine,
  operatorsMachine,
  intMachine,
  stringMachine,
  identifierMachine,
);

lexer.source = code;
for (const token of lexer.tokenStream()) {
  console.log(token);
}

