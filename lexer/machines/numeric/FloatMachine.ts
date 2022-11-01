import {IMachine} from 'machines';
import {BaseToken} from 'structs/BaseToken';

enum FloatMachineStates {
  Init,
  Invalid,
  Dot,
  Numbering,
  DNumbering,
  Float,
  Double,
  Decimal,
}

export type FloatMachineToken = {
  name: 'FloatToken' | 'DoubleToken' | 'DecimalToken';
  kind: 'RealToken'
  value: number;
} & BaseToken;

export class FloatMachine implements IMachine<FloatMachineToken> {

  private readonly source: string;
  private readonly isDigit = /\d/;
  private start = 0;
  private pointer = 0;
  public state = FloatMachineStates.Init;

  constructor(src: string) {
    this.source = src;
  }

  public get name() {
    return 'FloatMachine';
  }

  public getPointer(): number {
    return this.pointer;
  }

  public startFrom(start: number): void {
    this.start = start;
    this.state = FloatMachineStates.Init;
  }

  private parseValue(src: string): number {
    return parseFloat(src);
  }

  private stateToName(): FloatMachineToken['name'] {
    switch (this.state) {
      case FloatMachineStates.Float:
        return 'FloatToken';
      case FloatMachineStates.Double:
        return 'DoubleToken';
      case FloatMachineStates.Decimal:
        return 'DecimalToken';
      default:
        throw new Error('Invalid stated reached');
    }
  }

  private shouldContinue(): boolean {
    const s = this.state;
    return this.pointer <= this.source.length &&
      !(
        s === FloatMachineStates.Invalid ||
        s === FloatMachineStates.Double ||
        s === FloatMachineStates.Float ||
        s === FloatMachineStates.Decimal
      );
  }


  public isAccepted(): false | FloatMachineToken {
    for (let i = this.start; this.shouldContinue(); i++) {
      this.pointer = i;
      this.handle(this.source[i]);
    }

    if (this.state === FloatMachineStates.Invalid) return false;
    const src = this.source.substring(this.start, this.pointer);
    const value = this.parseValue(src);

    return {
      name: this.stateToName(),
      kind: 'RealToken',
      src,
      value,
      range: [this.start, this.pointer],
    };

  }

  private handle(char: string) {
    switch (this.state) {
      case FloatMachineStates.Init:
        this.handleInit(char);
        break;
      case FloatMachineStates.Dot:
        this.handleDot(char);
        break;
      case FloatMachineStates.Numbering:
        this.handleNumbering(char);
        break;
      case FloatMachineStates.DNumbering:
        this.handleDNumbering(char);
        break;
    }
  }


  private handleInit(char: string) {
    if (char === '.') {
      this.state = FloatMachineStates.Dot;
      return;
    }

    if (this.isDigit.test(char)) {
      this.state = FloatMachineStates.Numbering;
      return;
    }

    this.state = FloatMachineStates.Invalid;
  }

  private handleDot(char: string) {
    if (this.isDigit.test(char)) {
      this.state = FloatMachineStates.DNumbering;
      return;
    }

    this.state = FloatMachineStates.Invalid;
  }

  private handleNumbering(char: string) {
    if (this.isDigit.test(char)) {
      return;
    }

    if (char === '.') {
      this.state = FloatMachineStates.Dot;
      return;
    }

    if (char.toLowerCase() === 'f') {
      this.state = FloatMachineStates.Float;
      return;
    }

    if (char.toLowerCase() === 'm') {
      this.state = FloatMachineStates.Decimal;
      return;
    }

    if (char.toLowerCase() === 'd') {
      this.state = FloatMachineStates.Double;
      return;
    }

    this.state = FloatMachineStates.Invalid;
  }

  handleDNumbering(char: string) {
    if (this.isDigit.test(char)) {
      return;
    }

    if (char.toLowerCase() === 'f') {
      this.state = FloatMachineStates.Float;
      return;
    }

    if (char.toLowerCase() === 'm') {
      this.state = FloatMachineStates.Double;
      return;
    }

    this.state = FloatMachineStates.Double;
  }
}
