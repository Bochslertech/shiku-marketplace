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
// export interface AttrStru {
//     attrIds: Array<bigint>;
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
// export interface Component {
//     id: bigint;
//     attribute: ComponentAttribute;
// }
// export interface ComponentAttribute {
//     name: string;
//     traitType: string;
// }
// export interface GetListingsRes {
//     listings: Listings__1;
//     rarityScore: number;
// }
// export interface GetSoldListingsRes {
//     listings: SoldListings;
//     rarityScore: number;
// }
// export type GetTokenResponse = { ok: TokenDetails } | { err: { NotFoundIndex: null } };
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
// export interface Listings__1 {
//     tokenIndex: TokenIndex;
//     time: Time;
//     seller: Principal;
//     price: bigint;
// }
// export type MintResponse =
//     | { ok: Array<CanvasIdentity> }
//     | {
//           err:
//               | { NotOpen: null }
//               | { NotWhiteListOrMaximum: null }
//               | { SoldOut: null }
//               | { InsufficientBalance: null }
//               | { Unauthorized: null }
//               | { Other: null }
//               | { NotEnoughToMint: null }
//               | { LessThanFee: null }
//               | { AllowedInsufficientBalance: null };
//       };
// export interface NFTLinkInfo {
//     id: TokenIndex;
//     photoLink: string;
//     videoLink: string;
// }
// export interface NFTMetaData {
//     id: bigint;
//     attrIds: Array<bigint>;
// }
export interface NFTStoreInfo {
    photoLink: [] | [string];
    videoLink: [] | [string];
    index: TokenIndex;
}
// export type OpenBoxResponse =
//     | { ok: CanvasIdentity }
//     | {
//           err: { NotOpen: null } | { NotOwner: null } | { AlreadyOpen: null };
//       };
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
// export interface TokenDetails {
//     id: bigint;
//     attrArr: Array<ComponentAttribute>;
//     rarityScore: number;
// }
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
    // bBlindBoxOpen: (arg_0: TokenIndex__1) => Promise<boolean>;
    // balanceOf: (arg_0: Principal) => Promise<bigint>;
    // batchTransferFrom: (
    //     arg_0: Principal,
    //     arg_1: Array<Principal>,
    //     arg_2: Array<TokenIndex__1>,
    // ) => Promise<TransferResponse>;
    // buyNow: (arg_0: BuyRequest) => Promise<BuyResponse>;
    // cancelFavorite: (arg_0: TokenIndex__1) => Promise<boolean>;
    // cancelList: (arg_0: TokenIndex__1) => Promise<ListResponse>;
    // checkIfWhiteList: (arg_0: Principal) => Promise<boolean>;
    // clearAirDrop: () => Promise<boolean>;
    // clearPrice: () => Promise<boolean>;
    // clearWhiteList: () => Promise<boolean>;
    // cliamAirdrop: () => Promise<AirDropResponse>;
    // deleteAirDrop: (arg_0: Principal) => Promise<boolean>;
    // getAirDropLeft: () => Promise<Array<[Principal, bigint]>>;
    // getAirDropRemain: (arg_0: Principal) => Promise<bigint>;
    // getAirDropStartTime: () => Promise<Time>;
    // getAll: () => Promise<Array<[TokenIndex__1, Principal]>>;
    // getAllComponent: () => Promise<Array<[TokenIndex__1, Component]>>;
    // getAllHistoryStorageCanisterId: () => Promise<Array<Principal>>;
    // getAllNFT: (arg_0: Principal) => Promise<Array<[TokenIndex__1, Principal]>>;
    // getAllNftCanister: () => Promise<Array<Principal>>;
    // getAllNftLinkInfo: () => Promise<Array<[TokenIndex__1, NFTLinkInfo]>>;
    // getAllTokens: () => Promise<Array<[TokenIndex__1, NFTMetaData]>>;
    // getAllUserNFT: (arg_0: Principal) => Promise<Array<NFTStoreInfo>>;
    // getApproved: (arg_0: TokenIndex__1) => Promise<[] | [Principal]>;
    // getAvailableMint: () => Promise<Array<[TokenIndex__1, boolean]>>;
    // getBlindBoxLink: () => Promise<[string, string]>;
    // getBlindTime: () => Promise<[Time, Time]>;
    // getCirculation: () => Promise<bigint>;
    // getComponentById: (arg_0: TokenIndex__1) => Promise<[] | [Component]>;
    // getComponentsSize: () => Promise<bigint>;
    // getCycles: () => Promise<bigint>;
    // getLinkInfoByIndex: (arg_0: TokenIndex__1) => Promise<[[] | [string], [] | [string]]>;
    // getLinkInfoByIndexArr: (
    //     arg_0: Array<TokenIndex__1>,
    // ) => Promise<Array<[[] | [string], [] | [string]]>>;
    // getListings: () => Promise<Array<[NFTStoreInfo, GetListingsRes]>>;
    // getListingsByAttr: (arg_0: Array<AttrStru>) => Promise<Array<[NFTStoreInfo, Listings]>>;
    // getMaxMarketFeeRatio: () => Promise<bigint>;
    // getMintAccount: () => Promise<bigint>;
    // getMintPrice: () => Promise<Array<[bigint, bigint]>>;
    // getNftHoldInfo: () => Promise<Array<[Principal, bigint]>>;
    // getNftLinkInfo: (arg_0: TokenIndex__1) => Promise<[] | [NFTLinkInfo]>;
    // getNftStoreCIDByIndex: (arg_0: TokenIndex__1) => Promise<Principal>;
    // getOpenTime: () => Promise<[Time, Time]>;
    // getOwnerSize: () => Promise<bigint>;
    getRegistry: () => Promise<Array<[Principal, Array<NFTStoreInfo>]>>;
    // getRoyaltyFeeRatio: () => Promise<bigint>;
    getRoyaltyFeeTo: () => Promise<Principal>;
    // getSaleInfo: () => Promise<[bigint, bigint]>;
    // getSoldListings: () => Promise<Array<[NFTStoreInfo, GetSoldListingsRes]>>;
    // getStorageCanisterId: () => Promise<[] | [Principal]>;
    // getSuppy: () => Promise<bigint>;
    // getTokenById: (arg_0: bigint) => Promise<GetTokenResponse>;
    // getWICPCanisterId: () => Promise<Principal>;
    // getWhiteList: () => Promise<Array<[Principal, bigint]>>;
    // getWhiteListPrice: (arg_0: Principal) => Promise<Array<[bigint, bigint]>>;
    // getbOpenMarket: () => Promise<boolean>;
    // isApprovedForAll: (arg_0: Principal, arg_1: Principal) => Promise<boolean>;
    // isList: (arg_0: TokenIndex__1) => Promise<[] | [Listings]>;
    // list: (arg_0: ListRequest) => Promise<ListResponse>;
    // mint: (arg_0: bigint) => Promise<MintResponse>;
    // newStorageCanister: (arg_0: Principal) => Promise<boolean>;
    // openBlindBox: (arg_0: TokenIndex__1) => Promise<OpenBoxResponse>;
    // ownerOf: (arg_0: TokenIndex__1) => Promise<[] | [Principal]>;
    // preMint: (arg_0: Array<PreMint>) => Promise<bigint>;
    // proAvailableMint: () => Promise<boolean>;
    // setAirDropStartTime: (arg_0: Time) => Promise<boolean>;
    // setApprovalForAll: (arg_0: Principal, arg_1: boolean) => Promise<boolean>;
    // setBlindBoxLink: (arg_0: NFTLinkInfo) => Promise<boolean>;
    // setCapacity: (arg_0: bigint) => Promise<boolean>;
    // setFavorite: (arg_0: TokenIndex__1) => Promise<boolean>;
    // setMaxMarketFeeRatio: (arg_0: bigint) => Promise<boolean>;
    // setMintAccount: (arg_0: bigint) => Promise<boolean>;
    // setMintFeeRatio: (arg_0: bigint) => Promise<boolean>;
    // setMintPrice: (arg_0: Array<[bigint, bigint]>) => Promise<boolean>;
    // setNftCanister: (arg_0: Array<Principal>) => Promise<boolean>;
    // setNftLinkInfo: (arg_0: Array<NFTLinkInfo>) => Promise<boolean>;
    // setOwner: (arg_0: Principal) => Promise<boolean>;
    // setRoyaltyFeeTo: (arg_0: Principal) => Promise<boolean>;
    // setRoyaltyfeeRatio: (arg_0: bigint) => Promise<boolean>;
    // setStorageCanisterId: (arg_0: [] | [Principal]) => Promise<boolean>;
    // setSuppy: (arg_0: bigint) => Promise<boolean>;
    // setTime: (arg_0: Array<Time>) => Promise<boolean>;
    // setWICPCanisterId: (arg_0: Principal) => Promise<boolean>;
    // setWhiteListPrice: (arg_0: Array<[bigint, bigint]>) => Promise<boolean>;
    // setbOpenMarket: (arg_0: boolean) => Promise<boolean>;
    transferFrom: (
        arg_0: Principal,
        arg_1: Principal,
        arg_2: TokenIndex__1,
    ) => Promise<TransferResponse>;
    // updateList: (arg_0: ListRequest) => Promise<ListResponse>;
    // uploadAirDropList: (arg_0: Array<AirDropStruct>) => Promise<boolean>;
    // uploadComponents: (arg_0: Array<Component>) => Promise<boolean>;
    // uploadNftMetaData: (arg_0: Array<NFTMetaData>) => Promise<boolean>;
    // uploadOGWhiteList: (arg_0: Array<Principal>) => Promise<boolean>;
    // uploadWhiteList: (arg_0: Array<Principal>) => Promise<boolean>;
    // wallet_receive: () => Promise<bigint>;
    // whiteListMint: (arg_0: bigint) => Promise<MintResponse>;
}
