import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash';
import { NftIdentifier } from '@/01_types/nft';
import { parse_nft_identifier, parse_token_identifier } from '@/02_common/nft/ext';
import { isYumiSpecialCollection } from '@/02_common/yumi';

dayjs.extend(utc);
dayjs.extend(timezone);

// =================== 首页 banner ===================

export type HomeBanner = {
    name: string;
    image: string;
    link:
        | {
              type: 'outside';
              url: string; // 任意 url 链接,全路径
              target?: '_blank'; // 是否新页面打开
          }
        | {
              type: 'market';
              collection: string; // 集合的罐子 id
              target?: '_blank'; // 是否新页面打开
          }
        | {
              type: 'launchpad';
              collection: string; // 集合的罐子 id
              target?: '_blank'; // 是否新页面打开
          };
};

export const queryHomeBanners = async (backend_host: string): Promise<HomeBanner[]> => {
    const r = await fetch(`${backend_host}/new_config/home_banner.json?v=${Date.now()}`);
    const json = await r.json();
    // console.debug(`🚀 ~ file: aws.ts:14 ~ queryHomeBanners ~ json:`, json);
    return json;
};

// =================== 首页 热门 NFT 集合 ===================

export type HomeHotCollection = {
    info: {
        collection: string; // ? canisterId ->
        name: string;
        description: string;
        logo: string;
        banner: string;
        featured: string;
    };
    // creator: string; // 简化
    // creator: {
    //     userId: string;
    //     userName: string; // 用不上
    //     avatar: string; // 用不上
    // };
    // stats: {
    //     floorPrice: number;
    //     volumeTrade: number;
    // };
};

export const queryHomeHotCollections = async (
    backend_host: string,
): Promise<HomeHotCollection[]> => {
    const r = await fetch(`${backend_host}/config/hot_collection.json?v=${Date.now()}`);
    const json = await r.json();
    // console.debug(`🚀 ~ file: aws.ts:63 ~ queryHomeHotCollections ~ json:`, json);
    return json.map((d: any) => ({
        info: {
            collection: d.info.canisterId,
            name: d.info.name,
            description: d.info.description,
            logo: d.info.logo,
            banner: d.info.banner,
            featured: d.info.featured,
        },
        // creator: d.creator.userId,
        // stats: {
        //     floorPrice: d.stats.floorPrice,
        //     volumeTrade: d.stats.volumeTrade,
        // },
    }));
};

// =================== 首页 热门 NFT 集合 ===================

export type HomeFeaturedArtwork = {
    token_id: NftIdentifier;
    metadata: {
        metadata: {
            name: string;
            url: string;
            description: string;
        };
    };
    creator: {
        principal: string;
        username: string;
        avatar: string;
    };
};

export const queryHomeFeaturedArtworks = async (
    backend_host: string,
): Promise<HomeFeaturedArtwork[]> => {
    const r = await fetch(`${backend_host}/config/featured_artwork_30day.json?v=${Date.now()}`);
    const json = await r.json();
    // console.debug(`🚀 ~ file: aws.ts:63 ~ queryHomeFeaturedArtworks ~ json:`, json);
    return json.map((d: any) => ({
        token_id: {
            collection: d.collectionData.canisterId,
            token_identifier: parse_token_identifier(
                d.collectionData.canisterId,
                d.collectionData.tokenIndex,
            ),
        },
        metadata: {
            metadata: {
                name: d.metadata.name,
                url: d.metadata.url,
                description: d.metadata.description,
            },
        },
        creator: {
            principal: d.creator.userId,
            username: d.creator.userName,
            avatar: d.creator.avatar,
        },
    }));
};

// =================== 查询指定集合的地板价 ===================

export type CollectionStatistics = {
    supply: number; // 总供应量
    owners: number; // 所有者个数
    floor: string; // 地板价
    volume: string; // 总成交量
};

export const getCollectionStatistics = async (
    backend_host: string,
    collection: string,
): Promise<CollectionStatistics | undefined> => {
    return new Promise((resolve, reject) => {
        fetch(
            `${backend_host}/statistics/collection/${collection}_${dayjs()
                .utcOffset(0)
                .format('YYYY-MM-DD')}.json`,
        )
            .then((r) => r.json())
            .then((json) => {
                resolve({
                    supply: json.items,
                    owners: json.owner,
                    floor: `${json.floorPrice}`,
                    volume: `${json.volumeTrade}`,
                });
            })
            .catch((e) => {
                console.error('getCollectionStatistics failed', collection, e);
                if ('Unexpected token ' < ', "<?xml vers"... is not valid JSON' === e.message) {
                    return resolve(undefined);
                }
                reject(e);
            });
    });
};

// ================================= 某 NFT 集合的历史成交记录 =================================

export type CollectionEvent = {
    index: number; // 序号号
    created: string; // 创建时间 // ! 纳秒 // date
    collection: string; // ? principal -> string
    token_identifier: string; // item
    type:
        | 'sold' // 卖出
        | 'claim'; // 铸币 // eventType
    from: string; // ? principal -> string
    to: string; // ? principal -> string
    price: string; // 价格
};

export const queryCollectionsEvents = async (
    backend_host: string,
    collection: string,
): Promise<CollectionEvent[]> => {
    const r = await fetch(`${backend_host}/activity/collection/${collection}.json?v=${Date.now()}`);
    const json = await r.json();

    return json.map((d: any) => ({
        index: d.index,
        created: d.date,
        collection: d.collection,
        token_identifier: d.item,
        type: d.eventType,
        from: d.from,
        to: d.to,
        price: `${d.price}`,
    }));
};

// ================================= 某 NFT 的历史成交记录 =================================

export type CollectionNftEvent = {
    index: number; // 序号号
    created: string; // 创建时间 // ! 纳秒 // date
    collection: string; // ? principal -> string
    token_identifier: string; // item
    type:
        | 'sold' // 卖出
        | 'claim'; // 铸币 // eventType
    from: string; // ? principal -> string
    to: string; // ? principal -> string
    price: string; // 价格
};

export const queryCollectionNftEvents = async (
    backend_host: string,
    token_id: NftIdentifier,
): Promise<CollectionNftEvent[]> => {
    const r = await fetch(
        `${backend_host}/activity/${token_id.collection}/token/${
            token_id.token_identifier
        }.json?v=${Date.now()}`,
    );
    const json = await r.json();
    // console.warn(`🚀 ~ file: kyc.ts:13 ~ queryCollectionNftEvents ~ json:`, json);
    return json.map((d: any) => ({
        index: d.index,
        created: d.date,
        collection: d.collection,
        token_identifier: d.token,
        type: d.eventType,
        from: d.from,
        to: d.to,
        price: `${d.price}`,
    }));
};

// =================== Explore banner ===================

export type ExploreBanner = {
    collection: string;
    banner: string;
};

export const queryExploreBanners = async (backend_host: string): Promise<ExploreBanner[]> => {
    const r = await fetch(`${backend_host}/config/market_banner.json?v=${Date.now()}`);
    const json = await r.json();
    // console.debug(`🚀 ~ file: aws.ts:14 ~ queryExploreBanners ~ json:`, json);
    return json.map((d: any) => ({
        collection: d.canisterId,
        banner: d.banner,
    }));
};

// =================== Explore art ===================

export type ExploreArtCard = {
    token_id: NftIdentifier;
    name: string;
    url: string;
    thumb: string;
};

export const queryExploreArtList = async (backend_host: string): Promise<ExploreArtCard[]> => {
    const r = await fetch(`${backend_host}/config/artist_carousel.json?v=${Date.now()}`);
    const json = await r.json();
    // console.debug(`🚀 ~ file: aws.ts:14 ~ queryExploreArtList ~ json:`, json);
    return json.map((d: any) => ({
        token_id: parse_nft_identifier(d.tokenId),
        name: d.name,
        url: d.url,
        thumb: d.thumb,
    }));
};

// =================== Ranking ===================

export type RankedCollection = {
    collection: string; // canisterId
    items: number;
    owners: number;

    name: string;
    logo: string;
    featured: string;

    rate: number;
    floorPrice: number;
    volume: number;
};

export const queryRankedCollectionList = async (
    backend_host: string,
): Promise<RankedCollection[]> => {
    const r = await fetch(`${backend_host}/rank/collection/7day.json?v=${Date.now()}`);
    const json = await r.json();
    // console.debug(`🚀 ~ file: aws.ts:14 ~ queryRankedCollectionList ~ json:`, json);
    const list: RankedCollection[] = json
        .map((d: any) => {
            const item: RankedCollection = {
                collection: d.canisterId,
                items: d.items,
                owners: d.owners,

                name: d.name,
                logo: d.logo,
                featured: d.featured,

                rate: d.rate,
                floorPrice: d.floorPrice,
                volume: d.volume,
            };
            return item;
        })
        .sort((a: RankedCollection, b: RankedCollection) => b.volume - a.volume);
    return _.sortBy(list, [(s) => (isYumiSpecialCollection(s.name, s.collection) ? 1 : 0)]);
};
