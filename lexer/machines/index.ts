import {IntegerToken} from './numeric/IntegerMachine';
import { IdentifierToken } from './IdentifiersMachine'
import {StringToken} from './StringMachine';
import {BaseToken, Range} from 'structs';
import {FloatMachineToken} from './numeric/FloatMachine';

export * from './IMachine';
export * from './StringMachine';
export * from './numeric/IntegerMachine';
export * from './numeric/FloatMachine';
export * from './IdentifiersMachine';

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
  FloatMachineToken |
  CloseBrace |
  StringToken |
  IdentifierToken |
  ErrorToken;
