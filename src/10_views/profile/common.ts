import _ from 'lodash';
import { NftIdentifier, NftMetadata } from '@/01_types/nft';
import { UniqueCollectionData } from '@/01_types/yumi';
import { cdn_by_assets } from '@/02_common/cdn';
import { parseLowerCaseSearch } from '@/02_common/data/search';
import { sortCardsByPrice } from '@/02_common/nft/sort';
import { NFT_OGY_GOLD } from '@/03_canisters/nft/special';
import { getNameByNftMetadata } from '@/05_utils/nft/metadata';
import { FilterCollectionOption } from '@/09_components/nft-card/filter/collections';
import { ROWS } from '@/09_components/nft-card/sliced';

export type ProfileTab = 'collected' | 'created' | 'favorite' | 'activity' | 'auction';

const PROFILE_TABS: ProfileTab[] = ['collected', 'created', 'favorite', 'activity', 'auction'];

export const isValidProfileTab = (tab: string): boolean => PROFILE_TABS.includes(tab as any);

// 用户个人中心展示使用
export type UsedProfile = {
    principal: string | undefined;
    account: string;
    banner: string;
    avatar: string;
    username: string;
    bio: string;
    created: NftIdentifier[]; // 当前账户所创建的 NFT
    favorited: NftIdentifier[]; // 当前账户所收藏的 NFT
};

export type HeaderView = {
    principal: string | undefined;
    account: string;
    banner: string;
    avatar: string;
    username: string;
    bio: string;
};

export const profileToView = (profile: UsedProfile): HeaderView => ({
    principal: profile.principal,
    account: profile.account,
    banner: profile.banner,
    avatar: profile.avatar,
    username: profile.username,
    bio: profile.bio,
});

// 个人中心通过卡片计算过滤的集合
export const setCollectionOptionsByList = (
    wrappedList: NftMetadata[] | undefined,
    collectionDataList: UniqueCollectionData[],
    setCollectionOptions: (options: FilterCollectionOption[]) => void,
) => {
    if (wrappedList === undefined) return;
    const gold: string[] = [];
    const others: string[] = [];
    const options: FilterCollectionOption[] = [];
    for (const card of wrappedList) {
        const collection = card.metadata.token_id.collection;
        const data = collectionDataList.find((d) => d.info.collection === collection);
        if (NFT_OGY_GOLD.includes(collection)) {
            gold.push(collection); // 黄金的放到一起
        } else if (data === undefined) {
            others.push(collection); // 没找到对应的集合,放到 other 里面
        } else {
            const name = data.info.name;
            const logo = data.info.logo ?? cdn_by_assets('/svgs/logo/collection-others.svg')!;
            let index = options.findIndex((o) => o.collection === collection);
            if (index === -1) {
                index = options.length;
                options.push({
                    collection,
                    name,
                    collections: [collection],
                    logo,
                    count: 1,
                });
            } else {
                options[index].count += 1;
            }
        }
    }
    if (gold.length) {
        options.splice(0, 0, {
            collection: 'gold',
            name: 'Gold',
            collections: gold,
            logo: cdn_by_assets('/svgs/logo/collection-yumi-gold.svg')!,
            count: gold.length,
        });
    }
    if (others.length) {
        options.push({
            collection: 'others',
            name: 'Others',
            collections: others,
            logo: cdn_by_assets('/svgs/logo/collection-others.svg')!,
            count: others.length,
        });
    }
    setCollectionOptions(options);
};
// 排序
export type ProfileSortOption = 'price_low_to_high' | 'price_high_to_low' | 'viewed' | 'favorited';
export const PROFILE_SORT_OPTIONS: { value: ProfileSortOption; label: string }[] = [
    { value: 'price_low_to_high', label: 'Price: Low to High' },
    { value: 'price_high_to_low', label: 'Price: High to Low' },
    { value: 'viewed', label: 'Most viewed' },
    { value: 'favorited', label: 'Most favorited' },
];
// 个人中心卡片过滤
export const profileFilterList = (
    wrappedList: NftMetadata[] | undefined,
    openCollectionFilter: boolean,
    collectionOptions: FilterCollectionOption[], // 集合分类
    search: string, // 集合名称过滤
    sort: ProfileSortOption,
    icp_usd: string | undefined,
    ogy_usd: string | undefined,
) => {
    if (wrappedList === undefined) return wrappedList;
    let list = [...wrappedList];
    // 1. 集合过滤
    if (openCollectionFilter && collectionOptions.length) {
        list = list.filter((c) => {
            for (const option of collectionOptions) {
                if (option.collections.includes(c.owner.token_id.collection)) return true;
            }
            return false;
        });
    }
    // 2. 名称过滤
    const s = parseLowerCaseSearch(search);
    if (s) {
        list = list.filter((c) => getNameByNftMetadata(c).toLowerCase().indexOf(s) > -1);
    }
    // 3. 排序
    if (list.length > 1) {
        switch (sort) {
            case 'price_low_to_high':
                list = sortCardsByPrice(list, sort, icp_usd, ogy_usd);
                break;
            case 'price_high_to_low':
                list = sortCardsByPrice(list, sort, icp_usd, ogy_usd);
                break;
            case 'viewed':
                list = _.sortBy(list, [(s) => s.listing?.views && -s.listing.views]);
                break;
            case 'favorited':
                list = _.sortBy(list, [
                    (s) => s.listing?.favorited?.length && -s.listing.favorited.length,
                ]);
                break;
            default:
                break;
        }
    }

    return list;
};

// ? 页面个数计算

export const PROFILE_CARD_SIZE: [number, number][] = [
    [2000, 10 * ROWS],
    [1440, 7 * ROWS],
    [1105, 7 * ROWS],
    [848, 5 * ROWS],
    [0, 2 * ROWS],
];
