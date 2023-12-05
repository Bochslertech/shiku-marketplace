import { Principal } from '@dfinity/principal';

export type AccountIdentifier = string;
// export type AccountIdentifier__1 = string;
// export type CandyValue =
//     | { Int: bigint }
//     | { Nat: bigint }
//     | { Empty: null }
//     | { Nat16: number }
//     | { Nat32: number }
//     | { Nat64: bigint }
//     | { Blob: Array<number> }
//     | { Bool: boolean }
//     | { Int8: number }
//     | { Nat8: number }
//     | { Nats: { thawed: Array<bigint> } | { frozen: Array<bigint> } }
//     | { Text: string }
//     | { Bytes: { thawed: Array<number> } | { frozen: Array<number> } }
//     | { Int16: number }
//     | { Int32: number }
//     | { Int64: bigint }
//     | { Option: [] | [CandyValue] }
//     | { Floats: { thawed: Array<number> } | { frozen: Array<number> } }
//     | { Float: number }
//     | { Principal: Principal }
//     | {
//           Array: { thawed: Array<CandyValue> } | { frozen: Array<CandyValue> };
//       }
//     | { Class: Array<Property> };
// export type Category = string;
// export interface CollectionInit {
//     url: [] | [string];
//     featured: [] | [Img];
//     logo: [] | [Img];
//     name: [] | [string];
//     banner: [] | [Img];
//     description: [] | [string];
//     links: [] | [Links];
//     isVisible: boolean;
//     royalties: Price;
//     category: [] | [Category];
//     standard: Standard;
//     releaseTime: [] | [Time];
//     openTime: [] | [Time];
// }
export type EventId = bigint;
// export interface EventInit {
//     oatReleaseStartTime: Time;
//     eventStartTime: Time;
//     featured: string;
//     camp: bigint;
//     link: string;
//     name: string;
//     description: string;
//     oatReleaseEndTime: Time;
//     canister: Principal;
//     permisson: { wl: null } | { nowl: null };
//     eventEndTime: Time;
//     eventType: { notStart: null } | { ended: null };
// }
// export interface ICPSale {
//     token: TokenSpec;
//     memo: bigint;
//     user: User;
//     price: bigint;
//     retry: bigint;
// }
// export interface ICTokenSpec {
//     fee: bigint;
//     decimals: bigint;
//     canister: Principal;
//     standard: { ICRC1: null } | { EXTFungible: null } | { DIP20: null } | { Ledger: null };
//     symbol: string;
// }
// export type Img = string;
// export interface Links {
//     twitter: [] | [string];
//     instagram: [] | [string];
//     discord: [] | [string];
//     yoursite: [] | [string];
//     telegram: [] | [string];
//     medium: [] | [string];
// }
export interface OatEvent {
    id: bigint;
    oatReleaseStartTime: Time;
    eventStartTime: Time;
    featured: string;
    camp: bigint;
    link: string;
    name: string;
    description: string;
    claimed: bigint;
    oatReleaseEndTime: Time;
    projectId: bigint;
    canister: Principal;
    permisson: { wl: null } | { nowl: null };
    eventEndTime: Time;
    eventType: { notStart: null } | { ended: null };
}
// export interface OgyInfo {
//     fee: { rate: bigint; precision: bigint };
//     creator: Principal;
//     token: TokenSpec__1;
//     owner: Principal;
//     totalFee: { rate: bigint; precision: bigint };
// }
// export interface PageParam {
//     page: bigint;
//     pageCount: bigint;
// }
// export type Price = bigint;
export interface Project {
    id: bigint;
    twitter: [] | [string];
    owner: Principal;
    instagram: [] | [string];
    logo: string;
    name: string;
    banner: string;
    description: string;
    website: [] | [string];
    events: Array<bigint>;
    discord: [] | [string];
    telegram: [] | [string];
    medium: [] | [string];
}
export type ProjectId = bigint;
// export interface ProjectInit {
//     twitter: [] | [string];
//     instagram: [] | [string];
//     logo: string;
//     name: string;
//     banner: string;
//     description: string;
//     website: [] | [string];
//     discord: [] | [string];
//     telegram: [] | [string];
//     medium: [] | [string];
// }
// export interface Property {
//     value: CandyValue;
//     name: string;
//     immutable: boolean;
// }
// export type Result = { ok: Principal } | { err: string };
// export type SettleICPResult =
//     | { ok: null }
//     | {
//           err: { NoSettleICP: null } | { SettleErr: null } | { RetryExceed: null };
//       };
// export type Standard = { ext: null } | { ogy: OgyInfo };
export type Time = bigint;
export type TokenIdentifier = string;
// export interface TokenSpec {
//     fee: bigint;
//     canister: string;
//     decimal: bigint;
//     symbol: string;
// }
// export type TokenSpec__1 = { ic: ICTokenSpec } | { extensible: CandyValue };
// export type User = { principal: Principal } | { address: AccountIdentifier__1 };
export type VerifyResult =
    | { ok: TokenIdentifier }
    | {
          err:
              | { CannotNotify: AccountIdentifier }
              | { InsufficientBalance: null }
              | { TxNotFound: null }
              | { InvalidToken: TokenIdentifier }
              | { Rejected: null }
              | { Unauthorized: AccountIdentifier }
              | { EventNoExist: null }
              | { Other: string }
              | { CollectionNoExist: null };
      };
export default interface _SERVICE {
    // addCanisterController: (arg_0: Principal, arg_1: Principal) => Promise<undefined>;
    // addManager: (arg_0: Array<Principal>) => Promise<undefined>;
    // addOatWhitelist: (arg_0: Array<Principal>) => Promise<undefined>;
    addWhitelist: (arg_0: EventId, arg_1: Array<AccountIdentifier>) => Promise<undefined>;
    // batchSettleICP: (arg_0: Array<bigint>) => Promise<Array<SettleICPResult>>;
    canClaim: (arg_0: EventId) => Promise<boolean>;
    // changeOatTime: (
    //     arg_0: EventId,
    //     arg_1: Time,
    //     arg_2: Time,
    //     arg_3: Time,
    //     arg_4: Time,
    // ) => Promise<boolean>;
    claim: (arg_0: EventId) => Promise<VerifyResult>;
    // clearICPSettlements: (arg_0: Array<bigint>) => Promise<undefined>;
    // createCollection: (arg_0: bigint, arg_1: CollectionInit) => Promise<Result>;
    // createEvent: (arg_0: ProjectId, arg_1: EventInit) => Promise<EventId>;
    // createProject: (arg_0: ProjectInit) => Promise<ProjectId>;
    // delEvent: (arg_0: EventId) => Promise<undefined>;
    // delManager: (arg_0: Array<Principal>) => Promise<undefined>;
    // delOatwhitelist: (arg_0: Array<Principal>) => Promise<undefined>;
    // delProject: (arg_0: ProjectId) => Promise<undefined>;
    // delWhitelist: (arg_0: EventId) => Promise<undefined>;
    // eventAddCamp: (
    //     arg_0: EventId,
    //     arg_1: bigint,
    //     arg_2: string,
    //     arg_3: Time,
    //     arg_4: Time,
    // ) => Promise<boolean>;
    // eventRemoveCamp: (arg_0: EventId, arg_1: bigint) => Promise<boolean>;
    // flushICPSettlement: () => Promise<undefined>;
    // geManager: () => Promise<Array<Principal>>;
    // getCanister: () => Promise<Array<Principal>>;
    // getCollectionRemainingTokens: (arg_0: Principal) => Promise<Array<bigint>>;
    // getConfig: () => Promise<{ owner: Principal; yumi: Principal; record: Principal }>;
    // getEventCost: () => Promise<bigint>;
    getEvents: () => Promise<Array<OatEvent>>;
    getEventsByEventId: (arg_0: Array<EventId>) => Promise<Array<OatEvent>>;
    getEventsByProjectId: (arg_0: ProjectId) => Promise<Array<OatEvent>>;
    // getICPSettlements: () => Promise<Array<[bigint, ICPSale]>>;
    // getOatwhitelist: () => Promise<Array<Principal>>;
    // getProjects: (arg_0: [] | [PageParam]) => Promise<Array<Project>>;
    // getProjectsByPid: (arg_0: Principal) => Promise<[] | [Project]>;
    getProjectsByProjectId: (arg_0: Array<ProjectId>) => Promise<Array<Project>>;
    // getWhoCanister: (arg_0: Principal) => Promise<Array<Principal>>;
    listWhitelist: (arg_0: Principal) => Promise<Array<[AccountIdentifier, bigint]>>;
    // massEnableClaim: (arg_0: EventId, arg_1: Array<bigint>) => Promise<undefined>;
    // migrate_event_img: (arg_0: bigint, arg_1: string) => Promise<undefined>;
    // migrate_project_img: (arg_0: bigint, arg_1: string, arg_2: string) => Promise<undefined>;
    // setEventCost: (arg_0: bigint) => Promise<undefined>;
    // updateEvent: (arg_0: EventId, arg_1: string, arg_2: string, arg_3: string) => Promise<boolean>;
    // updateProject: (arg_0: ProjectId, arg_1: ProjectInit) => Promise<undefined>;
    // withdraw: (arg_0: Principal, arg_1: bigint, arg_2: bigint) => Promise<undefined>;
}
