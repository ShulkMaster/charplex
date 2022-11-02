import {IntegerToken} from './numeric/IntegerMachine.js';
import { IdentifierToken } from './IdentifiersMachine.js'
import {KeywordToken} from './KeywordMachine.js'
import {OperatorToken} from './OperatorsMachine.js';
import {StringToken} from './StringMachine.js';
import { CommentToken } from './CommentsMachine.js';
import {BaseToken, Range} from 'structs/index.js';
import {FloatMachineToken} from './numeric/FloatMachine.js';

export * from './IMachine.js';
export * from './StringMachine.js';
export * from './numeric/IntegerMachine.js';
export * from './numeric/FloatMachine.js';
export * from './IdentifiersMachine.js';
export * from './KeywordMachine.js';
export * from './OperatorsMachine.js';
export * from './CommentsMachine.js';

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

export type DotToken = {
  name: 'dot';
  kind: 'punctuation';
} & BaseToken;

export type ErrorToken = {
  name: 'Error';
  kind: 'error';
  src: string;
  range: Range;
  r: number,
  c: number,
}

export type MachineToken = |
  OpenBrace |
  OpenBracket |
  CloseBracket |
  OpenParenthesis |
  CloseParenthesis |
  SemiColon |
  DotToken |
  CommentToken |
  IntegerToken |
  FloatMachineToken |
  CloseBrace |
  StringToken |
  KeywordToken |
  IdentifierToken |
  OperatorToken |
  ErrorToken;


