import { NftIdentifier } from '../nft';

// CCC 标准的 Owner 原始数据
export type NftTokenOwnerMetadataCcc = {
    owner: string; // principal
    proxy?: string; // ? account_hex yumi 的代持罐子的地址 // 是否代持, yumi 会替代用户持有
    other:
        | {
              type: 'bjcsj-rqaaa-aaaah-qcxqq-cai'; // ! bjcsj-rqaaa-aaaah-qcxqq-cai
              bucketCanisterId: string; // ? principal -> string
              index: string; // ? bigint -> string
          }
        | {
              type: 'ml2cx-yqaaa-aaaah-qc2xq-cai'; // ! ml2cx-yqaaa-aaaah-qc2xq-cai
              photoLink?: string;
              videoLink?: string;
              index: string; // ? bigint -> string
          }
        | {
              type: 'o7ehd-5qaaa-aaaah-qc2zq-cai'; // ! o7ehd-5qaaa-aaaah-qc2zq-cai
              photoLink?: string;
              videoLink?: string;
              index: string; // ? bigint -> string
          }
        | {
              type: 'nusra-3iaaa-aaaah-qc2ta-cai'; // ! nusra-3iaaa-aaaah-qc2ta-cai
              photoLink?: string;
              videoLink?: string;
              index: string; // ? bigint -> string
          };
};

// ccc 代理 NFT
// 标识某个 NFT 的当前所有者
export type CccProxyNft = {
    token_id: NftIdentifier; // ? principal -> string
    owner: string; // ? principal -> string
};
