import * as api2 from '@/04_apis/yumi/api2';
import { NftCollectionFloor } from '@/04_apis/yumi/api2';
import { getYumiApi2Host } from './special';

// ================================= 某 NFT 集合的交易量统计 =================================

export type NftCollectionVolume = {
    day: number; // 时间 // ! 毫秒
    volume: string; // 总交易量 // value
    count: number; // 总交易次数 // count
};

// ! 按时间正序的
export const queryCollection24HVolume = async (
    collection: string,
): Promise<NftCollectionVolume[]> => {
    const backend_host = getYumiApi2Host();
    return api2.queryCollection24HVolume(backend_host, collection);
};

// ================================= 某 NFT 集合的地板价统计 =================================

// ! 按时间正序的
export const queryCollectionFloorPriceByDay = async (
    collection: string,
): Promise<NftCollectionFloor[]> => {
    const backend_host = getYumiApi2Host();
    return api2.queryCollectionFloorPriceByDay(backend_host, collection);
};

export const estimateFiatAmountForExactCrypto = async (args: {
    crypto: 'ICP';
    amount: string;
    fiat: 'USD';
}): Promise<string> => {
    const backend_host = getYumiApi2Host();
    return await api2.estimateFiatAmountForExactCrypto(backend_host, args);
};
