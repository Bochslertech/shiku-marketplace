import { ConnectedIdentity } from '../identity';
import { BatchNftSale } from '../yumi';
import { TransactionAction } from './common';

// 批量售出状态
export type BatchSellingAction =
    | undefined // 未开始
    | 'DOING' // 开始出售
    | 'BATCH_WHITELIST' // 1. 批量需要考虑先允许白名单
    | 'BATCH_APPROVING' // 2. 批量统一前置授权阶段
    | 'BATCH_YUMI_LISTING'; // 3. Yumi 记录上架信息阶段

// 批量售出 NFT 接口
export type BatchSellNftExecutor = (
    identity: ConnectedIdentity,
    sales: BatchNftSale[],
) => Promise<BatchNftSale[] | undefined>;

// ======================= 可恢复交易 =======================

// 单个步骤所携带的信息
export type BatchSellingTransactionAction<T> = TransactionAction<BatchSellingAction, T>;

// 批量卖出交易信息
export type BatchSellingTransaction = {
    type: 'batch-sell';
    args: {
        sales: BatchNftSale[];
    };
    actions: BatchSellingTransactionAction<any>[];
};

// 批量卖出接口
export type BatchSellingByTransactionExecutor = (
    id: string,
    created: number,
    transaction: BatchSellingTransaction,
) => Promise<void>;
