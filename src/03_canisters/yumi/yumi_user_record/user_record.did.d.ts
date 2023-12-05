import { Principal } from '@dfinity/principal';

export type AccountIdentifier = string;
export type AccountIdentifier__1 = string;
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
export interface Event {
    to: [] | [Principal];
    toAid: [] | [AccountIdentifier];
    collection: Principal;
    date: Time;
    from: [] | [Principal];
    item: TokenIdentifier;
    memo: bigint;
    fromAid: [] | [AccountIdentifier];
    tokenSymbol: [] | [string];
    index: bigint;
    price: [] | [Price];
    eventType: RecordEventType;
}
// export type EventType =
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
// export interface LogMessagesData {
//     timeNanos: Nanos;
//     message: string;
// }
// export type Nanos = bigint;
export interface PageParam {
    page: bigint;
    pageCount: bigint;
}
export type Price = bigint;
export type RecordEventType =
    | { auctionDeal: null }
    | { dutchAuction: null }
    | { offer: null }
    | { list: null }
    | { claim: null }
    | { mint: null }
    | { sold: null }
    | { acceptOffer: null }
    | { point: null }
    | { auction: null }
    | { transfer: null };
export type Time = bigint;
export type TokenIdentifier = string;
// export type TokenIdentifier__1 = string;
export default interface _SERVICE {
    // addEvent: (
    //     arg_0: EventType,
    //     arg_1: TokenIdentifier__1,
    //     arg_2: [] | [Principal],
    //     arg_3: [] | [Principal],
    //     arg_4: [] | [AccountIdentifier__1],
    //     arg_5: [] | [AccountIdentifier__1],
    //     arg_6: [] | [Price],
    //     arg_7: bigint,
    //     arg_8: Principal,
    //     arg_9: [] | [string],
    //     arg_10: bigint,
    // ) => Promise<undefined>;
    // getBackupEventSize: () => Promise<bigint>;
    // getCanisterLog: (arg_0: [] | [CanisterLogRequest]) => Promise<[] | [CanisterLogResponse]>;
    // getCollectionEvents: (arg_0: Principal) => Promise<[] | [Array<Event>]>;
    // getCollectionEventsPageable: (
    //     arg_0: Principal,
    //     arg_1: PageParam,
    // ) => Promise<[] | [[Array<Event>, bigint]]>;
    // getCollectionEventsSize: (arg_0: Principal) => Promise<[] | [bigint]>;
    // getCollectionEventsWithIndex: (arg_0: Principal, arg_1: bigint) => Promise<[] | [Array<Event>]>;
    // getConfig: () => Promise<{ oat: Principal; yumi: Principal; launchpad: Principal }>;
    // getEventByIndex: (arg_0: bigint) => Promise<Event>;
    // getEventSize: () => Promise<bigint>;
    // getEventsByParam: (arg_0: PageParam) => Promise<[] | [[Array<Event>, bigint]]>;
    // getEventsByRange: (arg_0: bigint, arg_1: bigint) => Promise<[] | [[Array<Event>, bigint]]>;
    // getNftEvents: (arg_0: TokenIdentifier__1) => Promise<[] | [Array<Event>]>;
    // getNftEventsPageable: (
    //     arg_0: TokenIdentifier__1,
    //     arg_1: PageParam,
    // ) => Promise<[] | [[Array<Event>, bigint]]>;
    getUserEvents: (arg_0: AccountIdentifier__1) => Promise<[] | [Array<Event>]>;
    // getUserEventsPageable: (
    //     arg_0: AccountIdentifier__1,
    //     arg_1: PageParam,
    // ) => Promise<[] | [[Array<Event>, bigint]]>;
    // migrateEvent: () => Promise<undefined>;
    // pushBackupEvent: (arg_0: Array<Event>) => Promise<undefined>;
    // recoveryBackupEvent: () => Promise<undefined>;
    // recoveryMapping: (arg_0: bigint, arg_1: bigint) => Promise<undefined>;
    // remove_from_user: (arg_0: Principal) => Promise<undefined>;
    // setIsOpen: (arg_0: Principal) => Promise<undefined>;
    // sortByCollectionEventIndex: () => Promise<undefined>;
    // sortByNFTEventIndex: () => Promise<undefined>;
    // sortByUserEventIndex: () => Promise<undefined>;
}
