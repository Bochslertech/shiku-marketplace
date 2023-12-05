import { NftIdentifier, TokenInfo } from './nft';
import { ExtUser } from './nft-standard/ext';

// =================== 统一上架信息 ===================

export type ListingFee = {
    platform: string; // 平台手续费 // ? bigint -> string
    royalties: string; // 版税 // ? bigint -> string
};

export type NftListingHolding = {
    type: 'holding'; // 持有中,未上架
};
// 需要综合 yumi 上架和 ogy 上架信息 // 估计将来还会有个 Ext 的上架信息
export type NftListingListing = {
    type: 'listing'; // 以固定价格出售
    time: string; // 上架时间 // ? bigint -> string
    token: TokenInfo; // 卖家指定的卖出的代币信息
    price: string; // 出售价格 // ? bigint -> string
    raw:
        | {
              type: 'yumi'; // yumi 上架会有的信息
              token_identifier: string; // 哪个 nft
              seller: string; // 卖家 // ? principal -> string
              fee: ListingFee; // 费用信息
          }
        | {
              type: 'ogy';
              sale_id: string;
              raw: string;
          };
};
export type NftListingAuction = {
    type: 'auction'; // 普通拍卖 // ! 弃用
    time: string; // 上架时间 // ? bigint -> string
    token_identifier: string; // 哪个 nft
    seller: string; // 卖家 // ? principal -> string
    fee: ListingFee; // 费用信息
    auction: {
        ttl: string; // ! 过期时间? // ? bigint -> string
        start: string; // 开始价格 // ? bigint -> string
        abort?: string; // 流拍价格 // ? bigint -> string
        highest?: {
            price: string; // 最高价格 // ? bigint -> string
            bidder: string; // 出价人 // ? principal -> string
        };
    };
};
export type NftListingDutchAuction = {
    type: 'dutch'; // 荷兰拍卖法
    time: string; // 上架时间 // ? bigint -> string
    token_identifier: string; // 哪个 nft
    seller: string; // 卖家 // ? principal -> string
    token: TokenInfo; // 卖家指定的卖出的代币信息
    fee: ListingFee; // 费用信息
    auction: {
        time: {
            start: string; // 开始时间 // ? bigint -> string
            end: string; // 结束时间 // ? bigint -> string
            reduce: string; // 降价间隔时间 // ? bigint -> string
        };
        price: {
            start: string; // 开始价 高价 // ? bigint -> string
            floor: string; // 最低价 // ? bigint -> string
            reduce: string; // 每次降价 // ? bigint -> string
        };
        payee: ExtUser; // 默认收款地址
    };
};

export type NftListing =
    | NftListingHolding
    | NftListingListing
    | NftListingAuction
    | NftListingDutchAuction;

export type NftListingData = {
    token_id: NftIdentifier;

    views?: string; // 被人查看次数 // ! ogy没有 // ? bigint -> string
    favorited?: string[]; // 被那些人收藏了 // ! ogy没有 // ? principal -> string
    latest_price?: string; // 上次售出价格, 如果是 0 表示没有售出过 // ! ogy没有 // ! 就是 ICP 的价格 // ? bigint -> string

    // 上架信息
    listing: NftListing;

    // 其他信息
    raw: string;
};
