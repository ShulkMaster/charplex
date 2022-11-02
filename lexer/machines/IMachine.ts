import {BaseToken} from 'structs/index.js';

export interface IMachine<T extends BaseToken> {
  getPointer(): number;
  isAccepted(): T | false;
  startFrom(start: number): void
  get name();
}
