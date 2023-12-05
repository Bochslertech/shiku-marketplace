import { ConnectedIdentity } from '@/01_types/identity';
import { ExtUser } from '@/01_types/nft-standard/ext';
import { parse_token_index_with_checking } from '@/02_common/nft/ext';
import * as ccc from './nft_ccc';
import * as ext from './nft_ext';
import * as icnaming from './nft_icnaming';
import * as shiku_land from './nft_shiku_land';
import { NFT_CCC, NFT_EXT_WITHOUT_APPROVE, NFT_ICNAMING, NFT_OGY, NFT_SHIKU_LAND } from './special';

// =========================== 验证授权 ===========================

// 每个标准要用不同的方法

export const allowance = async (
    identity: ConnectedIdentity,
    collection: string,
    args: {
        token_identifier: string;
        owner: ExtUser;
        spender: string;
    },
): Promise<boolean> => {
    try {
        // 如果是 CCC 标准
        if (NFT_CCC.includes(collection)) {
            throw new Error("ccc nft has no method 'allowance'");
        }
        // 如果是 OGY 标准
        if (NFT_OGY.includes(collection)) {
            throw new Error("ccc nft has no method 'allowance'");
        }
        // 如果是 ICNAMING 标准
        if (NFT_ICNAMING.includes(collection)) {
            return await icnaming.allowance(identity, collection, args);
        }
        // 如果是 SHIKU_LAND 标准
        if (NFT_SHIKU_LAND.includes(collection)) {
            return await shiku_land.allowance(identity, collection, args);
        }

        // 如果是 EXT 标准, 但是没有 allowance 方法
        if (NFT_EXT_WITHOUT_APPROVE.includes(collection)) {
            throw new Error("ext nft but has no method 'allowance'");
        }

        // 默认用 EXT 标准
        return await ext.allowance(identity, collection, args);
    } catch (e) {
        throw new Error(`allowance,${collection},${args},e: ${e}`);
    }
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
    try {
        // 如果是 CCC 标准
        if (NFT_CCC.includes(collection)) {
            throw new Error("ccc nft has no method 'approve'");
        }
        // 如果是 OGY 标准
        if (NFT_OGY.includes(collection)) {
            throw new Error("ccc nft has no method 'approve'");
        }
        // 如果是 ICNAMING 标准
        if (NFT_ICNAMING.includes(collection)) {
            return await icnaming.approve(identity, collection, args);
        }
        // 如果是 SHIKU_LAND 标准
        if (NFT_SHIKU_LAND.includes(collection)) {
            return await shiku_land.approve(identity, collection, args);
        }

        // 如果是 EXT 标准, 但是没有 approve 方法
        if (NFT_EXT_WITHOUT_APPROVE.includes(collection)) {
            throw new Error("ext nft but has no method 'approve'");
        }

        // 默认用 EXT 标准
        return await ext.approve(identity, collection, args);
    } catch (e) {
        throw new Error(`'approve: ', ${JSON.stringify({ collection, args, e })}`);
    }
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
    try {
        // 如果是 CCC 标准
        if (NFT_CCC.includes(collection)) {
            if (args.from.principal === undefined) {
                throw new Error(`ccc NFT must be principal`);
            }
            if (args.to.principal === undefined) {
                throw new Error(`ccc NFT must be principal`);
            }
            return await ccc.transferFrom(identity, collection, {
                owner: args.from.principal,
                token_index: parse_token_index_with_checking(collection, args.token_identifier),
                to: args.from.principal,
            });
        }
        // 如果是 OGY 标准
        if (NFT_OGY.includes(collection)) {
            throw new Error("ogy nft has no method 'transfer'");
        }
        // 如果是 ICNAMING 标准
        if (NFT_ICNAMING.includes(collection)) {
            return await icnaming.transferFrom(identity, collection, args);
        }
        // 如果是 SHIKU_LAND 标准
        if (NFT_SHIKU_LAND.includes(collection)) {
            return await shiku_land.transferFrom(identity, collection, args);
        }

        // 默认用 EXT 标准
        return await ext.transferFrom(identity, collection, args);
    } catch (e) {
        throw new Error(`transferFrom, ${collection}, ${args}, ${e}`);
    }
};
