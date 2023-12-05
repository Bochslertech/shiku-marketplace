import * as goldApi from '@/04_apis/yumi/gold-api';
import { NftListingData } from '@/01_types/listing';
import { NftIdentifier } from '@/01_types/nft';
import { NftMetadata } from '@/01_types/nft';
import {
    GoldFloorPrice,
    GoldNews,
    GoldRequestActivityType,
    GoldSortOption,
    GoldTimeSeries,
    GoldTimeSeriesList,
    GoldVolumetric,
    GoldWeight,
} from '@/04_apis/yumi/gold-api';
import { getYumiApi2Host, getYumiApiHost } from './special';

// 获取黄金nft列表 重量筛选 分页 排序
export const queryGoldNftList = async (
    weight: GoldWeight,
    search: string,
    sort: GoldSortOption,
    page: number,
    size: number,
): Promise<{
    total: number;
    page: number;
    size: number;
    data: NftMetadata[];
}> => {
    const backend_host = getYumiApiHost();
    return goldApi.queryGoldNftList(backend_host, weight, search, sort, page, size);
};

export const queryGoldNft = async (token_id: NftIdentifier): Promise<NftMetadata> => {
    const backend_host = getYumiApiHost();
    return goldApi.queryGoldNft(backend_host, token_id);
};

// 获取一年金价走势图
export const queryGoldTimeSeries = async ({
    symbols = 'XAU',
    start_at,
    end_at,
}: GoldTimeSeries): Promise<GoldTimeSeriesList[] | []> => {
    const backend_host = getYumiApi2Host();
    return goldApi.queryGoldTimeSeries(backend_host, { symbols, start_at, end_at });
};

//黄金自动上架
export const goldAutoSell = async (
    { collection, token_identifier }: NftIdentifier,
    listing: NftListingData,
): Promise<NftListingData> => {
    const backend_host = getYumiApi2Host();
    return goldApi.goldAutoSell(backend_host, { collection, token_identifier }, listing);
};

// 获取Volume数据
export const queryGoldVolume = async (): Promise<GoldVolumetric[] | []> => {
    const backend_host = getYumiApiHost();
    return goldApi.queryGoldVolume(backend_host);
};

// 获取 floorPrice数据
export const queryGoldFloorPrice = async (): Promise<GoldFloorPrice[] | []> => {
    const backend_host = getYumiApiHost();
    return goldApi.queryGoldFloorPrice(backend_host);
};

// 获取activities数据
export const queryGoldActivities = async (
    canister: string,
    token_id: string,
    page: number,
    pageSize: number,
): Promise<GoldRequestActivityType> => {
    const backend_host = getYumiApiHost();
    return goldApi.queryGoldActivities(backend_host, canister, token_id, page, pageSize);
};

// 获取新消息
export const queryGoldNewMessage = async (): Promise<GoldNews[]> => {
    return goldApi.queryGoldNewMessage();
};

// 判断黄金 是否为 挂单 或 回购上架
export const isGoldListing = (raw: string | undefined): boolean => {
    if (raw === undefined) return false;
    try {
        const item = JSON.parse(raw);
        return item.isList !== undefined || item.isRepurchase === true;
    } catch {
        return false;
    }
};
