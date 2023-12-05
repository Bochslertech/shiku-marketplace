import { ConnectedIdentity } from '../identity';
import { NftTokenOwner, TokenInfo } from '../nft';
import { TransactionAction } from './common';

// 购买状态
export type SellingAction =
    // ! Yumi 步骤
    | undefined // 未开始
    | 'DOING' // 开始出售
    | 'APPROVING' // 1. 统一前置授权阶段
    // EXT 系列有 approve 的
    | 'APPROVING_EXT' // EXT 标准
    | 'APPROVING_EXT_CHECKING' // 检查授权
    | 'APPROVING_EXT_APPROVING' // 如果没授权,要进行授权
    | 'APPROVING_EXT_CHECKING_AGAIN' // 授权后要再次进行检查
    | 'YUMI_LISTING' // 2. Yumi 记录上架信息阶段
    // ! CCC 步骤
    | undefined // 未开始
    | 'DOING' // 开始出售
    | 'APPROVING' // 1. 统一前置授权阶段
    // CCC 标准没有 approve,需要用户将所有权转移给 yumi 的代理罐子
    | 'APPROVING_CCC' // CCC 标准
    | 'APPROVING_CCC_CHECKING_TRANSFERRED' // 检查是否已经将所有权转移给代理罐
    | 'APPROVING_CCC_BEFORE_TRANSFERRING' // 转移给 yumi 代理罐子之前,先保存当时的所有者
    | 'APPROVING_CCC_TRANSFERRING' // 转移给 yumi
    | 'APPROVING_CCC_AFTER_TRANSFERRING' // 告知 yumi 已经转移
    | 'YUMI_LISTING' // 2. Yumi 记录上架信息阶段
    // ! OGY 步骤
    | undefined // 未开始
    | 'DOING' // 开始出售
    | 'APPROVING' // 1. 统一前置授权阶段
    // OGY 系列 直接上架
    | 'APPROVING_OGY' // OGY 标准
    | 'APPROVING_OGY_SUPPORTED_TOKEN' // 先获取支持的币种
    | 'APPROVING_OGY_CANCELLING' // 如果已经上架的,需要先取消
    | 'APPROVING_OGY_SELLING'; // 直接上架

// 上架 NFT 接口
export type SellNftExecutor = (
    identity: ConnectedIdentity,
    owner: NftTokenOwner,
    last: string | undefined, // 上次价格, OGY 需要判断是否已经上架了
    token: TokenInfo,
    price: string,
    allow_list?: string[], // 允许回购的白名单 // OGY Gold 使用
) => Promise<boolean>;

// ======================= 可恢复交易 =======================

// 单个步骤所携带的信息
export type SingleSellAction<T> = TransactionAction<SellingAction, T>;

// 销售 NFT 交易信息
export type SingleSellTransaction = {
    type: 'single-sell';
    args: {
        owner: NftTokenOwner;
        last: string | undefined; // 上次价格, OGY 需要判断是否已经上架了
        token: TokenInfo;
        price: string;
        allow_list?: string[]; // 允许回购的白名单 // OGY Gold 使用
    };
    actions: SingleSellAction<any>[];
};

// 销售 NFT 接口
export type SellNftByTransactionExecutor = (
    id: string,
    created: number,
    transaction: SingleSellTransaction,
) => Promise<void>;
