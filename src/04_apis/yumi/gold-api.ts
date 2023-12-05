// import dayjs from 'dayjs';
import { NftListingData } from '@/01_types/listing';
import {
    NftIdentifier,
    NftTokenMetadata,
    NftTokenOwner,
    TokenInfo,
    TokenStandard,
} from '@/01_types/nft';
import { NftMetadata } from '@/01_types/nft';
import { customStringify } from '@/02_common/data/json';
import { principal2account } from '@/02_common/ic/account';
import { unwrapOption, unwrapOptionMap } from '@/02_common/types/options';
import { unwrapVariantKey } from '@/02_common/types/variant';

// ============================== types ==============================

// 挂单 nft token类型
export type GoldNftToken = {
    id: [] | [number];
    symbol: string;
    canister: string;
    standard: TokenStandard;
    decimals: number;
    fee: [] | [number];
};

//单个黄金nft返回类型
export type GoldNftInfo = {
    canister: string; // 罐子 // "himny-aiaaa-aaaak-aepca-cai"
    collection: string; // 罐子 // "himny-aiaaa-aaaak-aepca-cai"
    token_id: string; // token_identifier // "gold-067876"

    // 所有者信息
    owner: string; // 所有者 // principal // "nka23-rvoky-suzg7-qvnev-ldniw-vhaft-idot4-zenzk-oyryp-7hqpc-iqe"

    // 元数据信息
    name: string; // 名称 // "gold-067876"
    description: string; // 描述信息 // "10g Gold Bullion Bar Origyn Digital Certificate"
    preview: string; // 预览图 // "https://prptl.io/-/himny-aiaaa-aaaak-aepca-cai/collection/preview"
    primary: string; // 主图 // "https://prptl.io/-/himny-aiaaa-aaaak-aepca-cai/collection/-/10g.png"

    // 其他信息
    weight: number; // 重量 // 10
    properties: string; // 属性 // "{\"Fineness\":\"99.99%\",\"Dimensions\":\"15.5 x 25.5 mm\",\"Weight\":\"10g\",\"Hardness\":\"25 Hv\",\"Manufacturer\":\"METALOR\",\"Serial Number\":\"067876\"}"
    front: string; // 封面图 // "https://prptl.io/-/himny-aiaaa-aaaak-aepca-cai/-/gold-067879/-/front-067876.jpg"
    back: string; // 背面图 // "https://prptl.io/-/himny-aiaaa-aaaak-aepca-cai/-/gold-067879/-/back-067876.jpg"

    // 上架信息
    isList?: boolean; // 是否上架 // true
    sale_id?: string; // "e163e377f0cb53b11c76aa764a38dd36d6ff74833ec85246156a46519f8994dd"
    start_date?: number; // 上架时间 // 1691753733199000000
    end_date?: number; // 结束时间 // 2638524933199000000
    token?: GoldNftToken; // 上架的指定的代币
    amount?: number; // 上架信息 // 1000000000

    // 上架
    isRepurchase?: boolean; //标示 是否回购
    usd_price?: number; // 折算成美元价格
};

// 黄金 dash-board volumes 类型
export type GoldVolumetric = {
    date: string;
    volume: number;
};

// 黄金 dash-board floorPrice 类型
export type GoldFloorPrice = {
    date: string;
    floorPrice: number;
};

// activity 单条数据类型
export type GoldActivityType = {
    collection: string;
    from: string;
    to: string;
    timestamp: string; // 2023-08-15T10:00:23.000Z
    token_amount: number;
    token_id: string;
    token_symbol: string;
    type: string;
    usd_price: number;
};

// activity 返回类型
export type GoldRequestActivityType = {
    list: GoldActivityType[];
    total: number;
};

//gold 新闻
export type GoldNews = {
    url: string;
    uuid: string;
    image_url: string;
    title: string;
    published_at: string; // 2023-09-05T04:24:55.000000Z
};

//gold chart type
export type GoldChartItem = {
    [date: string]: {
        XAU: number;
        USD: number;
    };
};

//gold 金价走势图 type
export type GoldTimeSeries = {
    symbols?: string;
    start_at: string;
    end_at: string;
};

//金价走势图返回数据 type
export type GoldTimeSeriesList = {
    createdAt: string;
    price: number;
    symbols: string;
    tradeAt: string;
    unit: string;
    _v: number;
    _id: string;
};

// 获取黄金nft列表 重量筛选 分页 排序
export type GoldWeight = '1' | '10' | '100' | '1000';
export type GoldSortOption = 'price_low_to_high' | 'price_high_to_low';

const parseTokenByOgyToken = (token: any): TokenInfo => {
    return {
        id: unwrapOptionMap(token.id, (s) => `${s}`),
        symbol: (() => {
            switch (token.symbol) {
                case 'ICP':
                case 'OGY':
                    return token.symbol;
            }
            throw new Error(`token ${token.symbol} is not supported`);
        })(),
        canister: token.canister,
        standard: (() => {
            const key = unwrapVariantKey(token.standard);
            switch (key) {
                case 'Ledger':
                case 'ICRC1':
                case 'DIP20':
                case 'EXTFungible':
                    return { type: key };
            }
            throw new Error(`module_be8972b0 unknown token standard: ${key}`);
        })(),
        decimals: `${token.decimals}`,
        fee: unwrapOptionMap(token.fee, (s) => `${s}`),
    };
};

const parseGoldNft = (item: GoldNftInfo): NftMetadata => {
    const token_id: NftIdentifier = {
        collection: item.canister,
        token_identifier: item.token_id,
    };
    const owner: NftTokenOwner = {
        token_id,
        owner: principal2account(item.owner),
        raw: {
            standard: 'ogy',
            data: {
                token_id: item.token_id,
                account: { principal: item.owner },
            },
        },
    };
    const metadata: NftTokenMetadata = {
        token_id,
        metadata: {
            name: item.name,
            mimeType: '',
            url: item.primary,
            thumb: item.preview,
            description: item.description,
            traits: [],
            onChainUrl: item.primary,
            yumi_traits: [],
        },
        raw: {
            standard: 'ogy',
            data: customStringify(item),
        },
    };
    let listing: NftListingData | undefined = undefined;
    if (
        (item.isList !== undefined || item.isRepurchase === true) && // 这个不要判断 假上架
        // item.sale_id &&
        // item.start_date &&
        // item.end_date &&
        item.token &&
        item.amount &&
        item.usd_price
    ) {
        listing = {
            token_id,
            listing: {
                type: 'listing',
                time: `${item.start_date ?? ''}`, // ! 自动上架需要补上
                token: parseTokenByOgyToken(item.token), // ! 自动上架需要补上
                price: `${item.amount}`, // ! 自动上架需要补上
                raw: {
                    type: 'ogy',
                    sale_id: item.sale_id ?? '', // ! 自动上架需要补上
                    raw: customStringify(item),
                },
            },
            raw: customStringify(item),
        };
    } else {
        listing = {
            token_id,
            listing: { type: 'holding' },
            raw: customStringify(item),
        };
    }

    const card: NftMetadata = {
        owner,
        metadata,
        listing,
    };
    return card;
};

export const queryGoldNftList = async (
    backend_host: string,
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
    const r = await fetch(
        `${backend_host}/gold/nfts?weight=${weight}&content=${search}&sort=${(() => {
            switch (sort) {
                case 'price_low_to_high':
                    return 'asc';
                case 'price_high_to_low':
                    return 'desc';
            }
            throw new Error(`what a sort: ${sort}?`);
        })()}&pageSize=${size}&page=${page}`,
    );
    const json = await r.json();
    // console.debug(`🚀 ~ file: gold-api.ts:46 ~ json:`, json);
    if (json.code === 200 && json.msg === 'success') {
        return {
            total: json.data.total,
            page,
            size,
            data: json.data.list.map(parseGoldNft),
        };
    } else {
        return { total: 0, page, size, data: [] };
    }
};

export const queryGoldNft = async (
    backend_host: string,
    token_id: NftIdentifier,
): Promise<NftMetadata> => {
    const r = await fetch(
        `${backend_host}/gold/nft?canister=${token_id.collection}&token_id=${token_id.token_identifier}`,
    );
    const json = await r.json();
    if (json.code !== 200) throw new Error(`can not find nft metadata`);
    return parseGoldNft(json.data);
};

// 获取一年金价走势图
export const queryGoldTimeSeries = async (
    backend_host: string,
    { symbols = 'XAU', start_at, end_at }: GoldTimeSeries,
): Promise<GoldTimeSeriesList[] | []> => {
    const r = await fetch(
        `${backend_host}/gold/tradePrice?symbols=${symbols}&start_at=${start_at}&end_at=${end_at}`,
    );
    const json = await r.json();
    if (json.code === 200 && json.msg === 'Success') {
        return json.data;
    } else return [];
};

//黄金自动上架
export const goldAutoSell = async (
    backend_host: string,
    { collection, token_identifier }: NftIdentifier,
    listing: NftListingData,
): Promise<NftListingData> => {
    if (listing.listing.type !== 'listing' || listing.listing.raw.type !== 'ogy')
        throw new Error(`auto sell failed: not listing`);
    const r = await fetch(`${backend_host}/gold/autoSell`, {
        method: 'POST',
        headers: [['Content-Type', 'application/json']],
        body: JSON.stringify({
            canister: collection,
            token_id: token_identifier,
        }),
    });
    const json = await r.json();
    const message = json.message;
    if (!message) throw new Error(`auto sell failed: request failed`);
    if (token_identifier !== message.token_id) throw new Error('auto sell failed: wrong token id');
    if (
        !message.txn_type?.sale_opened ||
        !message.txn_type.sale_opened.pricing.auction ||
        !message.txn_type.sale_opened.pricing.auction.token.ic
    )
        throw new Error('auto sell failed: no data');
    const sale_opened = message.txn_type.sale_opened;

    listing.listing.time = message.timestamp; // 时间补上
    listing.listing.token = parseTokenByOgyToken(
        message.txn_type.sale_opened.pricing.auction.token.ic,
    );
    listing.listing.price = `${
        unwrapOption(sale_opened.pricing.auction.buy_now) ?? sale_opened.pricing.auction.start_price
    }`;
    listing.listing.raw.sale_id = sale_opened.sale_id;
    return listing;
};

// 获取Volume数据
export const queryGoldVolume = async (backend_host: string): Promise<GoldVolumetric[] | []> => {
    const usdVolume = await fetch(`${backend_host}/gold/dailyVolume`);
    const json = await usdVolume.json();
    if (json.code === 200 && json.msg === 'success') {
        return json.data;
    } else {
        console.error(json.msg, 'queryVolume failed');
        return [];
    }
};

// 获取 floorPrice数据
export const queryGoldFloorPrice = async (backend_host: string): Promise<GoldFloorPrice[] | []> => {
    const floorPrice = await fetch(`${backend_host}/gold/floorPrice`);
    const json = await floorPrice.json();
    if (json.code === 200 && json.msg === 'success') {
        return json.data;
    } else {
        console.error(json.msg, 'queryFloorPrice failed');
        return [];
    }
};

// 获取activities数据
export const queryGoldActivities = async (
    backend_host: string,
    canister: string,
    token_id: string,
    page: number,
    pageSize: number,
): Promise<GoldRequestActivityType> => {
    const activities = await fetch(
        `${backend_host}/gold/activities?canister=${canister}&token_id=${token_id}&page=${page}&pageSize=${pageSize}`,
    );
    const json = await activities.json();
    if (json.code === 200 && json.msg === 'success') {
        // console.debug(`🚀 ~ file: gold-api.ts:283 ~ json:`, json);
        return json.data;
    } else {
        console.error(json.msg, 'queryActivities failed');
        return { list: [], total: 0 };
    }
};

// 获取新消息
export const queryGoldNewMessage = async (): Promise<GoldNews[]> => {
    return new Promise((resolve, reject) => {
        fetch(
            `https://api.marketaux.com/v1/news/all?industries=Basic%20Materials,Financial,Financial%20Services&filter_entities=true&limit=10&published_after=2023-04-18T11:17&api_token=V9GgPTVAbLHioPK7JDoFUcfbJTvJ44WjGZIwCR46`,
        )
            .then((r) => r.json())
            .then((json) => {
                // console.debug(`🚀 ~ file: gold-api.ts:298 ~ .then ~ json:`, json);
                return resolve(json.data);
            })
            .catch((e) => {
                if (`${e}`.endsWith('Failed to fetch')) return resolve([]);
                reject(e);
                console.debug('🚀 ~ file: gold-api.ts:106 ~ return newPromise ~ e:', e);
            });
    });
};

// // 获取实时图表信息
// export const queryGoldChartInfo = async (): Promise<GoldChartItem[]> => {
//     const start_date = dayjs().subtract(90, 'day').format('YYYY-MM-DD');
//     const end_date = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
//     const chartInfo = await fetch(
//         `https://metals-api.com/api/timeseries?access_key=pj9uxpzo9szpk9weqz3n5ny3gg0za54685al60kwsn129lz52m23nmghu19g&start_date=${start_date}&end_date=${end_date}&symbols=XAU`,
//     );
//     const json = await chartInfo.json();
//     if (json.success) {
//         return json.rates;
//     } else {
//         console.error(`🚀 ~ file: gold-api.ts:120 ~ queryGoldChartInfo ~ json:`, json);
//         return [];
//     }
// };
