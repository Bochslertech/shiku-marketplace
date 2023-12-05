import * as nft from '@/03_canisters/nft/nft';
import { NftTokenMetadata, NftTokenOwner, NftTokenScore } from '@/01_types/nft';
import { CoreCollectionData } from '@/01_types/yumi';
import { anonymous } from '../../connect/anonymous';
import { getCccProxyNfts } from '../../stores/collection.stored';

// =========================== 查询所有标准的所有 token 的所有者 ===========================

// 每个标准要用不同的方法
export const queryAllTokenOwners = async (collection: string): Promise<NftTokenOwner[]> => {
    return nft.queryAllTokenOwners(anonymous, collection, getCccProxyNfts);
};

// =========================== 查询所有标准的所有 token 的元数据 ===========================

// 每个标准要用不同的方法
export const queryAllTokenMetadata = async (
    collection: string,
    token_owners: NftTokenOwner[],
    collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata[]> => {
    return nft.queryAllTokenMetadata(anonymous, collection, token_owners, collection_data);
};

// =========================== 查询所有标准的所有 token 的稀有度 ===========================

// 每个标准要用不同的方法
export const queryAllTokenScores = async (collection: string): Promise<NftTokenScore[]> => {
    return nft.queryAllTokenScores(anonymous, collection);
};

// =========================== tokens_ext 查询 EXT 标准的指定 owner 的 token 元数据  ===========================

export const queryOwnerTokenMetadata = async (
    collection: string,
    account: string,
    collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata[]> => {
    return nft.queryOwnerTokenMetadata(anonymous, collection, account, collection_data);
};

// =========================== metadata 查询指定 nft 的 token 元数据  ===========================

export const querySingleTokenMetadata = async (
    collection: string,
    token_identifier: string,
    collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata> => {
    return nft.querySingleTokenMetadata(anonymous, collection, token_identifier, collection_data);
};

// =========================== bearer 查询指定 nft 的所有者 ===========================

export const querySingleTokenOwner = async (
    collection: string,
    token_identifier: string,
): Promise<string> => {
    return nft.querySingleTokenOwner(anonymous, collection, token_identifier);
};

// ===========================  获取铸币人 ===========================

export const queryCollectionNftMinter = async (
    collection: string,
    token_identifier: string,
): Promise<string> => {
    return nft.queryCollectionNftMinter(anonymous, collection, token_identifier);
};
