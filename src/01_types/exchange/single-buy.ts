import { NftIdentifier, TokenInfo, YumiListingNftStandard } from '../nft';
import { TransactionAction } from './common';

// 购买状态
export type BuyingAction =
    // ! Yumi 购买
    | undefined // 未开始
    | 'DOING' // 开始购买
    | 'CHECKING_KYC' // 1. 检查KYC
    | 'CHECKING_BALANCE' // 2. 检查余额
    | 'CREATING_ORDER' // 3. 创建订单阶段 Yumi
    | 'PAY' // 4. 用户付款
    | 'SUBMITTING_HEIGHT' // 5. 提交转账高度,得到 NFT
    // ! OGY 购买
    | undefined // 未开始
    | 'DOING' // 开始购买
    | 'CHECKING_KYC' // 1. 检查KYC
    | 'CHECKING_BALANCE' // 2. 检查余额
    | 'OGY_QUERY_PAY_ACCOUNT' // 3. OGY 的第 3 步 查询付款地址
    | 'PAY' // 4. 用户付款
    | 'OGY_BID_NFT' // 5. OGY 的第 5 步 付款后进行购买
    | 'OGY_BID_NFT_SUCCESS'; // 6. 检查是否购买成功

// 购买 NFT OGY 标准需要的额外数据
export type BuyNftRawOgy = {
    standard: 'ogy';
    sale_id: string;
    broker_id?: string; // 代理商的 id
    seller: string; // ? principal -> string
};

// 购买 NFT 额外数据
export type BuyNftRaw = { standard: YumiListingNftStandard } | BuyNftRawOgy;

// 购买 NFT 接口
export type BuyNftExecutor = (
    token_id: NftIdentifier,
    owner: string | undefined,
    token: TokenInfo,
    price: string,
    raw: BuyNftRaw,
) => Promise<boolean>;

// ======================= 可恢复交易 =======================

// 单个步骤所携带的信息
export type SingleBuyAction<T> = TransactionAction<BuyingAction, T>;
// 购买 NFT 交易信息
export type SingleBuyTransaction = {
    type: 'single-buy';
    args: {
        token_id: NftIdentifier;
        owner: string;
        token: TokenInfo;
        price: string;
        raw: BuyNftRaw;
    };
    actions: SingleBuyAction<any>[];
    paid: number; // 执行支付的次数, 只有第一次允许执行, 其他情况一律必须手动再次执行
};

// 购买 NFT 接口
export type BuyNftByTransactionExecutor = (
    id: string,
    created: number,
    transaction: SingleBuyTransaction,
    manual: boolean, // 是否用户手动执行
) => Promise<void>;
