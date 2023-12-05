import { NftMetadata, TokenInfo } from '@/01_types/nft';
import { principal2account } from '@/02_common/ic/account';
import { unwrapOptionMap } from '@/02_common/types/options';
import { unwrapVariantKey } from '@/02_common/types/variant';

// ================================= 查询 token 的 汇率 =================================

export type TokenExchangePrice = {
    symbol: string;
    price: string;
    priceChange: string | number;
    priceChangePercent: string | number;
};

export const queryTokenExchangePriceList = async (
    backend_host: string,
): Promise<TokenExchangePrice[]> => {
    const usdPrice = await fetch(`${backend_host}/exchange/price`);
    const json = await usdPrice.json();
    if (json.code === 200 && json.msg === 'success') {
        return json.data;
    } else {
        console.error(json.msg, 'queryExchangePrice failed');
        return [];
    }
};

// ================================= 查询 指定 token 的 汇率 =================================
// ICP OGY
export const queryTokenUsdRate = async (
    backend_host: string,
    symbol: string,
): Promise<string | undefined> => {
    const r = await fetch(`${backend_host}/exchange/price?symbol=${symbol}`);
    const json = await r.json();
    // console.warn(`🚀 ~ file: api.ts:7 ~ queryIcpUsdRate ~ json:`, json);
    if (json.code === 200 && json.msg === 'success') {
        return `${json.data}`;
    }
    console.error('can not get icp price', json);
    return undefined;
};

// ================================= 查询 OGY 汇率 =================================

// let lastOgyDuration = 60;
// let lastOgyDurationTimestamp = 0;
// export const queryOgyUsdRate = async (): Promise<string | undefined> => {
//     const now = Date.now();
//     const fetchRate = async (minutes: number): Promise<string | undefined> => {
//         const start = now - 1000 * 60 * minutes;
//         try {
//             const r = await fetch(
//                 `https://http-api.livecoinwatch.com/coins/history/range?coin=OGY&start=${start}&end=${now}&currency=USD`,
//             );
//             const json = await r.json();
//             if (json.success === true && json.coin === 'OGY' && json.data.length) {
//                 return `${json.data[json.data.length - 1].rate}`;
//             }
//             console.error('can not get ogy price', json);
//         } catch (e) {
//             console.error('fetch ogy rate failed', e);
//         }
//         return undefined;
//     };

//     if (lastOgyDurationTimestamp + 1000 * 3600 < Date.now()) {
//         lastOgyDuration = 60; // 超过一小时了,就重新开始
//     }

//     let r: string | undefined = undefined;
//     const durations = [
//         60, // 尝试 1 小时
//         60 * 12, // 尝试半天
//         60 * 24, // 尝试 1 天
//         60 * 24 * 2, // 尝试 2 天
//         60 * 24 * 3, // 尝试 3 天
//         60 * 24 * 7, // 尝试 7 天
//     ];
//     for (const duration of durations) {
//         if (lastOgyDuration <= duration) {
//             r = await fetchRate(duration);
//             if (r !== undefined) {
//                 lastOgyDuration = duration; // 记录当前的范围
//                 lastOgyDurationTimestamp = Date.now(); // 记录当前的时间
//                 break;
//             }
//         }
//     }

//     if (r === undefined) lastOgyDuration = durations[durations.length - 1] + 1; // 所有的都尝试了, 就限制一小时内不再请求

//     return r;
// };

// ================================= 查询某用户的 OGY 黄金 NFT =================================

export const queryUserGoldNft = async (
    backend_host: string,
    principal: string,
): Promise<NftMetadata[]> => {
    const r = await fetch(`${backend_host}/gold/collected?who=${principal}`);
    const json = await r.json();
    // console.warn(`🚀 ~ file: api.ts:67 ~ queryUserGoldNft ~ json:`, json);
    if (json.code === 200 && json.msg === 'success') {
        return json.data.map((d: any) => {
            const card: NftMetadata = {
                owner: {
                    token_id: {
                        collection: d.canisterId,
                        // token_index: Number(d.token_index.substring(5)),
                        token_identifier: d.token_index,
                    },
                    owner: principal2account(d.owner),
                    raw: {
                        standard: 'ogy',
                        data: { token_id: d.token_index, account: { principal: d.owner } },
                    },
                },
                metadata: {
                    token_id: {
                        collection: d.canisterId,
                        // token_index: Number(d.token_index.substring(5)),
                        token_identifier: d.token_index,
                    },
                    metadata: {
                        name: d.name,
                        mimeType: '',
                        url: d.url,
                        thumb: '',
                        description: d.description,
                        traits: [],
                        onChainUrl: d.url,
                        yumi_traits: [],
                    },
                    raw: {
                        standard: 'ogy',
                        data: d,
                    },
                },
            };
            return card;
        });
    }
    console.error('can not get queryUserGoldNft', json);
    return [];
};

// ================================= 查询 OGY 支持的代币标准 =================================

const SimpleTokenStandard = ['Ledger', 'ICRC1', 'DIP20', 'EXTFungible'];
export const queryOgyGoldSupportedTokens = async (backend_host: string): Promise<TokenInfo[]> => {
    const r = await fetch(`${backend_host}/gold/tokens`);
    const json = await r.json();
    // console.warn(`🚀 ~ file: api.ts:67 ~ queryOgyGoldSupportedTokens ~ json:`, json);
    if (json.code === 200 && json.msg === 'success') {
        return json.data.map((d: any) => {
            const standard_type = unwrapVariantKey(d.standard);
            if (!SimpleTokenStandard.includes(standard_type) && standard_type !== 'Other') {
                throw new Error('can not parse token info');
            }
            return {
                id: unwrapOptionMap(d.id, (n) => `${n}`),
                symbol: d.symbol,
                canister: d.canister,
                standard: SimpleTokenStandard.includes(standard_type)
                    ? { type: standard_type }
                    : {
                          type: standard_type,
                          raw: d.standard[standard_type],
                      },
                decimals: `${d.decimals}`,
                fee: unwrapOptionMap(d.fee, (n) => `${n}`),
            };
        });
    }
    console.error('can not get queryOgyGoldSupportedTokens', json);
    return [];
};

// ================================= 二维码加白功能 =================================

export const queryWhitelistJwtToken = async (
    backend_host: string,
    collection: string,
): Promise<string> => {
    const r = await fetch(
        `${backend_host}/qrcode/get_token?canister_id=${collection}` /* cspell: disable-line */,
    );
    const json = await r.json();
    // console.warn(`🚀 ~ file: api.ts:67 ~ queryWhitelistJwtToken ~ json:`, json);
    if (json.code === 200) return json.data.data.jwt_token;
    console.error('can not get queryWhitelistJwtToken', json);
    throw new Error(`query token failed`);
};

// launchpad 加白名单
export const doLaunchpadAddWhitelist = async (
    backend_host: string,
    collection: string,
    account: string,
): Promise<void> => {
    const token = await queryWhitelistJwtToken(backend_host, collection);
    const r = await fetch(`${backend_host}/qrcode/whitelist` /* cspell: disable-line */, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jwt_token: token,
            canister_id: collection,
            account_id: account,
        }),
    });
    const json = await r.json();
    // console.warn(`🚀 ~ file: api.ts:67 ~ doLaunchpadAddWhitelist ~ json:`, json);
    if (json.code === 200) return json.data.data.jwt_token;
    console.error('can not get doLaunchpadAddWhitelist', json);
    throw new Error(`add launchpad whitelist failed`);
};

// oat 加白名单
export const doOatAddWhitelist = async (
    backend_host: string,
    collection: string,
    event_id: string,
    account: string,
): Promise<void> => {
    const token = await queryWhitelistJwtToken(backend_host, collection);
    const r = await fetch(`${backend_host}/qrcode/oat_whitelist` /* cspell: disable-line */, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jwt_token: token,
            event_id: event_id,
            account_id: account,
        }),
    });
    const json = await r.json();
    // console.warn(`🚀 ~ file: api.ts:67 ~ doLaunchpadAddWhitelist ~ json:`, json);
    if (json.code === 200) return json.data.data.jwt_token;
    console.error('can not get doOatAddWhitelist', json);
    throw new Error(`add oat whitelist failed`);
};
