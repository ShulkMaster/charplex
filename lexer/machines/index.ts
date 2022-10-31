import {IntegerToken} from './numeric/IntegerMachine';
import {StringToken} from './StringMachine';
import {BaseToken, Range} from 'structs';

export * from './IMachine';
export * from './StringMachine';
export * from './numeric/IntegerMachine';

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
  ErrorToken;
