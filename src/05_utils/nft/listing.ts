import { NftListingData } from '@/01_types/listing';
import { NftIdentifier, SupportedNftStandard, YumiListingNftStandard } from '@/01_types/nft';
import { uniqueKey } from '@/02_common/nft/identifier';
import { queryTokenListingByOgy } from '../canisters/nft/ogy';
import { queryTokenListing } from '../canisters/yumi/core';
import { putMemoryNftListing } from '../stores/listing.stored';

// 取出第一个数据
const first = (list: NftListingData[]): NftListingData => {
    if (list.length) return list[0];
    else throw new Error(`wrong length of queryNftListingData result`);
};

// 查询单个 NFT 的上架信息
export const queryNftListingData = async (
    standard: SupportedNftStandard,
    token_id: NftIdentifier,
): Promise<NftListingData> => {
    const listing = await (async () => {
        // ogy的需要单独查
        if (standard === 'ogy') {
            return queryTokenListingByOgy(token_id.collection, [token_id]).then(first);
        }
        return queryTokenListing([token_id]).then(first);
    })();
    putMemoryNftListing(token_id, listing);
    return listing;
};

type BatchOgy = {
    standard: 'ogy';
    collection: string;
    token_id_list: NftIdentifier[]; // 必须同为 collection 的 NFT
};

type BatchYumi = {
    standard: YumiListingNftStandard;
    token_id_list: NftIdentifier[]; // 其他的不需要 collection
};
const querySingleCollectionNftListingDataByList = async (
    args: BatchOgy | BatchYumi,
): Promise<NftListingData[]> => {
    const listing_list = await (async () => {
        // ogy的需要单独查
        if (args.standard === 'ogy') {
            return queryTokenListingByOgy(args.collection, args.token_id_list);
        }
        return queryTokenListing(args.token_id_list);
    })();
    listing_list.forEach((listing) => putMemoryNftListing(listing.token_id, listing));
    return listing_list;
};

// 返回的值是个对象, key 是 uniqueKey(token_id) 值是对应的 listing
export const queryNftListingDataByList = async (
    list: {
        standard: SupportedNftStandard;
        token_id: NftIdentifier;
    }[],
): Promise<Record<string, NftListingData>> => {
    if (list.length === 0) return {};
    // 1. 先进行分类
    // OGY 的要分集合,单独一组
    // 其他的可以一组
    const chunks: Record<SupportedNftStandard, Record<string, NftIdentifier[]>> = {} as any;
    for (const item of list) {
        if (!chunks[item.standard]) chunks[item.standard] = {};
        chunks[item.standard][item.token_id.collection] = (
            chunks[item.standard][item.token_id.collection] || []
        ).concat(item.token_id);
    }
    const args_list_ogy: BatchOgy[] = [];
    const args_list_yumi: BatchYumi[] = [];
    for (const [standard, collection_map] of Object.entries(chunks)) {
        if (standard === 'ogy') {
            for (const [collection, token_id_list] of Object.entries(collection_map)) {
                args_list_ogy.push({
                    standard: 'ogy',
                    collection,
                    token_id_list,
                });
            }
        } else {
            for (const token_id_list of Object.values(collection_map)) {
                args_list_yumi.push({
                    standard: standard as YumiListingNftStandard,
                    token_id_list,
                });
            }
        }
    }
    // 2. 分别查询
    const result: Record<string, NftListingData> = {};
    const results = await Promise.all(
        [...args_list_ogy, ...args_list_yumi].map(querySingleCollectionNftListingDataByList),
    );
    for (const r of results) {
        for (const item of r) {
            result[uniqueKey(item.token_id)] = item;
        }
    }
    return result;
};
