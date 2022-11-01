import {IntegerToken} from './numeric/IntegerMachine';
import { IdentifierToken } from './IdentifiersMachine'
import {KeywordToken} from './KeywordMachine'
import {OperatorToken} from './OperatorsMachine';
import {StringToken} from './StringMachine';
import { CommentToken } from './CommentsMachine';
import {BaseToken, Range} from 'structs';
import {FloatMachineToken} from './numeric/FloatMachine';

export * from './IMachine';
export * from './StringMachine';
export * from './numeric/IntegerMachine';
export * from './numeric/FloatMachine';
export * from './IdentifiersMachine';
export * from './KeywordMachine';
export * from './OperatorsMachine';
export * from './CommentsMachine';

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

export type OpenBracket = {
  name: 'OpenBracket';
  kind: 'punctuation';
} & BaseToken;

export type CloseBracket = {
  name: 'CloseBracket';
  kind: 'punctuation';
} & BaseToken;

export type OpenParenthesis = {
  name: 'OpenParenthesis';
  kind: 'punctuation';
} & BaseToken;

export type CloseParenthesis = {
  name: 'CloseParenthesis';
  kind: 'punctuation';
} & BaseToken;

export type SemiColon = {
  name: 'SemiColon';
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
  OpenBracket |
  CloseBracket |
  OpenParenthesis |
  CloseParenthesis |
  SemiColon |
  CommentToken |
  IntegerToken |
  FloatMachineToken |
  CloseBrace |
  StringToken |
  KeywordToken |
  IdentifierToken |
  OperatorToken |
  ErrorToken;


