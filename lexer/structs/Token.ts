export type Range = [
  start: number,
  end: number
];

export enum TokenKind {
  keyword,
  identifier
}

export type Token = {
  name: string;
  range: Range;
  src: string;
  kind: TokenKind;
}
