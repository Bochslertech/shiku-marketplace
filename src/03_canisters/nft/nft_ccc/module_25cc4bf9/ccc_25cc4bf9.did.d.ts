import { Principal } from '@dfinity/principal';

// export type AirDropResponse =
//     | { ok: CanvasIdentity }
//     | {
//           err:
//               | { AlreadyCliam: null }
//               | { NotInAirDropListOrAlreadyCliam: null }
//               | { NotEnoughToMint: null };
//       };
// export interface AirDropStruct {
//     user: Principal;
//     remainTimes: bigint;
// }
// export interface BuyRequest {
//     tokenIndex: TokenIndex;
//     price: bigint;
//     marketFeeRatio: bigint;
//     feeTo: Principal;
// }
// export type BuyResponse =
//     | { ok: TokenIndex }
//     | {
//           err:
//               | { NotAllowBuySelf: null }
//               | { InsufficientBalance: null }
//               | { AlreadyTransferToOther: null }
//               | { NotFoundIndex: null }
//               | { Unauthorized: null }
//               | { Other: null }
//               | { LessThanFee: null }
//               | { AllowedInsufficientBalance: null };
//       };
// export interface CanvasIdentity {
//     photoLink: [] | [string];
//     videoLink: [] | [string];
//     index: TokenIndex;
// }
// export interface ListRequest {
//     tokenIndex: TokenIndex;
//     price: bigint;
// }
// export type ListResponse =
//     | { ok: TokenIndex }
//     | {
//           err:
//               | { NotApprove: null }
//               | { NotNFT: null }
//               | { NotFoundIndex: null }
//               | { SamePrice: null }
//               | { NotOwner: null }
//               | { Other: null }
//               | { MarketNotOpen: null }
//               | { AlreadyList: null };
//       };
// export interface Listings {
//     tokenIndex: TokenIndex;
//     time: Time;
//     seller: Principal;
//     price: bigint;
// }
// export interface NFTLinkInfo {
//     id: TokenIndex;
//     link: string;
// }
export interface NFTStoreInfo {
    photoLink: [] | [string];
    videoLink: [] | [string];
    index: TokenIndex;
}
// export interface PreMint {
//     user: Principal;
//     index: bigint;
// }
// export interface SoldListings {
//     lastPrice: bigint;
//     time: Time;
//     account: bigint;
// }
// export type Time = bigint;
export type TokenIndex = bigint;
export type TokenIndex__1 = bigint;
export type TransferResponse =
    | { ok: TokenIndex }
    | {
          err:
              | { ListOnMarketPlace: null }
              | { NotAllowTransferToSelf: null }
              | { NotOwnerOrNotApprove: null }
              | { Other: null };
      };
export default interface _SERVICE {
    // approve: (arg_0: Principal, arg_1: TokenIndex__1) => Promise<boolean>;
    // balanceOf: (arg_0: Principal) => Promise<bigint>;
    // batchTransferFrom: (
    //     arg_0: Principal,
    //     arg_1: Array<Principal>,
    //     arg_2: Array<TokenIndex__1>,
    // ) => Promise<TransferResponse>;
    // buyNow: (arg_0: BuyRequest) => Promise<BuyResponse>;
    // cancelFavorite: (arg_0: TokenIndex__1) => Promise<boolean>;
    // cancelList: (arg_0: TokenIndex__1) => Promise<ListResponse>;
    // clearAirDrop: () => Promise<boolean>;
    // cliamAirdrop: () => Promise<AirDropResponse>;
    // deleteAirDrop: (arg_0: Principal) => Promise<boolean>;
    // getAirDropLeft: () => Promise<Array<[Principal, bigint]>>;
    // getAirDropRemain: (arg_0: Principal) => Promise<bigint>;
    // getAirDropStartTime: () => Promise<Time>;
    // getAll: () => Promise<Array<[TokenIndex__1, Principal]>>;
    // getAllHistoryStorageCanisterId: () => Promise<Array<Principal>>;
    // getAllNFT: (arg_0: Principal) => Promise<Array<[TokenIndex__1, Principal]>>;
    // getAllNftCanister: () => Promise<Array<Principal>>;
    // getAllNftPhotoLink: () => Promise<Array<[TokenIndex__1, string]>>;
    // getAllNftVideoLink: () => Promise<Array<[TokenIndex__1, string]>>;
    // getAllUserNFT: (arg_0: Principal) => Promise<Array<NFTStoreInfo>>;
    // getApproved: (arg_0: TokenIndex__1) => Promise<[] | [Principal]>;
    // getAvailableMint: () => Promise<Array<[TokenIndex__1, boolean]>>;
    // getCirculation: () => Promise<bigint>;
    // getCycles: () => Promise<bigint>;
    // getListings: () => Promise<Array<[NFTStoreInfo, Listings]>>;
    // getMarketFeeRatio: () => Promise<bigint>;
    // getMintAccount: () => Promise<bigint>;
    // getNftPhotoLink: (arg_0: TokenIndex__1) => Promise<[] | [string]>;
    // getNftStoreCIDByIndex: (arg_0: TokenIndex__1) => Promise<Principal>;
    // getNftVideoLink: (arg_0: TokenIndex__1) => Promise<[] | [string]>;
    // getOwnerSize: () => Promise<bigint>;
    getRegistry: () => Promise<Array<[Principal, Array<NFTStoreInfo>]>>;
    // getRoyaltyFeeRatio: () => Promise<bigint>;
    getRoyaltyFeeTo: () => Promise<Principal>;
    // getSoldListings: () => Promise<Array<[NFTStoreInfo, SoldListings]>>;
    // getStorageCanisterId: () => Promise<[] | [Principal]>;
    // getSuppy: () => Promise<bigint>;
    // getWICPCanisterId: () => Promise<Principal>;
    // getbOpenMarket: () => Promise<boolean>;
    // isApprovedForAll: (arg_0: Principal, arg_1: Principal) => Promise<boolean>;
    // isList: (arg_0: TokenIndex__1) => Promise<[] | [Listings]>;
    // list: (arg_0: ListRequest) => Promise<ListResponse>;
    // newStorageCanister: (arg_0: Principal) => Promise<boolean>;
    // ownerOf: (arg_0: TokenIndex__1) => Promise<[] | [Principal]>;
    // preMint: (arg_0: Array<PreMint>) => Promise<bigint>;
    // proAvailableMint: () => Promise<boolean>;
    // setAirDropStartTime: (arg_0: Time) => Promise<boolean>;
    // setApprovalForAll: (arg_0: Principal, arg_1: boolean) => Promise<boolean>;
    // setFavorite: (arg_0: TokenIndex__1) => Promise<boolean>;
    // setMarketFeeRatio: (arg_0: bigint) => Promise<boolean>;
    // setMintAccount: (arg_0: bigint) => Promise<boolean>;
    // setNftCanister: (arg_0: Array<Principal>) => Promise<boolean>;
    // setNftPhotoLink: (arg_0: Array<NFTLinkInfo>) => Promise<boolean>;
    // setNftVideoLink: (arg_0: Array<NFTLinkInfo>) => Promise<boolean>;
    // setOwner: (arg_0: Principal) => Promise<boolean>;
    // setRoyaltyFeeTo: (arg_0: Principal) => Promise<boolean>;
    // setRoyaltyfeeRatio: (arg_0: bigint) => Promise<boolean>;
    // setStorageCanisterId: (arg_0: [] | [Principal]) => Promise<boolean>;
    // setWICPCanisterId: (arg_0: Principal) => Promise<boolean>;
    // setbOpenMarket: (arg_0: boolean) => Promise<boolean>;
    transferFrom: (
        arg_0: Principal,
        arg_1: Principal,
        arg_2: TokenIndex__1,
    ) => Promise<TransferResponse>;
    // updateList: (arg_0: ListRequest) => Promise<ListResponse>;
    // uploadAirDropList: (arg_0: Array<AirDropStruct>) => Promise<boolean>;
    // wallet_receive: () => Promise<bigint>;
}
