import {IMachine} from 'machines';
import {BaseToken} from 'structs/BaseToken';

enum IntegerMachineStates {
  Init,
  Invalid,
  LeadZero,
  Numbering,
  NumberingHex,
  Integer,
  IntegerU,
  Hex,
  HexU,
}

export type IntegerToken = {
  name: 'decimal' | 'hexadecimal';
  value: number;
  unsigned: boolean;
  kind: 'IntegerToken';
} & BaseToken;

export class IntegerMachine implements IMachine<IntegerToken> {

  private readonly source: string;
  private readonly isDigit = /\d/;
  private readonly isHexDigit = /[0-9a-fA-F]/;
  private start = 0;
  private pointer = 0;
  public state = IntegerMachineStates.Init;


  constructor(src: string) {
    this.source = src;
  }

  public get name() {
    return 'IntegerMachine';
  }

  public startFrom(start: number): void {
    this.start = start;
    this.state = IntegerMachineStates.Init;
  }

  private isUnsigned(): boolean {
    return this.state === IntegerMachineStates.HexU ||
      this.state === IntegerMachineStates.IntegerU;
  }

  private isOk(): boolean {
    const s = this.state;
    return s === IntegerMachineStates.Integer ||
      s === IntegerMachineStates.IntegerU ||
      s === IntegerMachineStates.Hex ||
      s === IntegerMachineStates.HexU;
  }

  private shouldContinue(): boolean {
    return this.source.length - 1 > this.pointer &&
      this.state !== IntegerMachineStates.Invalid &&
      !this.isOk();
  }

  public getPointer(): number {
    return this.pointer;
  }

  public isAccepted(): false | IntegerToken {
    for (let i = this.start; this.shouldContinue(); i++) {
      this.pointer = i;
      this.handle(this.source[i]);
    }
    const isOnNumber = this.state === IntegerMachineStates.Numbering || this.state === IntegerMachineStates.NumberingHex;
    if (!(this.isOk() || isOnNumber)) {
      return false;
    }

    if (isOnNumber) {
      this.pointer++;
    }
    const unsigned = this.isUnsigned();
    const end = unsigned ? this.pointer + 1 : this.pointer;
    const src = this.source.substring(this.start, end);
    const value = this.parseValue(src, unsigned);

    return {
      name: this.stateToType(),
      kind: 'IntegerToken',
      src,
      unsigned,
      value,
      range: [this.start, end],
    };
  }

  private handle(char: string) {
    switch (this.state) {
      case IntegerMachineStates.Init:
        this.initHandler(char);
        break;
      case IntegerMachineStates.LeadZero:
        this.handleLeadZero(char);
        break;
      case IntegerMachineStates.Numbering:
        this.handleNumbering(char);
        break;
      case IntegerMachineStates.NumberingHex:
        this.handleNumberingHex(char);
        break;
    }
  }

  private initHandler(char: string): void {
    if (char === '0') {
      this.state = IntegerMachineStates.LeadZero;
      return;
    }

    if (this.isDigit.test(char)) {
      this.state = IntegerMachineStates.Numbering;
      return;
    }

    this.state = IntegerMachineStates.Invalid;
  }

  private handleLeadZero(char: string) {
    if (char.toLowerCase() === 'x') {
      this.state = IntegerMachineStates.NumberingHex;
      return;
    }

    if (this.isDigit.test(char)) {
      this.state = IntegerMachineStates.Numbering;
      return;
    }

    this.state = IntegerMachineStates.Invalid;
  }

  private handleNumbering(char: string) {
    if (this.isDigit.test(char)) {
      return;
    }

    if (char.toLowerCase() === 'u') {
      this.state = IntegerMachineStates.IntegerU;
      return;
    }

    this.state = IntegerMachineStates.Integer;
  }

  private handleNumberingHex(char: string) {
    if (this.isHexDigit.test(char)) {
      return;
    }

    if (char.toLowerCase() === 'u') {
      this.state = IntegerMachineStates.HexU;
      return;
    }

    this.state = IntegerMachineStates.Hex;
  }

  private stateToType(): IntegerToken['name'] {
    switch (this.state) {
      case IntegerMachineStates.Invalid:
      case IntegerMachineStates.Init:
        throw new Error('Invalid stated reached');
      case IntegerMachineStates.Numbering:
      case IntegerMachineStates.Integer:
      case IntegerMachineStates.IntegerU:
        return 'decimal';
      case IntegerMachineStates.Hex:
      case IntegerMachineStates.HexU:
      case IntegerMachineStates.NumberingHex:
        return 'hexadecimal';
      case IntegerMachineStates.LeadZero:
        return 'decimal';
    }
  }

  private parseValue(src: string, unsigned: boolean): number {
    const isHex = this.state === IntegerMachineStates.Hex || this.state === IntegerMachineStates.HexU;
    let _src = src;
    let radix = 10;
    if (isHex) {
      radix = 16;
    }
    if (unsigned) {
      // removing u at the end of string
      _src = src.substring(0, this.pointer - 1);
    }
    return parseInt(_src, radix);
  }
}
