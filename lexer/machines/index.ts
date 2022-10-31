import {IntegerToken} from './numeric/IntegerMachine';
import {StringToken} from './StringMachine';

export * from './IMachine';
export * from './StringMachine';
export * from './numeric/IntegerMachine';

export type MachineToken = IntegerToken | StringToken;
