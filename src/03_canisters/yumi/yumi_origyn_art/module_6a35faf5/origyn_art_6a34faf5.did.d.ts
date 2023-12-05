import type { Principal } from '@dfinity/principal';

// export type AccountIdentifier = string;
// export type AccountIdentifier__1 = string;
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
export interface CollectionMetadata {
    artworkMedium: string;
    artworkDescription: string;
    media: Array<string>;
    artworkList: string;
    artworkSize: string;
    authorPicture: string;
    artworkDetails: string;
    name: string;
    description: string;
    authorBirth: string;
    coverImage: string;
    copyright: string;
    artAuthor: string;
    authorProvenance: string;
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
export interface ICTokenSpec {
    fee: bigint;
    decimals: bigint;
    canister: Principal;
    standard: { ICRC1: null } | { EXTFungible: null } | { DIP20: null } | { Ledger: null };
    symbol: string;
}
export interface ICTokenSpec__1 {
    fee: bigint;
    decimals: bigint;
    canister: Principal;
    standard: { ICRC1: null } | { EXTFungible: null } | { DIP20: null } | { Ledger: null };
    symbol: string;
}
// export interface LogMessagesData {
//     timeNanos: Nanos;
//     message: string;
// }
// export type Nanos = bigint;
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
export interface PrimarySale {
    fee: { rate: bigint; precision: bigint };
    egg_canister: Principal;
    token: ICTokenSpec__1;
    owner: Principal;
    end_time: Time;
    available: bigint;
    threshold_trade: bigint;
    start_time: Time;
    threshold_percentage: bigint;
    fraction_canister: Principal;
    unit_price: bigint;
    volumeTrade: bigint;
    total_supply: bigint;
}
// export interface RecordEventInit {
//     to: [] | [Principal];
//     toAID: [] | [AccountIdentifier];
//     collection: Principal;
//     date: bigint;
//     from: [] | [Principal];
//     item: TokenIdentifier;
//     fromAID: [] | [AccountIdentifier];
//     price: [] | [bigint];
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
// export type Result = { ok: string } | { err: OrigynError };
// export type Result_1 = { ok: Ogy_Token } | { err: OrigynError };
// export type Result_2 = { ok: null } | { err: string };
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
export type Time = bigint;
// export type TokenIdentifier = string;
// export type User = { principal: Principal } | { address: AccountIdentifier__1 };
// export interface YumiPointFee {
//     creator: Principal;
//     rate: bigint;
//     precision: bigint;
// }
export default interface _SERVICE {
    // addCollectionMetadata: (arg_0: Principal, arg_1: CollectionMetadata) => Promise<undefined>;
    // addManager: (arg_0: Array<Principal>) => Promise<undefined>;
    // addMintedNFT: (arg_0: Principal, arg_1: Array<string>) => Promise<undefined>;
    // addOgyCanisters: (arg_0: Array<Principal>) => Promise<undefined>;
    // addPointSettlementV: (arg_0: Array<[Principal, bigint]>) => Promise<undefined>;
    // addPrimarySale: (arg_0: PrimarySale) => Promise<Result_2>;
    // addPrimarySaleBlock: (arg_0: Principal, arg_1: boolean) => Promise<undefined>;
    // addSupportedTokens: (arg_0: Array<ICTokenSpec>) => Promise<undefined>;
    // addWhitelist: (arg_0: Array<Principal>) => Promise<undefined>;
    // batchSettleRecord: (arg_0: Array<bigint>) => Promise<undefined>;
    // buy_primary_nft_origyn: (arg_0: Principal, arg_1: bigint) => Promise<Array<Result_1>>;
    // delManager: (arg_0: Array<Principal>) => Promise<undefined>;
    // delOgyCanisters: (arg_0: Array<Principal>) => Promise<Array<Principal>>;
    // delPrimarySale: (arg_0: Principal) => Promise<undefined>;
    // delwhitelist: (arg_0: Array<Principal>) => Promise<undefined>;
    // flushPointSettlement: () => Promise<undefined>;
    // flushRecordSettlement: () => Promise<undefined>;
    // getCanisterLog: (arg_0: [] | [CanisterLogRequest]) => Promise<[] | [CanisterLogResponse]>;
    // getManager: () => Promise<Array<Principal>>;
    // getOwner: () => Promise<Principal>;
    // getPointSettlements: () => Promise<Array<[bigint, PointSale]>>;
    // getRecordSettlement: () => Promise<Array<[bigint, RecordSettle]>>;
    // getStagedTokens: (arg_0: Principal) => Promise<Array<string>>;
    // getrecordMarks: () => Promise<Array<[Principal, Array<[string, bigint]>]>>;
    // getwhitelist: () => Promise<Array<Principal>>;
    // handleSecondPoint: (arg_0: Principal) => Promise<undefined>;
    listCollections: () => Promise<Array<[Principal, CollectionMetadata]>>;
    // listMintedAndStaged: (
    //     arg_0: Principal,
    // ) => Promise<{ staged: [] | [Array<string>]; minted: [] | [Array<string>] }>;
    listOgyCanisters: () => Promise<Array<Principal>>;
    listPrimarySale: () => Promise<Array<PrimarySale>>;
    listSupportedTokens: () => Promise<Array<ICTokenSpec>>;
    // mintFractionNFTByEggCanister: (
    //     arg_0: Principal,
    //     arg_1: { rate: bigint; precision: bigint },
    // ) => Promise<Array<Result>>;
    // rmSupportedTokens: (arg_0: Array<string>) => Promise<Array<ICTokenSpec>>;
    // setOwner: (arg_0: Principal) => Promise<undefined>;
    // setPointSettlements: (arg_0: bigint, arg_1: Principal, arg_2: bigint) => Promise<undefined>;
    // setYumiPointFee: (arg_0: Principal, arg_1: YumiPointFee) => Promise<undefined>;
    // settlePoint: (arg_0: bigint) => Promise<SettlePointResult>;
    // settleRecord: (arg_0: bigint) => Promise<SettleRecordResult>;
}
