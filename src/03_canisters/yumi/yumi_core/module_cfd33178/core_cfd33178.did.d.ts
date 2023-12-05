import { Principal } from '@dfinity/principal';

export type AccountIdentifier = string;
export type AccountIdentifier__1 = string;
// export type AccountIdentifier__2 = string;
export interface AddCart {
    nftUrl: string;
    tokenIdentifier: TokenIdentifier;
    nftName: string;
}
export interface Auction {
    fee: Fee;
    ttl: bigint;
    highestBidder: [] | [Principal];
    tokenIdentifier: TokenIdentifier__2;
    seller: Principal;
    resevePrice: [] | [Price__2];
    highestPrice: [] | [Price__2];
    startPrice: Price__2;
}
export type BatchTradeResult =
    | {
          ok: { Memo: bigint; Price: bigint };
      }
    | { err: Err__1 };
export type BatchVerifyResult = { ok: Array<TokenIdentifier> } | { err: Err };
// export type BlockIndex = bigint;
export type CandyShared =
    | { Int: bigint }
    | { Map: Array<[CandyShared, CandyShared]> }
    | { Nat: bigint }
    | { Set: Array<CandyShared> }
    | { Nat16: number }
    | { Nat32: number }
    | { Nat64: bigint }
    | { Blob: Array<number> }
    | { Bool: boolean }
    | { Int8: number }
    | { Ints: Array<bigint> }
    | { Nat8: number }
    | { Nats: Array<bigint> }
    | { Text: string }
    | { Bytes: Array<number> }
    | { Int16: number }
    | { Int32: number }
    | { Int64: bigint }
    | { Option: [] | [CandyShared] }
    | { Floats: Array<number> }
    | { Float: number }
    | { Principal: Principal }
    | { Array: Array<CandyShared> }
    | { Class: Array<PropertyShared> };
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
export type Category = string;
export interface CollectionCreatorData {
    bio: string;
    userName: string;
    userId: UserId;
    time: Time;
    avatar: Img__1;
}
export interface CollectionData {
    creator: [] | [CollectionCreatorData];
    info: CollectionInfo__1;
    stats: [] | [CollectionStatsImmut];
}
// export type CollectionErr =
//     | { perMaxCollNum: null }
//     | { guestCannotCreateCollection: null }
//     | { maxCollNum: null };
export interface CollectionFilterArgs {
    creator: [] | [Array<UserId>];
    name: [] | [string];
    category: [] | [Array<string>];
}
// export interface CollectionInfo {
//     url: [] | [string];
//     creator: UserId;
//     featured: [] | [Img__1];
//     logo: [] | [Img__1];
//     name: string;
//     banner: [] | [Img__1];
//     description: [] | [string];
//     links: [] | [Links];
//     isVisible: boolean;
//     royalties: { fee: bigint; precision: bigint };
//     category: [] | [Category];
//     standard: Standard;
//     releaseTime: [] | [Time];
//     canisterId: Principal;
// }
export interface CollectionInfo__1 {
    url: [] | [string];
    creator: UserId;
    featured: [] | [Img__1];
    logo: [] | [Img__1];
    name: string;
    banner: [] | [Img__1];
    description: [] | [string];
    links: [] | [Links];
    isVisible: boolean;
    royalties: { fee: bigint; precision: bigint };
    category: [] | [Category];
    standard: Standard;
    releaseTime: [] | [Time];
    canisterId: Principal;
}
// export interface CollectionInit {
//     url: [] | [string];
//     featured: [] | [Img__1];
//     logo: [] | [Img__1];
//     name: [] | [string];
//     banner: [] | [Img__1];
//     description: [] | [string];
//     links: [] | [Links];
//     isVisible: boolean;
//     royalties: { fee: bigint; precision: bigint };
//     category: [] | [Category];
//     standard: Standard;
//     releaseTime: [] | [Time];
//     openTime: [] | [Time];
// }
export interface CollectionSortFilterArgs {
    filterArgs: CollectionFilterArgs;
    offset: bigint;
    limit: bigint;
    ascending: boolean;
    sortingField: CollectionSortingField;
}
export type CollectionSortingField =
    | { listingNumber: null }
    | { name: null }
    | { createTime: null }
    | { floorPrice: null }
    | { volumeTrade: null };
export interface CollectionStatsImmut {
    listings: Array<Listings>;
    tradeCount: bigint;
    createTime: Time;
    floorPrice: Price__2;
    volumeTrade: Price__2;
}
// export interface CreatorInfo {
//     userName: string;
//     user: UserId__1;
//     canister: Principal;
// }
export interface DealPrice {
    token: TokenSpec;
    price: bigint;
}
export interface DutchAuction {
    fee: Fee;
    startTime: Time;
    token: TokenSpec__3;
    tokenIdentifier: TokenIdentifier__2;
    reduceTime: bigint;
    endTime: Time;
    floorPrice: Price__2;
    seller: Principal;
    reducePrice: Price__2;
    payee: User__2;
    startPrice: Price__2;
}
// export type DutchAuctionResult = { ok: null } | { err: Err__1 };
export type Err =
    | { NotList: null }
    | { NotSell: null }
    | { VerifyTxErr: null }
    | { CannotNotify: AccountIdentifier__1 }
    | { InsufficientBalance: null }
    | { TxNotFound: null }
    | { DuplicateHeight: null }
    | { InvalidToken: TokenIdentifier }
    | { Rejected: null }
    | { Unauthorized: AccountIdentifier__1 }
    | { Other: string };
export type Err__1 =
    | { msgandBidder: [Principal, Principal] }
    | { offerExpired: null }
    | { auctionFail: null }
    | { nftNotAuction: null }
    | { other: [TokenIdentifier__1, string] }
    | { kycNotPass: null }
    | { nftAlreadyListing: null }
    | { notFoundOffer: null }
    | { nftNotlist: null }
    | { nftlockedByOther: null }
    | { amlNotPass: null }
    | { kycorAmlNotPass: null };
export interface Fee {
    platform: { rate: bigint; precision: bigint };
    royalties: { rate: bigint; precision: bigint };
}
export interface Fee__1 {
    platform: { rate: bigint; precision: bigint };
    royalties: { rate: bigint; precision: bigint };
}
export interface Fixed {
    fee: Fee;
    token: TokenSpec__3;
    tokenIdentifier: TokenIdentifier__2;
    seller: Principal;
    price: Price__2;
}
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
//     token: TokenSpec__3;
//     memo: bigint;
//     user: AccountIdentifier__2;
//     price: bigint;
//     retry: bigint;
// }
// export interface ICPSale {
//     token: TokenSpec__3;
//     memo: bigint;
//     user: User__2;
//     price: bigint;
//     retry: bigint;
// }
export interface ICTokenSpec {
    id: [] | [bigint];
    fee: [] | [bigint];
    decimals: bigint;
    canister: Principal;
    standard:
        | { ICRC1: null }
        | { EXTFungible: null }
        | { DIP20: null }
        | { Other: CandyShared }
        | { Ledger: null };
    symbol: string;
}
export type Img = string;
export type Img__1 = string;
// export type Img__2 = string;
export interface Links {
    twitter: [] | [string];
    instagram: [] | [string];
    discord: [] | [string];
    yoursite: [] | [string];
    telegram: [] | [string];
    medium: [] | [string];
}
export type ListResult = { ok: TokenIdentifier__1 } | { err: Err__1 };
export type Listing =
    | { fixed: Fixed }
    | { dutchAuction: DutchAuction }
    | { unlist: null }
    | { auction: Auction };
export interface Listings {
    tokenIdentifier: TokenIdentifier__3;
    price: Price__3;
}
// export interface LogMessagesData {
//     timeNanos: Nanos;
//     message: string;
// }
export interface NFTInfo {
    listing: Listing;
    lastPrice: Price__2;
    listTime: [] | [Time];
    views: bigint;
    favoriters: Array<Principal>;
}
// export type Nanos = bigint;
// export interface NewDutchAuction {
//     startTime: Time;
//     token: TokenSpec__2;
//     tokenIdentifier: TokenIdentifier__1;
//     reduceTime: bigint;
//     endTime: Time;
//     floorPrice: Price__1;
//     reducePrice: Price__1;
//     payee: [] | [User__1];
//     startPrice: Price__1;
// }
export interface NewFixed {
    token: TokenSpec__2;
    tokenIdentifier: TokenIdentifier__1;
    price: Price__1;
}
export interface NewOffer {
    ttl: bigint;
    token: TokenSpec__2;
    tokenIdentifier: TokenIdentifier__1;
    seller: User__1;
    price: Price__1;
    bidder: Principal;
}
export interface NewProfile {
    bio: string;
    userName: string;
    banner: Img;
    notification: Array<string>;
    email: string;
    avatar: Img;
}
export interface Offer {
    ttl: bigint;
    status: OfferStatus;
    token: TokenSpec__2;
    tokenIdentifier: TokenIdentifier__1;
    time: Time;
    seller: User__1;
    price: Price__1;
    offerId: OfferId__1;
    bidder: Principal;
}
export type OfferId = bigint;
export type OfferId__1 = bigint;
export type OfferId__2 = bigint;
export type OfferResult = { ok: OfferId__1 } | { err: Err__1 };
export type OfferStatus =
    | { expired: null }
    | { rejected: null }
    | { ineffect: null }
    | { accepted: null };
export interface OgyInfo {
    fee: { rate: bigint; precision: bigint };
    creator: Principal;
    token: TokenSpec__1;
    owner: Principal;
    totalFee: { rate: bigint; precision: bigint };
}
export interface Order {
    fee: Fee__1;
    token: TokenSpec__2;
    tokenIdentifier: TokenIdentifier__1;
    tradeType: TradeType;
    memo: bigint;
    time: bigint;
    seller: User__1;
    buyer: User__1;
    price: Price__1;
}
// export interface PageParam {
//     page: bigint;
//     pageCount: bigint;
// }
// export interface PointSale {
//     user: User__2;
//     price: bigint;
//     retry: bigint;
// }
export type Price = bigint;
export type Price__1 = bigint;
export type Price__2 = bigint;
export type Price__3 = bigint;
export type ProfileErr = { alreadyCreate: null } | { noProfile: null } | { defaultAccount: null };
export interface ProfileLet {
    bio: string;
    userName: string;
    created: Array<TokenIdentifier__4>;
    favorited: Array<TokenIdentifier__4>;
    userId: UserId__2;
    time: Time;
    banner: Img;
    notification: Array<string>;
    offersReceived: Array<OfferId__2>;
    collections: Array<Principal>;
    email: string;
    collected: Array<TokenIdentifier__4>;
    offersMade: Array<OfferId__2>;
    followeds: Array<UserId__2>;
    followers: Array<UserId__2>;
    avatar: Img;
}
export interface Property {
    value: CandyValue;
    name: string;
    immutable: boolean;
}
export interface PropertyShared {
    value: CandyShared;
    name: string;
    immutable: boolean;
}
// export interface RecordEventInit {
//     to: [] | [Principal];
//     height: bigint;
//     toAID: [] | [AccountIdentifier__2];
//     collection: Principal;
//     date: bigint;
//     from: [] | [Principal];
//     item: TokenIdentifier__2;
//     memo: bigint;
//     fromAID: [] | [AccountIdentifier__2];
//     tokenSymbol: [] | [string];
//     price: [] | [Price__2];
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
// export type Result = { ok: null } | { err: CollectionErr };
// export type Result_1 = { ok: null } | { err: string };
export type Result_2 = { ok: ProfileLet } | { err: ProfileErr };
export type Result_3 = { ok: null } | { err: ProfileErr };
// export type Result_4 = { ok: Principal } | { err: CollectionErr };
export type Result_5 = { ok: TokenIdentifier } | { err: [TokenIdentifier, string] };
// export type Result_6 = { ok: BlockIndex } | { err: string };
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
export interface ShowCart {
    nftUrl: string;
    tokenIdentifier: TokenIdentifier;
    nftName: string;
    price: bigint;
    collectionName: string;
}
export type Standard = { ext: null } | { ogy: OgyInfo };
// export interface StatsListings {
//     tokenIdentifier: TokenIdentifier__3;
//     price: Price__3;
// }
export type Time = bigint;
export type TokenIdentifier = string;
export type TokenIdentifier__1 = string;
export type TokenIdentifier__2 = string;
export type TokenIdentifier__3 = string;
export type TokenIdentifier__4 = string;
export interface TokenSpec {
    fee: bigint;
    canister: string;
    decimal: bigint;
    symbol: string;
}
export type TokenSpec__1 = { ic: ICTokenSpec } | { extensible: CandyValue };
export interface TokenSpec__2 {
    fee: bigint;
    canister: string;
    decimal: bigint;
    symbol: string;
}
export interface TokenSpec__3 {
    fee: bigint;
    canister: string;
    decimal: bigint;
    symbol: string;
}
export type TradeResult = { ok: Order } | { err: Err__1 };
export type TradeType =
    | { fixed: null }
    | { dutchAuction: null }
    | { offer: null }
    | { auction: null };
// export type User = { principal: Principal } | { address: AccountIdentifier };
export type UserId = Principal;
// export type UserId__1 = Principal;
export type UserId__2 = Principal;
export type User__1 = { principal: Principal } | { address: AccountIdentifier };
export type User__2 = { principal: Principal } | { address: AccountIdentifier };
export type VerifyResult = { ok: TokenIdentifier } | { err: Err };
// export interface definite_canister_settings {
//     freezing_threshold: bigint;
//     controllers: [] | [Array<Principal>];
//     memory_allocation: bigint;
//     compute_allocation: bigint;
// }
export default interface _SERVICE {
    // acceptOffer: (arg_0: OfferId) => Promise<Result_6>;
    // addCanisterController: (arg_0: Principal, arg_1: Principal) => Promise<undefined>;
    addCarts: (arg_0: Array<AddCart>) => Promise<Array<Result_5>>;
    // addCreator_whitelist: (arg_0: Array<Principal>) => Promise<undefined>;
    // addSecond_creator_whitelist: (arg_0: Array<Principal>) => Promise<undefined>;
    // add_shikuland_owner: (arg_0: User) => Promise<undefined>;
    // balance: () => Promise<bigint>;
    batchBuyNow: (arg_0: Array<TokenIdentifier>) => Promise<BatchTradeResult>;
    batchSell: (arg_0: Array<NewFixed>) => Promise<Array<ListResult>>;
    // batchSetPointSettlements: (arg_0: Array<[Principal, bigint]>) => Promise<undefined>;
    // batchSetRecordMarks: (arg_0: Principal, arg_1: Array<[string, bigint]>) => Promise<undefined>;
    // batchSettleICP: (arg_0: Array<bigint>) => Promise<Array<SettleICPResult>>;
    // batchSettleICPRefund: (arg_0: Array<bigint>) => Promise<undefined>;
    // batchSettleRecord: (arg_0: Array<bigint>) => Promise<undefined>;
    // batchUpdateProfile: (arg_0: Array<UserId__1>, arg_1: string) => Promise<undefined>;
    batchVerifyTx: (arg_0: bigint) => Promise<BatchVerifyResult>;
    buyNow: (arg_0: TokenIdentifier) => Promise<TradeResult>;
    // cancelOffer: (arg_0: OfferId) => Promise<boolean>;
    // checkOffer: (arg_0: Array<TokenIdentifier>) => Promise<undefined>;
    // checkSubAccountBalance: (arg_0: AccountIdentifier__1, arg_1: TokenSpec) => Promise<bigint>;
    // checkTx: (arg_0: Array<TokenIdentifier>) => Promise<undefined>;
    // collectionStats: (arg_0: Principal) => Promise<
    //     | []
    //     | [
    //           {
    //               listings: Array<StatsListings>;
    //               tradeCount: bigint;
    //               createTime: Time;
    //               floorPrice: Price;
    //               volumeTrade: Price;
    //           },
    //       ]
    // >;
    // common_img_migrate: (
    //     arg_0: Principal,
    //     arg_1: string,
    //     arg_2: string,
    //     arg_3: string,
    // ) => Promise<undefined>;
    // createCollection: (arg_0: CollectionInit) => Promise<Result_4>;
    createProfile: (arg_0: NewProfile) => Promise<Result_3>;
    // createProfile4User: (arg_0: Principal, arg_1: NewProfile) => Promise<Result_3>;
    // created: (arg_0: TokenIdentifier, arg_1: Principal) => Promise<undefined>;
    // dealOffer: (arg_0: Array<TokenIdentifier>) => Promise<undefined>;
    // delCreator_whitelist: (arg_0: Array<Principal>) => Promise<undefined>;
    // delSecond_creator_whitelist: (arg_0: Array<Principal>) => Promise<undefined>;
    // deleteCanister: (arg_0: Principal) => Promise<undefined>;
    // deleteWait: (arg_0: TokenIdentifier) => Promise<undefined>;
    // deleteWaitByHeight: (arg_0: bigint) => Promise<undefined>;
    favorite: (arg_0: TokenIdentifier) => Promise<undefined>;
    findHighOfferByNft: (arg_0: TokenIdentifier) => Promise<[] | [Offer]>;
    // findOfferById: (arg_0: OfferId) => Promise<[] | [Offer]>;
    // findOfferByNft: (arg_0: TokenIdentifier) => Promise<Array<Offer>>;
    // findProfile: () => Promise<Result_2>;
    findProfileWho: (arg_0: User__2) => Promise<Result_2>;
    // flushICPRefundSettlement: () => Promise<undefined>;
    // flushICPSettlement: () => Promise<undefined>;
    // flushPointSettlement: () => Promise<undefined>;
    // flushPriceOfAuction: () => Promise<undefined>;
    // flushRecordSettlement: () => Promise<undefined>;
    // follow: (arg_0: Principal) => Promise<undefined>;
    // getBatchListingByTid: (arg_0: bigint) => Promise<Array<Listing>>;
    // getCanisterLog: (arg_0: [] | [CanisterLogRequest]) => Promise<[] | [CanisterLogResponse]>;
    // getCanisterSettings: (arg_0: Principal) => Promise<definite_canister_settings>;
    getCollectionData: (arg_0: Principal) => Promise<[] | [CollectionData]>;
    // getCollectionDatas: (arg_0: Array<Principal>) => Promise<Array<CollectionData>>;
    // getConfig: () => Promise<{
    //     platformFeeAccount: Principal;
    //     owner: Principal;
    //     lanuchpad: Principal;
    //     block: string;
    //     ledeger: string;
    //     point: Principal;
    //     record: Principal;
    // }>;
    // getCreator_whitelist: () => Promise<Array<Principal>>;
    // getEntRoyalties: () => Promise<Array<[string, string]>>;
    // getICPRefundSettlements: () => Promise<Array<[bigint, ICPRefund]>>;
    // getICPSettlements: () => Promise<Array<[bigint, ICPSale]>>;
    // getListingByHeight: (arg_0: bigint, arg_1: TokenSpec) => Promise<[] | [Listing]>;
    // getListingByTid: (arg_0: bigint) => Promise<[] | [Listing]>;
    // getOfferTids: () => Promise<Array<TokenIdentifier>>;
    // getOwner: () => Promise<Principal>;
    getPayAddress: () => Promise<string>;
    // getPayAddressWho: (arg_0: Principal) => Promise<string>;
    // getPointSettlements: () => Promise<Array<[bigint, PointSale]>>;
    getPriceOfAuction: (arg_0: TokenIdentifier) => Promise<[] | [DealPrice]>;
    // getRecordSettlement: () => Promise<Array<[bigint, RecordSettle]>>;
    // getSecond_creator_whitelist: () => Promise<Array<Principal>>;
    // get_shikuland_owers: () => Promise<Array<User>>;
    // getrecordMarks: () => Promise<Array<[Principal, Array<[string, bigint]>]>>;
    // getrecordMarksByCanister: (arg_0: Principal) => Promise<Array<[string, bigint]>>;
    // handleOrigynActivity: (arg_0: Principal, arg_1: Array<string>) => Promise<undefined>;
    // handleOrigynActivityForBt385: () => Promise<undefined>;
    // importCollection: (arg_0: Principal, arg_1: string, arg_2: CollectionInit) => Promise<Result>;
    // insertListing: (arg_0: Array<Fixed>) => Promise<bigint>;
    // listCollected: () => Promise<Array<TokenIdentifier>>;
    listCollections: () => Promise<Array<string>>;
    listCollections2: (arg_0: [] | [CollectionSortFilterArgs]) => Promise<Array<CollectionData>>;
    // listCreated: () => Promise<Array<TokenIdentifier>>;
    // listCreators: () => Promise<Array<CreatorInfo>>;
    // listFavorite: () => Promise<Array<TokenIdentifier>>;
    listOfferMade: (arg_0: Principal) => Promise<Array<Offer>>;
    // listOfferReceived: (arg_0: Principal) => Promise<Array<Offer>>;
    // listOrigynCollections: () => Promise<Array<Principal>>;
    // listProfile: () => Promise<Array<[string, string, string]>>;
    // listfolloweds: () => Promise<Array<Principal>>;
    // listfollowers: () => Promise<Array<Principal>>;
    makeOffer: (arg_0: NewOffer) => Promise<OfferResult>;
    // migrateCollection: () => Promise<undefined>;
    // migrateListing: () => Promise<undefined>;
    // myCollectionList: () => Promise<Array<CollectionInfo>>;
    // nftInfo: (arg_0: TokenIdentifier) => Promise<NFTInfo>;
    nftInfos: (arg_0: Array<TokenIdentifier>) => Promise<Array<NFTInfo>>;
    // nftInfosByCollection: (arg_0: Principal, arg_1: Array<number>) => Promise<Array<NFTInfo>>;
    // nftInfosByCollectionOgy: (arg_0: Principal, arg_1: Array<string>) => Promise<Array<NFTInfo>>;
    // nftInfosByCollectionPageable: (arg_0: Principal, arg_1: PageParam) => Promise<Array<NFTInfo>>;
    // pageListProfile: (arg_0: PageParam) => Promise<Array<[string, string, string, string, bigint]>>;
    // profileCount: () => Promise<bigint>;
    queryPlatformFee: () => Promise<{
        fee: Price;
        precision: bigint;
        account: AccountIdentifier__1;
    }>;
    // queryPointRatio: () => Promise<bigint>;
    // querySortedCollection: (
    //     arg_0: CollectionSortingField,
    //     arg_1: boolean,
    //     arg_2: bigint,
    //     arg_3: bigint,
    //     arg_4: CollectionFilterArgs,
    // ) => Promise<Array<Principal>>;
    // recordPoint: (arg_0: User, arg_1: Price) => Promise<undefined>;
    // rejectOffer: (arg_0: OfferId) => Promise<Result_1>;
    // rejectOfferByUser: (arg_0: OfferId) => Promise<Result_1>;
    removeCarts: (arg_0: [] | [TokenIdentifier]) => Promise<undefined>;
    // removeCollection: (arg_0: Principal, arg_1: string) => Promise<Result>;
    // removeStatsCollectionList: (
    //     arg_0: Principal,
    //     arg_1: Array<TokenIdentifier>,
    // ) => Promise<undefined>;
    // resetRecordMarks: (arg_0: Principal) => Promise<undefined>;
    // resetTrade: (arg_0: TokenIdentifier) => Promise<undefined>;
    // reset_shikuland_owner: () => Promise<undefined>;
    sell: (arg_0: NewFixed) => Promise<ListResult>;
    // sellDutchAuction: (arg_0: NewDutchAuction) => Promise<DutchAuctionResult>;
    // setEntCollectionRoyalty: (arg_0: string, arg_1: string) => Promise<undefined>;
    // setICPRefundSettlements: (
    //     arg_0: bigint,
    //     arg_1: AccountIdentifier__1,
    //     arg_2: bigint,
    //     arg_3: bigint,
    //     arg_4: TokenSpec,
    // ) => Promise<undefined>;
    // setICPSettlements: (
    //     arg_0: bigint,
    //     arg_1: User,
    //     arg_2: bigint,
    //     arg_3: bigint,
    //     arg_4: TokenSpec,
    // ) => Promise<undefined>;
    // setKycSwitch: (arg_0: boolean) => Promise<undefined>;
    // setMinter: (arg_0: Principal, arg_1: string) => Promise<undefined>;
    // setOwner: (arg_0: Principal) => Promise<undefined>;
    // setPlatformAccount: (arg_0: Principal) => Promise<undefined>;
    // setPlatformFee: (arg_0: bigint, arg_1: bigint) => Promise<undefined>;
    // setPointRatio: (arg_0: bigint) => Promise<undefined>;
    // setPointSettlements: (arg_0: Principal, arg_1: bigint) => Promise<undefined>;
    // setPriceOfAuction: (arg_0: TokenIdentifier, arg_1: DealPrice) => Promise<undefined>;
    // setRateLimit: (arg_0: bigint, arg_1: bigint) => Promise<undefined>;
    // setRateLimitFalse: () => Promise<undefined>;
    // setRecordMarks: (arg_0: Principal, arg_1: string, arg_2: bigint) => Promise<undefined>;
    // setTid: (arg_0: bigint) => Promise<undefined>;
    // setWICP: (arg_0: string) => Promise<undefined>;
    // settleICP: (arg_0: bigint) => Promise<SettleICPResult>;
    // settleICPRefund: (arg_0: bigint) => Promise<SettleICPResult>;
    // settlePoint: (arg_0: bigint) => Promise<SettlePointResult>;
    // settleRecord: (arg_0: bigint) => Promise<SettleRecordResult>;
    showCart: () => Promise<Array<ShowCart>>;
    subscribe: (arg_0: string) => Promise<undefined>;
    unSell: (arg_0: TokenIdentifier) => Promise<ListResult>;
    unfavorite: (arg_0: TokenIdentifier) => Promise<undefined>;
    // unfollow: (arg_0: Principal) => Promise<undefined>;
    // updateAvatar: (arg_0: Principal, arg_1: Img__2) => Promise<boolean>;
    // updateCollection: (arg_0: CollectionInfo) => Promise<boolean>;
    // updateCollectionFloorPrice: (arg_0: Principal) => Promise<undefined>;
    // updateCreators: () => Promise<string>;
    updateOffer: (arg_0: OfferId, arg_1: Price) => Promise<OfferResult>;
    updateProfile: (arg_0: NewProfile) => Promise<boolean>;
    verifyTxWithMemo: (arg_0: bigint, arg_1: TokenSpec) => Promise<VerifyResult>;
    view: (arg_0: TokenIdentifier) => Promise<undefined>;
    // volumeTraded: (arg_0: Principal, arg_1: Price) => Promise<undefined>;
    // wallet_receive: () => Promise<bigint>;
    // withdraw: (
    //     arg_0: AccountIdentifier__1,
    //     arg_1: Price,
    //     arg_2: bigint,
    //     arg_3: TokenSpec,
    // ) => Promise<boolean>;
    // withdrawByAdmin: (arg_0: Principal, arg_1: Price, arg_2: TokenSpec) => Promise<boolean>;
    // withdrawBySubAccount: (arg_0: User, arg_1: Price, arg_2: TokenSpec) => Promise<boolean>;
}
