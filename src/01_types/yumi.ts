import { NftListing } from './listing';
import { NftIdentifier, NftMetadata, NftTokenOwner, TokenInfo, TokenStandard } from './nft';
import { OgyCandyValue_2f2a0ab9 } from './nft-standard/ogy-candy';

// KYC 结果
export type KycResult = {
    principal: string;
    level: 'NA' | 'Tier1' | 'Tier2' | 'Tier3';
    status?: 'pending';
    quota: number;
    used: number;
};

// yumi 集合详细信息中的代币信息
export type CollectionStandardOgyInfoTokenIC = {
    fee?: string; // ? bigint -> string
    decimals: string; // ? bigint -> string
    canister: string; // ? principal -> string
    standard: TokenStandard; // ? simple variant
    symbol: string;
};
// yumi 集合详细信息中的代币信息
export type CollectionStandardOgyInfoToken =
    | { ic: CollectionStandardOgyInfoTokenIC; extensible?: undefined }
    | { ic?: undefined; extensible: OgyCandyValue_2f2a0ab9 };

type CollectionStandardOgyInfo = {
    creator: string; // ? principal -> string
    owner: string; // ? principal -> string
    token: CollectionStandardOgyInfoToken;
    fee: {
        rate: string; // ? bigint -> string
        precision: string; // ? bigint -> string
    };
    totalFee: {
        rate: string; // ? bigint -> string
        precision: string; // ? bigint -> string
    };
};
// yumi 集合详细信息中的代币信息
export type CollectionStandard =
    | { ext: null; ogy?: undefined }
    | { ext?: undefined; ogy: CollectionStandardOgyInfo };

// yumi 集合详细信息中的链接信息
export type CollectionLinks = {
    twitter?: string;
    medium?: string;
    discord?: string;
    website?: string; // yoursite /* Cspell: disable-line */
    instagram?: string;
    telegram?: string;
};

// yumi 集合详细信息
export interface CollectionInfo {
    collection: string; // ? principal -> string // canisterId
    creator: string; // ? principal -> string

    standard: CollectionStandard;
    royalties: string; // ? bigint -> string // 百分比现实, 需要乘以 100
    isVisible: boolean;

    name: string;
    category?: string;
    description?: string;
    featured?: string;
    logo?: string;
    banner?: string;
    links?: CollectionLinks;

    releaseTime?: string; // ? bigint -> string

    url?: string; // ? 说没有用的字段
}

// yumi 集合创建者信息
export type CollectionCreator = {
    userId: string; // ? principal -> string
    username: string;
    avatar: string;
    bio: string;
    time: string; // ? bigint -> string
};

// yumi 集合的上架信息
type Listings = {
    tokenIdentifier: string; // ? token_identifier
    price: string; // ? bigint -> string
};
export type CollectionMetadata = {
    listings: Array<Listings>;
    tradeCount: string; // ? bigint -> string
    createTime: string; // ? bigint -> string
    floorPrice: string; // ? bigint -> string
    volumeTrade: string; // ? bigint -> string
};

// yumi 集合元数据信息
export type CoreCollectionData = {
    info: CollectionInfo;
    creator?: CollectionCreator;
    metadata?: CollectionMetadata;
};

// yumi 集合元数据信息
export type ArtistCollectionData = {
    info: CollectionInfo;
    creator?: CollectionCreator;
    metadata?: CollectionMetadata;
};

// yumi 集合元数据信息
export type UniqueCollectionData = CoreCollectionData | ArtistCollectionData;

// yumi 批量卖出记录
export type BatchNftSale = {
    // 展示需要的字段
    token_id: NftIdentifier;
    card: NftMetadata;
    // 售出需要的字段
    owner: NftTokenOwner;
    token: TokenInfo;
    last: string | undefined; // 上次价格, OGY 需要判断是否已经上架了
    price: string;
    result?: string; // 成功就是 '' // 其他就是错误信息
};

// yumi 购物车
export type ShoppingCartItem = {
    token_id: NftIdentifier;
    card?: NftMetadata;
    listing?: NftListing;
};
