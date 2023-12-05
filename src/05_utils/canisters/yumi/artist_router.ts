import * as artist_router from '@/03_canisters/yumi/yumi_artist_router';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftIdentifier } from '@/01_types/nft';
import { ArtistCollectionData } from '@/01_types/yumi';
import { ArtistCollectionArgs, MintingNFT } from '@/03_canisters/yumi/yumi_artist_router';
import { anonymous } from '../../connect/anonymous';
import { getYumiArtistRouterCanisterId } from './special';

// =========================== 查询后端支持的 NFT 集合 id 列表 ===========================

export const queryArtistCollectionIdList = async (): Promise<string[]> => {
    const backend_canister_id = getYumiArtistRouterCanisterId();
    return artist_router.queryArtistCollectionIdList(anonymous, backend_canister_id);
};

export const queryArtistCollectionIdListByBackend = async (
    backend_canister_id: string,
): Promise<string[]> => {
    return artist_router.queryArtistCollectionIdList(anonymous, backend_canister_id);
};

// =========================== 查询所有的 Art NFT 列表 ===========================

export const queryAllArtistNftTokenIdList = async (): Promise<NftIdentifier[]> => {
    const backend_canister_id = getYumiArtistRouterCanisterId();
    return artist_router.queryAllArtistNftTokenIdList(anonymous, backend_canister_id);
};

// =========================== 查询后端支持的 NFT 集合列表 和详细信息 ===========================

export const queryArtistCollectionDataList = async (): Promise<ArtistCollectionData[]> => {
    const backend_canister_id = getYumiArtistRouterCanisterId();
    return artist_router.queryArtistCollectionDataList(anonymous, backend_canister_id);
};

export const queryArtistCollectionDataListByBackend = async (
    backend_canister_id: string,
): Promise<ArtistCollectionData[]> => {
    return artist_router.queryArtistCollectionDataList(anonymous, backend_canister_id);
};

// =========================== 查询有权限创建 NFT 的账户 ===========================

export const getAllArtists = async (): Promise<string[]> => {
    const backend_canister_id = getYumiArtistRouterCanisterId();
    return artist_router.getAllArtists(anonymous, backend_canister_id);
};

// =========================== 查询创建 NFT 的费用 ===========================

export const queryMintingFee = async (): Promise<string> => {
    const backend_canister_id = getYumiArtistRouterCanisterId();
    return artist_router.queryMintingFee(anonymous, backend_canister_id);
};

// =========================== 查询某个用户的 Artist 罐子 ===========================

export const queryUserArtistCollection = async (principal: string): Promise<string | undefined> => {
    const backend_canister_id = getYumiArtistRouterCanisterId();
    return artist_router.queryUserArtistCollection(anonymous, backend_canister_id, principal);
};

// =========================== 用户创建 Artist collection ===========================

export const createArtistCollection = async (
    identity: ConnectedIdentity,
    args: ArtistCollectionArgs,
): Promise<string | undefined> => {
    const backend_canister_id = getYumiArtistRouterCanisterId();
    return artist_router.createArtistCollection(identity, backend_canister_id, args);
};
// =========================== 创建 NFT 的 ===========================

export const mintArtistNFT = async (
    identity: ConnectedIdentity,
    args: {
        collection: string;
        to: string; // principal or account_hex
        metadata?: MintingNFT;
        height: string; // 付费的高度
    },
): Promise<NftIdentifier> => {
    const backend_canister_id = getYumiArtistRouterCanisterId();
    return artist_router.mintArtistNFT(identity, backend_canister_id, args);
};

// =========================== 查询通知消息 ===========================

export type ArtistNotice = {
    id: string; // ? bigint -> string
    status: 'read' | 'unread';
    minter: string;
    timestamp: string; // ? bigint -> string
    result: { reject: string } | { accept: string };
};

export const queryNoticeList = async (identity: ConnectedIdentity): Promise<ArtistNotice[]> => {
    const backend_canister_id = getYumiArtistRouterCanisterId();
    return artist_router.queryNoticeList(identity, backend_canister_id);
};

// =========================== 设置通知已读 ===========================

export const readNotices = async (identity: ConnectedIdentity, args: string[]): Promise<void> => {
    const backend_canister_id = getYumiArtistRouterCanisterId();
    return artist_router.readNotices(identity, backend_canister_id, args);
};
