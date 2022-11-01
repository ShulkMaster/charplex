import {IdentifierToken} from 'machines';

export interface ISymbolManager {
  registerSymbol(identifier: IdentifierToken): void
  getCurrentScope(): string;
}
