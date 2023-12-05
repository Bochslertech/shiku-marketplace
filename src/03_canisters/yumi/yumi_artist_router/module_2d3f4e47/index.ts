import { Principal } from '@dfinity/principal';
import _ from 'lodash';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftIdentifier } from '@/01_types/nft';
import { ArtistCollectionData, CollectionInfo } from '@/01_types/yumi';
import { string2array } from '@/02_common/data/arrays';
import { isAccountHex } from '@/02_common/ic/account';
import { isPrincipalText } from '@/02_common/ic/principals';
import { parse_nft_identifier, parse_token_identifier } from '@/02_common/nft/ext';
import { bigint2string, string2bigint } from '@/02_common/types/bigint';
import { unwrapOptionMap, wrapOption, wrapOptionMap } from '@/02_common/types/options';
import { principal2string, string2principal } from '@/02_common/types/principal';
import { unwrapMotokoResultMap } from '@/02_common/types/results';
import { throwsBy, unchanging, unwrapVariantKey } from '@/02_common/types/variant';
import { ArtistCollectionArgs, ArtistNotice, MintingNFT } from '..';
import { wrapCollectionLinks } from '../../../yumi/types';
import { parseCollectionInfo } from '../../yumi_core/module_cfd33178';
import idlFactory from './artist_router_2d3f4e47.did';
import _SERVICE from './artist_router_2d3f4e47.did.d';

// =========================== 查询后端支持的 NFT 集合 id 列表 ===========================

export const queryArtistCollectionIdList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<string[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.listCollections();
    return _.uniq(r); // ! 后端数据不可靠，去重
    return r;
};

// =========================== 查询后端支持的 NFT 集合列表 和详细信息 ===========================

export const queryArtistCollectionDataList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<ArtistCollectionData[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.getCollectionInfos();
    // 对结果进行处理
    const results = r.map((d) => {
        const info: CollectionInfo = parseCollectionInfo(d);
        const data: ArtistCollectionData = { info };
        return data;
    });
    return _.uniqBy(results, (item) => item.info.collection); // ! 后端数据不可靠，去重
    return results;
};

// =========================== 查询所有的 Art NFT 列表 ===========================

export const queryAllArtistNftTokenIdList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<NftIdentifier[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.listNFT();
    return r.map(parse_nft_identifier);
};

// =========================== 查询有权限创建 NFT 的账户 ===========================

export const getAllArtists = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<string[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.getArtists();
    return r.map(principal2string);
};

// =========================== 查询创建 NFT 的费用 ===========================

export const queryMintingFee = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<string> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.getNFTCost();
    return bigint2string(r);
};

// =========================== 查询某个用户的 Artist 罐子 ===========================

export const queryUserArtistCollection = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    principal: string,
): Promise<string | undefined> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.getCollectionByPid(string2principal(principal));
    return unwrapOptionMap(r, principal2string);
};
// =========================== 用户创建 Artist collection ===========================

export const createArtistCollection = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: ArtistCollectionArgs,
): Promise<string> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.createCollection({
        standard: { ext: null },
        royalties: { fee: string2bigint(args.royalties ?? '0'), precision: string2bigint('2') },
        isVisible: args.isVisible ?? false,

        name: wrapOption(args.name),
        category: wrapOption(args.category),
        description: wrapOption(args.description),
        featured: wrapOption(args.featured),
        logo: wrapOption(args.logo),
        banner: wrapOption(args.banner),
        links: wrapCollectionLinks(args.links),

        releaseTime: wrapOptionMap(args.releaseTime, string2bigint),
        openTime: wrapOptionMap(args.openTime, string2bigint),

        url: wrapOption(args.url),
    });
    return unwrapMotokoResultMap<Principal, string, string>(
        r,
        principal2string,
        throwsBy<string>(unchanging),
    );
};

// =========================== 查询有权限创建 NFT 的账户 ===========================

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
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.mintNFTWithICP(string2bigint(args.height), args.collection, {
        to: (() => {
            if (isPrincipalText(args.to)) return { principal: string2principal(args.to) };
            if (isAccountHex(args.to)) return { address: args.to };
            throw new Error('invalid args.to');
        })(),
        metadata: wrapOptionMap(args.metadata, (m) => string2array(JSON.stringify(m))),
    });
    return unwrapMotokoResultMap<number, string, NftIdentifier>(
        r,
        (token_index) => ({
            collection: args.collection,
            token_identifier: parse_token_identifier(args.collection, token_index),
        }),
        throwsBy<string>(unchanging),
    );
};

// =========================== 查询通知消息 ===========================

export const queryNoticeList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<ArtistNotice[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.getNotice();
    return r.map((d) => ({
        id: bigint2string(d.id),
        status: (() => {
            const key = unwrapVariantKey(d.status);
            switch (key) {
                case 'readed' /* cspell: disable-line */:
                    return 'read';
                case 'unreaded' /* cspell: disable-line */:
                    return 'unread';
            }
            throw new Error(`wrong status`);
        })(),
        minter: d.minter,
        timestamp: bigint2string(d.timestamp),
        result: d.result,
    }));
};

// =========================== 设置通知已读 ===========================

export const readNotices = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: string[],
): Promise<void> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    await actor.setNoticesReaded(args.map(string2bigint)); /* cspell: disable-line */
};

export default {
    queryArtistCollectionIdList,
    queryArtistCollectionDataList,
    queryAllArtistNftTokenIdList,
    getAllArtists,
    queryMintingFee,
    queryUserArtistCollection,
    createArtistCollection,
    mintArtistNFT,
    queryNoticeList,
    readNotices,
};
