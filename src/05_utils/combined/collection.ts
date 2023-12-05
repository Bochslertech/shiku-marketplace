import { NftTokenMetadata, NftTokenOwner, NftTokenScore } from '@/01_types/nft';
import { UniqueCollectionData } from '@/01_types/yumi';
import {
    canisterQueryNftCollectionMetadata,
    canisterQueryNftCollectionScores,
} from '@/04_apis/canister-query/nft/collection';
import {
    queryAllTokenMetadata,
    queryAllTokenOwners,
    queryAllTokenScores,
} from '../canisters/nft/nft';
import {
    collectionTokenMetadataStored,
    collectionTokenOwnersStored,
    collectionTokenScoresStored,
} from '../stores/collection.stored';

// 查询集合所有的 owner
export const getTokenOwners = async (
    collection: string,
    from: 'stored' | 'stored_remote' | 'remote',
): Promise<NftTokenOwner[] | undefined> => {
    switch (from) {
        case 'stored':
            return collectionTokenOwnersStored.getItem(collection);
        case 'stored_remote': {
            let stored = await collectionTokenOwnersStored.getItem(collection);
            if (stored === undefined) {
                stored = await queryAllTokenOwners(collection);
                collectionTokenOwnersStored.setItem(collection, stored);
            }
            return stored;
        }
        case 'remote': {
            const token_owners = await queryAllTokenOwners(collection);
            collectionTokenOwnersStored.setItem(collection, token_owners);
            return token_owners;
        }
    }
    throw new Error(`what a from: ${from}`);
};

// 查询集合所有的 metadata
export const getTokenMetadata = async (
    collection: string,
    option:
        | { from: 'stored'; token_owners: NftTokenOwner[] }
        | { from: 'stored_remote'; token_owners: NftTokenOwner[]; data?: UniqueCollectionData }
        | { from: 'remote'; token_owners: NftTokenOwner[]; data?: UniqueCollectionData },
): Promise<NftTokenMetadata[] | undefined> => {
    switch (option.from) {
        case 'stored': {
            const stored = await collectionTokenMetadataStored.getItem(collection);
            if (stored?.length === option.token_owners.length) return stored; // 长度一致才算有效
            return undefined;
        }
        case 'stored_remote': {
            let stored = await collectionTokenMetadataStored.getItem(collection);
            if (stored === undefined) {
                stored = await canisterQueryNftCollectionMetadata(collection); // ? 从 canister-query 获取
                if (stored) collectionTokenMetadataStored.setItem(collection, stored);
            }
            if (stored?.length !== option.token_owners.length) stored = undefined; // 长度都不对,一定无效
            if (stored === undefined) {
                stored = await queryAllTokenMetadata(collection, option.token_owners, option.data);
                collectionTokenMetadataStored.setItem(collection, stored);
            }
            return stored;
        }
        case 'remote': {
            const data = await queryAllTokenMetadata(collection, option.token_owners, option.data);
            collectionTokenMetadataStored.setItem(collection, data);
            return data;
        }
    }
    throw new Error(`what a option: ${option}`);
};

// 查询集合所有的 scores
export const getTokenScores = async (
    collection: string,
    option:
        | { from: 'stored'; token_owners?: NftTokenOwner[] }
        | { from: 'stored_remote'; token_owners?: NftTokenOwner[] }
        | { from: 'remote' },
): Promise<NftTokenScore[] | undefined> => {
    switch (option.from) {
        case 'stored': {
            const stored = await collectionTokenScoresStored.getItem(collection);
            if (stored?.length === 0) return stored; // * 长度为 0 就是有效,且没有
            if (!option.token_owners || stored?.length === option.token_owners.length)
                return stored; // 长度一致才算有效
            return undefined;
        }
        case 'stored_remote': {
            let stored = await collectionTokenScoresStored.getItem(collection);
            if (stored === undefined) {
                stored = await canisterQueryNftCollectionScores(collection); // ? 从 canister-query 获取
                if (stored) collectionTokenScoresStored.setItem(collection, stored);
            }
            if (stored?.length === 0) return stored; // * 长度为 0 就是有效,且没有
            // ? 下面的判断条件有误, 会出现稀有度个数小于实际 NFT 个数的情况
            // ? 这种情况的 NFT, 只缓存短时间
            // if (option.token_owners && (stored?.length ?? 0) < option.token_owners.length)
            //     stored = undefined; // 缓存的稀有度个数小于实际 NFT 数据, 表明缓存失效
            if (stored === undefined) {
                stored = await queryAllTokenScores(collection);
                // 如果取得的数据个数小于实际 NFT 个数,表明数据不完整, 只能临时使用
                const partial =
                    option.token_owners && stored && stored.length < option.token_owners.length;
                collectionTokenScoresStored.setItem(
                    collection,
                    stored,
                    // 临时使用, 只缓存 5 分钟
                    partial ? Date.now() + 1000 * 60 * 5 : undefined,
                );
            }
            return stored;
        }
        case 'remote': {
            const stored = await queryAllTokenScores(collection);
            collectionTokenScoresStored.setItem(collection, stored);
            return stored;
        }
    }
    throw new Error(`what a option: ${option}`);
};
