// 门票所携带的数据
export interface InnerData {
    data: Array<number>;
    headers: Array<[string, string]>;
}
export interface OuterData {
    url: string;
    headers: Array<[string, string]>;
}
export type MediaData = { Inner: InnerData } | { Outer: OuterData };
export type NFTOwnable =
    | { Data: Array<number> }
    | { List: Array<NFTOwnable> }
    | { None: null }
    | { Text: string }
    | { Media: MediaData };

// 门票当前的状态
//  所有人不可见  ownable  所有者可见  opened  匿名可见
// ----------------> ----------------> -------------->
export type NftTicketStatus =
    | {
          // 所有人都不可见
          NoBody: string; // 数字是 ownable - now // ? bigint -> string
      }
    | { InvalidToken: null } // token_identifier 错的
    | {
          // 无权查看, 不是调用者的 NFT
          Forbidden: string; // 数字是 opened - now // ? bigint -> string
      }
    | {
          // 仅所有者可见
          Owner: [
              string, // 数字是 opened - now // ? bigint -> string
              NFTOwnable,
          ];
      }
    | {
          // 匿名可见
          Anonymous: [
              string, // 数字是 now - opened // ? bigint -> string
              NFTOwnable,
          ];
      };

// 门票 NFT 的类型
// lottery 可以显示是否中奖
// code 可以显示所拥有的数据
export type NftTicketType = 'lottery' | 'code';
export const SUPPORTED_NFT_TICKET_TYPES: string[] = ['lottery', 'code'];

// 目前门票已经部署的项目
export type NftTicketProject =
    | 'ICP x EthCC NFT' // 中奖了领取衬衫
    | 'Hello! HashKey & ICP & Yumi Edition'; // 可以查看注册码, 用于领取 HashKey 的注册金

// 门票的基本信息
export type NftTicketMetadata = {
    type: NftTicketType;
    project: NftTicketProject;
};

// 门票所有信息
export type NftTicketOwnedData = {
    type: NftTicketType;
    project: NftTicketProject;
    owned?: string; // undefined 说明无法查看数据 '' 空串表明没有数据,也就是没中奖,没有中奖码 有内容表示是最核心的数据
    status: 'NoBody' | 'InvalidToken' | 'Forbidden' | 'Owner' | 'Anonymous';
    data: NftTicketStatus;
};
