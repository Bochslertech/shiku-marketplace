import { ConnectedIdentity } from '../identity';
import { NftTokenOwner } from '../nft';
import { TransactionAction } from './common';

// 转移状态
export type TransferringAction =
    // ! 普通的转移
    | undefined // 未开始
    | 'DOING' // 开始转移
    | 'RETRIEVING' // 1. 某些标准 NFT 需要额外做操作
    | 'TRANSFERRING' // 2. 正在转移
    // ! CCC 的转移
    | undefined // 未开始
    | 'DOING' // 开始转移
    | 'RETRIEVING' // 1. 某些标准 NFT 需要额外做操作
    | 'RETRIEVING_CCC' // 1. CCC 标准有可能是代理的需要取回
    | 'TRANSFERRING'; // 2. 正在转移

// 转移 NFT 接口
export type TransferNftExecutor = (
    identity: ConnectedIdentity,
    owner: NftTokenOwner, // 需要的数据比较多
    to: string, // principal or account_hex // CCC 不支持 account_hex
    is_batch?: boolean,
) => Promise<boolean>;

// ======================= 可恢复交易 =======================

// 单个步骤所携带的信息
export type SingleTransferAction<T> = TransactionAction<TransferringAction, T>;

// 转移 NFT 交易信息
export type SingleTransferTransaction = {
    type: 'single-transfer';
    args: {
        owner: NftTokenOwner; // 需要的数据比较多
        to: string; // principal or account_hex // CCC 不支持 account_hex
    };
    actions: SingleTransferAction<any>[];
};

// 转移 NFT 接口
export type TransferNftByTransactionExecutor = (
    id: string,
    created: number,
    transaction: SingleTransferTransaction,
) => Promise<void>;
