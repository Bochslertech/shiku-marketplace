import { Principal } from '@dfinity/principal';

// export type AccountIdentifier = string;
export type AccountIdentifier__1 = string;
// export type AccountIdentifier__2 = string;
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
// export type CanisterLogFeature = { filterMessageByContains: null } | { filterMessageByRegex: null };
// export interface CanisterLogMessages {
//     data: Array<LogMessagesData>;
//     lastAnalyzedMessageTimeNanos: [] | [Nanos];
// }
// export interface CanisterLogMessagesInfo {
//     features: Array<[] | [CanisterLogFeature]>;
//     lastTimeNanos: [] | [Nanos];
//     count: number;
//     firstTimeNanos: [] | [Nanos];
// }
// export type CanisterLogRequest =
//     | { getMessagesInfo: null }
//     | { getMessages: GetLogMessagesParameters }
//     | { getLatestMessages: GetLatestLogMessagesParameters };
// export type CanisterLogResponse =
//     | { messagesInfo: CanisterLogMessagesInfo }
//     | { messages: CanisterLogMessages };
// export type CollectionErr =
//     | { perMaxCollNum: null }
//     | { guestCannotCreateCollection: null }
//     | { maxCollNum: null };
export interface CollectionInfo {
    id: Principal;
    faq: Array<{ Question: string; Answer: string }>;
    whitelistTimeStart: Time;
    whitelistTimeEnd: Time;
    featured: string;
    starTime: Time;
    endTime: Time;
    production: string;
    typicalNFTs: Array<{
        TokenIndex: TokenIndex;
        NFTName: string;
        Canister: Principal;
        NFTUrl: string;
    }>;
    name: string;
    team: string;
    banner: string;
    description: string;
    totalSupply: bigint;
    whitelistCount: bigint;
    links: [] | [Links];
    addTime: Time;
    approved: string;
    normalPerCount: [] | [bigint];
    featured_mobile: string;
    index: bigint;
    price: Price;
    teamImage: Array<string>;
    normalCount: bigint;
    whitelistPerCount: bigint;
    standard: Standard;
    whitelistPrice: Price;
    avaliable: bigint;
}
// export type Errors =
//     | { nyi: null }
//     | { storage_configuration_error: null }
//     | { escrow_withdraw_payment_failed: null }
//     | { token_not_found: null }
//     | { owner_not_found: null }
//     | { content_not_found: null }
//     | { auction_ended: null }
//     | { out_of_range: null }
//     | { sale_id_does_not_match: null }
//     | { sale_not_found: null }
//     | { item_not_owned: null }
//     | { property_not_found: null }
//     | { validate_trx_wrong_host: null }
//     | { withdraw_too_large: null }
//     | { content_not_deserializable: null }
//     | { bid_too_low: null }
//     | { nft_sale_not_start: null }
//     | { validate_deposit_wrong_amount: null }
//     | { existing_sale_found: null }
//     | { nft_sale_not_end: null }
//     | { asset_mismatch: null }
//     | { escrow_cannot_be_removed: null }
//     | { deposit_burned: null }
//     | { nft_sale_ended: null }
//     | { cannot_restage_minted_token: null }
//     | { nft_locked: null }
//     | { cannot_find_status_in_metadata: null }
//     | { receipt_data_mismatch: null }
//     | { validate_deposit_failed: null }
//     | { unreachable: null }
//     | { unauthorized_access: null }
//     | { item_already_minted: null }
//     | { no_escrow_found: null }
//     | { escrow_owner_not_the_owner: null }
//     | { improper_interface: null }
//     | { app_id_not_found: null }
//     | { token_non_transferable: null }
//     | { sale_not_over: null }
//     | { update_class_error: null }
//     | { malformed_metadata: null }
//     | { not_enough_nfts: null }
//     | { token_id_mismatch: null }
//     | { id_not_found_in_metadata: null }
//     | { auction_not_started: null }
//     | { library_not_found: null }
//     | { attempt_to_stage_system_data: null }
//     | { validate_deposit_wrong_buyer: null }
//     | { not_enough_storage: null }
//     | { sales_withdraw_payment_failed: null };
// export interface GetLatestLogMessagesParameters {
//     upToTimeNanos: [] | [Nanos];
//     count: number;
//     filter: [] | [GetLogMessagesFilter];
// }
// export interface GetLogMessagesFilter {
//     analyzeCount: number;
//     messageRegex: [] | [string];
//     messageContains: [] | [string];
// }
// export interface GetLogMessagesParameters {
//     count: number;
//     filter: [] | [GetLogMessagesFilter];
//     fromTimeNanos: [] | [Nanos];
// }
// export interface ICPRefund {
//     token: TokenSpec__1;
//     memo: bigint;
//     user: AccountIdentifier__2;
//     price: bigint;
//     retry: bigint;
// }
// export interface ICPSale {
//     token: TokenSpec__1;
//     memo: bigint;
//     user: User;
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
export interface Links {
    twitter: [] | [string];
    instagram: [] | [string];
    discord: [] | [string];
    yoursite: [] | [string];
    telegram: [] | [string];
    medium: [] | [string];
}
// export interface LogMessagesData {
//     timeNanos: Nanos;
//     message: string;
// }
// export type Nanos = bigint;
export interface OgyInfo {
    fee: { rate: bigint; precision: bigint };
    creator: Principal;
    token: TokenSpec;
    owner: Principal;
    totalFee: { rate: bigint; precision: bigint };
}
// export interface Ogy_Token {
//     ogy_canister: Principal;
//     token_id: string;
// }
// export interface OrigynError {
//     text: string;
//     error: Errors;
//     number: number;
//     flag_point: string;
// }
// export interface PointSale {
//     user: User;
//     price: bigint;
//     retry: bigint;
// }
export type Price = bigint;
// export type Price__1 = bigint;
export interface Property {
    value: CandyValue;
    name: string;
    immutable: boolean;
}
// export interface RecordEventInit {
//     to: [] | [Principal];
//     toAID: [] | [AccountIdentifier__2];
//     collection: Principal;
//     date: bigint;
//     from: [] | [Principal];
//     item: TokenIdentifier;
//     memo: bigint;
//     fromAID: [] | [AccountIdentifier__2];
//     tokenSymbol: [] | [string];
//     price: [] | [Price__1];
//     eventType: RecordEventType;
// }
// export type RecordEventType =
//     | { auctionDeal: null }
//     | { dutchAuction: null }
//     | { offer: null }
//     | { list: null }
//     | { claim: null }
//     | { mint: null }
//     | { sold: null }
//     | { acceptOffer: null }
//     | { point: null }
//     | { auction: null }
//     | { transfer: null };
// export interface RecordSettle {
//     retry: bigint;
//     record: RecordEventInit;
// }
export type Result = { ok: bigint } | { err: string };
// export type Result_1 = { ok: null } | { err: CollectionErr };
// export type Result_2 = { ok: Ogy_Token } | { err: OrigynError };
// export type SettleICPResult =
//     | { ok: null }
//     | {
//           err: { NoSettleICP: null } | { SettleErr: null } | { RetryExceed: null };
//       };
// export type SettlePointResult =
//     | { ok: null }
//     | {
//           err: { NoSettlePoint: null } | { SettleErr: null } | { RetryExceed: null };
//       };
// export type SettleRecordResult =
//     | { ok: null }
//     | {
//           err: { NoSettleRecord: null } | { SettleErr: null } | { RetryExceed: null };
//       };
export type Standard = { ext: null } | { ogy: OgyInfo };
export type Time = bigint;
// export type TokenIdentifier = string;
export type TokenIdentifier__1 = string;
export type TokenIndex = number;
export type TokenSpec = { ic: ICTokenSpec } | { extensible: CandyValue };
// export interface TokenSpec__1 {
//     fee: bigint;
//     canister: string;
//     decimal: bigint;
//     symbol: string;
// }
// export type User = { principal: Principal } | { address: AccountIdentifier };
// export type User__1 = { principal: Principal } | { address: AccountIdentifier };
export type VerifyResult =
    | { ok: Array<bigint> }
    | {
          err:
              | { VerifyTxErr: null }
              | { kycNotPass: null }
              | { SoldOut: null }
              | { CannotNotify: AccountIdentifier__1 }
              | { PaymentReturn: null }
              | { VerifyTxErr1: null }
              | { InsufficientBalance: null }
              | { TxNotFound: null }
              | { InvalidToken: TokenIdentifier__1 }
              | { Rejected: null }
              | { Unauthorized: AccountIdentifier__1 }
              | { Other: string }
              | { amlNotPass: null }
              | { CollectionNoExist: null }
              | { kycorAmlNotPass: null };
      };
export default interface _SERVICE {
    // addCreator_whitelist: (arg_0: Array<Principal>) => Promise<Array<Principal>>;
    // addHeights: (arg_0: Array<bigint>) => Promise<undefined>;
    // addSecond_creator_whitelist: (arg_0: Array<Principal>) => Promise<undefined>;
    addWhitelist: (arg_0: Principal, arg_1: Array<AccountIdentifier__1>) => Promise<undefined>;
    // auditCollection: (arg_0: Principal, arg_1: string) => Promise<boolean>;
    // batchSettleICP: (arg_0: Array<bigint>) => Promise<Array<SettleICPResult>>;
    // batchSettleICPRefund: (arg_0: Array<bigint>) => Promise<undefined>;
    // batchSettleRecord: (arg_0: Array<bigint>) => Promise<undefined>;
    // canClaim: (arg_0: Principal, arg_1: bigint) => Promise<boolean>;
    // claim: (arg_0: bigint, arg_1: Principal, arg_2: Price) => Promise<VerifyResult>;
    claimWithHeight: (arg_0: bigint) => Promise<VerifyResult>;
    // claim_origyn: (arg_0: Principal, arg_1: bigint) => Promise<Array<Result_2>>;
    // delCreator_whitelist: (arg_0: Array<Principal>) => Promise<Array<Principal>>;
    // delSecond_creator_whitelist: (arg_0: Array<Principal>) => Promise<undefined>;
    // delWhitelist: (arg_0: Principal) => Promise<undefined>;
    // flushICPRefundSettlement: () => Promise<undefined>;
    // flushICPSettlement: () => Promise<undefined>;
    // flushPointSettlement: () => Promise<undefined>;
    // flushRecordSettlement: () => Promise<undefined>;
    // getCanisterLog: (arg_0: [] | [CanisterLogRequest]) => Promise<[] | [CanisterLogResponse]>;
    getCollection: (arg_0: Principal) => Promise<[] | [CollectionInfo]>;
    // getConfig: () => Promise<{
    //     platformFeeAccount: Principal;
    //     owner: Principal;
    //     ledger: string;
    //     block: string;
    //     point: Principal;
    //     record: Principal;
    // }>;
    // getCreator_whitelist: () => Promise<Array<Principal>>;
    // getHeight: () => Promise<Array<bigint>>;
    // getICPRefundSettlements: () => Promise<Array<[bigint, ICPRefund]>>;
    // getICPSettlements: () => Promise<Array<[bigint, ICPSale]>>;
    // getOwner: () => Promise<Principal>;
    // getPointSettlements: () => Promise<Array<[bigint, PointSale]>>;
    // getRecordSettlement: () => Promise<Array<[bigint, RecordSettle]>>;
    // getSecond_creator_whitelist: () => Promise<Array<Principal>>;
    // getStagedTokens: (arg_0: Principal) => Promise<Array<string>>;
    // importCollection: (arg_0: CollectionInfo) => Promise<Result_1>;
    isWhitelist: (arg_0: Principal) => Promise<Result>;
    listBought: (arg_0: Principal) => Promise<Array<[AccountIdentifier__1, bigint]>>;
    listCollections: () => Promise<Array<CollectionInfo>>;
    // listWhitelist: (arg_0: Principal) => Promise<Array<[AccountIdentifier__1, bigint]>>;
    // massEnableClaim: (arg_0: Principal, arg_1: Array<bigint>) => Promise<undefined>;
    // migrateCollection: () => Promise<undefined>;
    // migrate_img: (arg_0: Array<[Principal, string, string]>) => Promise<undefined>;
    // queryPlatformFee: () => Promise<{
    //     fee: Price;
    //     precision: bigint;
    //     account: AccountIdentifier__1;
    // }>;
    // queryPointRatio: () => Promise<bigint>;
    // remaingTokens: (arg_0: Principal) => Promise<Array<bigint>>;
    // removeCollection: (arg_0: Principal) => Promise<boolean>;
    // rmHeights: (arg_0: Array<bigint>) => Promise<undefined>;
    // setICPRefundSettlements: (
    //     arg_0: bigint,
    //     arg_1: AccountIdentifier__1,
    //     arg_2: bigint,
    //     arg_3: bigint,
    // ) => Promise<undefined>;
    // setICPSettlements: (
    //     arg_0: bigint,
    //     arg_1: User__1,
    //     arg_2: bigint,
    //     arg_3: bigint,
    // ) => Promise<undefined>;
    // setOwner: (arg_0: Principal) => Promise<undefined>;
    // setPlatformAccount: (arg_0: Principal) => Promise<undefined>;
    // setPlatformFee: (arg_0: Price, arg_1: bigint) => Promise<undefined>;
    // setPointRatio: (arg_0: bigint) => Promise<undefined>;
    // setPointSettlements: (arg_0: bigint, arg_1: Principal, arg_2: bigint) => Promise<undefined>;
    // settleICP: (arg_0: bigint) => Promise<SettleICPResult>;
    // settleICPRefund: (arg_0: bigint) => Promise<SettleICPResult>;
    // settlePoint: (arg_0: bigint) => Promise<SettlePointResult>;
    // settleRecord: (arg_0: bigint) => Promise<SettleRecordResult>;
    // updateCollection: (arg_0: CollectionInfo) => Promise<boolean>;
    // withdraw: (arg_0: User, arg_1: Price, arg_2: bigint) => Promise<boolean>;
}
