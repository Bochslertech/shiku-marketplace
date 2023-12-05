import _ from 'lodash';
import { ConnectedIdentity } from '@/01_types/identity';
import { ListingFee, NftListingData } from '@/01_types/listing';
import { NftIdentifier, TokenInfo } from '@/01_types/nft';
import { ExtUser } from '@/01_types/nft-standard/ext';
import { CoreCollectionData } from '@/01_types/yumi';
import { principal2account } from '@/02_common/ic/account';
import { canister_module_hash_and_time } from '@/02_common/ic/status';
import { bigint2string, string2bigint } from '@/02_common/types/bigint';
import { principal2string } from '@/02_common/types/principal';
import { MotokoResult, parseMotokoResult, unwrapMotokoResult } from '@/02_common/types/results';
import { unwrapVariantKey } from '@/02_common/types/variant';
import { getRandomAvatar, getRandomBanner } from '@/02_common/yumi';
import { filterNotSupportedTokenIdentifier, filterOgyTokenIdentifier } from '../../nft/special';
import module_5cecdb32 from './module_5cecdb32';
import module_3242c807 from './module_3242c807';
import { Result_2 as CandidProfileLetResult } from './module_3242c807/core_3242c807.did.d';
import module_cfd33178 from './module_cfd33178';

const MAPPING_MODULES = {
    ['5cecdb323f621b2af6bb46643344da08e4ffca5678654199505d701baab98e1b']: module_5cecdb32,
    ['3242c8077cd7ffba5a58abe98db0bd46fac030bbd57857572944257dbdc8fabb']: module_3242c807,
    ['cfd33178f492d106e545b0803705e3c54c461716ef6665386f7c3cc1728a8723']: module_cfd33178,
};

const MAPPING_CANISTERS: Record<
    string,
    | '5cecdb323f621b2af6bb46643344da08e4ffca5678654199505d701baab98e1b'
    | '3242c8077cd7ffba5a58abe98db0bd46fac030bbd57857572944257dbdc8fabb'
    | 'cfd33178f492d106e545b0803705e3c54c461716ef6665386f7c3cc1728a8723'
> = {
    // ! 正式环境
    ['udtw4-baaaa-aaaah-abc3q-cai']:
        '5cecdb323f621b2af6bb46643344da08e4ffca5678654199505d701baab98e1b',
    // * 预发布环境
    ['pfsjt-fqaaa-aaaap-aaapq-cai']:
        '3242c8077cd7ffba5a58abe98db0bd46fac030bbd57857572944257dbdc8fabb',
    // ? 测试环境
    ['ajy76-hiaaa-aaaah-aa3mq-cai']:
        'cfd33178f492d106e545b0803705e3c54c461716ef6665386f7c3cc1728a8723',
};

// 检查每一个罐子的 module 有没有改变,如果变化了就要通知
export const checkYumiCoreCanisterModule = async () => {
    for (const canister_id of [
        'udtw4-baaaa-aaaah-abc3q-cai',
        'pfsjt-fqaaa-aaaap-aaapq-cai',
        'ajy76-hiaaa-aaaah-aa3mq-cai',
    ]) {
        const r = await canister_module_hash_and_time(canister_id, import.meta.env.CONNECT_HOST);
        console.error('yumi core canister module is changed', canister_id, r.module_hash);
    }
};

// 运行时检查,如果没有实现对应的模块,就报错提示
for (const key of Object.keys(MAPPING_CANISTERS)) {
    const module = MAPPING_CANISTERS[key];
    if (!MAPPING_MODULES[module]) {
        console.error('Yumi core canister is not implement', key, module);
    }
}
const getModule = (collection: string) => {
    const module_hex = MAPPING_CANISTERS[collection];
    if (module_hex === undefined) throw new Error(`unknown yumi core canister id: ${collection}`);
    const module = MAPPING_MODULES[module_hex];
    if (module === undefined) throw new Error(`unknown yumi core canister id: ${collection}`);
    return module;
};

// ================================ 第一次注册用户 =====================================
// yumi 注册用户获得随机用户信息
export const getNewUser = (principal: string) => {
    return {
        userName: principal,
        banner: getRandomBanner(),
        avatar: getRandomAvatar(),
        email: '',
        bio: '',
        notification: [],
    };
};

export const registerUser = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    principal: string,
): Promise<boolean> => {
    const module = getModule(backend_canister_id);
    const r = await module.registerUser(identity, backend_canister_id, principal);
    // console.debug(`🚀 ~ file: index.ts:107 ~ r:`, principal, r);
    return r;
};

// ================================ 更新用户设置信息 =====================================
export type UpdateUserSettingsArgs = {
    username: string;
    banner: string;
    avatar: string;
    email: string;
    bio: string;
};
export const getUserSettings = (args: UpdateUserSettingsArgs) => {
    return {
        userName: args.username,
        banner: args.banner,
        avatar: args.avatar,
        email: args.email,
        bio: args.bio,
        notification: [],
    };
};
export const updateUserSettings = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: UpdateUserSettingsArgs,
): Promise<boolean> => {
    const module = getModule(backend_canister_id);
    return module.updateUserSettings(identity, backend_canister_id, args);
};

// =========================== 查询用户信息 ===========================

export type QueryProfileArgs =
    | { type: 'address'; account: string }
    | { type: 'principal'; principal: string };

type ProfileError = { alreadyCreate: null } | { noProfile: null } | { defaultAccount: null };
export type ProfileLet = {
    principal: string | undefined; // ? principal -> string // userId
    account: string;
    username: string;
    banner: string;
    avatar: string;
    email: string;
    bio: string;
    notification: string[];
    created: string[]; // ? token_identifier
    favorited: string[]; // ? token_identifier
    time: string; // ? bigint -> string
    offersReceived: string[];
    collections: string[]; // ? principal -> string
    collected: string[]; // ? token_identifier
    offersMade: string[];
    followed: string[]; // ? principal -> string
    followers: string[]; // ? principal -> string
};
export type ProfileResult = MotokoResult<ProfileLet, ProfileError>;

export const parseProfileLet = (args: QueryProfileArgs, r: CandidProfileLetResult): ProfileLet => {
    const mapped: ProfileResult = parseMotokoResult(
        r,
        (ok) => {
            const value: ProfileLet = {
                principal: principal2string(ok.userId), // ? principal -> string
                account: principal2account(principal2string(ok.userId)),
                username: ok.userName,
                banner: ok.banner,
                avatar: ok.avatar,
                email: ok.email,
                bio: ok.bio,
                notification: ok.notification,
                created: _.uniq(
                    ok.created
                        .filter(filterNotSupportedTokenIdentifier)
                        .filter(filterOgyTokenIdentifier),
                ), // ! 可能仍存在不支持的 NFT // OGY 的罐子也不要
                favorited: _.uniq(
                    ok.favorited
                        .filter(filterNotSupportedTokenIdentifier)
                        .filter(filterOgyTokenIdentifier),
                ), // ! 可能仍存在不支持的 NFT // OGY 的罐子也不要
                time: bigint2string(ok.time),
                offersReceived: ok.offersReceived.map(bigint2string),
                collections: ok.collections.map(principal2string), // ? principal -> string
                collected: ok.collected,
                offersMade: ok.offersMade.map(bigint2string),
                followed: ok.followeds.map(principal2string) /* cspell: disable-line */, // ? principal -> string
                followers: ok.followers.map(principal2string), // ? principal -> string
            };
            return value;
        },
        (err) => err,
    );
    return unwrapMotokoResult(mapped, (e) => {
        const key = unwrapVariantKey(e);
        if (key === 'noProfile') {
            const mock: ProfileLet = {
                principal: args.type === 'principal' ? args.principal : undefined, // ? principal -> string
                account: args.type === 'principal' ? principal2account(args.principal) : '',
                username: args.type === 'principal' ? args.principal : args.account,
                banner: getRandomBanner(),
                avatar: getRandomAvatar(),
                email: '',
                bio: '',
                notification: [],
                created: [], // ! 可能仍存在不支持的 NFT
                favorited: [], // ! 可能仍存在不支持的 NFT
                time: `${Date.now() * 1e6}`,
                offersReceived: [],
                collections: [], // ? principal -> string
                collected: [],
                offersMade: [],
                followed: [], // ? principal -> string
                followers: [], // ? principal -> string
            };
            return mock;
        }
        throw new Error(key);
    });
};

export const queryProfile = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: QueryProfileArgs,
): Promise<ProfileLet> => {
    const module = getModule(backend_canister_id);
    return module.queryProfile(identity, backend_canister_id, args);
};

// =========================== 查询后端支持的 NFT 集合列表 ===========================

export const queryCoreCollectionIdList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<string[]> => {
    const module = getModule(backend_canister_id);
    return module.queryCoreCollectionIdList(identity, backend_canister_id);
};

// =========================== 查询后端支持的 NFT 集合列表 和详细信息 ===========================

export const queryCoreCollectionDataList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<CoreCollectionData[]> => {
    const module = getModule(backend_canister_id);
    return module.queryCoreCollectionDataList(identity, backend_canister_id);
};

// =========================== 查询指定的 NFT 集合列表 和详细信息 ===========================

export const queryCoreCollectionData = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    collection: string,
): Promise<CoreCollectionData | undefined> => {
    const module = getModule(backend_canister_id);
    return module.queryCoreCollectionData(identity, backend_canister_id, collection);
};

// =========================== 查询后端支持的单个 NFT 集合详细信息 ===========================
// ? 暂未使用
// export const querySingleCoreCollectionData = async (
//     backend_canister_id: string,
//     collection: string,
// ): Promise<CoreCollectionData> => {
//     const { creator } = identity;
//     const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
//     const r = await actor.getCollectionData(string2principal(collection));
//     const data = unwrapOption(r);
//     if (data === undefined) throw new Error('collection not found');
//     return parseCoreCollectionData(data);
// };

// =========================== 查询指定用户的拍卖出价记录 ===========================

export type AuctionOffer = {
    token_id: NftIdentifier;
    ttl: string; // ? bigint -> string
    status: 'expired' | 'rejected' | 'ineffect' | 'accepted' /* cspell: disable-line */;
    token: TokenInfo;
    tokenIdentifier: string; // ? token_identifier
    time: string; // ? bigint -> string
    seller: ExtUser;
    price: string; // ? bigint -> string
    offerId: string; // ? bigint -> string
    bidder: string; // ? principal -> string
};
export const queryAllAuctionOfferList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    principal: string,
): Promise<AuctionOffer[]> => {
    const module = getModule(backend_canister_id);
    return module.queryAllAuctionOfferList(identity, backend_canister_id, principal);
};

// =========================== 查询指定Token的 上架信息 ===========================

export const queryTokenListing = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    token_id_list: NftIdentifier[],
): Promise<NftListingData[]> => {
    const module = getModule(backend_canister_id);
    return module.queryTokenListing(identity, backend_canister_id, token_id_list);
};

// =========================== 查询平台费率 ===========================

export type YumiPlatformFee = {
    account: string;
    fee: string; // ? bigint -> string
    precision: string; // ? bigint -> string
};

export const queryYumiPlatformFee = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<YumiPlatformFee> => {
    const module = getModule(backend_canister_id);
    return module.queryYumiPlatformFee(identity, backend_canister_id);
};

// =========================== 批量记录上架信息 ===========================

export const wrapTokenInfo = (token: TokenInfo) => {
    return {
        symbol: token.symbol,
        canister: token.canister,
        decimal: string2bigint(token.decimals),
        fee: string2bigint(token.fee ?? '0'),
    };
};

// ! 错误信息也在结果里，需要调用方检查结果是不是 token_identifier
export const batchListing = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: {
        token_identifier: string;
        token: TokenInfo;
        price: string;
    }[],
): Promise<string[]> => {
    const module = getModule(backend_canister_id);
    return module.batchListing(identity, backend_canister_id, args);
};

// =========================== 记录上架信息 ===========================

export const listing = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: {
        token_identifier: string;
        token: TokenInfo;
        price: string;
    },
): Promise<string> => {
    const module = getModule(backend_canister_id);
    return module.listing(identity, backend_canister_id, args);
};

// =========================== 记录下架信息 ===========================

export const cancelListing = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    token_identifier: string,
): Promise<string> => {
    const module = getModule(backend_canister_id);
    return module.cancelListing(identity, backend_canister_id, token_identifier);
};

// =========================== 收藏某个 NFT ===========================

export const favoriteByCore = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: {
        token_identifier: string;
        favorite: boolean;
    },
): Promise<void> => {
    const module = getModule(backend_canister_id);
    module.favoriteByCore(identity, backend_canister_id, args);
};

// =========================== 创建购买订单 ===========================

export type YumiBuyOrder = {
    fee: ListingFee; // 平台费
    token: TokenInfo; // 币种
    tokenIdentifier: string;
    tradeType:
        | 'listing' // ? fixed ->
        | 'dutch' // ? dutchAuction ->
        | 'offer' // 荷兰拍卖的出价记录
        | 'auction';
    memo: string; // ? bigint -> string
    time: string; // ? bigint -> string
    seller: ExtUser;
    buyer: ExtUser;
    price: string; // ? bigint -> string
};

export const createSingleBuyOrder = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    token_identifier: string, // 只要一个识别码就行了?
): Promise<YumiBuyOrder> => {
    const module = getModule(backend_canister_id);
    return module.createSingleBuyOrder(identity, backend_canister_id, token_identifier);
};

// =========================== 提交转账记录证明 ===========================

export const submittingTransferHeight = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: { token_id: NftIdentifier; height: string; token: TokenInfo },
): Promise<string> => {
    const module = getModule(backend_canister_id);
    return module.submittingTransferHeight(identity, backend_canister_id, args);
};

// =========================== 批量创建购买订单 ===========================

export type BatchOrderInfo = {
    memo: string; // ? bigint -> string
    price: string; // ? bigint -> string
};

export const createBatchBuyOrder = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    token_identifier_list: string[], // 只要一个识别码就行了?
): Promise<BatchOrderInfo> => {
    const module = getModule(backend_canister_id);
    return module.createBatchBuyOrder(identity, backend_canister_id, token_identifier_list);
};

// =========================== 批量提交转账记录证明 ===========================

export const submittingTransferBatchHeight = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    transfer_height: string,
    token_id_list: NftIdentifier[],
): Promise<string[]> => {
    const module = getModule(backend_canister_id);
    return module.submittingTransferBatchHeight(
        identity,
        backend_canister_id,
        transfer_height,
        token_id_list,
    );
};

// =========================== 查询购物车 ===========================

export const queryShoppingCart = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<NftIdentifier[]> => {
    const module = getModule(backend_canister_id);
    return module.queryShoppingCart(identity, backend_canister_id);
};

// =========================== 增加待购 NFT ===========================

// ! 错误信息也在结果里，需要调用方检查结果是不是 token_identifier
// ! 错误信息 前缀是 id
export const addShoppingCartItems = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: {
        token_identifier: string;
        url: string;
        name: string;
    }[],
): Promise<string[]> => {
    const module = getModule(backend_canister_id);
    return module.addShoppingCartItems(identity, backend_canister_id, args);
};

// =========================== 移除待购 NFT ===========================

export const removeShoppingCartItems = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    token_identifier?: string,
): Promise<void> => {
    const module = getModule(backend_canister_id);
    module.removeShoppingCartItems(identity, backend_canister_id, token_identifier);
};

// =========================== 订阅邮箱 ===========================

export const subscribeEmail = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    email: string,
): Promise<void> => {
    const module = getModule(backend_canister_id);
    module.subscribeEmail(identity, backend_canister_id, email);
};

// =========================== 新增查看次数 ===========================

export const viewedNft = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    token_identifier: string,
): Promise<void> => {
    const module = getModule(backend_canister_id);
    module.viewedNft(identity, backend_canister_id, token_identifier);
};

// =========================== 查询最高出价 shiku 拍卖 ===========================

export const queryShikuLandsHighestOffer = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    token_identifier: string, // shiku lands 的 NFT
): Promise<AuctionOffer | undefined> => {
    const module = getModule(backend_canister_id);
    return module.queryShikuLandsHighestOffer(identity, backend_canister_id, token_identifier);
};

// =========================== 查询 shiku 拍卖 是否成交 ===========================

export type ShikuNftDutchAuctionDealPrice = {
    token: TokenInfo;
    price: string; // ? bigint -> string
};

export const queryShikuLandsDealPrice = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    token_identifier: string, // shiku lands 的 NFT
): Promise<ShikuNftDutchAuctionDealPrice | undefined> => {
    const module = getModule(backend_canister_id);
    return module.queryShikuLandsDealPrice(identity, backend_canister_id, token_identifier);
};

// =========================== 查询 shiku 出价付款地址 ===========================

export const queryShikuLandsPayAccount = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<string> => {
    const module = getModule(backend_canister_id);
    return module.queryShikuLandsPayAccount(identity, backend_canister_id);
};

// =========================== shiku 进行出价 ===========================

export type ShikuLandsMakeOfferArgs = {
    seller: string; // account
    token_id: NftIdentifier;
    token: TokenInfo;
    price: string;
    ttl: string;
};

export const shikuLandsMakeOffer = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: ShikuLandsMakeOfferArgs,
): Promise<string> => {
    const module = getModule(backend_canister_id);
    return module.shikuLandsMakeOffer(identity, backend_canister_id, args);
};

// =========================== shiku 修改出价 ===========================

export const shikuLandsUpdateOffer = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: {
        offer_id: string; // ? bigint -> string
        price: string;
    },
): Promise<string> => {
    const module = getModule(backend_canister_id);
    return module.shikuLandsUpdateOffer(identity, backend_canister_id, args);
};
