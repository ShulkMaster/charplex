import {IMachine} from './IMachine';
import {Integer, BaseToken} from 'structs/BaseToken';

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
} & BaseToken;

export class IdentifiersMachine implements IMachine<IdentifierToken> {

  private readonly source: string;
  private readonly isLetter = /^[A-Za-z]+$/
  private readonly isDigit = /\d/;
  private start = 0;
  private pointer = 0;
  public state: IdentifierMachineStates = IdentifierMachineStates.Init;

  constructor(src: string) {
    this.source = src;
  }

  public startFrom(start: number): void {
    this.start = start;
    this.state = IdentifierMachineStates.Init;
  }

  private shouldStop() : boolean {
    return this.state === IdentifierMachineStates.Invalid ||
      this.state === IdentifierMachineStates.Accepted || this.pointer > this.source.length
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

  public isAccepted(): IdentifierToken | false {
    for (let i = this.start; !this.shouldStop(); i++) {
      this.pointer = i;
      this.handle(this.source[i]);
    }

    if (this.state === IdentifierMachineStates.Invalid) return false;

    const src = this.source.substring(this.start, this.pointer);
    const value = src; //this.parseValue(src);

    return {
      name: 'IdentifierToken',
      kind: 'identifier',
      src,
      value,
      range: [this.start, this.pointer],
    };
  }

  private handle(char: string) {
    switch (this.state) {
      case IdentifierMachineStates.Init:
        this.initHandler(char);
        break;
      case IdentifierMachineStates.Number:
        //this.handleLeadZero(char);
        break;
      case IdentifierMachineStates.At:
        //this.handleNumbering(char);
        break;
      case IdentifierMachineStates.UnderScore:
        //this.handleNumberingHex(char);
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

    this.state = IdentifierMachineStates.Accepted
  }

  /*private handleLeadZero(char: string) {
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
  }*/

  /*private stateToType(): Integer {
    switch (this.state) {
      case IdentifierMachineStates.At:
      case IdentifierMachineStates.Invalid:
        case IdentifierMachineStates.UnderScore:
      case IdentifierMachineStates.Init:
        throw new Error('Invalid stated reached');
      case IdentifierMachineStates.Number:
        return 'decimal';
      case IdentifierMachineStates.Letters:
        return 'string';
    }
  }*/

 /* private parseValue(src: string) {
    const isHex = this.state === IntegerMachineStates.Hex || this.state === IntegerMachineStates.HexU;
    let _src = src;
    let radix = 10;
    if (isHex) {
      radix = 16;
    }
    if (unsigned) {
      _src = src.substring(0, this.pointer - 1);
    }
    return parseInt(_src, radix);
  }*/
}
