import * as core from '@/03_canisters/yumi/yumi_core';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftListingData } from '@/01_types/listing';
import { NftIdentifier, TokenInfo } from '@/01_types/nft';
import { CoreCollectionData } from '@/01_types/yumi';
import { isPrincipalText } from '@/02_common/ic/principals';
import {
    AuctionOffer,
    BatchOrderInfo,
    ProfileLet,
    ShikuNftDutchAuctionDealPrice,
    YumiBuyOrder,
    YumiPlatformFee,
} from '@/03_canisters/yumi/yumi_core';
import { anonymous } from '../../connect/anonymous';
import { getYumiCoreCanisterId } from './special';

// ================================ 更新用户设置信息 =====================================

export const updateUserSettings = async (
    identity: ConnectedIdentity,
    args: {
        username: string;
        banner: string;
        avatar: string;
        email: string;
        bio: string;
    },
): Promise<boolean> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.updateUserSettings(identity, backend_canister_id, args);
};

// =========================== 查询用户信息 Principal ===========================

export const queryProfileByPrincipal = async (principal: string): Promise<ProfileLet> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.queryProfile(anonymous, backend_canister_id, {
        type: 'principal',
        principal,
    });
};

// =========================== 查询用户信息 AccountHex ===========================

export const queryProfileByAccountHex = async (account: string): Promise<ProfileLet> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.queryProfile(anonymous, backend_canister_id, { type: 'address', account });
};

// =========================== 查询用户信息 Principal AccountHex ===========================

export const queryProfileByPrincipalOrAccountHex = async (
    principal_or_account: string,
): Promise<ProfileLet> => {
    return isPrincipalText(principal_or_account)
        ? queryProfileByPrincipal(principal_or_account)
        : queryProfileByAccountHex(principal_or_account);
};

// =========================== 查询后端支持的 NFT 集合列表 ===========================

export const queryCoreCollectionIdList = async (): Promise<string[]> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.queryCoreCollectionIdList(anonymous, backend_canister_id);
};

export const queryCoreCollectionIdListByBackend = async (
    backend_canister_id: string,
): Promise<string[]> => {
    return core.queryCoreCollectionIdList(anonymous, backend_canister_id);
};

// =========================== 查询后端支持的 NFT 集合列表 和详细信息 ===========================

export const queryCoreCollectionDataList = async (): Promise<CoreCollectionData[]> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.queryCoreCollectionDataList(anonymous, backend_canister_id);
};

export const queryCoreCollectionDataListByBackend = async (
    backend_canister_id: string,
): Promise<CoreCollectionData[]> => {
    return core.queryCoreCollectionDataList(anonymous, backend_canister_id);
};

// =========================== 查询指定的 NFT 集合列表 和详细信息 ===========================

export const queryCoreCollectionData = async (
    collection: string,
): Promise<CoreCollectionData | undefined> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.queryCoreCollectionData(anonymous, backend_canister_id, collection);
};

// =========================== 查询后端支持的 NFT 集合列表 和详细信息 ===========================

export const queryAllAuctionOfferList = async (principal: string): Promise<AuctionOffer[]> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.queryAllAuctionOfferList(anonymous, backend_canister_id, principal);
};

// =========================== 查询指定Token的 上架信息 ===========================

export const queryTokenListing = async (
    token_id_list: NftIdentifier[],
): Promise<NftListingData[]> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.queryTokenListing(anonymous, backend_canister_id, token_id_list);
};

// =========================== 查询平台费率 ===========================

export const queryYumiPlatformFee = async (): Promise<YumiPlatformFee> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.queryYumiPlatformFee(anonymous, backend_canister_id);
};

export const queryYumiPlatformFeeByBackend = async (
    backend_canister_id: string,
): Promise<YumiPlatformFee> => {
    return core.queryYumiPlatformFee(anonymous, backend_canister_id);
};

// =========================== 批量记录上架信息 ===========================

// ! 错误信息也在结果里，需要调用方检查结果是不是 token_identifier
export const batchListing = async (
    identity: ConnectedIdentity,
    args: {
        token_identifier: string;
        token: TokenInfo;
        price: string;
    }[],
): Promise<string[]> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.batchListing(identity, backend_canister_id, args);
};

// =========================== 记录上架信息 ===========================

export const listing = async (
    identity: ConnectedIdentity,
    args: {
        token_identifier: string;
        token: TokenInfo;
        price: string;
    },
): Promise<string> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.listing(identity, backend_canister_id, args);
};

// =========================== 记录下架信息 ===========================

export const cancelListing = async (
    identity: ConnectedIdentity,
    token_identifier: string,
): Promise<string> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.cancelListing(identity, backend_canister_id, token_identifier);
};

// =========================== 收藏某个 NFT ===========================

export const favoriteByCore = async (
    identity: ConnectedIdentity,
    args: {
        token_identifier: string;
        favorite: boolean;
    },
): Promise<void> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.favoriteByCore(identity, backend_canister_id, args);
};

// =========================== 创建购买订单 ===========================

export const createSingleBuyOrder = async (
    identity: ConnectedIdentity,
    token_identifier: string, // 只要一个识别码就行了?
): Promise<YumiBuyOrder> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.createSingleBuyOrder(identity, backend_canister_id, token_identifier);
};

// =========================== 提交转账记录证明 ===========================

export const submittingTransferHeight = async (
    identity: ConnectedIdentity,
    args: { token_id: NftIdentifier; height: string; token: TokenInfo },
): Promise<string> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.submittingTransferHeight(identity, backend_canister_id, args);
};

// =========================== 批量创建购买订单 ===========================

export const createBatchBuyOrder = async (
    identity: ConnectedIdentity,
    token_identifier_list: string[], // 只要一个识别码就行了?
): Promise<BatchOrderInfo> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.createBatchBuyOrder(identity, backend_canister_id, token_identifier_list);
};

// =========================== 批量提交转账记录证明 ===========================

export const submittingTransferBatchHeight = async (
    identity: ConnectedIdentity,
    transfer_height: string,
    token_id_list: NftIdentifier[],
): Promise<string[]> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.submittingTransferBatchHeight(
        identity,
        backend_canister_id,
        transfer_height,
        token_id_list,
    );
};

// =========================== 查询购物车 ===========================

export const queryShoppingCart = async (identity: ConnectedIdentity): Promise<NftIdentifier[]> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.queryShoppingCart(identity, backend_canister_id);
};

// =========================== 增加待购 NFT ===========================

// ! 错误信息也在结果里，需要调用方检查结果是不是 token_identifier
// ! 错误信息 前缀是 id
export const addShoppingCartItems = async (
    identity: ConnectedIdentity,
    args: {
        token_identifier: string;
        url: string;
        name: string;
    }[],
): Promise<string[]> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.addShoppingCartItems(identity, backend_canister_id, args);
};

// =========================== 移除待购 NFT ===========================

export const removeShoppingCartItems = async (
    identity: ConnectedIdentity,
    token_identifier?: string,
): Promise<void> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.removeShoppingCartItems(identity, backend_canister_id, token_identifier);
};

// =========================== 订阅邮箱 ===========================

export const subscribeEmail = async (email: string): Promise<void> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.subscribeEmail(anonymous, backend_canister_id, email);
};

// =========================== 新增查看次数 ===========================

export const viewedNft = async (
    identity: ConnectedIdentity,
    token_identifier: string,
): Promise<void> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.viewedNft(identity, backend_canister_id, token_identifier);
};

// =========================== 查询最高出价 shiku 拍卖 ===========================

export const queryShikuLandsHighestOffer = async (
    token_identifier: string, // shiku lands 的 NFT
): Promise<AuctionOffer | undefined> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.queryShikuLandsHighestOffer(anonymous, backend_canister_id, token_identifier);
};

// =========================== 查询 shiku 拍卖 是否成交 ===========================

export const queryShikuLandsDealPrice = async (
    token_identifier: string, // shiku lands 的 NFT
): Promise<ShikuNftDutchAuctionDealPrice | undefined> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.queryShikuLandsDealPrice(anonymous, backend_canister_id, token_identifier);
};

// =========================== 查询 shiku 出价付款地址 ===========================

export const queryShikuLandsPayAccount = async (identity: ConnectedIdentity): Promise<string> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.queryShikuLandsPayAccount(identity, backend_canister_id);
};

// =========================== shiku 进行出价 ===========================

export const shikuLandsMakeOffer = async (
    identity: ConnectedIdentity,
    args: {
        seller: string; // account
        token_id: NftIdentifier;
        token: TokenInfo;
        price: string;
        ttl: string;
    },
): Promise<string> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.shikuLandsMakeOffer(identity, backend_canister_id, args);
};

// =========================== shiku 修改出价 ===========================

export const shikuLandsUpdateOffer = async (
    identity: ConnectedIdentity,
    args: {
        offer_id: string; // ? bigint -> string
        price: string;
    },
): Promise<string> => {
    const backend_canister_id = getYumiCoreCanisterId();
    return core.shikuLandsUpdateOffer(identity, backend_canister_id, args);
};
