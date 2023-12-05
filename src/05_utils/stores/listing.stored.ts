import { NftListingData } from '@/01_types/listing';
import { NftIdentifier } from '@/01_types/nft';
import { uniqueKey } from '@/02_common/nft/identifier';
import { MemoryStore } from '../stored';

// =============== NFT 上架信息 信息代理缓存 ===============
// ! 内存中保留
// 每次全局更新后，不能把上架信息丢失了
const nft_list_memory = new MemoryStore<NftListingData>(
    1000 * 60 * 60 * 24 * 365, // * 1 年
    false, // 不需要随机
);
export const putMemoryNftListing = (token_id: NftIdentifier, listing: NftListingData) =>
    nft_list_memory.setItem(uniqueKey(token_id), listing);
export const fetchMemoryNftListing = (token_id: NftIdentifier): NftListingData | undefined =>
    nft_list_memory.getItem(uniqueKey(token_id));
export const removeMemoryNftListing = (token_id: NftIdentifier) =>
    nft_list_memory.removeItem(uniqueKey(token_id));
