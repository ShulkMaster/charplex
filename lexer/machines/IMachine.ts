import {BaseToken} from 'structs/BaseToken';

export interface IMachine<T extends BaseToken> {
  getPointer(): number;
  isAccepted(): T | false;
  startFrom(start: number): void
}
