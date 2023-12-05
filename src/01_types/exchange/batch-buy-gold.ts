import { NftListing } from '../listing';
import { NftIdentifier, NftTokenOwner } from '../nft';
import { TransactionAction } from './common';
import { BuyNftRawOgy } from './single-buy';

// 批量购买黄金状态
// ! Gold 购买
export type BatchBuyingGoldAction =
    | undefined // 未开始
    | 'DOING' // 开始购买
    | 'CHECKING_KYC' // 1. 检查KYC
    | 'CHECKING_BALANCE' // 2. 检查余额
    | 'QUERY_PAY_ACCOUNTS' // 3. 查询付款地址
    | 'PAY' // 4. 用户付款
    | 'BID_NFTS' // 5. 付款后进行购买
    | 'BID_NFTS_ALL_SUCCESS'; // 5. 全部购买成功

// 黄金购买参数
export type NftOwnerAndListing = {
    owner: NftTokenOwner;
    listing: NftListing;
    raw: BuyNftRawOgy;
};

// 批量购买黄金 NFT 接口
export type BuyGoldNftExecutor = (
    token_list: NftOwnerAndListing[],
) => Promise<NftIdentifier[] | undefined>;
// ======================= 可恢复交易 =======================

// ! Gold 购买
// 单个步骤所携带的信息
export type BatchGoldBuyingTransactionAction<T> = TransactionAction<BatchBuyingGoldAction, T>;

// 批量购买交易信息
export type BatchBuyingGoldTransaction = {
    type: 'batch-buy-gold';
    args: {
        token_list: NftOwnerAndListing[];
    };
    actions: BatchGoldBuyingTransactionAction<any>[];
    paid: number; // 执行支付的次数
    bided: number; // 执行bid的次数
};

// 批量购买接口
export type BatchBuyingGoldByTransactionExecutor = (
    id: string,
    created: number,
    transaction: BatchBuyingGoldTransaction,
) => Promise<void>;
