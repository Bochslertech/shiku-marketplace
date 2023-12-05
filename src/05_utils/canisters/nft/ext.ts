import * as ext from '@/03_canisters/nft/ext';
import * as blind from '@/03_canisters/nft/nft_ext/blind';
import { ConnectedIdentity } from '@/01_types/identity';
import { ExtUser } from '@/01_types/nft-standard/ext';
import { anonymous } from '../../connect/anonymous';

// =========================== 验证授权 ===========================

// 每个标准要用不同的方法

export const allowance = async (
    collection: string,
    args: {
        token_identifier: string;
        owner: ExtUser;
        spender: string;
    },
): Promise<boolean> => {
    return ext.allowance(anonymous, collection, args);
};

// =========================== 授权 ===========================

// 每个标准要用不同的方法
export const approve = async (
    identity: ConnectedIdentity,
    collection: string,
    args: {
        token_identifier: string;
        spender: string;
        subaccount?: number[];
    },
): Promise<boolean> => {
    return ext.approve(identity, collection, args);
};

// =========================== 转移 ===========================

export const transferFrom = async (
    identity: ConnectedIdentity,
    collection: string,
    args: {
        token_identifier: string;
        from: ExtUser;
        to: ExtUser;
        subaccount?: number[];
        memo?: number[];
    },
): Promise<boolean> => {
    return ext.transferFrom(identity, collection, args);
};

// ===================== 查询开启时间 =====================

export const queryBlindBoxOpenTime = async (collection: string): Promise<string> => {
    return blind.queryBlindBoxOpenTime(anonymous, collection);
};
