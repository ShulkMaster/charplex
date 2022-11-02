import {IdentifierToken} from 'machines/index.js';

export interface ISymbolManager {
  registerSymbol(identifier: IdentifierToken): void
  getCurrentScope(): string;
}
