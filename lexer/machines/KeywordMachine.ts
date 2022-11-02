import {IMachine} from './IMachine';
import {BaseToken} from 'structs/BaseToken';

enum KeywordMachineStates {
  Init,
  Invalid,
  Accepted,
  isLetter,
  isKeyword
}

export type KeywordToken = {
  value: string;
  kind: 'keyword';
} & BaseToken;

export class KeywordMachine implements IMachine<KeywordToken> {

  private readonly source: string;
  private start = 0;
  private pointer = 0;
  private word = '';
  private keyword = '';
  public state: KeywordMachineStates = KeywordMachineStates.Init;

  constructor(src: string) {
    this.source = src;
  }

  get name(): any {
    return 'KeywordMachine';
  }

  public startFrom(start: number): void {
    this.start = start;
    this.state = KeywordMachineStates.Init;
  }

  private shouldStop() : boolean {
    return this.state === KeywordMachineStates.Invalid ||
      this.state === KeywordMachineStates.Accepted ||
      this.pointer > this.source.length
  }

  public getPointer(): number {
    return this.pointer;
  }

  public isAccepted(): KeywordToken | false {
    for (let i = this.start; !this.shouldStop(); i++) {
      this.pointer = i;
      this.handle(this.source[i]);
    }

    if (this.state === KeywordMachineStates.Invalid) return false;

    const src = this.keyword;
    const value = this.keyword; //this.parseValue(src);

    return {
      name: 'KeywordToken',
      kind: 'keyword',
      src,
      value,
      range: [this.start, this.pointer],
      r: 0,
      c: 0,
    };
  }

  private handle(char: string) {
    switch (this.state) {
      case KeywordMachineStates.Init:
        this.initHandler(char);
        break;
      case KeywordMachineStates.isLetter:
        this.handlerLetter(char);
        break;
      case KeywordMachineStates.isKeyword:
        this.handlerIsKeyword(this.word);
        break;
    }
  }

  private initHandler(char: string): void {

    if(/^[a-z]+$/.test(char)){
      this.state = KeywordMachineStates.isLetter;
      this.word += char;
      return;
    }

    this.state = KeywordMachineStates.Invalid;
  }

  private handlerLetter(char: string): void {

    if(/^[a-z]+$/.test(char)) {
      this.state = KeywordMachineStates.isLetter;
      this.word += char;
      return;
    }

    this.state = KeywordMachineStates.isKeyword
  }

  private handlerIsKeyword(char: string): void {
    if(char === 'bool'){
      this.state = KeywordMachineStates.Accepted;
      this.keyword = char;
      this.word = '';
      return;
    }
    if(char === 'break'){
      this.state = KeywordMachineStates.Accepted;
      this.keyword = char;
      this.word = '';
      return;
    }
    if(char === 'char'){
      this.state = KeywordMachineStates.Accepted;
      this.keyword = char;
      this.word = '';
      return;
    }
    if(char === 'class'){
      this.state = KeywordMachineStates.Accepted;
      this.keyword = char;
      this.word = '';
      return;
    }
    if(char === 'else'){
      this.state = KeywordMachineStates.Accepted;
      this.keyword = char;
      this.word = '';
      return;
    }
    if(char === 'float'){
      this.state = KeywordMachineStates.Accepted;
      this.keyword = char;
      this.word = '';
      return;
    }
    if(char === 'for'){
      this.state = KeywordMachineStates.Accepted;
      this.keyword = char;
      this.word = '';
      return;
    }
    if(char === 'if'){
      this.state = KeywordMachineStates.Accepted;
      this.keyword = char;
      this.word = '';
      return;
    }
    if(char === 'int'){
      this.state = KeywordMachineStates.Accepted;
      this.keyword = char;
      this.word = '';
      return;
    }
    if(char === 'new'){
      this.state = KeywordMachineStates.Accepted;
      this.keyword = char;
      this.word = '';
      return;
    }
    if(char === 'return'){
      this.state = KeywordMachineStates.Accepted;
      this.keyword = char;
      this.word = '';
      return;
    }
    if(char === 'static'){
      this.state = KeywordMachineStates.Accepted;
      this.keyword = char;
      this.word = '';
      return;
    }
    if(char === 'string'){
      this.state = KeywordMachineStates.Accepted;
      this.keyword = char;
      this.word = '';
      return;
    }
    if(char === 'using'){
      this.state = KeywordMachineStates.Accepted;
      this.keyword = char;
      this.word = '';
      return;
    }
    if(char === 'void'){
      this.state = KeywordMachineStates.Accepted;
      this.keyword = char;
      this.word = '';
      return;
    }
    if(char === 'while'){
      this.state = KeywordMachineStates.Accepted;
      this.keyword = char;
      this.word = '';
      return;
    }

    this.word = '';
    this.state = KeywordMachineStates.Invalid
  }
}
