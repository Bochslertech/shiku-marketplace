import { Principal } from '@dfinity/principal';
import _ from 'lodash';
import { ConnectedIdentity } from '@/01_types/identity';
import { ListingFee, NftListing, NftListingData } from '@/01_types/listing';
import { NftIdentifier, TokenInfo } from '@/01_types/nft';
import { ExtUser } from '@/01_types/nft-standard/ext';
import {
    CollectionCreator,
    CollectionInfo,
    CollectionMetadata,
    CoreCollectionData,
} from '@/01_types/yumi';
import { customStringify } from '@/02_common/data/json';
import { parse_nft_identifier } from '@/02_common/nft/ext';
import { bigint2string, string2bigint } from '@/02_common/types/bigint';
import { unwrapOption, unwrapOptionMap, wrapOption } from '@/02_common/types/options';
import { principal2string, string2principal } from '@/02_common/types/principal';
import {
    parseMotokoResult,
    unwrapMotokoResult,
    unwrapMotokoResultMap,
} from '@/02_common/types/results';
import {
    mapping_true,
    throwsVariantError,
    unchanging,
    unwrapVariant2,
    unwrapVariant4Map,
    unwrapVariantKey,
} from '@/02_common/types/variant';
import {
    AuctionOffer,
    BatchOrderInfo,
    getNewUser,
    getUserSettings,
    parseProfileLet,
    ProfileLet,
    ShikuLandsMakeOfferArgs,
    ShikuNftDutchAuctionDealPrice,
    UpdateUserSettingsArgs,
    wrapTokenInfo,
    YumiBuyOrder,
} from '..';
import { parseCollectionStandard, unwrapCollectionLinks } from '../../../yumi/types';
import idlFactory from './core_3242c807.did';
import _SERVICE, {
    Auction as CandidAuction,
    CollectionData as CandidCollectionData,
    DutchAuction as CandidDutchAuction,
    Fee as CandidFee,
    Fixed as CandidFixed,
    CollectionCreatorData,
    CollectionInfo__1,
    /* cspell: disable-next-line */
    CollectionStatsImmut,
    Err,
    Err__1,
    Offer,
    Order,
    TokenSpec__2,
    User__1,
} from './core_3242c807.did.d';

// ================================ 第一次注册用户 =====================================

export const registerUser = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    principal: string,
): Promise<boolean> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.createProfile(getNewUser(principal));
    // console.debug(`🚀 ~ file: index.ts:82 ~ r:`, r);
    const mapped = parseMotokoResult(r, mapping_true, (err) => err);
    return unwrapMotokoResult(mapped, (e) => {
        if (e['alreadyCreate'] !== undefined) return false; // 当做注册成功处理,不抛出异常了
        throw new Error(`${unwrapVariantKey(e)}`);
    });
};

// ================================ 更新用户设置信息 =====================================

export const updateUserSettings = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: UpdateUserSettingsArgs,
): Promise<boolean> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.updateProfile(getUserSettings(args));
    return r;
};

// =========================== 查询用户信息 ===========================

export const queryProfile = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: { type: 'address'; account: string } | { type: 'principal'; principal: string },
): Promise<ProfileLet> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.findProfileWho(
        args.type === 'address'
            ? { address: args.account }
            : { principal: string2principal(args.principal) },
    );
    return parseProfileLet(args, r);
};

// =========================== 查询后端支持的 NFT 集合列表 ===========================

export const queryCoreCollectionIdList = async (
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

export const parseCollectionInfo = (info: CollectionInfo__1): CollectionInfo => ({
    collection: principal2string(info.canisterId), // ? principal -> string
    url: unwrapOption(info.url),
    creator: principal2string(info.creator), // ? principal -> string
    featured: unwrapOption(info.featured),
    logo: unwrapOption(info.logo),
    name: info.name,
    banner: unwrapOption(info.banner),
    description: unwrapOption(info.description),
    links: unwrapCollectionLinks(info.links),
    isVisible: info.isVisible,
    royalties: bigint2string(info.royalties),
    category: unwrapOption(info.category),
    standard: parseCollectionStandard(info.standard),
    releaseTime: unwrapOptionMap(info.releaseTime, bigint2string),
});
const parseCollectionCreator = (
    creator: [] | [CollectionCreatorData],
): CollectionCreator | undefined =>
    unwrapOptionMap(creator, (o) => ({
        bio: o.bio,
        username: o.userName,
        userId: principal2string(o.userId), // ? principal -> string
        time: bigint2string(o.time),
        avatar: o.avatar,
    }));
const parseCollectionMetadata = (
    stats: [] | [CollectionStatsImmut] /* cspell: disable-line */,
): CollectionMetadata | undefined =>
    unwrapOptionMap(stats, (s) => ({
        listings: s.listings.map((l) => ({
            tokenIdentifier: l.tokenIdentifier,
            price: bigint2string(l.price),
        })),
        tradeCount: bigint2string(s.tradeCount),
        createTime: bigint2string(s.createTime),
        floorPrice: bigint2string(s.floorPrice), // ? bigint -> string
        volumeTrade: bigint2string(s.volumeTrade),
    }));

const parseCoreCollectionData = (d: CandidCollectionData): CoreCollectionData => {
    const info: CollectionInfo = parseCollectionInfo(d.info);
    const creator: CollectionCreator | undefined = parseCollectionCreator(d.creator);
    const metadata: CollectionMetadata | undefined = parseCollectionMetadata(d.stats);
    const data: CoreCollectionData = { info };
    if (creator !== undefined) data.creator = creator;
    if (metadata !== undefined) data.metadata = metadata;
    return data;
};
export const queryCoreCollectionDataList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<CoreCollectionData[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.listCollections2([]); // 不写过滤条件了
    const results = r.map(parseCoreCollectionData);
    return _.uniqBy(results, (item) => item.info.collection); // ! 后端数据不可靠，去重
    return results;
};

// =========================== 查询指定的 NFT 集合列表 和详细信息 ===========================

export const queryCoreCollectionData = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    collection: string,
): Promise<CoreCollectionData | undefined> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.getCollectionData(string2principal(collection));
    return unwrapOptionMap(r, parseCoreCollectionData);
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

const unwrapExtUser = (u: User__1): ExtUser =>
    unwrapVariant2<Principal, string, string, string>(
        u,
        ['principal', principal2string],
        ['address', unchanging],
    ) as ExtUser;

const unwrapTokenInfo = (token: TokenSpec__2): TokenInfo => {
    return {
        symbol: token.symbol,
        canister: token.canister,
        standard: { type: 'Ledger' },
        decimals: bigint2string(token.decimal),
        fee: bigint2string(token.fee),
    };
};

const unwrapAuctionOffer = (d: Offer): AuctionOffer => {
    return {
        token_id: {
            collection: parse_nft_identifier(d.tokenIdentifier).collection,
            token_identifier: d.tokenIdentifier,
        },
        ttl: bigint2string(d.ttl),
        status: unwrapVariantKey(d.status),
        token: unwrapTokenInfo(d.token),
        tokenIdentifier: d.tokenIdentifier,
        time: bigint2string(d.time),
        seller: unwrapExtUser(d.seller),
        price: bigint2string(d.price),
        offerId: bigint2string(d.offerId),
        bidder: principal2string(d.bidder),
    };
};
export const queryAllAuctionOfferList = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    principal: string,
): Promise<AuctionOffer[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.listOfferMade(string2principal(principal));
    // 对结果进行处理
    return r.map(unwrapAuctionOffer);
};

// =========================== 查询指定Token的 上架信息 ===========================

const parseListingFee = (fee: CandidFee): ListingFee => {
    return {
        platform: bigint2string(fee.platform),
        royalties: bigint2string(fee.royalties),
    };
};

export const queryTokenListing = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    token_id_list: NftIdentifier[],
): Promise<NftListingData[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.nftInfos(token_id_list.map((token_id) => token_id.token_identifier));
    // 对结果进行处理
    return r.map((d, i) => {
        const token_id = token_id_list[i];

        let latest_price: string | undefined = bigint2string(d.lastPrice);
        if (latest_price === '0') latest_price = undefined; // 设置成 0

        const time = unwrapOptionMap(d.listTime, bigint2string);
        /* cspell: disable-next-line */
        if (d.listing['unlist'] === undefined && time === undefined) {
            throw new Error(`listing time can not be undefiled when listing status`);
        }

        return {
            token_id,
            views: bigint2string(d.views),
            favorited: d.favoriters.map(principal2string) /* cspell: disable-line */,
            latest_price,
            listing: unwrapVariant4Map<
                null,
                CandidFixed,
                CandidAuction,
                CandidDutchAuction,
                NftListing
            >(
                d.listing,
                ['unlist', () => ({ type: 'holding' })] /* cspell: disable-line */,
                [
                    'fixed',
                    (fixed) => ({
                        type: 'listing',
                        time: time!,
                        token: unwrapTokenInfo(fixed.token),
                        price: bigint2string(fixed.price),
                        raw: {
                            type: 'yumi',
                            token_identifier: (() => {
                                if (fixed.tokenIdentifier !== token_id.token_identifier)
                                    throw new Error(`token identifier must be same`);
                                return token_id.token_identifier;
                            })(),
                            seller: principal2string(fixed.seller),
                            fee: parseListingFee(fixed.fee),
                        },
                    }),
                ],
                [
                    'auction',
                    (auction) => ({
                        type: 'auction',
                        time: time!,
                        token_identifier: (() => {
                            if (auction.tokenIdentifier !== token_id.token_identifier)
                                throw new Error(`token identifier must be same`);
                            return token_id.token_identifier;
                        })(),
                        seller: principal2string(auction.seller),
                        fee: parseListingFee(auction.fee),
                        auction: {
                            ttl: bigint2string(auction.ttl),
                            start: bigint2string(auction.startPrice),
                            abort: unwrapOptionMap(
                                auction.resevePrice /* cspell: disable-line */,
                                bigint2string,
                            ),
                            highest: (() => {
                                const price = unwrapOptionMap(auction.highestPrice, bigint2string);
                                const bidder = unwrapOptionMap(
                                    auction.highestBidder,
                                    principal2string,
                                );
                                if (price === undefined || bidder === undefined) return undefined;
                                return {
                                    price,
                                    bidder,
                                };
                            })(),
                        },
                    }),
                ],
                [
                    'dutchAuction',
                    (dutch) => ({
                        type: 'dutch',
                        time: time!,
                        token_identifier: (() => {
                            if (dutch.tokenIdentifier !== token_id.token_identifier)
                                throw new Error(`token identifier must be same`);
                            return token_id.token_identifier;
                        })(),
                        seller: principal2string(dutch.seller),
                        token: unwrapTokenInfo(dutch.token),
                        fee: parseListingFee(dutch.fee), // ? principal -> string
                        auction: {
                            time: {
                                start: bigint2string(dutch.startTime),
                                end: bigint2string(dutch.endTime),
                                reduce: bigint2string(dutch.reduceTime),
                            },
                            price: {
                                start: bigint2string(dutch.startPrice),
                                floor: bigint2string(dutch.floorPrice),
                                reduce: bigint2string(dutch.reducePrice),
                            },
                            payee: unwrapVariant2<Principal, string, string, string>(
                                dutch.payee,
                                ['principal', principal2string],
                                ['address', unchanging],
                            ) as ExtUser,
                        },
                    }),
                ],
            ),
            raw: customStringify(d),
        };
    });
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
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.queryPlatformFee();
    return {
        account: r.account,
        fee: bigint2string(r.fee),
        precision: bigint2string(r.precision),
    };
};

// =========================== 批量记录上架信息 ===========================

const formatError1 = (e: Err__1): string => {
    const key = unwrapVariantKey(e);
    switch (key) {
        case 'other':
            return `listing failed: ${e['other'][1]}`;
    }
    return `unknown error: ${key}`;
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
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.batchSell(
        args.map((args) => ({
            tokenIdentifier: args.token_identifier,
            token: wrapTokenInfo(args.token),
            price: string2bigint(args.price),
        })),
    );
    return r.map((r) =>
        unwrapMotokoResultMap<string, Err__1, string>(
            r,
            unchanging, // token_identifier
            formatError1,
        ),
    );
};

// =========================== 记录上架信息 ===========================

const throwErr__1 = (e: Err__1) => {
    const key = unwrapVariantKey(e);
    switch (key) {
        case 'other':
            throw new Error(`listing failed: ${e['other'][1]}`);
    }
    throw new Error(`unknown error: ${key}`);
};

export const listing = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: {
        token_identifier: string;
        token: TokenInfo;
        price: string;
    },
): Promise<string> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.sell({
        tokenIdentifier: args.token_identifier,
        token: {
            symbol: args.token.symbol,
            canister: args.token.canister,
            decimal: string2bigint(args.token.decimals),
            fee: string2bigint(args.token.fee ?? '0'),
        },
        price: string2bigint(args.price),
    });
    return unwrapMotokoResultMap<string, Err__1, string>(
        r,
        unchanging, // token_identifier
        throwErr__1,
    );
};

// =========================== 记录下架信息 ===========================

export const cancelListing = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    token_identifier: string,
): Promise<string> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.unSell(token_identifier);
    return unwrapMotokoResultMap<string, Err__1, string>(
        r,
        unchanging, // token_identifier
        throwErr__1,
    );
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
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    args.favorite
        ? await actor.favorite(args.token_identifier)
        : await actor.unfavorite(args.token_identifier);
};

// =========================== 创建购买订单 ===========================

export const createSingleBuyOrder = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    token_identifier: string, // 只要一个识别码就行了?
): Promise<YumiBuyOrder> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.buyNow(token_identifier);
    return unwrapMotokoResultMap<Order, Err__1, YumiBuyOrder>(
        r,
        (o) => ({
            fee: parseListingFee(o.fee),
            token: unwrapTokenInfo(o.token),
            tokenIdentifier: o.tokenIdentifier,
            tradeType: unwrapVariantKey(o.tradeType),
            memo: bigint2string(o.memo),
            time: bigint2string(o.time),
            seller: unwrapExtUser(o.seller),
            buyer: unwrapExtUser(o.buyer),
            price: bigint2string(o.price),
        }),
        throwErr__1,
    );
};

// =========================== 提交转账记录证明 ===========================

const throwErr = (e: Err) => {
    const key = unwrapVariantKey(e);
    switch (key) {
        case 'Other':
            throw new Error(`submit height failed: ${e['Other'][1]}`);
    }
    if (key) throw new Error(`submit height failed: ${key}`);
    throw new Error(`unknown error: ${key}`);
};

export const submittingTransferHeight = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: {
        token_id: NftIdentifier;
        height: string;
        token: TokenInfo;
    },
): Promise<string> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.verifyTxWithMemo(string2bigint(args.height), wrapTokenInfo(args.token));
    return unwrapMotokoResultMap<string, Err, string>(r, unchanging, (e: Err) => {
        if (e['DuplicateHeight'] === null) return args.token_id.token_identifier;
        return throwErr(e);
    });
};

// =========================== 批量创建购买订单 ===========================

export const createBatchBuyOrder = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    token_identifier_list: string[], // 只要一个识别码就行了?
): Promise<BatchOrderInfo> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.batchBuyNow(token_identifier_list);
    return unwrapMotokoResultMap<{ Memo: bigint; Price: bigint }, Err__1, BatchOrderInfo>(
        r,
        (o) => ({
            memo: bigint2string(o.Memo),
            price: bigint2string(o.Price),
        }),
        throwErr__1,
    );
};

// =========================== 批量提交转账记录证明 ===========================

export const submittingTransferBatchHeight = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    transfer_height: string,
    token_id_list: NftIdentifier[],
): Promise<string[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.batchVerifyTx(string2bigint(transfer_height));
    return unwrapMotokoResultMap<string[], Err, string[]>(r, unchanging, (e: Err) => {
        if (e['DuplicateHeight'] === null) return token_id_list.map((t) => t.token_identifier);
        return throwErr(e);
    });
};

// =========================== 查询购物车 ===========================

export const queryShoppingCart = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<NftIdentifier[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.showCart();
    return r.map((c) => parse_nft_identifier(c.tokenIdentifier));
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
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.addCarts(
        args.map((a) => ({
            tokenIdentifier: a.token_identifier,
            nftUrl: a.url,
            nftName: a.name,
        })),
    );
    return r.map((c) =>
        unwrapMotokoResultMap<string, any, string>(c, unchanging, ([token_identifier, message]) => {
            return `${token_identifier} ${message}`;
        }),
    );
};

// =========================== 移除待购 NFT ===========================

export const removeShoppingCartItems = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    token_identifier?: string,
): Promise<void> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    await actor.removeCarts(wrapOption(token_identifier));
};

// =========================== 订阅邮箱 ===========================

export const subscribeEmail = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    email: string,
): Promise<void> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    await actor.subscribe(email);
};

// =========================== 新增查看次数 ===========================

export const viewedNft = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    token_identifier: string,
): Promise<void> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    await actor.view(token_identifier);
};

// =========================== 查询最高出价 shiku 拍卖 ===========================

export const queryShikuLandsHighestOffer = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    token_identifier: string, // shiku lands 的 NFT
): Promise<AuctionOffer | undefined> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.findHighOfferByNft(token_identifier);
    return unwrapOptionMap(r, unwrapAuctionOffer);
};

// =========================== 查询 shiku 拍卖 是否成交 ===========================

export const queryShikuLandsDealPrice = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    token_identifier: string, // shiku lands 的 NFT
): Promise<ShikuNftDutchAuctionDealPrice | undefined> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.getPriceOfAuction(token_identifier);
    return unwrapOptionMap(r, (d) => ({
        token: unwrapTokenInfo(d.token),
        price: bigint2string(d.price),
    }));
};

// =========================== 查询 shiku 出价付款地址 ===========================

export const queryShikuLandsPayAccount = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<string> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.getPayAddress();
    return r;
};

// =========================== shiku 进行出价 ===========================

export const shikuLandsMakeOffer = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: ShikuLandsMakeOfferArgs,
): Promise<string> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.makeOffer({
        seller: { address: args.seller },
        tokenIdentifier: args.token_id.token_identifier,
        token: wrapTokenInfo(args.token),
        price: string2bigint(args.price),
        bidder: string2principal(identity.principal),
        ttl: string2bigint(args.ttl),
    });
    return unwrapMotokoResultMap(r, bigint2string, throwsVariantError);
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
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.updateOffer(string2bigint(args.offer_id), string2bigint(args.price));
    return unwrapMotokoResultMap(r, bigint2string, throwsVariantError);
};

export default {
    registerUser,
    updateUserSettings,
    queryProfile,
    queryCoreCollectionIdList,
    parseCollectionInfo,
    queryCoreCollectionDataList,
    queryCoreCollectionData,
    queryAllAuctionOfferList,
    queryTokenListing,
    queryYumiPlatformFee,
    batchListing,
    listing,
    cancelListing,
    favoriteByCore,
    createSingleBuyOrder,
    submittingTransferHeight,
    createBatchBuyOrder,
    submittingTransferBatchHeight,
    queryShoppingCart,
    addShoppingCartItems,
    removeShoppingCartItems,
    subscribeEmail,
    viewedNft,
    queryShikuLandsHighestOffer,
    queryShikuLandsDealPrice,
    queryShikuLandsPayAccount,
    shikuLandsMakeOffer,
    shikuLandsUpdateOffer,
};
