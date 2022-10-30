import {IMachine, IntegerToken, MachineToken} from './machines';
import {Range} from './structs';

enum LexerStates {
  Init,
  Halt,
  Error,
  Lexing
}

export class Lexer {

  private src: string = '';
  private _machines: IMachine<MachineToken>[] = new Array(1);
  private state = LexerStates.Init;

  constructor(intMachine: IMachine<IntegerToken>) {
    this._machines[0] = intMachine;
  }

  public set source(src: string) {
    this.src = src;
    this.state = LexerStates.Init;
  }

  rangeEnd(range: Range): number {
    return range[1];
  }

  public* tokenStream(): Generator<MachineToken> {
    if (this.state === LexerStates.Error || this.state === LexerStates.Halt) {
      return;
    }
    for (let i = 0; i < this.src.length;) {
      const char = this.src[i];
      if (char === ' ') {
        i++;
        continue;
      }
      const machine = this._machines[0];
      machine.startFrom(i);
      const token = machine.isAccepted();
      if (token) {
        i = this.rangeEnd(token.range) + 1;
        yield token;
      } else {
        i++;
      }
    }
    this.state = LexerStates.Halt;
  }

}
