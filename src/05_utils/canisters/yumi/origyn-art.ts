import * as origyn_art from '@/03_canisters/yumi/yumi_origyn_art';
import { TokenInfo } from '@/01_types/nft';
import { OrigynArtCollectionData } from '@/03_canisters/yumi/yumi_origyn_art';
import { anonymous } from '../../connect/anonymous';
import { getYumiOrigynArtCanisterId } from './special';

// =========================== 查询后端支持的 NFT 集合列表 ===========================

export const queryOrigynArtCollectionIdList = async (): Promise<string[]> => {
    const backend_canister_id = getYumiOrigynArtCanisterId();
    return origyn_art.queryOrigynArtCollectionIdList(anonymous, backend_canister_id);
};

// =========================== 列出支持交易的代币信息 ===========================

export const queryOrigynArtSupportedTokens = async (): Promise<TokenInfo[]> => {
    const backend_canister_id = getYumiOrigynArtCanisterId();
    return origyn_art.queryOrigynArtSupportedTokens(anonymous, backend_canister_id);
};

// =========================== 查询二级市场的 origyn art 罐子 ===========================

export const queryOrigynArtMarketCollectionIdList = async (): Promise<string[]> => {
    const backend_canister_id = getYumiOrigynArtCanisterId();
    return origyn_art.queryOrigynArtMarketCollectionIdList(anonymous, backend_canister_id);
};

export const queryOrigynArtMarketCollectionIdListByBackend = async (
    backend_canister_id: string,
): Promise<string[]> => {
    return origyn_art.queryOrigynArtMarketCollectionIdList(anonymous, backend_canister_id);
};

// =========================== 查询后端支持的 NFT 集合列表 和详细信息 ===========================

export const queryOrigynArtMarketCollectionDataList = async (): Promise<
    OrigynArtCollectionData[]
> => {
    const backend_canister_id = getYumiOrigynArtCanisterId();
    return origyn_art.queryOrigynArtMarketCollectionDataList(anonymous, backend_canister_id);
};
export const queryOrigynArtMarketCollectionDataListByBackend = async (
    backend_canister_id: string,
): Promise<OrigynArtCollectionData[]> => {
    return origyn_art.queryOrigynArtMarketCollectionDataList(anonymous, backend_canister_id);
};
