import {MachineToken} from 'machines';

export type SymbolUsage = {
  row: number;
  col: number;
  token: MachineToken;
}

export type Symbol = {
  name: string;
  scope: SymbolTable;
  declaration: boolean;
  kind: MachineToken['kind'];
  usages: SymbolUsage[];
}

export type SymbolTable = {
  displayName: string;
  scope: string;
  underScopes: {
    [scope: string]: SymbolTable;
  };
  upperScope: SymbolTable | null;
  symbols: {
    [src: string] : Symbol;
  }
};
