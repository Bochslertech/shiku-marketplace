import { NftListing } from '../listing';
import { NftIdentifier, NftTokenOwner } from '../nft';
import { TransactionAction } from './common';

// 批量购买状态
// ! 转账给 Yumi 的批量购买, 只支持 ICP
export type BatchBuyingAction =
    | undefined // 未开始
    | 'DOING' // 开始购买
    | 'CHECKING_KYC' // 1. 检查KYC
    | 'CREATING_BATCH_ORDER' // 2. 创建批量订单阶段
    | 'CHECKING_BALANCE' // 3. 检查余额
    | 'PAY' // 4. 用户付款
    | 'SUBMITTING_HEIGHT'; // 5. 提交转账高度,得到 NFT

// 批量购买 NFT 接口
export type BatchBuyNftExecutor = (
    token_list: {
        owner: NftTokenOwner;
        listing: NftListing;
    }[],
) => Promise<NftIdentifier[] | undefined>;

// ======================= 可恢复交易 =======================

// ! 转账给 Yumi 的批量购买, 只支持 ICP
// 单个步骤所携带的信息
export type BatchBuyingTransactionAction<T> = TransactionAction<BatchBuyingAction, T>;

// 批量购买交易信息
export type BatchBuyingTransaction = {
    type: 'batch-buy';
    args: {
        token_list: {
            owner: NftTokenOwner;
            listing: NftListing;
        }[];
    };
    actions: BatchBuyingTransactionAction<any>[];
    paid: number; // 执行支付的次数, 只有第一次允许执行, 其他情况一律必须手动再次执行
};

// 批量购买接口
export type BatchBuyingByTransactionExecutor = (
    id: string,
    created: number,
    transaction: BatchBuyingTransaction,
    manual: boolean,
) => Promise<void>;
