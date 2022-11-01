import {IMachine} from './IMachine';
import {BaseToken} from 'structs/BaseToken';

enum CommentsMachineStates {
  Init,
  Invalid,
  Accepted,
  Slash,
  DoubleSlash,
  Commenting,
  Asterisk
}

export type CommentToken = {
  value: string;
  kind: 'comments';
} & BaseToken;

export class CommentsMachine implements IMachine<CommentToken> {

  private readonly source: string;
  private isLineBreak = /\n/;
  private comment = ''
  private commentFinal = ''
  private start = 0;
  private pointer = 0;
  public state: CommentsMachineStates = CommentsMachineStates.Init;

  constructor(src: string) {
    this.source = src;
  }

  get name(): any {
    return 'CommentsMachine'
  }

  public getPointer(): number {
    return this.pointer;
  }

  private shouldStop() : boolean {
    return this.state === CommentsMachineStates.Invalid ||
      this.state === CommentsMachineStates.Accepted || this.pointer > this.source.length 
  }

  isAccepted(): false | CommentToken {
    for (let i = this.start; !this.shouldStop(); i++) {
      this.pointer = i;
      this.handle(this.source[i]);
    }

    if (this.state === CommentsMachineStates.Invalid) return false;

    const src = this.source.substring(this.start, this.pointer);
    const value = this.commentFinal; //this.parseValue(src);

    return {
      name: 'CommentToken',
      kind: 'comments',
      src,
      value,
      range: [this.start, this.pointer],
    };
  }

  public startFrom(start: number): void {
    this.start = start;
    this.state = CommentsMachineStates.Init;
  }

  private handle(char: string) {
    switch (this.state) {
      case CommentsMachineStates.Init:
        this.initHandler(char);
        break;
      case CommentsMachineStates.Slash:
        this.handleSlash(char);
        break;
      case CommentsMachineStates.DoubleSlash:
        this.handleDoubleSlash(char);
        break;
      case CommentsMachineStates.Commenting:
        this.handleCommenting(char);
        break;
      case CommentsMachineStates.Asterisk:
        this.handleAsterisk(char);
        break;  
    }
  }

  private initHandler(char: string) : void {

    if (char === '/') {
      this.state = CommentsMachineStates.Slash;
      return;
    }

    this.state = CommentsMachineStates.Invalid;
  }

  private handleSlash(char: string) : void {

    if (char === '/') {
      this.state = CommentsMachineStates.DoubleSlash;
      return;
    }

    if (char === '*') {
      this.state = CommentsMachineStates.Commenting;
      return;
    }

    this.state = CommentsMachineStates.Invalid;
  }

  private handleDoubleSlash(char: string) : void {
    if (this.isLineBreak.test(char)) {
      this.state = CommentsMachineStates.Accepted;
      this.commentFinal = this.comment;
      this.comment = '';
      return;
    }

    this.comment += char;
  }

  private handleCommenting(char: string) : void {
    
    if (char === '*') {
      this.state = CommentsMachineStates.Asterisk;
      return;
    }

    this.comment += char;
  }

  private handleAsterisk(char: string) : void {
    
    if (char === '/') {
      this.state = CommentsMachineStates.DoubleSlash;
      return;
    }

    this.comment += char;
  }
}