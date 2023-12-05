import { NftTokenMetadata, NftTokenOwner } from '@/01_types/nft';
import { NftTokenScore } from '@/01_types/nft';
import { CccProxyNft } from '@/01_types/nft-standard/ccc';
import { getAllCccProxyNfts } from '../canisters/yumi/ccc_proxy';
import { CombinedStore, MemoryStore } from '../stored';

// 太大的内容不方便交给状态工具管理

// =============== ccc proxy 代理缓存, 属于查询所有者的部分 ===============
// ! 状态工具会异步加载,不能体现出异步读取,因此,独立处理吧
const ccc_proxy_memory = new MemoryStore<CccProxyNft[]>(
    1000 * 5, // * 5 秒
    false, // 不需要随机
);
const cccProxyNftsStored = {
    getItem: (): CccProxyNft[] | undefined => ccc_proxy_memory.getItem(''),
    setItem: (records: CccProxyNft[]) => ccc_proxy_memory.setItem('', records),
};
export const getCccProxyNfts = async (): Promise<CccProxyNft[]> => {
    let cached = cccProxyNftsStored.getItem();
    if (cached === undefined) {
        cached = await getAllCccProxyNfts();
        cccProxyNftsStored.setItem(cached);
    }
    return cached;
};

// =============== token 所有者缓存 ===============
// ! 这里只是为了最初显示而已
// ! 为了防止数据有误,在特别独立的显示内容里,应当从线上获取最新的数据,并缓存
export const collectionTokenOwnersStored = new CombinedStore<NftTokenOwner[]>(
    1000 * 60, // * 最多 60 秒
    true, // 需要随机
    {
        key_name: `__yumi_collection_token_owners_keys__`,
        indexed_key: (collection: string) => `__yumi_collection_token_owners_${collection}__`,
    },
);

// =============== token 元数据缓存 ===============
// ! 这里只是为了最初显示而已
// ! 为了防止数据有误,在特别独立的显示内容里,应当从线上获取最新的数据,并缓存
export const collectionTokenMetadataStored = new CombinedStore<NftTokenMetadata[]>(
    1000 * 3600 * 24 * 7, // * 最多缓存7天
    true, // 需要随机
    {
        key_name: `__yumi_collection_token_metadata_keys__`,
        indexed_key: (collection: string) => `__yumi_collection_token_metadata_${collection}__`,
    },
);

// =============== token 稀有度缓存 ===============
// ! 这里只是为了最初显示而已
// ! 为了防止数据有误,在特别独立的显示内容里,应当从线上获取最新的数据,并缓存
export const collectionTokenScoresStored = new CombinedStore<NftTokenScore[]>(
    1000 * 3600 * 24 * 7, // * 最多缓存7天
    true, // 需要随机
    {
        key_name: `__yumi_collection_token_scores_keys__`,
        indexed_key: (collection: string) => `__yumi_collection_token_scores_${collection}__`,
    },
);
