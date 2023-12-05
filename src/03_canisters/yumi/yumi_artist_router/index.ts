import { ConnectedIdentity } from '@/01_types/identity';
import { NftIdentifier } from '@/01_types/nft';
import { ArtistCollectionData, CollectionLinks } from '@/01_types/yumi';
import { canister_module_hash_and_time } from '@/02_common/ic/status';
import module_2d3f4e47 from './module_2d3f4e47';
import module_beb8bacf from './module_beb8bacf';

const MAPPING_MODULES = {
    ['beb8bacf351a265aa7b8757bed762e2d1a38582ed60d3e576ac53f0d4f0bd59d']: module_beb8bacf,
    ['2d3f4e473f7084fcf607035e71b6c70b9bcdf899ca488e58efa1e543fa5f0c7e']: module_2d3f4e47,
};

const MAPPING_CANISTERS: Record<
    string,
    | 'beb8bacf351a265aa7b8757bed762e2d1a38582ed60d3e576ac53f0d4f0bd59d'
    | '2d3f4e473f7084fcf607035e71b6c70b9bcdf899ca488e58efa1e543fa5f0c7e'
> = {
    // ! 正式环境
    ['qnblj-lyaaa-aaaah-aa74a-cai']:
        'beb8bacf351a265aa7b8757bed762e2d1a38582ed60d3e576ac53f0d4f0bd59d',
    // * 预发布环境
    ['st74o-biaaa-aaaah-abcoa-cai']:
        'beb8bacf351a265aa7b8757bed762e2d1a38582ed60d3e576ac53f0d4f0bd59d',
    // ? 测试环境
    ['v32d7-paaaa-aaaah-abc7q-cai']:
        '2d3f4e473f7084fcf607035e71b6c70b9bcdf899ca488e58efa1e543fa5f0c7e',
};

// 检查每一个罐子的 module 有没有改变,如果变化了就要通知
export const checkYumiArtistRouterCanisterModule = async () => {
    for (const canister_id of [
        'qnblj-lyaaa-aaaah-aa74a-cai',
        'st74o-biaaa-aaaah-abcoa-cai',
        'v32d7-paaaa-aaaah-abc7q-cai',
    ]) {
        const r = await canister_module_hash_and_time(canister_id, import.meta.env.CONNECT_HOST);
        console.error('yumi artist router canister module is changed', canister_id, r.module_hash);
    }
};

// 运行时检查,如果没有实现对应的模块,就报错提示
for (const key of Object.keys(MAPPING_CANISTERS)) {
    const module = MAPPING_CANISTERS[key];
    if (!MAPPING_MODULES[module]) {
        console.error('Yumi artist router canister is not implement', key, module);
    }
}
const getModule = (collection: string) => {
    const module_hex = MAPPING_CANISTERS[collection];
    if (module_hex === undefined)
        throw new Error(`unknown yumi artist router canister id: ${collection}`);
    const module = MAPPING_MODULES[module_hex];
    if (module === undefined)
        throw new Error(`unknown yumi artist router canister id: ${collection}`);
    return module;
};

// =========================== 查询后端支持的 NFT 集合 id 列表 ===========================

export const queryArtistCollectionIdList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<string[]> => {
    const module = getModule(backend_canister_id);
    return module.queryArtistCollectionIdList(identity, backend_canister_id);
};

// =========================== 查询后端支持的 NFT 集合列表 和详细信息 ===========================

export const queryArtistCollectionDataList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<ArtistCollectionData[]> => {
    const module = getModule(backend_canister_id);
    return module.queryArtistCollectionDataList(identity, backend_canister_id);
};

// =========================== 查询所有的 Art NFT 列表 ===========================

export const queryAllArtistNftTokenIdList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<NftIdentifier[]> => {
    const module = getModule(backend_canister_id);
    return module.queryAllArtistNftTokenIdList(identity, backend_canister_id);
};

// =========================== 查询有权限创建 NFT 的账户 ===========================

export const getAllArtists = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<string[]> => {
    const module = getModule(backend_canister_id);
    return module.getAllArtists(identity, backend_canister_id);
};

// =========================== 查询创建 NFT 的费用 ===========================

export const queryMintingFee = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<string> => {
    const module = getModule(backend_canister_id);
    return module.queryMintingFee(identity, backend_canister_id);
};

// =========================== 查询某个用户的 Artist 罐子 ===========================

export const queryUserArtistCollection = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    principal: string,
): Promise<string | undefined> => {
    const module = getModule(backend_canister_id);
    return module.queryUserArtistCollection(identity, backend_canister_id, principal);
};
// =========================== 用户创建 Artist collection ===========================

export type ArtistCollectionArgs = {
    // standard: CollectionStandard; // 过于复杂, 前端肯定不需要
    royalties?: string; // ? bigint -> string
    isVisible?: boolean;

    name?: string;
    category?: string;
    description?: string;
    featured?: string;
    logo?: string;
    banner?: string;
    links?: CollectionLinks;

    releaseTime?: string; // ? bigint -> string
    openTime?: string; // ? bigint -> string

    url?: string; // ? 说没有用的字段
};

export const createArtistCollection = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: ArtistCollectionArgs,
): Promise<string> => {
    const module = getModule(backend_canister_id);
    return module.createArtistCollection(identity, backend_canister_id, args);
};

// =========================== 查询有权限创建 NFT 的账户 ===========================

export type NftMetadataLink<T extends string> = { label: T; value: string };
export type Attribute = { trait_type: string; value: string };

export type MintingNFT = {
    name: string;
    category: string;
    description: string;
    url: string;
    mimeType: string;
    thumb: string;
    attributes?: Attribute[];
    timestamp: number; // 毫秒
    linkList?: [
        NftMetadataLink<'discord'>,
        NftMetadataLink<'instagram'>,
        NftMetadataLink<'medium'>,
        NftMetadataLink<'telegram'>,
        NftMetadataLink<'twitter'>,
        NftMetadataLink<'website'>,
    ];
};

export const mintArtistNFT = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: {
        collection: string;
        to: string; // principal or account_hex
        metadata?: MintingNFT;
        height: string; // 付费的高度
    },
): Promise<NftIdentifier> => {
    const module = getModule(backend_canister_id);
    return module.mintArtistNFT(identity, backend_canister_id, args);
};

// =========================== 查询通知消息 ===========================

export type ArtistNotice = {
    id: string; // ? bigint -> string
    status: 'read' | 'unread';
    minter: string;
    timestamp: string; // ? bigint -> string
    result: { reject: string } | { accept: string };
};

export const queryNoticeList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<ArtistNotice[]> => {
    const module = getModule(backend_canister_id);
    return module.queryNoticeList(identity, backend_canister_id);
};

// =========================== 设置通知已读 ===========================

export const readNotices = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: string[],
): Promise<void> => {
    const module = getModule(backend_canister_id);
    return module.readNotices(identity, backend_canister_id, args);
};
