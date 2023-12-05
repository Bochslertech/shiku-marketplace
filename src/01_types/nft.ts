import { NftListingData } from './listing';
import { NftTokenOwnerMetadataCcc } from './nft-standard/ccc';
import { NftTokenOwnerMetadataExt } from './nft-standard/ext';
import { NftTokenOwnerMetadataIcnaming } from './nft-standard/icnaming';
import { NftTokenOwnerMetadataOgy } from './nft-standard/ogy';
import { NftTokenOwnerMetadataShikuLand } from './nft-standard/shiku_land';
import { UniqueCollectionData } from './yumi';

// ===================== 当前支持的 NFT 标准 =====================

// 在 yumi 上架的 NFT
export type YumiListingNftStandard = 'ext' | 'ccc' | 'icnaming' | 'shiku_land';

export type SupportedNftStandard =
    | YumiListingNftStandard
    | 'ogy' // OGY 自带交易所, 必须在该罐子里交易
    | 'ext'; // EXT 也带有交易所, 看情况需不需要使用

// ===================== 涉及金钱就要指明单位 =====================

export type TokenStandard =
    | {
          type: 'Ledger' | 'ICRC1' | 'DIP20' | 'EXTFungible';
          raw?: undefined;
      }
    | {
          type: 'Other';
          raw: string;
      };
export type TokenInfo = {
    id?: string; // ? bigint -> string
    symbol: string;
    canister: string; // ? principal -> string
    standard: TokenStandard;
    decimals: string; // ? bigint -> string
    fee?: string; // ? bigint -> string
};

// ===================== NFT 唯一标识 =====================

export type NftIdentifier = {
    collection: string; // ? principal -> string
    token_identifier: string;
};

// ===================== NFT 所有者 =====================

export type NftTokenOwner = {
    token_id: NftIdentifier;
    owner: string; // account hex
    raw:
        | { standard: 'ext'; data: NftTokenOwnerMetadataExt } // 也许要携带其他信息
        | { standard: 'ccc'; data: NftTokenOwnerMetadataCcc }
        | { standard: 'ogy'; data: NftTokenOwnerMetadataOgy }
        | { standard: 'icnaming'; data: NftTokenOwnerMetadataIcnaming }
        | { standard: 'shiku_land'; data: NftTokenOwnerMetadataShikuLand };
};

// ===================== NFT 元数据 =====================

export type NftMetadataTrait = {
    name: string;
    value: string;
};

// 基本信息
type BasicNftMetadata = {
    name: string; // NFT 名称
    mimeType: string; // NFT 数据类型
    url: string;
    thumb: string; // 缩略图
    description: string; // 描述信息
    traits: NftMetadataTrait[]; // 特征
    onChainUrl: string; // 链上数据
    yumi_traits: NftMetadataTrait[]; // yumi 定义的特征
};

export type NftTokenMetadata = {
    token_id: NftIdentifier;
    metadata: BasicNftMetadata;
    raw: { standard: SupportedNftStandard; data: string };
};

// ===================== NFT 稀有度信息 =====================

export type NftTokenScore = {
    token_id: NftIdentifier;
    score: {
        value: number;
        order: number; // 排序
    };
    raw: { standard: SupportedNftStandard; data?: string };
};

// ===================== NFT 所有信息 =====================

export type NftMetadata = {
    data?: UniqueCollectionData; // 某些 NFT 不需要 data
    owner: NftTokenOwner; // 所有权
    metadata: NftTokenMetadata; // 元数据
    listing?: NftListingData; // 上架信息
    score?: NftTokenScore; // 稀有度信息
};
