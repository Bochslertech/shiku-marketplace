import dayjs from 'dayjs';
import _ from 'lodash';

// ================================= 某 NFT 集合的交易量统计 =================================

export type NftCollectionVolume = {
    day: number; // 时间 // ! 毫秒
    volume: string; // 总交易量 // value
    count: number; // 总交易次数 // count
};

// ! 按时间正序的
export const queryCollection24HVolume = async (
    backend_host: string,
    collection: string,
): Promise<NftCollectionVolume[]> => {
    return new Promise((resolve, reject) => {
        fetch(
            `${backend_host}/statistics/24hVolume/timeseries/${collection}` /* cspell: disable-line */,
        )
            .then((r) => r.json())
            .then((json) => {
                if (!_.isArray(json)) {
                    console.debug(`🚀 ~ file: api2.ts:50 ~ .then ~ json:`, json);
                    return resolve([]);
                }
                // console.warn(`🚀 ~ file: kyc.ts:13 ~ queryCollection24HVolume ~ json:`, json);
                for (const d of json) {
                    if (d.collectionId === collection) {
                        return resolve(
                            d.tradingVolume.map((dd: any) => ({
                                /* cspell: disable-next-line */
                                day: dayjs(dd.date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate().getTime(),
                                volume: `${dd.value}`,
                                count: dd.count,
                            })),
                        );
                    }
                }
                return resolve([]);
            })
            .catch((e) => {
                if (`${e}`.endsWith('Failed to fetch')) return resolve([]); // ! 只有正式环境有这个数据, 其他环境报错返回空吧
                console.debug(`🚀 ~ file: api2.ts:71 ~ return newPromise ~ e:`, e);
                reject(e);
            });
    });
};

// ================================= 某 NFT 集合的地板价统计 =================================

export type NftCollectionFloor = {
    day: number; // 时间 // ! 毫秒
    floor: string; // 地板价
};

// ! 按时间正序的
export const queryCollectionFloorPriceByDay = async (
    backend_host: string,
    collection: string,
): Promise<NftCollectionFloor[]> => {
    return new Promise((resolve, reject) => {
        fetch(
            `${backend_host}/statistics/24hVolume/timeseries/${collection}` /* cspell: disable-line */,
        )
            .then((r) => r.json())
            .then((json) => {
                if (!_.isArray(json)) {
                    return resolve([]);
                }
                // console.warn(`🚀 ~ file: kyc.ts:13 ~ queryCollection24HVolume ~ json:`, json);
                return resolve(
                    json[0].tradingVolume.map((d) => ({
                        day: dayjs(d.date, 'YYYY-MM-DD').toDate().getTime(),
                        floor: `${d.value}`,
                    })),
                );
            })
            .catch((e) => {
                if (`${e}`.endsWith('Failed to fetch')) return resolve([]); // ! 只有正式环境有这个数据, 其他环境报错返回空吧
                console.debug(`🚀 ~ file: api2.ts:109 ~ return newPromise ~ e:`, e);
                reject(e);
            });
    });
};

// ================================= 根据特定crypto数量获取需要支付的法币数量 =================================

export const estimateFiatAmountForExactCrypto = async (
    backend_host: string,
    args: { crypto: 'ICP'; amount: string; fiat: 'USD' },
): Promise<string> => {
    const r = await fetch(
        `${backend_host}/v2/pay/fetchPrices?crypto=${args.crypto}&amount=${Number(
            args.amount,
        )}&fiat=${args.fiat}` /* cspell: disable-line */,
    )
        .then((r) => r.json())
        .then((json) => {
            if (json.success) {
                console.debug('🚀 ~ file: api2.ts:102 ~ .then ~ json.data:', json);
                return json.data.fiatAmount;
            } else {
                console.error(json.returnMsg);
            }
        })
        .catch((e) => console.error(e));
    return r;
};
