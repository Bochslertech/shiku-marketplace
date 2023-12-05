import * as ccc_proxy from '@/03_canisters/yumi/yumi_ccc_proxy';
import { ConnectedIdentity } from '@/01_types/identity';
import { CccProxyNft } from '@/01_types/nft-standard/ccc';
import { anonymous } from '../../connect/anonymous';
import { getYumiCccProxyCanisterId } from './special';

// =========================== 查询 NFT 的存入人 用以比较是不是当前用户存入的 ===========================

export const queryNftDepositor = async (
    collection: string,
    index: number,
): Promise<string | undefined> => {
    const backend_canister_id = getYumiCccProxyCanisterId();
    return ccc_proxy.queryNftDepositor(anonymous, backend_canister_id, {
        collection,
        index,
    });
};

// =========================== 存入之前,先告知所有者 ===========================

export const beforeDepositingNft = async (
    identity: ConnectedIdentity,
    args: { collection: string; token_index: number },
): Promise<boolean> => {
    const backend_canister_id = getYumiCccProxyCanisterId();
    return ccc_proxy.beforeDepositingNft(identity, backend_canister_id, args);
};

// =========================== 存入之后,要告知已经变更 ===========================

export const afterDepositingNft = async (
    identity: ConnectedIdentity,
    args: { collection: string; token_index: number },
): Promise<boolean> => {
    const backend_canister_id = getYumiCccProxyCanisterId();
    return ccc_proxy.afterDepositingNft(identity, backend_canister_id, args);
};

// =========================== 获取所有代理的 NFT 信息 ===========================

export const getAllCccProxyNfts = async (): Promise<CccProxyNft[]> => {
    const backend_canister_id = getYumiCccProxyCanisterId();
    return ccc_proxy.getAllCccProxyNfts(anonymous, backend_canister_id);
};

// =========================== 取回自己的 NFT ===========================

export const retrieveCccNft = async (
    identity: ConnectedIdentity,
    token_identifier: string,
): Promise<boolean> => {
    const backend_canister_id = getYumiCccProxyCanisterId();
    return ccc_proxy.retrieveCccNft(identity, backend_canister_id, token_identifier);
};
