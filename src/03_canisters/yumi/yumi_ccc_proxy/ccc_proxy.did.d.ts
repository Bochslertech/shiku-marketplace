import { Principal } from '@dfinity/principal';

export type AccountIdentifier = string;
// export type AccountIdentifier__1 = string;
// export interface AllowanceRequest {
//     token: TokenIdentifier__1;
//     owner: User;
//     spender: Principal;
// }
// export type Balance = bigint;
// export type Balance__1 = bigint;
// export type CommonError = { InvalidToken: TokenIdentifier__1 } | { Other: string };
export interface DepositInfo {
    ttl: Time;
    status: boolean;
    deposit: Principal;
}
export type FillDepositErr =
    | { ownerError: null }
    | { getBearerErr: null }
    | { noExistDeposit: null }
    | { unSupportCollectionErr: null };
// export type Memo = Array<number>;
export type ReserveDepositErr =
    | { getBearerErr: null }
    | { checkOwnerErr: null }
    | { unSupportCollectionErr: null };
export type Result = { ok: null } | { err: ReserveDepositErr };
export type Result_1 = { ok: null } | { err: FillDepositErr };
// export type Result__1 = { ok: AccountIdentifier__1 } | { err: CommonError };
// export type Result__1_1 = { ok: Balance__1 } | { err: CommonError };
// export type SubAccount = Array<number>;
export type Time = bigint;
export type TokenIdentifier = string;
export type TokenIdentifier__1 = string;
// export interface TransferRequest {
//     to: User;
//     token: TokenIdentifier__1;
//     notify: boolean;
//     from: User;
//     memo: Memo;
//     subaccount: [] | [SubAccount];
//     amount: Balance;
// }
export type TransferResponse =
    | { ok: Balance }
    | {
          err:
              | { CannotNotify: AccountIdentifier }
              | { InsufficientBalance: null }
              | { InvalidToken: TokenIdentifier__1 }
              | { Rejected: null }
              | { Unauthorized: AccountIdentifier }
              | { Other: string };
      };
// export type User = { principal: Principal } | { address: AccountIdentifier };
// export interface thirdCollectionInfo {
//     creator: Principal;
//     collectionType: string;
// }
export default interface _SERVICE {
    // addCreator_whitelist: (arg_0: Array<Principal>) => Promise<undefined>;
    // addThirdCollection: (arg_0: Principal, arg_1: thirdCollectionInfo) => Promise<undefined>;
    // allowance: (arg_0: AllowanceRequest) => Promise<Result__1_1>;
    // balance: () => Promise<bigint>;
    // bearer: (arg_0: TokenIdentifier) => Promise<Result__1>;
    // delCreator_whitelist: (arg_0: Array<Principal>) => Promise<undefined>;
    fillDeposit: (arg_0: Principal, arg_1: number) => Promise<Result_1>;
    getAllDeposit: () => Promise<Array<[string, number, Principal]>>;
    // getCreator_whitelist: () => Promise<Array<Principal>>;
    getDeposit: (arg_0: Principal, arg_1: number) => Promise<[] | [DepositInfo]>;
    // getMinter: (arg_0: Principal) => Promise<Principal>;
    // getOwner: () => Promise<Principal>;
    // getThirdCollections: () => Promise<Array<[Principal, thirdCollectionInfo]>>;
    // getTokenIdentifierByUser: (arg_0: Principal) => Promise<Array<TokenIdentifier>>;
    // removeThirdCollection: (arg_0: Principal) => Promise<Array<[Principal, thirdCollectionInfo]>>;
    reserveDeposit: (arg_0: Principal, arg_1: number) => Promise<Result>;
    // setOwner: (arg_0: Principal) => Promise<undefined>;
    // setYumiOwner: (arg_0: Principal) => Promise<undefined>;
    // transfer: (arg_0: TransferRequest) => Promise<TransferResponse>;
    // wallet_receive: () => Promise<bigint>;
    withdraw: (arg_0: TokenIdentifier) => Promise<TransferResponse>;
}
