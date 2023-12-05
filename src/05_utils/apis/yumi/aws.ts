import * as aws from '@/04_apis/yumi/aws';
import { NftIdentifier } from '@/01_types/nft';
import {
    CollectionEvent,
    CollectionNftEvent,
    CollectionStatistics,
    ExploreArtCard,
    ExploreBanner,
    HomeBanner,
    HomeFeaturedArtwork,
    HomeHotCollection,
    RankedCollection,
} from '@/04_apis/yumi/aws';
import { getYumiAwsHost } from './special';

// =================== 首页 banner ===================

export const queryHomeBanners = async (): Promise<HomeBanner[]> => {
    const backend_host = getYumiAwsHost();
    return aws.queryHomeBanners(backend_host);
};

// =================== 首页 热门 NFT 集合 ===================

export const queryHomeHotCollections = async (): Promise<HomeHotCollection[]> => {
    const backend_host = getYumiAwsHost();
    return aws.queryHomeHotCollections(backend_host);
};

// =================== 首页 热门 NFT 集合 ===================

export const queryHomeFeaturedArtworks = async (): Promise<HomeFeaturedArtwork[]> => {
    const backend_host = getYumiAwsHost();
    return aws.queryHomeFeaturedArtworks(backend_host);
};

// =================== 查询指定集合的地板价 ===================

export const getCollectionStatistics = async (
    collection: string,
): Promise<CollectionStatistics | undefined> => {
    const backend_host = getYumiAwsHost();
    return aws.getCollectionStatistics(backend_host, collection);
};

// ================================= 某 NFT 集合的历史成交记录 =================================

export const queryCollectionsEvents = async (collection: string): Promise<CollectionEvent[]> => {
    const backend_host = getYumiAwsHost();
    return aws.queryCollectionsEvents(backend_host, collection);
};

// ================================= 某 NFT 的历史成交记录 =================================

export const queryCollectionNftEvents = async (
    token_id: NftIdentifier,
): Promise<CollectionNftEvent[]> => {
    const backend_host = getYumiAwsHost();
    return aws.queryCollectionNftEvents(backend_host, token_id);
};

// =================== Explore banner ===================

export const queryExploreBanners = async (): Promise<ExploreBanner[]> => {
    const backend_host = getYumiAwsHost();
    return aws.queryExploreBanners(backend_host);
};

// =================== Explore art ===================

export const queryExploreArtList = async (): Promise<ExploreArtCard[]> => {
    const backend_host = getYumiAwsHost();
    return aws.queryExploreArtList(backend_host);
};

// =================== Ranking ===================

export const queryRankedCollectionList = async (): Promise<RankedCollection[]> => {
    const backend_host = getYumiAwsHost();
    return aws.queryRankedCollectionList(backend_host);
};
