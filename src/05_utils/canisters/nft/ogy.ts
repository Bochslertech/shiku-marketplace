import * as ogy from '@/03_canisters/nft/nft_ogy';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftListingData } from '@/01_types/listing';
import { NftIdentifier, NftTokenMetadata, NftTokenOwner, TokenInfo } from '@/01_types/nft';
import { OgyCandyValue_2f2a0ab9, OgyCandyValue_47a7c018 } from '@/01_types/nft-standard/ogy-candy';
import { CoreCollectionData } from '@/01_types/yumi';
import { getYumiOgyBroker } from '@/02_common/nft/ogy';
import {
    OgyCollectionInfo_2f2a0ab9,
    OgyCollectionInfo_be8972b0,
    OgyTokenActive,
    OgyTokenHistory,
} from '@/03_canisters/nft/nft_ogy';
import { anonymous } from '../../connect/anonymous';

// =========================== 查询 OGY 集合信息 ===========================

export const queryCollectionInfoByOgy = async (
    collection: string,
): Promise<
    | OgyCollectionInfo_2f2a0ab9<OgyCandyValue_2f2a0ab9>
    | OgyCollectionInfo_2f2a0ab9<OgyCandyValue_47a7c018>
    | OgyCollectionInfo_be8972b0<OgyCandyValue_2f2a0ab9>
> => {
    return ogy.queryCollectionInfoByOgy(anonymous, collection);
};

// =========================== 查询 OGY 标准的所有 token 的所有者 ===========================

export const queryAllTokenOwnersByIdList = async (
    collection: string,
    id_list: string[] | undefined,
): Promise<NftTokenOwner[]> => {
    return ogy.queryAllTokenOwnersByIdList(anonymous, collection, id_list);
};

// =========================== 查询 OGY 标准的所有 token 的所有者 ===========================

export const queryAllTokenOwnersByOgy = async (collection: string): Promise<NftTokenOwner[]> => {
    return ogy.queryAllTokenOwnersByOgy(anonymous, collection);
};

// =========================== 查询 OGY 标准的所有 token 元数据 ===========================

export const queryAllTokenMetadataByOgy = async (
    collection: string,
    token_owners: NftTokenOwner[],
    _collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata[]> => {
    return ogy.queryAllTokenMetadataByOgy(collection, token_owners, _collection_data);
};

// =========================== 查询 OGY 标准的指定 token 元数据 ===========================

export const querySingleTokenMetadataByOgy = async (
    collection: string,
    token_identifier: string,
    _collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata> => {
    return ogy.querySingleTokenMetadataByOgy(collection, token_identifier, _collection_data);
};

// =========================== 查询 OGY 标准的指定 nft 的所有者 ===========================

export const querySingleTokenOwnerByOgy = async (
    collection: string,
    token_identifier: string,
): Promise<string> => {
    return ogy.querySingleTokenOwnerByOgy(anonymous, collection, token_identifier);
};

// =========================== OGY 标准下架 ===========================

export const retrieveNftFromListingByOgy = async (
    identity: ConnectedIdentity,
    collection: string,
    token_identifier: string,
): Promise<boolean> => {
    return ogy.retrieveNftFromListingByOgy(identity, collection, token_identifier);
};

// =========================== OGY 标准上架 ===========================

export const listingByOgy = async (
    identity: ConnectedIdentity,
    collection: string,
    args: {
        broker_id?: string; // 代理商的 id
        token_identifier: string;
        token: TokenInfo; // 设定的代币信息
        price: string; // 注意是已经乘以单位精度的值
        allow_list?: string[]; // 允许回购的白名单
    },
): Promise<boolean> => {
    return ogy.listingByOgy(identity, collection, args);
};

// =========================== 查询 OGY 标准的指定 nft 的上架信息 ===========================

export const queryTokenListingByOgy = async (
    collection: string,
    token_id_list: NftIdentifier[],
): Promise<NftListingData[]> => {
    return ogy.queryTokenListingByOgy(anonymous, collection, token_id_list, getYumiOgyBroker());
};

// =========================== OGY 查询购买充值地址 ===========================

export const queryRechargeAccountByOgy = async (
    collection: string,
    principal: string, // 谁要购买
): Promise<string> => {
    return ogy.queryRechargeAccountByOgy(anonymous, collection, principal);
};

// =========================== OGY 购买 ===========================

export type BidNftArg = {
    sale_id: string;
    broker_id?: string; // 代理商的 id
    token_identifier: string;
    seller: string; // ? principal -> string
    buyer: string; // ? principal -> string
    token: TokenInfo; // 设定的代币信息
    amount: string; // 使用的代币数量
};

export const bidNftByOgy = async (
    identity: ConnectedIdentity,
    collection: string,
    args: BidNftArg,
): Promise<NftIdentifier> => {
    return ogy.bidNftByOgy(identity, collection, args);
};

// =========================== OGY 批量 购买 ===========================

export const batchBidNftByOgy = async (
    identity: ConnectedIdentity,
    collection: string,
    args: BidNftArg[],
): Promise<NftIdentifier[]> => {
    return ogy.batchBidNftByOgy(identity, collection, args);
};

// =========================== OGY 查询活跃的 token ===========================

export const queryTokenActiveRecordsByOgy = async (collection: string): Promise<OgyTokenActive> => {
    return ogy.queryTokenActiveRecordsByOgy(anonymous, collection);
};

// =========================== OGY 查询 历史记录 ===========================

export const queryTokenHistoryRecordsByOgy = async (
    collection: string,
): Promise<OgyTokenHistory> => {
    return ogy.queryTokenHistoryRecordsByOgy(anonymous, collection);
};

// =========================== OGY 标准 获取铸币人 ===========================

export const queryCollectionNftMinterByOgy = async (
    collection: string,
    token_identifier: string,
): Promise<string> => {
    return ogy.queryCollectionNftMinterByOgy(anonymous, collection, token_identifier);
};
