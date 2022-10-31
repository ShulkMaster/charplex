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
  value: number;
  unsigned: boolean;
  kind: 'decimal' | 'hexadecimal';
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

  private shouldContinue(): boolean {
    return this.state === IntegerMachineStates.Numbering ||
      this.state === IntegerMachineStates.NumberingHex ||
      this.state === IntegerMachineStates.LeadZero ||
      this.state === IntegerMachineStates.Init;
  }

  public getPointer(): number {
    return this.pointer;
  }

  public isAccepted(): false | IntegerToken {
    for (let i = this.start; this.shouldContinue(); i++) {
      this.pointer = i;
      this.handle(this.source[i]);
    }

    if (this.state === IntegerMachineStates.Invalid) return false;

    const unsigned = this.isUnsigned();
    const src = this.source.substring(this.start, this.pointer);
    const value = this.parseValue(src, unsigned);

    return {
      name: 'IntegerToken',
      kind: this.stateToType(),
      src,
      unsigned,
      value,
      range: [this.start, this.pointer],
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

  private stateToType(): IntegerToken['kind'] {
    switch (this.state) {
      case IntegerMachineStates.Numbering:
      case IntegerMachineStates.NumberingHex:
      case IntegerMachineStates.Invalid:
      case IntegerMachineStates.Init:
        throw new Error('Invalid stated reached');
      case IntegerMachineStates.Integer:
      case IntegerMachineStates.IntegerU:
        return 'decimal';
      case IntegerMachineStates.Hex:
      case IntegerMachineStates.HexU:
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
