import {CloseBrace, IMachine, IntegerToken, MachineToken, OpenBrace} from './machines';
import {Range} from './structs';

enum LexerStates {
  Init,
  Halt,
  Error,
  Lexing
}

export type MachineChangeCallback = ((m: IMachine<MachineToken>) => void);

export class Lexer {

  private readonly _machines: IMachine<MachineToken>[];
  private listener: MachineChangeCallback | undefined = undefined;
  private src: string = '';
  private _state = LexerStates.Init;
  private lastErrorRange: Range | undefined = undefined;

  constructor(machines: IMachine<MachineToken>[]) {
    this._machines = machines;
    if (machines.length < 1) {
      throw new Error('Lexer requires at least 1 machine to run');
    }
  }

  public set source(src: string) {
    this.src = src;
    this._state = LexerStates.Init;
  }

  private rangeEnd(range: Range): number {
    return range[1];
  }

  public get state(): LexerStates {
    return this._state;
  }

  public registerOnMachineChange(m: MachineChangeCallback): void {
    this.listener = m;
  }

  public unregisterOnMachineChange(): void {
    this.listener = undefined;
  }

  public setErrorRange(index: number): void {
    if (this.lastErrorRange) {
      this.lastErrorRange = [this.lastErrorRange[0], index];
      return;
    }

    this.lastErrorRange = [index, index + 1];
  }

  private makeOpenBraceToken(index: number): OpenBrace {
    return {
      kind: 'punctuation',
      name: 'OpenBrace',
      openScope: '',
      range: [index, index + 1],
      src: '{',
    };
  }

  private makeCloseBraceToken(index: number): CloseBrace {
    return {
      closeScope: '',
      kind: 'punctuation',
      name: 'CloseBrace',
      range: [index, index + 1],
      src: '}',
    };
  }

  public* tokenStream(): Generator<MachineToken> {
    if (this._state === LexerStates.Error || this._state === LexerStates.Halt) {
      return;
    }
    let wasSent = false;
    for (let i = 0; i < this.src.length; i++) {
      const char = this.src[i];
      switch (char) {
        case ' ':
        case '\t':
          wasSent = true;
          break;
        case '{':
          yield this.makeOpenBraceToken(i);
          wasSent = true;
          break;
        case '}':
          yield this.makeCloseBraceToken(i);
          wasSent = true;
          break;
        default:
          const token = this.handle(i);
          if (token) {
            wasSent = true;
            i = this.rangeEnd(token.range);
            yield token;
          } else {
            wasSent = false;
            this.setErrorRange(i);
          }
      }
      if (wasSent && this.lastErrorRange) {
        const [start, end] = this.lastErrorRange;
        const src = this.src.substring(start, end  + 1);
        yield {kind: 'error', name: 'Error', range: this.lastErrorRange, src};
        this.lastErrorRange = undefined;
      }
    }
    this._state = LexerStates.Halt;
  }

  private handle(index: number): false | MachineToken {
    for (const m of this._machines) {
      m.startFrom(index);
      this.listener?.(m);
      const t = m.isAccepted();
      if (t) {
        return t;
      }
    }
    return false;
  }
}
