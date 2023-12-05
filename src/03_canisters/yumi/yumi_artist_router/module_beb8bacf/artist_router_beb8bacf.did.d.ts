import { Principal } from '@dfinity/principal';

export type AccountIdentifier = string;
export type AccountIdentifier__1 = string;
export type CandyValue =
    | { Int: bigint }
    | { Nat: bigint }
    | { Empty: null }
    | { Nat16: number }
    | { Nat32: number }
    | { Nat64: bigint }
    | { Blob: Array<number> }
    | { Bool: boolean }
    | { Int8: number }
    | { Nat8: number }
    | { Nats: { thawed: Array<bigint> } | { frozen: Array<bigint> } }
    | { Text: string }
    | { Bytes: { thawed: Array<number> } | { frozen: Array<number> } }
    | { Int16: number }
    | { Int32: number }
    | { Int64: bigint }
    | { Option: [] | [CandyValue] }
    | { Floats: { thawed: Array<number> } | { frozen: Array<number> } }
    | { Float: number }
    | { Principal: Principal }
    | {
          Array: { thawed: Array<CandyValue> } | { frozen: Array<CandyValue> };
      }
    | { Class: Array<Property> };
export type Category = string;
export interface CollectionInfo {
    url: [] | [string];
    creator: UserId;
    featured: [] | [Img];
    logo: [] | [Img];
    name: string;
    banner: [] | [Img];
    description: [] | [string];
    links: [] | [Links];
    isVisible: boolean;
    royalties: Price;
    category: [] | [Category];
    standard: Standard;
    releaseTime: [] | [Time];
    canisterId: Principal;
}
export interface CollectionInit {
    url: [] | [string];
    featured: [] | [Img];
    logo: [] | [Img];
    name: [] | [string];
    banner: [] | [Img];
    description: [] | [string];
    links: [] | [Links];
    isVisible: boolean;
    royalties: Price;
    category: [] | [Category];
    standard: Standard;
    releaseTime: [] | [Time];
    openTime: [] | [Time];
}
// export interface ICPSale {
//     token: TokenSpec__1;
//     memo: bigint;
//     user: User__1;
//     price: bigint;
//     retry: bigint;
// }
export interface ICTokenSpec {
    fee: bigint;
    decimals: bigint;
    canister: Principal;
    standard: { ICRC1: null } | { EXTFungible: null } | { DIP20: null } | { Ledger: null };
    symbol: string;
}
export type Img = string;
// export interface ImportNFT {
//     result: ImportNFTStatus;
//     applicant: Principal;
//     tokenIdentifier: TokenIdentifier__1;
// }
// export type ImportNFTStatus =
//     | { reject: string }
//     | { pending: null }
//     | { pass: string }
//     | { cancel: string };
export interface Links {
    twitter: [] | [string];
    instagram: [] | [string];
    discord: [] | [string];
    yoursite: [] | [string];
    telegram: [] | [string];
    medium: [] | [string];
}
export interface MintRequest {
    to: User;
    metadata: [] | [Array<number>];
}
export interface Notice {
    id: bigint;
    status: NoticeStatus;
    result: NoticeResult;
    minter: AccountIdentifier__1;
    timestamp: Time;
}
export type NoticeResult = { reject: string } | { accept: TokenIdentifier__1 };
export type NoticeStatus = { readed: null } | { unreaded: null };
export interface OgyInfo {
    fee: { rate: bigint; precision: bigint };
    creator: Principal;
    token: TokenSpec;
    owner: Principal;
    totalFee: { rate: bigint; precision: bigint };
}
// export interface PageParam {
//     page: bigint;
//     pageCount: bigint;
// }
export type Price = bigint;
export interface Property {
    value: CandyValue;
    name: string;
    immutable: boolean;
}
export type Result = { ok: TokenIndex } | { err: string };
export type Result_1 = { ok: Principal } | { err: string };
// export type Result_2 = { ok: null } | { err: string };
// export type SettleICPResult =
//     | { ok: null }
//     | {
//           err: { NoSettleICP: null } | { SettleErr: null } | { RetryExceed: null };
//       };
export type Standard = { ext: null } | { ogy: OgyInfo };
export type Time = bigint;
export type TokenIdentifier = string;
export type TokenIdentifier__1 = string;
export type TokenIndex = number;
export type TokenSpec = { ic: ICTokenSpec } | { extensible: CandyValue };
// export interface TokenSpec__1 {
//     fee: bigint;
//     canister: string;
//     decimal: bigint;
//     symbol: string;
// }
export type User = { principal: Principal } | { address: AccountIdentifier };
export type UserId = Principal;
// export type User__1 = { principal: Principal } | { address: AccountIdentifier };
export default interface _SERVICE {
    // addArtist: (arg_0: Array<Principal>) => Promise<undefined>;
    // addCanisterController: (arg_0: Principal, arg_1: Principal) => Promise<undefined>;
    // addManager: (arg_0: Array<Principal>) => Promise<undefined>;
    // addOperation: (arg_0: Array<Principal>) => Promise<undefined>;
    // applyImportNFT: (arg_0: TokenIdentifier) => Promise<Result_2>;
    // audit: (arg_0: TokenIdentifier, arg_1: boolean, arg_2: string) => Promise<Result_2>;
    // batchSettleICP: (arg_0: Array<bigint>) => Promise<Array<SettleICPResult>>;
    createCollection: (arg_0: CollectionInit) => Promise<Result_1>;
    // delArtist: (arg_0: Array<Principal>) => Promise<undefined>;
    // delManager: (arg_0: Array<Principal>) => Promise<undefined>;
    // delNFT: (arg_0: Array<TokenIdentifier>) => Promise<Result_2>;
    // delOperation: (arg_0: Array<Principal>) => Promise<undefined>;
    // flushICPSettlement: () => Promise<undefined>;
    getArtists: () => Promise<Array<Principal>>;
    // getCollection: () => Promise<[] | [Principal]>;
    getCollectionByPid: (arg_0: Principal) => Promise<[] | [Principal]>;
    // getCollectionInfo: (arg_0: Principal) => Promise<[] | [CollectionInfo]>;
    getCollectionInfos: () => Promise<Array<CollectionInfo>>;
    // getICPSettlements: () => Promise<Array<[bigint, ICPSale]>>;
    // getManager: () => Promise<Array<Principal>>;
    // getMinter: () => Promise<Principal>;
    getNFTCost: () => Promise<bigint>;
    getNotice: () => Promise<Array<Notice>>;
    // getOperations: () => Promise<Array<Principal>>;
    // importCollection: (
    //     arg_0: Principal,
    //     arg_1: Principal,
    //     arg_2: CollectionInfo,
    // ) => Promise<Result_1>;
    // listAllNFT: () => Promise<Array<[TokenIdentifier, ImportNFT]>>;
    listCollections: () => Promise<Array<string>>;
    listNFT: () => Promise<Array<TokenIdentifier>>;
    // listNFTPageable: (arg_0: PageParam) => Promise<Array<TokenIdentifier>>;
    // migrateCollection: () => Promise<undefined>;
    mintNFTWithICP: (arg_0: bigint, arg_1: string, arg_2: MintRequest) => Promise<Result>;
    // setMinter: (arg_0: Principal) => Promise<undefined>;
    // setNFTCost: (arg_0: bigint) => Promise<undefined>;
    setNoticesReaded: (arg_0: Array<bigint>) => Promise<undefined>;
    // updateCollection: (arg_0: Principal, arg_1: CollectionInfo) => Promise<undefined>;
    // withdraw: (arg_0: Principal, arg_1: bigint, arg_2: bigint) => Promise<boolean>;
}
