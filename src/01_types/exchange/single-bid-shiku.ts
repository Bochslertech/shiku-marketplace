import { NftIdentifier, TokenInfo } from '../nft';

// 拍卖出价状态
export type BiddingShikuAction =
    // ! Yumi 拍卖出价
    | undefined // 未开始
    | 'DOING' // 开始购买
    | 'CHECKING_KYC' // 1. 检查KYC
    | 'CHECKING_OFFER_ID' // 2. 查询有没有之前的出价数据
    | 'CHECKING_PAY_ACCOUNT' // 3. 检查付款地址
    | 'CHECKING_PAY_ACCOUNT_BALANCE' // 4. 检查付款地址余额
    | 'CHECKING_BALANCE' //  5. 检查用户余额
    | 'PAY' // 6. 用户付款
    | 'MAKE_OFFER' // 7. 出价
    | 'UPDATE_OFFER'; // 7. 更新出价

// shiku NFT 出价接口
export type BidShikuNftExecutor = (
    token_id: NftIdentifier,
    owner: string,
    token: TokenInfo,
    price: string,
    ttl: string, // 出价持续要拍卖结束
) => Promise<boolean>;
