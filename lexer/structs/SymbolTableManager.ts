import {SymbolTable} from './SymbolTable';
import {CloseBrace, IdentifierToken, OpenBrace} from 'machines';
import {MD5} from 'object-hash';
import {ISymbolManager} from './ISymbolManager';

export class SymbolTableManager implements ISymbolManager {
  private readonly globalScope: SymbolTable;
  private _scope: SymbolTable;

  constructor() {
    this.globalScope = {
      displayName: 'global',
      scope: 'global',
      symbols: {},
      underScopes: {},
      upperScope: null,
    };
    this._scope = this.globalScope;
  }

  public openScope(opener: OpenBrace): OpenBrace {
    const hash = MD5(opener);
    const temp = this._scope;
    this._scope = {
      scope: hash,
      upperScope: this._scope,
      displayName: `${this._scope.displayName}/${hash.substring(0, 5)}`,
      underScopes: {},
      symbols: {},
    };
    temp.underScopes[hash] = this._scope;
    return {...opener, openScope: hash};
  }

  public closeScope(closer: CloseBrace): CloseBrace {
    const hash = this._scope.scope;
    this._scope = this._scope.upperScope || this.globalScope;
    return {...closer, closeScope: hash};
  }

  public registerSymbol(identifier: IdentifierToken): void {
    const symbol = this._scope.symbols[identifier.src];
    if (symbol) {
      console.log('sm registed');
      symbol.usages.push({
        col: 0,
        row: 0,
        token: identifier,
      });
      return;
    }

    const usage = {
      col: 0,
      row: 0,
      token: identifier,
    };

    this._scope.symbols[identifier.src] = {
      usages: [usage],
      scope: this._scope,
      name: identifier.src,
      declaration: true,
      kind: identifier.kind,
    };
  }

  public getCurrentScope(): string {
    return this._scope.scope;
  }

  public getGlobal(): SymbolTable {
    return this.globalScope;
  }
}
