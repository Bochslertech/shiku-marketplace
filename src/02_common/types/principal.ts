import { Principal } from '@dfinity/principal';

// Principal -> 字符串
export const principal2string = (p: Principal): string => p.toText();

// 字符串 -> Principal
export const string2principal = (p: string): Principal => Principal.fromText(p);
