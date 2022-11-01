import {IMachine} from './IMachine';
import {BaseToken} from 'structs/BaseToken';

enum OperatorMachineStates {
  Init,
  Invalid,
  Plus,
  SecondPlus,
  Minus,
  SecondMinus,
  Ampersand,
  SecondAmpersand,
  Greaterthan,
  SecondGreater,
  Lessthan,
  SecondLess,
  Orsign,
  SecondOr,
  Tilde,
  FinalEquals,
  Negation,
  Final,
  Accepted,
}

export type OperatorToken = {
  value: string;
  kind: 'operator';
} & BaseToken;

export class OperatorsMachine implements IMachine<OperatorToken> {

  private readonly source: string;
  private readonly isFinal = /\s/

  private start = 0;
  private pointer = 0;
  public state: OperatorMachineStates = OperatorMachineStates.Init;

  constructor(src: string) {
    this.source = src;
  }

  get name(): any {
    return 'OperatorsMachine';
  }

  public startFrom(start: number): void {
    this.start = start;
    this.state = OperatorMachineStates.Init;
  }

  private shouldStop() : boolean {
    return this.state === OperatorMachineStates.Invalid ||
      this.state === OperatorMachineStates.Accepted || this.pointer > this.source.length
  }

  /*private shouldContinue(): boolean {
    return this.state === IdentifierMachineStates.Number ||
      this.state === IdentifierMachineStates.At ||
      this.state === IdentifierMachineStates.Letters ||
      this.state === IdentifierMachineStates.UnderScore ||
      this.state === IdentifierMachineStates.Init;
  }*/

  public getPointer(): number {
    return this.pointer;
  }

  public isAccepted(): OperatorToken | false {
    for (let i = this.start; !this.shouldStop(); i++) {
      this.pointer = i;
      this.handle(this.source[i]);
    }

    if (this.state === OperatorMachineStates.Invalid) return false;

    const src = this.source.substring(this.start, this.pointer);
    const value = src; //this.parseValue(src);

    return {
      name: 'OperatorToken',
      kind: 'operator',
      src,
      value,
      range: [this.start, this.pointer],
    };
  }

  private handle(char: string) {
    switch (this.state) {
      case OperatorMachineStates.Init:
        this.initHandler(char);
        break;
      case OperatorMachineStates.FinalEquals:
        this.handleFinalEquals(char);
        break;
      case OperatorMachineStates.Plus:
        this.handlePlus(char);
        break;
      case OperatorMachineStates.SecondPlus:
        this.handleSecondPlus(char);
        break;
      case OperatorMachineStates.Minus:
        this.handleMinus(char);
        break;
      case OperatorMachineStates.SecondMinus:
        this.handleSecondMinus(char);
        break;
      case OperatorMachineStates.Ampersand:
        this.handleAmpersand(char);
        break;
      case OperatorMachineStates.SecondAmpersand:
        this.handleSecondAmpersand(char);
        break;
      case OperatorMachineStates.Greaterthan:
        this.handleGreater(char);
        break;
      case OperatorMachineStates.SecondGreater:
        this.handleSecondGreater(char);
        break;
      case OperatorMachineStates.Lessthan:
        this.handleLess(char);
        break;
      case OperatorMachineStates.Negation:
        this.handleNegative(char);
        break;
      case OperatorMachineStates.SecondLess:
        this.handleSecondLess(char);
        break;
      case OperatorMachineStates.Orsign:
        this.handleOr(char);
        break;
      case OperatorMachineStates.SecondOr:
        this.handleSecondOr(char);
        break;
      case OperatorMachineStates.Tilde:
        this.handleTilde(char);
        break;
      case OperatorMachineStates.Final:
        this.handleFinal(char);
        break;
    }
  }

  private initHandler(char: string): void {
    if (char === '+') {
      this.state = OperatorMachineStates.Plus;
      return;
    }

    if (char === '-') {
      this.state = OperatorMachineStates.Minus;
      return;
    }

    if (char === '=') {
      this.state = OperatorMachineStates.Final;
      return;
    }

    if (char === '/') {
      this.state = OperatorMachineStates.SecondGreater;
      return;
    }

    if (char === '*') {
      this.state = OperatorMachineStates.SecondGreater;
      return;
    }

    if (char === '%') {
      this.state = OperatorMachineStates.SecondGreater;
      return;
    }

    if (char === '!') {
      this.state = OperatorMachineStates.SecondGreater;
      return;
    }

    if (char === '&') {
        this.state = OperatorMachineStates.Ampersand;
        return;
      }

    if (char === '|') {
        this.state = OperatorMachineStates.Orsign;
        return;
      }

    if (char === '>') {
        this.state = OperatorMachineStates.Greaterthan;
        return;
      }

    if (char === '<') {
        this.state = OperatorMachineStates.Lessthan;
        return;
      }

    if (char === '~') {
        this.state = OperatorMachineStates.Tilde;
        return;
      }

    this.state = OperatorMachineStates.Invalid;
  }

  private handleNegative(char: string): void {
    if (char === '=') {
      this.state = OperatorMachineStates.FinalEquals;
      return;
  }
  }

  private handlePlus(char: string): void {

    if (char === '+') {
      this.state = OperatorMachineStates.SecondPlus;
      return;
    }

    if (char === '=') {
        this.state = OperatorMachineStates.FinalEquals;
        return;
    }

    this.state = OperatorMachineStates.Accepted;
  }

  private handleSecondPlus(char: string): void {
    this.state = OperatorMachineStates.Accepted;
  }

  private handleMinus(char: string): void {

    if (char === '-') {
      this.state = OperatorMachineStates.SecondMinus;
      return;
    }

    if (char === '=') {
        this.state = OperatorMachineStates.FinalEquals;
        return;
    }
  
    this.state = OperatorMachineStates.Accepted;
  }

  private handleSecondMinus(char: string): void {
    this.state = OperatorMachineStates.Accepted;
  }

  private handleGreater(char: string): void {

    if (char === '>') {
        this.state = OperatorMachineStates.SecondGreater;
      return;
    }

    if (!this.isFinal.test(char)) {
      this.state = OperatorMachineStates.Invalid;
      return;
    }

    this.state = OperatorMachineStates.Accepted;
  }

  private handleSecondGreater(char: string): void {

    if (char === '=') {
        this.state = OperatorMachineStates.FinalEquals;
      return;
    }

    if (!this.isFinal.test(char)) {
      this.state = OperatorMachineStates.Invalid;
      return;
    }

    this.state = OperatorMachineStates.Accepted;
  }

  private handleLess(char: string): void {

    if (char === '<') {
      this.state = OperatorMachineStates.SecondLess;
      return;
    }

    if (char === '=') {
      this.state = OperatorMachineStates.FinalEquals;
    return;
  }

    if (!this.isFinal.test(char)) {
      this.state = OperatorMachineStates.Invalid;
      return;
    }

    this.state = OperatorMachineStates.Accepted;
  }

  private handleSecondLess(char: string): void {

    if (char === '=') {
      this.state = OperatorMachineStates.FinalEquals;
    return;
  }

    if (!this.isFinal.test(char)) {
      this.state = OperatorMachineStates.Invalid;
      return;
    }

    this.state = OperatorMachineStates.Accepted;
  }

  private handleAmpersand(char: string): void {

    if (char === '&') {
      this.state = OperatorMachineStates.SecondAmpersand;
      return;
    }

    if (char === '=') {
      this.state = OperatorMachineStates.FinalEquals;
      return;
      }

    if (!this.isFinal.test(char)) {
      this.state = OperatorMachineStates.Invalid;
      return;
    }

    this.state = OperatorMachineStates.Accepted;
  }

  private handleSecondAmpersand(char: string): void {

    if (!this.isFinal.test(char)) {
      this.state = OperatorMachineStates.Invalid;
      return;
    }

    this.state = OperatorMachineStates.Accepted;
  }

  private handleOr(char: string): void {

    if (char === '|') {
      this.state = OperatorMachineStates.SecondOr;
      return;
    }

    if (char === '=') {
        this.state = OperatorMachineStates.FinalEquals;
        return;
      }

    if (!this.isFinal.test(char)) {
      this.state = OperatorMachineStates.Invalid;
      return;
    }

    this.state = OperatorMachineStates.Accepted;
  }

  private handleSecondOr(char: string): void {

    if (!this.isFinal.test(char)) {
      this.state = OperatorMachineStates.Invalid;
      return;
    }

    this.state = OperatorMachineStates.Accepted;
  }

  private handleTilde(char: string): void {

    if (!this.isFinal.test(char)) {
      this.state = OperatorMachineStates.Invalid;
      return;
    }

    this.state = OperatorMachineStates.Accepted;
  }

  private handleFinalEquals(char: string): void {

    if (!this.isFinal.test(char)) {
      this.state = OperatorMachineStates.Final;
      return;
    }

    this.state = OperatorMachineStates.Accepted;
  }

  private handleFinal(char: string): void {

    this.state = OperatorMachineStates.Accepted;
  }
}
