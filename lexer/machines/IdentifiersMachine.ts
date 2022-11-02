import {IMachine} from './IMachine';
import {BaseToken} from 'structs/BaseToken';
import {ISymbolManager} from 'structs';

enum IdentifierMachineStates {
  Init,
  Invalid,
  Letters,
  Number,
  At,
  UnderScore,
  Accepted,
}

export type IdentifierToken = {
  value: string;
  kind: 'identifier';
} & BaseToken;

export class IdentifiersMachine implements IMachine<IdentifierToken> {

  private readonly source: string;
  private readonly isLetter = /^[A-Za-z]+$/;
  private readonly isDigit = /\d/;
  private start = 0;
  private pointer = 0;
  public state: IdentifierMachineStates = IdentifierMachineStates.Init;
  private _sm: ISymbolManager;

  constructor(src: string, sm: ISymbolManager) {
    this.source = src;
    this._sm = sm;
  }

  get name(): any {
    return 'IdentifiersMachine';
  }

  public startFrom(start: number): void {
    this.start = start;
    this.state = IdentifierMachineStates.Init;
  }

  private shouldStop(): boolean {
    return this.state === IdentifierMachineStates.Invalid ||
      this.state === IdentifierMachineStates.Accepted ||
      this.pointer >= this.source.length;
  }

  public getPointer(): number {
    return this.pointer;
  }

  public isAccepted(): IdentifierToken | false {
    for (let i = this.start; !this.shouldStop(); i++) {
      this.pointer = i;
      this.handle(this.source[i]);
    }

    if (this.state === IdentifierMachineStates.Invalid) return false;

    const src = this.source.substring(this.start, this.pointer);
    const value = src;
    const identifier: IdentifierToken = {
      name: 'IdentifierToken',
      kind: 'identifier',
      src,
      value,
      range: [this.start, this.pointer],
      r: 0,
      c: 0,
    };
    this._sm.registerSymbol(identifier);
    return identifier;
  }

  private handle(char: string) {
    switch (this.state) {
      case IdentifierMachineStates.Init:
        this.initHandler(char);
        break;
      case IdentifierMachineStates.Number:
        this.handleNumbers(char);
        break;
      case IdentifierMachineStates.At:
        this.handleAt(char);
        break;
      case IdentifierMachineStates.UnderScore:
        this.handleUnderScore(char);
        break;
      case IdentifierMachineStates.Letters:
        this.handleLetters(char);
        break;
    }
  }

  private initHandler(char: string): void {
    if (char === '@') {
      this.state = IdentifierMachineStates.At;
      return;
    }

    if (char === '_') {
      this.state = IdentifierMachineStates.UnderScore;
      return;
    }

    if (this.isLetter.test(char)) {
      this.state = IdentifierMachineStates.Letters;
      return;
    }

    this.state = IdentifierMachineStates.Invalid;
  }

  private handleLetters(char: string): void {

    if (this.isLetter.test(char)) {
      return;
    }

    if (this.isDigit.test(char)) {
      this.state = IdentifierMachineStates.Number;
      return;
    }

    if (char === '_') {
      this.state = IdentifierMachineStates.UnderScore;
      return;
    }

    this.state = IdentifierMachineStates.Accepted;
  }

  private handleNumbers(char: string): void {

    if (this.isDigit.test(char)) {
      return;
    }

    if (this.isLetter.test(char)) {
      this.state = IdentifierMachineStates.Letters;
      return;
    }

    if (char === '_') {
      this.state = IdentifierMachineStates.UnderScore;
      return;
    }

    this.state = IdentifierMachineStates.Accepted;

  }

  private handleAt(char: string): void {

    if (this.isLetter.test(char)) {
      this.state = IdentifierMachineStates.Letters;
      return;
    }

    if (char === '_') {
      this.state = IdentifierMachineStates.UnderScore;
      return;
    }

    this.state = IdentifierMachineStates.Invalid;
  }

  private handleUnderScore(char: string): void {

    if (char === '_') {
      return;
    }

    if (this.isLetter.test(char)) {
      this.state = IdentifierMachineStates.Letters;
      return;
    }

    if (this.isDigit.test(char)) {
      this.state = IdentifierMachineStates.Number;
      return;
    }

    if (char === '@') {
      this.state = IdentifierMachineStates.Invalid;
      return;
    }

    this.state = IdentifierMachineStates.Accepted;
  }
}
