import { Principal } from '@dfinity/principal';

export interface AllowanceRequest {
    token: string;
    owner: User;
    spender: Principal;
}
export interface ApproveRequest {
    token: string;
    subaccount: [] | [Array<number>];
    allowance: bigint;
    spender: Principal;
}
export type CommonError = { InvalidToken: string } | { Other: string };
export interface Coordinate {
    x: bigint;
    y: bigint;
}
// export type DetailValue =
//     | { I64: bigint }
//     | { U64: bigint }
//     | { Vec: Array<DetailValue> }
//     | { Slice: Array<number> }
//     | { TokenIdU64: bigint }
//     | { Text: string }
//     | { True: null }
//     | { False: null }
//     | { Float: number }
//     | { Principal: Principal };
// export type GenericValue =
//     | { Nat64Content: [] | [bigint] }
//     | { Nat32Content: number }
//     | { BoolContent: boolean }
//     | { Nat8Content: number }
//     | { Int64Content: bigint }
//     | { IntContent: bigint }
//     | { NatContent: bigint }
//     | { Nat16Content: number }
//     | { Int32Content: number }
//     | { Int8Content: number }
//     | { FloatContent: number }
//     | { Int16Content: number }
//     | { BlobContent: Array<number> }
//     | { NestedContent: Array<[string, GenericValue]> }
//     | { AccountIdentifier_Shiku: [] | [string] }
//     | { TextContent: string };
// export interface IndefiniteEvent {
//     operation: string;
//     details: Array<[string, DetailValue]>;
//     caller: Principal;
// }
// export interface InitArgs {
//     cap: [] | [Principal];
//     logo: [] | [string];
//     name: [] | [string];
//     custodians: [] | [Array<Principal>];
//     symbol: [] | [string];
// }
export interface LandProperty {
    id: bigint;
    pos: Coordinate;
    image_url: Array<string>;
    planet: string;
    owner: [] | [string];
    area: string;
    name: string;
    borrower: [] | [string];
    price_for_borrow: bigint;
    land_type: LandType;
    expiration: bigint;
    rent_cycle: bigint;
    dimension: string;
    planet_id: [] | [string];
    number: string;
    land_price: bigint;
    land_status: LandStatus;
    can_borrow: boolean;
}
export type LandStatus = { Status1: null } | { Status2: null };
export type LandType = { Landtype1: null } | { Landtype2: null };
// export interface Listing {
//     locked: [] | [bigint];
//     seller: string;
//     price: bigint;
// }
// export interface MetadataShikuFungibleDetails {
//     decimals: number;
//     metadata: [] | [Array<number>];
//     name: string;
// }
// export interface MetadataShikuNonFungibleDetails {
//     metadata: [] | [Array<number>];
// }
// export interface MintRequest {
//     to: Principal;
//     slotdata: number;
//     land_id: number;
// }
// export interface MintResponse {
//     tokenidx: bigint;
//     metadata: Array<GenericValue>;
//     slotdata: bigint;
// }
// export type NFTResult =
//     | {
//           ok: Array<[number, [] | [Listing], [] | [Array<number>]]>;
//       }
//     | { err: CommonError };
// export type Result = { Ok: TokenMetadata } | { Err: CommonError };
// export type Result_1 = { Ok: MintResponse } | { Err: CommonError };
// export type Result_2 = { ok: bigint } | { err: CommonError };
export type Result__1_1 = { ok: string } | { err: CommonError };
export type Result__1_2 = { ok: bigint } | { err: CommonError };
// export type TokenMetadata =
//     | { fungible: MetadataShikuFungibleDetails }
//     | { nonfungible: MetadataShikuNonFungibleDetails };
export interface TransferRequest {
    to: User;
    token: string;
    notify: boolean;
    from: User;
    memo: Array<number>;
    subaccount: [] | [Array<number>];
    amount: bigint;
}
export type TransferResponse = { ok: bigint } | { err: TransferResponseDetails };
export type TransferResponseDetails =
    | { CannotNotify: string }
    | { InsufficientBalance: null }
    | { InvalidToken: string }
    | { Rejected: null }
    | { Unauthorized: string }
    | { Other: string };
export type User = { principal: Principal } | { address: string };
export default interface _SERVICE {
    // add_land_image_url: (arg_0: bigint, arg_1: string) => Promise<undefined>;
    allowance: (arg_0: AllowanceRequest) => Promise<Result__1_2>;
    approve: (arg_0: ApproveRequest) => Promise<boolean>;
    bearer: (arg_0: string) => Promise<Result__1_1>;
    // clear_minted: () => Promise<undefined>;
    // delete_land_image_url: (arg_0: bigint, arg_1: bigint) => Promise<undefined>;
    // encoded_token: (arg_0: string) => Promise<string>;
    // getAllSlots: () => Promise<Array<[bigint, bigint]>>;
    getMinter: () => Promise<Principal>;
    // getRegistry: () => Promise<Array<[number, string]>>;
    // getTokens: () => Promise<Array<[number, TokenMetadata]>>;
    // getTokensByIds: (arg_0: Array<number>) => Promise<Array<[number, TokenMetadata]>>;
    // get_land_owner: (arg_0: bigint) => Promise<string>;
    // init_land: () => Promise<Array<[bigint, LandProperty]>>;
    // land_image_url: (arg_0: bigint) => Promise<Array<string>>;
    // land_image_url_len: (arg_0: bigint) => Promise<bigint>;
    land_info: () => Promise<Array<[bigint, LandProperty]>>;
    // land_info_by_id: (arg_0: bigint) => Promise<LandProperty>;
    // land_price: (arg_0: bigint) => Promise<bigint>;
    // land_status: (arg_0: bigint) => Promise<LandStatus>;
    // land_type: (arg_0: bigint) => Promise<LandType>;
    // metadata: (arg_0: string) => Promise<Result>;
    // mint: (arg_0: MintRequest) => Promise<Result_1>;
    // minted: () => Promise<Array<bigint>>;
    // pending_transactions: () => Promise<Array<IndefiniteEvent>>;
    // setMinter: (arg_0: Principal) => Promise<undefined>;
    // set_land_image_url: (arg_0: bigint, arg_1: string, arg_2: bigint) => Promise<undefined>;
    // supply: () => Promise<Result_2>;
    // token_identifier: (arg_0: bigint) => Promise<string>;
    // tokens_ext: (arg_0: string) => Promise<NFTResult>;
    transfer: (arg_0: TransferRequest) => Promise<TransferResponse>;
}
