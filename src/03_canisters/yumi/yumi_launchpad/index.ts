import { ConnectedIdentity } from '@/01_types/identity';
import { CollectionLinks, CollectionStandard } from '@/01_types/yumi';
import { bigint2string, string2bigint } from '@/02_common/types/bigint';
import { unwrapOptionMap } from '@/02_common/types/options';
import { principal2string, string2principal } from '@/02_common/types/principal';
import { unwrapMotokoResultMap } from '@/02_common/types/results';
import { throwsVariantError } from '@/02_common/types/variant';
import { parseCollectionStandard, unwrapCollectionLinks } from '../../yumi/types';
import idlFactory from './launchpad.did';
import _SERVICE, { CollectionInfo as CandidCollectionInfo } from './launchpad.did.d';

// ======================== 查询 Launchpad 的项目 ========================

export type LaunchpadCollectionStatus =
    | 'upcoming' // 即将上线
    | 'whitelist' // 白名单可买
    | 'open' // 公众可买
    | 'expired' // 已过期
    | 'unknown'; // ! 不知道算是什么状态

export const getLaunchpadCollectionStatus = (
    info: LaunchpadCollectionInfo,
): LaunchpadCollectionStatus => {
    const now = BigInt(new Date().getTime() * 1e6);

    const whitelist_start = BigInt(info.whitelist_start);
    const whitelist_end = BigInt(info.whitelist_end);
    const open_start = BigInt(info.open_start);
    const open_end = BigInt(info.open_end);

    if (now < whitelist_start) return 'upcoming';
    if (whitelist_start <= now && now < whitelist_end) return 'whitelist';
    // if (whitelist_end <= now && now < open_start) return 'unknown'; // ? 怎么就遗漏了这个时间段
    if (open_start <= now && now < open_end) return 'open';
    if (open_end <= now) return 'expired';

    return 'unknown';
};
export const getLaunchpadTimeRemain = (info: LaunchpadCollectionInfo): string => {
    const status = getLaunchpadCollectionStatus(info);
    const now = BigInt(Date.now() * 1e6);

    const whitelist_start = BigInt(info.whitelist_start);
    const whitelist_end = BigInt(info.whitelist_end);
    // const open_start = BigInt(info.open_start);
    const open_end = BigInt(info.open_end);

    switch (status) {
        case 'upcoming':
            return bigint2string(whitelist_start - now);
        case 'whitelist':
            return bigint2string(whitelist_end - now);
        case 'open':
            return bigint2string(open_end - now);
        case 'expired':
            return '0';
        default:
            return '0';
    }
};
export type LaunchpadCollectionInfo = {
    index: string; // ? bigint -> string
    collection: string; // ? principal -> string // id
    created: string; // ? bigint -> string // addTime

    featured: string; // 卡片图
    featured_mobile: string;

    name: string;
    banner: string;
    description: string;
    links?: CollectionLinks;

    standard: CollectionStandard;

    team: string;
    teamImages: string[]; // teamImage

    supply: string; // ? bigint -> string // totalSupply

    whitelist_start: string; // ? bigint -> string // whitelistTimeStart //
    whitelist_end: string; // ? bigint -> string // whitelistTimeEnd //
    whitelist_price: string; // ? bigint -> string // whitelistPrice
    whitelist_limit: string; // ? bigint -> string // whitelistPerCount // whitelist per wallet account
    whitelist_supply: string; // ? bigint -> string // whitelistCount

    remain: string; // ? bigint -> string // avaliable /* cspell: disable-line */

    open_start: string; // ? bigint -> string // starTime
    open_end: string; // ? bigint -> string // endTime
    open_price: string; // ? bigint -> string // price
    open_limit?: string; // ? bigint -> string // normalPerCount // public per wallet account
    open_supply: string; // ? bigint -> string // normalCount

    typical: {
        token_index: number; //
        name: string;
        collection: string; // ? principal -> string
        url: string;
    }[];

    production: string; // 产品介绍

    faq: { question: string; answer: string }[]; // 问答

    // approved: string; // 不知道干嘛的
};

export type AllLaunchpadCollections = {
    upcoming: LaunchpadCollectionInfo[];
    whitelist: LaunchpadCollectionInfo[];
    open: LaunchpadCollectionInfo[];
    expired: LaunchpadCollectionInfo[];
};

const parseLaunchpadCollectionInfo = (d: CandidCollectionInfo): LaunchpadCollectionInfo => {
    return {
        index: bigint2string(d.index),
        collection: principal2string(d.id),
        created: bigint2string(d.addTime),
        featured: d.featured,
        featured_mobile: d.featured_mobile,
        name: d.name,
        banner: d.banner,
        description: d.description,
        links: unwrapCollectionLinks(d.links),
        standard: parseCollectionStandard(d.standard),
        team: d.team,
        teamImages: d.teamImage,
        supply: bigint2string(d.totalSupply),
        whitelist_start: bigint2string(d.whitelistTimeStart),
        whitelist_end: bigint2string(d.whitelistTimeEnd),
        whitelist_price: bigint2string(d.whitelistPrice),
        whitelist_limit: bigint2string(d.whitelistPerCount),
        whitelist_supply: bigint2string(d.whitelistCount),
        remain: bigint2string(d.avaliable) /* cspell: disable-line */,
        open_start: bigint2string(d.starTime),
        open_end: bigint2string(d.endTime),
        open_price: bigint2string(d.price),
        open_limit: unwrapOptionMap(d.normalPerCount, bigint2string),
        open_supply: bigint2string(d.normalCount),
        typical: d.typicalNFTs.map((n) => ({
            token_index: n.TokenIndex,
            name: n.NFTName,
            collection: principal2string(n.Canister),
            url: n.NFTUrl,
        })),
        production: d.production,
        faq: d.faq.map((a) => ({ question: a.Question, answer: a.Answer })),
    };
};

export const queryAllLaunchpadCollections = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<LaunchpadCollectionInfo[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.listCollections();
    return r.map(parseLaunchpadCollectionInfo);
};

export const queryAllLaunchpadCollectionsWithStatus = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<AllLaunchpadCollections> => {
    const list = await queryAllLaunchpadCollections(identity, backend_canister_id);

    const now = BigInt(new Date().getTime() * 1e6);

    const compare =
        (map: (info: LaunchpadCollectionInfo) => number) =>
        (a: LaunchpadCollectionInfo, b: LaunchpadCollectionInfo) =>
            map(a) - map(b);

    // filter and sort
    const upcoming = list
        .filter((info) => now < BigInt(info.whitelist_start))
        .sort(compare((info) => -Number(info.created)));
    const whitelist = list
        .filter((info) => BigInt(info.whitelist_start) <= now && now < BigInt(info.whitelist_end))
        .sort(compare((info) => -Number(info.created)));
    const open = list
        .filter((info) => BigInt(info.open_start) <= now && now < BigInt(info.open_end))
        .sort(compare((info) => -Number(info.created)));
    const expired = list
        .filter((info) => BigInt(info.open_end) < now)
        .sort(compare((info) => Number(now) - Number(info.open_end)));

    return {
        upcoming,
        whitelist,
        open,
        expired,
    };
};

export const querySingleLaunchpadCollectionInfo = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    collection: string,
): Promise<LaunchpadCollectionInfo | undefined> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.getCollection(string2principal(collection));
    return unwrapOptionMap(r, parseLaunchpadCollectionInfo);
};

// ======================== 查询 Launchpad 的项目 用户最大可购买数量 ========================

// 报错表示不是白名单
export const queryWhitelistUserRemainAmount = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: {
        collection: string;
        whitelist_limit: string; // 白名单数量限制
        supply: string; // 总供应量
        remain: string; // 当前 NFT 剩下的量
        whitelist_supply: string; // 白名单总供应量
    },
): Promise<number> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.isWhitelist(string2principal(args.collection));
    return unwrapMotokoResultMap<bigint, string, number>(
        r,
        (a) =>
            Math.min(
                Math.max(0, Number(args.whitelist_limit) - Number(a)), // 这是只看用户剩下的可购买量
                Number(args.whitelist_supply) - (Number(args.supply) - Number(args.remain)), // 当前白名单剩下的总额度
                Number(args.remain), // 当前剩下的总数量
            ),
        // 最大限度减去支持的数量
        () => 0,
    );
};

// ======================== 查询 Launchpad 的项目 用户最大可购买数量 ========================

export const queryOpenUserRemainAmount = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: {
        collection: string;
        open_limit: string; // 公售数量限制
        supply: string; // 总供应量
        remain: string; // 当前 NFT 剩下的量
        open_supply: string; // 公售总供应量
    },
): Promise<number> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.listBought(string2principal(args.collection));
    const account = identity.account;
    const bought = r.filter((item) => item[0] === account).length;
    return Math.min(
        Math.max(0, Number(args.open_limit) - Number(bought)), // 这是只看用户剩下的可购买量
        Number(args.open_supply) - (Number(args.supply) - Number(args.remain)), // 当前公售剩下的总额度
        Number(args.remain), // 当前剩下的总数量
    );
};

// ======================== 充钱后取回应得的NFT ========================

export const claimLaunchpadNFT = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    height: string,
): Promise<number[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.claimWithHeight(string2bigint(height));
    return unwrapMotokoResultMap<bigint[], any, number[]>(
        r,
        (list) => list.map(Number), // 最大限度减去支持的数量
        throwsVariantError,
    );
};

// // ======================== Launchpad 加白名单 ========================

// export const launchpadAddWhitelist = async (
//     identity: ConnectedIdentity,
//     backend_canister_id: string,
//     args: {
//         collection: string;
//         account_list: string[];
//     },
// ): Promise<void> => {
//     const { creator } = identity;
//     const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
//     await actor.addWhitelist(string2principal(args.collection), args.account_list);
// };

// ======================== Launchpad 查询加白名单 ========================

export const queryLaunchpadWhitelist = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    collection: string,
): Promise<number> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.isWhitelist(string2principal(collection));
    return unwrapMotokoResultMap<bigint, string, number>(
        r,
        (a) => Number(a),
        (e) => {
            throw new Error(e);
        },
    );
};
