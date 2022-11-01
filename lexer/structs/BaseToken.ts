export type Range = [
  start: number,
  end: number
];

export type BaseToken = {
  name: string;
  range: Range;
  src: string;
}
