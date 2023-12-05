import { ConnectedIdentity } from '@/01_types/identity';
import { TokenInfo, TokenStandard } from '@/01_types/nft';
import { bigint2string } from '@/02_common/types/bigint';
import { unwrapOptionMap } from '@/02_common/types/options';
import { principal2string } from '@/02_common/types/principal';
import { unwrapVariantKey } from '@/02_common/types/variant';
import { OrigynArtCollectionData } from '..';
import idlFactory from './origyn_art_1335f1e9.did';
import _SERVICE from './origyn_art_1335f1e9.did.d';

// =========================== 查询后端支持的 NFT 集合列表 ===========================

export const queryOrigynArtCollectionIdList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<string[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.listPrimarySale();
    return r.flatMap((p) => [
        principal2string(p.egg_canister),
        principal2string(p.fraction_canister),
    ]);
};

// =========================== 列出支持交易的代币信息 ===========================

export const queryOrigynArtSupportedTokens = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<TokenInfo[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.listSupportedTokens();
    // 对结果进行处理
    return r.map((d) => ({
        id: unwrapOptionMap(d.id, bigint2string), // ? bigint -> string
        symbol: d.symbol,
        canister: principal2string(d.canister), // ? principal -> string
        standard: { type: unwrapVariantKey(d.standard) } as TokenStandard,
        decimals: bigint2string(d.decimals), // ? bigint -> string
        fee: unwrapOptionMap(d.fee, bigint2string), // ? bigint -> string
    }));
};

// =========================== 查询二级市场的 origyn art 罐子 ===========================

export const queryOrigynArtMarketCollectionIdList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<string[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.listOgyCanisters();
    // 对结果进行处理
    return r.map(principal2string);
};

// =========================== 查询后端支持的 NFT 集合列表 和详细信息 ===========================

export const queryOrigynArtCollectionDataList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<OrigynArtCollectionData[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.listCollections();
    // 对结果进行处理
    return r.map((d) => ({
        collection: principal2string(d[0]),
        metadata: d[1],
    }));
};

export default {
    queryOrigynArtCollectionIdList,
    queryOrigynArtSupportedTokens,
    queryOrigynArtMarketCollectionIdList,
    queryOrigynArtCollectionDataList,
};
