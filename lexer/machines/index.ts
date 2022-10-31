import {IntegerToken} from './numeric/IntegerMachine';
import { IdentifierToken } from './IdentifiersMachine'

export * from './IMachine';
export * from './numeric/IntegerMachine';
export * from './IdentifiersMachine';

export type MachineToken = IntegerToken | IdentifierToken;
