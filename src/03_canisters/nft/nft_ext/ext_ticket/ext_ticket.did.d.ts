import { Principal } from '@dfinity/principal';

// export interface CanisterStatusResponse {
//     status: CanisterStatusType;
//     memory_size: bigint;
//     cycles: bigint;
//     settings: DefiniteCanisterSettings;
//     idle_cycles_burned_per_day: bigint;
//     module_hash: [] | [Array<number>];
// }
// export type CanisterStatusType = { stopped: null } | { stopping: null } | { running: null };
// export interface CustomHttpRequest {
//     url: string;
//     method: string;
//     body: Array<number>;
//     headers: Array<[string, string]>;
// }
// export interface CustomHttpResponse {
//     body: Array<number>;
//     headers: Array<[string, string]>;
//     status_code: number;
// }
// export interface DefiniteCanisterSettings {
//     freezing_threshold: bigint;
//     controllers: Array<Principal>;
//     memory_allocation: bigint;
//     compute_allocation: bigint;
// }
// export interface ExtAllowanceArgs {
//     token: string;
//     owner: ExtUser;
//     spender: Principal;
// }
// export interface ExtApproveArgs {
//     token: string;
//     subaccount: [] | [Array<number>];
//     allowance: bigint;
//     spender: Principal;
// }
// export interface ExtBalanceArgs {
//     token: string;
//     user: ExtUser;
// }
// export type ExtBatchError = { Error: string };
// export type ExtCommonError = { InvalidToken: string } | { Other: string };
// export interface ExtListing {
//     locked: [] | [bigint];
//     seller: Principal;
//     price: bigint;
// }
// export interface ExtMintArgs {
//     to: ExtUser;
//     metadata: [] | [Array<number>];
// }
// export type ExtTokenMetadata =
//     | {
//           fungible: {
//               decimals: number;
//               metadata: [] | [Array<number>];
//               name: string;
//               symbol: string;
//           };
//       }
//     | { nonfungible: { metadata: [] | [Array<number>] } };
// export interface ExtTransferArgs {
//     to: ExtUser;
//     token: string;
//     notify: boolean;
//     from: ExtUser;
//     memo: Array<number>;
//     subaccount: [] | [Array<number>];
//     amount: bigint;
// }
// export type ExtTransferError =
//     | { CannotNotify: string }
//     | { InsufficientBalance: null }
//     | { InvalidToken: string }
//     | { Rejected: null }
//     | { Unauthorized: string }
//     | { Other: string };
// export type ExtUser = { principal: Principal } | { address: string };
export interface InnerData {
    data: Array<number>;
    headers: Array<[string, string]>;
}
// export interface LimitDuration {
//     end: bigint;
//     start: bigint;
// }
export type MediaData = { Inner: InnerData } | { Outer: OuterData };
// export type MotokoResult = { ok: bigint } | { err: ExtCommonError };
// export type MotokoResult_1 = { ok: Array<MotokoResult> } | { err: ExtBatchError };
// export type MotokoResult_2 = { ok: bigint } | { err: ExtTransferError };
// export type MotokoResult_3 = { ok: string } | { err: ExtCommonError };
// export type MotokoResult_4 = { ok: ExtTokenMetadata } | { err: ExtCommonError };
// export type MotokoResult_5 = { ok: Array<number> } | { err: ExtCommonError };
// export type MotokoResult_6 =
//     | {
//           ok: Array<[number, [] | [ExtListing], [] | [Array<number>]]>;
//       }
//     | { err: ExtCommonError };
// export type MotokoResult_7 = { ok: Array<MotokoResult_2> } | { err: ExtBatchError };
export type NFTOwnable =
    | { Data: Array<number> }
    | { List: Array<NFTOwnable> }
    | { None: null }
    | { Text: string }
    | { Media: MediaData };
export type NftTicketStatus =
    | { Anonymous: [bigint, NFTOwnable] }
    | { NoBody: bigint }
    | { InvalidToken: null }
    | { Owner: [bigint, NFTOwnable] }
    | { Forbidden: bigint };
// export interface NftView {
//     owner: string;
//     name: string;
//     approved: [] | [string];
// }
export interface OuterData {
    url: string;
    headers: Array<[string, string]>;
}
// export interface WalletReceiveResult {
//     accepted: bigint;
// }
export default interface _SERVICE {
    // __get_candid_interface_tmp_hack: () => Promise<string>;
    // allowance: (arg_0: ExtAllowanceArgs) => Promise<MotokoResult>;
    // approve: (arg_0: ExtApproveArgs) => Promise<boolean>;
    // approveAll: (arg_0: Array<ExtApproveArgs>) => Promise<Array<number>>;
    // balance: (arg_0: ExtBalanceArgs) => Promise<MotokoResult>;
    // balance_batch: (arg_0: Array<ExtBalanceArgs>) => Promise<MotokoResult_1>;
    // batchTransfer: (arg_0: Array<ExtTransferArgs>) => Promise<Array<MotokoResult_2>>;
    // bearer: (arg_0: string) => Promise<MotokoResult_3>;
    // calcTokenIdentifier: (arg_0: number) => Promise<string>;
    // canister_status: () => Promise<CanisterStatusResponse>;
    // extensions: () => Promise<Array<string>>;
    // getAllowances: () => Promise<Array<[number, Principal]>>;
    // getMetadata: () => Promise<Array<[number, ExtTokenMetadata]>>;
    // getMinter: () => Promise<Principal>;
    // getProperties: () => Promise<Array<[string, Array<[string, bigint]>]>>;
    // getRegistry: () => Promise<Array<[number, string]>>;
    // getScore: () => Promise<Array<[number, number]>>;
    // getTokens: () => Promise<Array<[number, ExtTokenMetadata]>>;
    // getTokensByIds: (arg_0: Array<number>) => Promise<Array<[number, ExtTokenMetadata]>>;
    // http_request: (arg_0: CustomHttpRequest) => Promise<CustomHttpResponse>;
    // maintainable_is_maintaining: () => Promise<boolean>;
    // maintainable_set_maintaining: (arg_0: boolean) => Promise<undefined>;
    // metadata: (arg_0: string) => Promise<MotokoResult_4>;
    // mintNFT: (arg_0: ExtMintArgs) => Promise<undefined>;
    // nft_get_all_tokens: () => Promise<Array<NftView>>;
    // nft_get_metadata: (arg_0: string, arg_1: number) => Promise<[] | [MediaData]>;
    // nft_get_rarity: (arg_0: string) => Promise<string>;
    // nft_info_get_name: () => Promise<string>;
    // nft_info_get_symbol: () => Promise<string>;
    // nft_info_set_logo: (arg_0: [] | [MediaData]) => Promise<undefined>;
    // nft_info_set_maintaining: (arg_0: [] | [MediaData]) => Promise<undefined>;
    // nft_info_set_name: (arg_0: string) => Promise<undefined>;
    // nft_info_set_symbol: (arg_0: string) => Promise<undefined>;
    // nft_info_set_thumbnail: (arg_0: [] | [MediaData]) => Promise<undefined>;
    // nft_limit_minter_get: () => Promise<Array<LimitDuration>>;
    // nft_limit_minter_set: (arg_0: Array<LimitDuration>) => Promise<undefined>;
    // nft_mint_batch: (
    //     arg_0: ExtMintArgs,
    //     arg_1: [] | [Principal],
    //     arg_2: number,
    //     arg_3: number,
    // ) => Promise<undefined>;
    // nft_set_content: (arg_0: Array<[string, [] | [Array<number>]]>) => Promise<undefined>;
    // nft_set_content_by_token_index: (
    //     arg_0: Array<[number, [] | [Array<number>]]>,
    // ) => Promise<undefined>;
    // nft_set_content_by_url_and_thumbnail: (arg_0: string, arg_1: string) => Promise<undefined>;
    // nft_set_metadata: (arg_0: Array<[string, number, [] | [MediaData]]>) => Promise<undefined>;
    // nft_set_metadata_all: (arg_0: Array<[number, [] | [MediaData]]>) => Promise<undefined>;
    // nft_set_metadata_by_token_index: (
    //     arg_0: Array<[number, number, [] | [MediaData]]>,
    // ) => Promise<undefined>;
    // nft_set_ownable: (arg_0: string, arg_1: NFTOwnable) => Promise<undefined>;
    // nft_set_ownable_all: (arg_0: NFTOwnable) => Promise<undefined>;
    // nft_set_ownable_by_token_index: (arg_0: number, arg_1: NFTOwnable) => Promise<undefined>;
    // nft_set_ownable_by_token_index_batch: (
    //     arg_0: Array<[number, NFTOwnable]>,
    // ) => Promise<undefined>;
    // nft_set_rarity: (arg_0: Array<[string, string]>) => Promise<undefined>;
    // nft_set_rarity_all: (arg_0: string) => Promise<undefined>;
    // nft_set_rarity_by_token_index: (arg_0: Array<[number, string]>) => Promise<undefined>;
    // nft_set_thumbnail: (arg_0: string, arg_1: [] | [MediaData]) => Promise<undefined>;
    // nft_set_thumbnail_all: (arg_0: [] | [MediaData]) => Promise<undefined>;
    // nft_set_thumbnail_by_token_index: (
    //     arg_0: number,
    //     arg_1: [] | [MediaData],
    // ) => Promise<undefined>;
    // nft_set_yumi_traits: (arg_0: Array<[string, string]>) => Promise<boolean>;
    nft_ticket: (arg_0: string) => Promise<NftTicketStatus>;
    // nft_ticket_get_activity: () => Promise<[bigint, bigint]>;
    // nft_ticket_get_transfer_forbidden: () => Promise<Array<LimitDuration>>;
    // nft_ticket_set_activity: (arg_0: bigint, arg_1: bigint) => Promise<undefined>;
    // nft_ticket_set_transfer_forbidden: (arg_0: Array<LimitDuration>) => Promise<undefined>;
    // permission_get_admins: () => Promise<Array<Principal>>;
    // permission_get_minters: () => Promise<Array<Principal>>;
    // permission_is_admin: (arg_0: Principal) => Promise<boolean>;
    // permission_is_minter: (arg_0: Principal) => Promise<boolean>;
    // permission_remove_admin: (arg_0: Principal) => Promise<undefined>;
    // permission_remove_minter: (arg_0: Principal) => Promise<undefined>;
    // permission_set_admin: (arg_0: Principal) => Promise<undefined>;
    // permission_set_minter: (arg_0: Principal) => Promise<undefined>;
    // supply: (arg_0: string) => Promise<MotokoResult>;
    // toAddress: (arg_0: string, arg_1: bigint) => Promise<string>;
    // tokens: (arg_0: string) => Promise<MotokoResult_5>;
    // tokens_ext: (arg_0: string) => Promise<MotokoResult_6>;
    // transfer: (arg_0: ExtTransferArgs) => Promise<MotokoResult_2>;
    // transfer_batch: (arg_0: Array<ExtTransferArgs>) => Promise<MotokoResult_7>;
    // upload_data_by_slice: (arg_0: Array<number>) => Promise<undefined>;
    // upload_data_by_slice_query: (arg_0: number, arg_1: number) => Promise<Array<number>>;
    // wallet_balance: () => Promise<bigint>;
    // wallet_receive: () => Promise<WalletReceiveResult>;
    // whoami: () => Promise<Principal>;
}
