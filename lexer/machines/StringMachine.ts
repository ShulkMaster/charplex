import {IMachine} from './IMachine';
import {BaseToken} from 'structs';

export type StringToken = {
  value: string;
  kind: 'string';
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
  VScape,
  String,
}

export class StringMachine implements IMachine<StringToken> {

  private readonly source: string;
  private readonly scapeSequences = ['\'', '"', '\\', '0', 'a', 'b', 'f', 'n', 'r', 't', 'v'];
  private start = 0;
  private pointer = 0;
  public state = StringMachineStates.Init;

  constructor(src: string) {
    this.source = src;
  }

  getPointer(): number {
    return this.pointer;
  }

  private isOK(): boolean {
    const s = this.state;
    const vString = s === StringMachineStates.VString;
    const regular = s === StringMachineStates.String;
    return vString || regular;
  }

  private shouldContinue(): boolean {
    const s = this.state;
    const length = this.source.length - 1 > this.pointer;
    const vContinue = s === StringMachineStates.VString;
    const regular = s === StringMachineStates.String;
    const invalid = s === StringMachineStates.Invalid;
    return length && !vContinue && !regular && !invalid;
  }

  public get name() {
    return 'StringMachine';
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

    if (!this.isOK()) return false;

    // FDA stops at closing " and does not include it
    const end = this.pointer + 1;
    const src = this.source.substring(this.start, end);
    const value = this.parseValue(src);

    return {
      name: 'stringToken',
      range: [this.start, end],
      kind: 'string',
      src,
      value,
      r: 0,
      c: 0,
    };
  }

  private handle(char: string) {
    // invalid and final states do not need to be handled as they would halt the DFA
    switch (this.state) {
      case StringMachineStates.Init:
        this.handleInit(char);
        break;
      case StringMachineStates.Verb:
        this.handleVerb(char);
        break;
      case StringMachineStates.VText:
        this.handleVText(char);
        break;
      case StringMachineStates.VScape:
        this.handleVScape(char);
        break;
      case StringMachineStates.Regular:
        this.handleRegular(char);
        break;
      case StringMachineStates.Text:
        this.handleText(char);
        break;
      case StringMachineStates.Scape:
        this.handleScape(char);
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

  private handleRegular(char: string): void {
    if (char === '"') {
      this.state = StringMachineStates.String;
      return;
    }

    // check for other whitespace character
    if (char === '\\') {
      this.state = StringMachineStates.Scape;
      return;
    }

    if (char !== '\n') {
      this.state = StringMachineStates.Text;
      return;
    }

    this.state = StringMachineStates.Invalid;
  }

  private handleScape(char: string): void {
    const includes = this.scapeSequences.indexOf(char.toLowerCase());
    if (includes === -1) {
      this.state = StringMachineStates.Invalid;
      return;
    }

    this.state = StringMachineStates.Text;
  }

  private handleText(char: string): void {
    if (char === '"') {
      this.state = StringMachineStates.String;
      return;
    }

    if (char === '\\') {
      this.state = StringMachineStates.Scape;
    }

    if (char === '\n') {
      this.state = StringMachineStates.Invalid;
    }
  }

  private handleVerb(char: string): void {
    if (char === '"') {
      this.state = StringMachineStates.VText;
      return;
    }

    this.state = StringMachineStates.Invalid;
  }

  private handleVText(char: string): void {
    if (char === '"') {
      this.state = StringMachineStates.VString;
      return;
    }

    if (char === '\\') {
      this.state = StringMachineStates.VScape;
    }
  }

  private handleVScape(char: string): void {
    if (char === '"') {
      this.state = StringMachineStates.VText;
      return;
    }
    this.state = StringMachineStates.Invalid;
  }

  private parseValue(src: string) {
    // return empty string for input ""
    if (src.length === 2) {
      return '';
    }
    // removes the " marks from the string
    let modified = src.substring(1, src.length - 1);
    modified = modified.replace('\\\'', '\'');
    modified = modified.replace('\\"', '"');
    modified = modified.replace('\\\\', '\\');
    modified = modified.replace('\\0', '\0');
    modified = modified.replace('\\a', '\a');
    modified = modified.replace('\\b', '\b');
    modified = modified.replace('\\f', '\f');
    modified = modified.replace('\\n', '\n');
    modified = modified.replace('\\r', '\r');
    modified = modified.replace('\\t', '\t');
    modified = modified.replace('\\v', '\v');
    return modified;
  }
}
