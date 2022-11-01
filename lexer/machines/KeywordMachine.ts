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
      this.state === KeywordMachineStates.Accepted || this.pointer > this.source.length
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

    const src = this.source.substring(this.start, this.pointer);
    const value = src; //this.parseValue(src);

    return {
      name: 'KeywordToken',
      kind: 'keyword',
      src,
      value,
      range: [this.start, this.pointer],
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
        this.handlerIsKeyboard(char);
      
        break; 
    }
  }

  private initHandler(char: string): void {
    this.state = KeywordMachineStates.Invalid;
  }

  private handlerLetter(char: string): void{
    if(/^[a-z]+$/.test(char)){
      this.state = KeywordMachineStates.isLetter
      return;
    }
    this.state = KeywordMachineStates.Invalid
  }

  private handlerIsKeyboard(char: string): void{
    if(char === 'bool'){
      this.state = KeywordMachineStates.isKeyword
      return;
    }
    if(char === 'break'){
      this.state = KeywordMachineStates.isKeyword
    }
    if(char === 'char'){
      this.state = KeywordMachineStates.isKeyword
    }
    if(char === 'class'){
      this.state = KeywordMachineStates.isKeyword
    }
    if(char === 'else'){
      this.state = KeywordMachineStates.isKeyword
    }
    if(char === 'float'){
      this.state = KeywordMachineStates.isKeyword
    }
    if(char === 'for'){
      this.state = KeywordMachineStates.isKeyword
    }
    if(char === 'if'){
      this.state = KeywordMachineStates.isKeyword
    }
    if(char === 'int'){
      this.state = KeywordMachineStates.isKeyword
    }
    if(char === 'new'){
      this.state = KeywordMachineStates.isKeyword
    }
    if(char === 'return'){
      this.state = KeywordMachineStates.isKeyword
    }
    if(char === 'static'){
      this.state = KeywordMachineStates.isKeyword
    }
    if(char === 'string'){
      this.state = KeywordMachineStates.isKeyword
    }
    if(char === 'using'){
      this.state = KeywordMachineStates.isKeyword
    }
    if(char === 'void'){
      this.state = KeywordMachineStates.isKeyword
    }
    if(char === 'while'){
      this.state = KeywordMachineStates.isKeyword
    }
    this.state = KeywordMachineStates.Invalid
  }

  
}
