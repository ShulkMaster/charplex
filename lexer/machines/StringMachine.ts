import {IMachine} from './IMachine';
import {BaseToken} from 'structs';

export type StringToken = {
  value: string;
} & BaseToken;

enum StringMachineStates {
  Init,
  Invalid,
  Verb,
  VText,
  VString,
  Regular,
  Text,
  Scape,
  String,
}

export class StringMachine implements IMachine<StringToken> {

  private readonly source: string;
  private start = 0;
  private pointer = 0;
  public state = StringMachineStates.Init;

  constructor(src: string) {
    this.source = src;
  }

  getPointer(): number {
    return this.pointer;
  }

  private shouldContinue(): boolean {
    const s = this.state;
    const vContinue = s !== StringMachineStates.VString;
    const regular = s !== StringMachineStates.String;
    const invalid = s !== StringMachineStates.Invalid;
    return vContinue || regular || invalid;
  }

  public startFrom(start: number): void {
    this.start = start;
    this.state = StringMachineStates.Init;
  }

  public isAccepted(): false | StringToken {
    for (let i = this.start; this.shouldContinue(); i++) {
      this.pointer = i;
      this.handle(this.source[i]);
    }

    if (this.state === StringMachineStates.Invalid) return false;

    const src = this.source.substring(this.start, this.pointer);
    const value = this.parseValue(src);

    return {
      name: 'stringToken',
      range: [this.start, this.pointer],
      value: 'luis',
      kind: 'string',
      src,
    };
  }

  private handle(char: string) {
    switch (this.state) {
      case StringMachineStates.Init:
        this.handleInit(char);
        break;
      case StringMachineStates.Invalid:
        break;
      case StringMachineStates.Verb:
        break;
      case StringMachineStates.VText:
        break;
      case StringMachineStates.VString:
        break;
      case StringMachineStates.Regular:
        this.handRegular(char);
        break;
      case StringMachineStates.Text:
        break;
      case StringMachineStates.Scape:
        break;
      case StringMachineStates.String:
        break;
    }
  }

  private handleInit(char: string): void {
    if (char === '@') {
      this.state = StringMachineStates.Verb;
      return;
    }

    if (char === '"') {
      this.state = StringMachineStates.Regular;
      return;
    }

    this.state = StringMachineStates.Invalid;
  }

  private handRegular(char: string): void {
    if (char === '"') {
      this.state = StringMachineStates.String;
      return;
    }

    this.state = StringMachineStates.Text;
  }

  private parseValue(src: string) {
    // return empty string for input ""
    if (src.length === 2) {
      return '';
    }
    // removes the " marks from the string
    return src.substring(1, src.length - 1);
  }
}
