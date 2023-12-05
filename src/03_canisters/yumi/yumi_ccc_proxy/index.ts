import { ConnectedIdentity } from '@/01_types/identity';
import { CccProxyNft } from '@/01_types/nft-standard/ccc';
import { parse_token_identifier } from '@/02_common/nft/ext';
import { bigint2string } from '@/02_common/types/bigint';
import { unwrapOptionMap } from '@/02_common/types/options';
import { principal2string, string2principal } from '@/02_common/types/principal';
import { unwrapMotokoResultMap } from '@/02_common/types/results';
import { mapping_true, throwsVariantError } from '@/02_common/types/variant';
import idlFactory from './ccc_proxy.did';
import _SERVICE, { FillDepositErr, ReserveDepositErr } from './ccc_proxy.did.d';

// =========================== 查询 NFT 的存入人 用以比较是不是当前用户存入的 ===========================

export const queryNftDepositor = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: { collection: string; index: number },
): Promise<string | undefined> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.getDeposit(string2principal(args.collection), args.index);
    return unwrapOptionMap(r, (info) => {
        if (!info.status) return undefined;
        return principal2string(info.deposit);
    });
};

// =========================== 存入之前,先告知所有者 ===========================

export const beforeDepositingNft = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: { collection: string; token_index: number },
): Promise<boolean> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.reserveDeposit(string2principal(args.collection), args.token_index);
    return unwrapMotokoResultMap<null, ReserveDepositErr, boolean>(r, mapping_true, (e) => {
        throw new Error(`can not store nft owner: ${e}`);
    });
};

// =========================== 存入之后,要告知已经变更 ===========================

export const afterDepositingNft = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    args: { collection: string; token_index: number },
): Promise<boolean> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.fillDeposit(string2principal(args.collection), args.token_index);
    return unwrapMotokoResultMap<null, FillDepositErr, boolean>(r, mapping_true, (e) => {
        throw new Error(`can not fill nft owner: ${e}`);
    });
};

// =========================== 获取所有代理的 NFT 信息 ===========================

export const getAllCccProxyNfts = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
): Promise<CccProxyNft[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.getAllDeposit();
    return r.map((d) => ({
        token_id: {
            collection: d[0],
            token_identifier: parse_token_identifier(d[0], d[1]),
        },
        owner: principal2string(d[2]),
    }));
};

// =========================== 取回自己的 NFT ===========================

export const retrieveCccNft = async (
    identity: ConnectedIdentity,
    backend_canister_id: string,
    token_identifier: string,
): Promise<boolean> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, backend_canister_id);
    const r = await actor.withdraw(token_identifier);
    return unwrapMotokoResultMap(r, (n) => bigint2string(n) === '1', throwsVariantError);
};
