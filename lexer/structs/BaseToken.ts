export type Range = [
  start: number,
  end: number
];

export type Integer = 'decimal' | 'hexadecimal';

export type TokenKind = |
  'keyword' |
  Integer |
  'identifier';

export type BaseToken = {
  name: string;
  range: Range;
  src: string;
  kind: TokenKind;
}
