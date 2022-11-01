import {
  CloseBrace,
  CloseBracket,
  CloseParenthesis,
  IMachine,
  MachineToken,
  OpenBrace,
  OpenBracket,
  OpenParenthesis,
  SemiColon,
} from './machines';
import {Range} from './structs';
import {SymbolTableManager} from './structs/SymbolTableManager';

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
  private readonly table: SymbolTableManager;

  constructor(table: SymbolTableManager, machine: IMachine<MachineToken>, ...machines: IMachine<MachineToken>[]) {
    this.table = table;
    this._machines = [machine];
    this._machines.push(...machines);
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
    const opener: OpenBrace = {
      kind: 'punctuation',
      name: 'OpenBrace',
      openScope: '',
      range: [index, index + 1],
      src: '{',
    };
    return this.table.openScope(opener);
  }

  private makeCloseBraceToken(index: number): CloseBrace {
    const closer: CloseBrace = {
      closeScope: '',
      kind: 'punctuation',
      name: 'CloseBrace',
      range: [index, index + 1],
      src: '}',
    };
    return this.table.closeScope(closer);
  }

  private makeOpenBracketToken(index: number): OpenBracket {
    return {
      kind: 'punctuation',
      name: 'OpenBracket',
      range: [index, index + 1],
      src: '[',
    };
  }

  private makeCloseBracketToken(index: number): CloseBracket {
    return {
      kind: 'punctuation',
      name: 'CloseBracket',
      range: [index, index + 1],
      src: ']',
    };
  }

  private makeOpenParenthesisToken(index: number): OpenParenthesis {
    return {
      kind: 'punctuation',
      name: 'OpenParenthesis',
      range: [index, index + 1],
      src: '(',
    };
  }

  private makeCloseParenthesisToken(index: number): CloseParenthesis {
    return {
      kind: 'punctuation',
      name: 'CloseParenthesis',
      range: [index, index + 1],
      src: ')',
    };
  }

  private makeSemiColon(index: number): SemiColon {
    return {
      kind: 'punctuation',
      name: 'SemiColon',
      range: [index, index + 1],
      src: ';',
    };
  }

  public* tokenStream(): Generator<MachineToken> {
    console.log(this.src);
    if (this._state === LexerStates.Error || this._state === LexerStates.Halt) {
      return;
    }
    let wasSent = false;
    for (let i = 0; i < this.src.length; i++) {
      const char = this.src[i];
      switch (char) {
        case ' ':
        case '\t':
        case '\n':
        case '\r':
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
        case '[':
          yield this.makeOpenBracketToken(i);
          wasSent = true;
          break;
        case ']':
          yield this.makeCloseBracketToken(i);
          wasSent = true;
          break;
        case '(':
          yield this.makeOpenParenthesisToken(i);
          wasSent = true;
          break;
        case ')':
          yield this.makeCloseParenthesisToken(i);
          wasSent = true;
          break;
        case ';':
          yield this.makeSemiColon(i);
          wasSent = true;
          break;
        default:
          const token = this.runMachines(i);
          if (token) {
            wasSent = true;
            i = Math.max(0, this.rangeEnd(token.range) - 1);
            yield token;
          } else {
            wasSent = false;
            this.setErrorRange(i);
          }
      }
      if (wasSent && this.lastErrorRange) {
        const start = this.lastErrorRange[0];
        const src = this.src.substring(start, i);
        yield {kind: 'error', name: 'Error', range: this.lastErrorRange, src};
        this.lastErrorRange = undefined;
      }
    }
    this._state = LexerStates.Halt;
  }

  private runMachines(index: number): false | MachineToken {
    let x: false | MachineToken = false;
    for (const m of this._machines) {
      m.startFrom(index);
      this.listener?.(m);
      const t = m.isAccepted();
      if (t) {
        x = t;
        break;
      }
    }
    return x;
  }
}
