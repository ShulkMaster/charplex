export const literalTypes = {
  Default: 'default',
  Null: 'null',
  True: 'true',
  False: 'false',
} as const;

export enum keywords {
  bool,
  break,
  char,
  class,
  default,
  else,
  float,
  for,
  if,
  int,
  new,
  return,
  static,
  string,
  using,
  void,
  while,
}

export const integerPrefixes = {
  u: 'u',
  l: 'l',
  f: 'f',
  hex: '0x'
}

export const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
