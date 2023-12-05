import * as api from '@/04_apis/yumi/api';
import { NftMetadata, TokenInfo } from '@/01_types/nft';
import { TokenExchangePrice } from '@/04_apis/yumi/api';
import { getYumiApiHost } from './special';

// ================================= 查询 token 的 汇率 =================================

export const queryTokenExchangePriceList = async (): Promise<TokenExchangePrice[]> => {
    const backend_host = getYumiApiHost();
    return api.queryTokenExchangePriceList(backend_host);
};

// ================================= 查询 指定 token 的 汇率 =================================
// ICP OGY
export const queryTokenUsdRate = async (symbol: string): Promise<string | undefined> => {
    const backend_host = getYumiApiHost();
    return api.queryTokenUsdRate(backend_host, symbol);
};

// ================================= 查询 OGY 汇率 =================================

// ================================= 查询某用户的 OGY 黄金 NFT =================================

export const queryUserGoldNft = async (principal: string): Promise<NftMetadata[]> => {
    const backend_host = getYumiApiHost();
    return api.queryUserGoldNft(backend_host, principal);
};

// ================================= 查询 OGY 支持的代币标准 =================================

export const queryOgyGoldSupportedTokens = async (): Promise<TokenInfo[]> => {
    const backend_host = getYumiApiHost();
    return api.queryOgyGoldSupportedTokens(backend_host);
};

// ================================= 二维码加白功能 =================================

export const queryWhitelistJwtToken = async (collection: string): Promise<string> => {
    const backend_host = getYumiApiHost();
    return api.queryWhitelistJwtToken(backend_host, collection);
};

// launchpad 加白名单
export const doLaunchpadAddWhitelist = async (
    collection: string,
    account: string,
): Promise<void> => {
    const backend_host = getYumiApiHost();
    return api.doLaunchpadAddWhitelist(backend_host, collection, account);
};

// oat 加白名单
export const doOatAddWhitelist = async (
    collection: string,
    event_id: string,
    account: string,
): Promise<void> => {
    const backend_host = getYumiApiHost();
    return api.doOatAddWhitelist(backend_host, collection, event_id, account);
};
