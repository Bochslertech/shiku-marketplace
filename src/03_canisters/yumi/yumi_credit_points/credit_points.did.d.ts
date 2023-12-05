import { Principal } from '@dfinity/principal';

// export type AccountIdentifier = string;
// export type Balance = bigint;
export type BalanceResponse = { ok: Balance__1 } | { err: CommonError__1 };
export type Balance__1 = bigint;
// export type CommonError = { InvalidToken: TokenIdentifier } | { Other: string };
export type CommonError__1 = { InvalidToken: TokenIdentifier } | { Other: string };
// export type Metadata =
//     | {
//           fungible: {
//               decimals: number;
//               metadata: [] | [Array<number>];
//               name: string;
//               symbol: string;
//           };
//       }
//     | { nonfungible: { metadata: [] | [Array<number>] } };
// export type Result = { ok: Balance } | { err: CommonError };
// export type Result_1 = { ok: Metadata } | { err: CommonError };
export type TokenIdentifier = string;
export type User = { principal: Principal } | { address: AccountIdentifier };
export default interface _SERVICE {
    // acceptCycles: () => Promise<undefined>;
    // availableCycles: () => Promise<bigint>;
    balance: (arg_0: User) => Promise<BalanceResponse>;
    // balances: () => Promise<Array<[AccountIdentifier, Balance]>>;
    // burn: (arg_0: User, arg_1: Balance) => Promise<BalanceResponse>;
    // getConfig: () => Promise<{ origyn: Principal; yumi: Principal; lanuchpad: Principal }>;
    // metadata: () => Promise<Result_1>;
    // mint: (arg_0: User, arg_1: Balance) => Promise<BalanceResponse>;
    // setLanuchpadOwner: (arg_0: Principal) => Promise<undefined>;
    // setOrigyn: (arg_0: Principal) => Promise<undefined>;
    // setYumiOwner: (arg_0: Principal) => Promise<undefined>;
    // supply: () => Promise<Result>;
}
