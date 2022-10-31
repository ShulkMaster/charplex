import {IntegerToken} from './numeric/IntegerMachine';
import { IdentifierToken } from './IdentifiersMachine'
import {OperatorToken} from './OperatorsMachine';
import {StringToken} from './StringMachine';
import {BaseToken, Range} from 'structs';

export * from './IMachine';
export * from './StringMachine';
export * from './numeric/IntegerMachine';
export * from './IdentifiersMachine';
export * from './OperatorsMachine';

export type OpenBrace = {
  name: 'OpenBrace';
  openScope: string;
  kind: 'punctuation';
} & BaseToken;

export type CloseBrace = {
  name: 'CloseBrace';
  closeScope: string;
  kind: 'punctuation';
} & BaseToken;

export type ErrorToken = {
  name: 'Error';
  kind: 'error';
  src: string;
  range: Range;
}

export type MachineToken = |
  OpenBrace |
  IntegerToken |
  CloseBrace |
  StringToken |
  IdentifierToken |
  OperatorToken |
  ErrorToken;
