import { ConnectedIdentity } from '@/01_types/identity';
import { TokenInfo } from '@/01_types/nft';
import { canister_module_hash_and_time } from '@/02_common/ic/status';
import module_6a35faf5 from './module_6a35faf5';
import module_1335f1e9 from './module_1335f1e9';
import { CollectionMetadata } from './module_1335f1e9/origyn_art_1335f1e9.did.d';

const MAPPING_MODULES = {
    ['6a35faf529f935f18bec0142d6c4ba117ccd82f13817fca458eb059f8cbf084f']: module_6a35faf5,
    ['1335f1e979640d0ef06d6c7efbac4a2c335a03ed79785bbd10d1ae47cab1c5e7']: module_1335f1e9,
};

const MAPPING_CANISTERS: Record<
    string,
    | '6a35faf529f935f18bec0142d6c4ba117ccd82f13817fca458eb059f8cbf084f'
    | '6a35faf529f935f18bec0142d6c4ba117ccd82f13817fca458eb059f8cbf084f'
    | '1335f1e979640d0ef06d6c7efbac4a2c335a03ed79785bbd10d1ae47cab1c5e7'
> = {
    // ! 正式环境
    ['od7d3-vaaaa-aaaap-aamfq-cai']:
        '6a35faf529f935f18bec0142d6c4ba117ccd82f13817fca458eb059f8cbf084f',
    // * 预发布环境
    ['owysw-uiaaa-aaaap-aamga-cai']:
        '6a35faf529f935f18bec0142d6c4ba117ccd82f13817fca458eb059f8cbf084f',
    // ? 测试环境
    ['patk5-byaaa-aaaap-aamda-cai']:
        '1335f1e979640d0ef06d6c7efbac4a2c335a03ed79785bbd10d1ae47cab1c5e7',
};

// 检查每一个罐子的 module 有没有改变,如果变化了就要通知
export const checkYumiOrigynArtCanisterModule = async () => {
    for (const canister_id of [
        'od7d3-vaaaa-aaaap-aamfq-cai',
        'owysw-uiaaa-aaaap-aamga-cai',
        'patk5-byaaa-aaaap-aamda-cai',
    ]) {
        const r = await canister_module_hash_and_time(canister_id, import.meta.env.CONNECT_HOST);
        console.error('yumi origyn art canister module is changed', canister_id, r.module_hash);
    }
};

// 运行时检查,如果没有实现对应的模块,就报错提示
for (const key of Object.keys(MAPPING_CANISTERS)) {
    const module = MAPPING_CANISTERS[key];
    if (!MAPPING_MODULES[module]) {
        console.error('Yumi origyn art canister is not implement', key, module);
    }
}
const getModule = (collection: string) => {
    const module_hex = MAPPING_CANISTERS[collection];
    if (module_hex === undefined)
        throw new Error(`unknown yumi origyn art canister id: ${collection}`);
    const module = MAPPING_MODULES[module_hex];
    if (module === undefined) throw new Error(`unknown yumi origyn art canister id: ${collection}`);
    return module;
};

// =========================== 查询后端支持的 NFT 集合列表 ===========================

export const queryOrigynArtCollectionIdList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<string[]> => {
    const module = getModule(backend_canister_id);
    return module.queryOrigynArtCollectionIdList(identity, backend_canister_id);
};

// =========================== 列出支持交易的代币信息 ===========================

export const queryOrigynArtSupportedTokens = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<TokenInfo[]> => {
    const module = getModule(backend_canister_id);
    return module.queryOrigynArtSupportedTokens(identity, backend_canister_id);
};

// =========================== 查询二级市场的 origyn art 罐子 ===========================

export const queryOrigynArtMarketCollectionIdList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<string[]> => {
    const module = getModule(backend_canister_id);
    return module.queryOrigynArtMarketCollectionIdList(identity, backend_canister_id);
};

// =========================== 查询后端支持的 NFT 集合列表 和详细信息 ===========================

export type OrigynArtCollectionData = {
    collection: string;
    metadata: CollectionMetadata;
};

export const queryOrigynArtMarketCollectionDataList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<OrigynArtCollectionData[]> => {
    const module = getModule(backend_canister_id);
    return module.queryOrigynArtCollectionDataList(identity, backend_canister_id);
};
