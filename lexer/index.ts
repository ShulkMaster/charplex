import {
  CommentsMachine,
  FloatMachine,
  IdentifiersMachine,
  IntegerMachine,
  KeywordMachine,
  OperatorsMachine,
  StringMachine,
} from './machines';
import {SymbolTableManager} from './structs';
import {Lexer} from './lexer';

export * from './lexer';
export * from './machines';
export * from './structs';
export * from './lang';

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

