import { ConnectedIdentity } from '@/01_types/identity';
import { NftTokenMetadata, NftTokenOwner } from '@/01_types/nft';
import { CccProxyNft, NftTokenOwnerMetadataCcc } from '@/01_types/nft-standard/ccc';
import { CoreCollectionData } from '@/01_types/yumi';
import { customStringify } from '@/02_common/data/json';
import { principal2account } from '@/02_common/ic/account';
import { canister_module_hash_and_time } from '@/02_common/ic/status';
import { parse_token_index_with_checking } from '@/02_common/nft/ext';
import { isSameNftByTokenId } from '@/02_common/nft/identifier';
import { bigint2string } from '@/02_common/types/bigint';
import { unwrapMotokoResultMap } from '@/02_common/types/results';
import { throwsBy, unwrapVariantKey } from '@/02_common/types/variant';
import { NFT_CCC } from '../special';
import module_0ae2ecf0 from './module_0ae2ecf0';
import {
    TokenIndex as TokenIndex_module_0ae2ecf0,
    TransferResponse as TransferResponse_module_0ae2ecf0,
} from './module_0ae2ecf0/ccc_0ae2ecf0.did.d';
import module_3ed02e09 from './module_3ed02e09';
import module_25cc4bf9 from './module_25cc4bf9';
import module_b31918c2 from './module_b31918c2';

const MAPPING_MODULES = {
    ['b31918c286f6c10d6b9e6a25a761c5092eb8ac24aebc3d45e0d596d51506ed44']: module_b31918c2,
    ['0ae2ecf060380021e402bf38ea72b7e2b077b68f59471a9b9f9070611581ef92']: module_0ae2ecf0,
    ['3ed02e09a05a21a7b9217ee382a7299c3979b24fcee07b3593364d468b6cbc6d']: module_3ed02e09,
    ['25cc4bf995890bbea2febd44ab7296144a7216934f972eaa11ceb9cb18590921']: module_25cc4bf9,
};

const MAPPING_CANISTERS: Record<
    string,
    | 'b31918c286f6c10d6b9e6a25a761c5092eb8ac24aebc3d45e0d596d51506ed44'
    | '0ae2ecf060380021e402bf38ea72b7e2b077b68f59471a9b9f9070611581ef92'
    | '3ed02e09a05a21a7b9217ee382a7299c3979b24fcee07b3593364d468b6cbc6d'
    | '25cc4bf995890bbea2febd44ab7296144a7216934f972eaa11ceb9cb18590921'
> = {
    ['bjcsj-rqaaa-aaaah-qcxqq-cai']:
        'b31918c286f6c10d6b9e6a25a761c5092eb8ac24aebc3d45e0d596d51506ed44',
    ['ml2cx-yqaaa-aaaah-qc2xq-cai']:
        '0ae2ecf060380021e402bf38ea72b7e2b077b68f59471a9b9f9070611581ef92',
    ['o7ehd-5qaaa-aaaah-qc2zq-cai']:
        '3ed02e09a05a21a7b9217ee382a7299c3979b24fcee07b3593364d468b6cbc6d',
    ['nusra-3iaaa-aaaah-qc2ta-cai']:
        '25cc4bf995890bbea2febd44ab7296144a7216934f972eaa11ceb9cb18590921',
};

// 检查每一个罐子的 module 有没有改变,如果变化了就要通知
export const checkCccCanisterModule = async () => {
    for (const canister_id of NFT_CCC) {
        const r = await canister_module_hash_and_time(canister_id, import.meta.env.CONNECT_HOST);
        const current = MAPPING_CANISTERS[canister_id];
        if (r.module_hash !== current) {
            console.error(
                'CCC canister module is changed',
                canister_id,
                current,
                '->',
                r.module_hash,
            );
        }
    }
};

// 运行时检查,如果没有实现对应的模块,就报错提示
for (const key of Object.keys(MAPPING_CANISTERS)) {
    const module = MAPPING_CANISTERS[key];
    if (!MAPPING_MODULES[module]) {
        console.error('CCC canister is not implement', key, module);
    }
}

const getModule = (collection: string) => {
    const module_hex = MAPPING_CANISTERS[collection];
    if (module_hex === undefined) throw new Error(`unknown ccc canister id: ${collection}`);
    const module = MAPPING_MODULES[module_hex];
    if (module === undefined) throw new Error(`unknown ccc canister id: ${collection}`);
    return module;
};

// =========================== 查询 CCC 标准的所有 token 的所有者 ===========================

export const queryAllTokenOwnersByCcc = async (
    identity: ConnectedIdentity,
    collection: string,
    fetchProxyNftList: () => Promise<CccProxyNft[]>,
): Promise<NftTokenOwner[]> => {
    const module = getModule(collection);
    const r = await module.queryAllTokenOwnersByCcc(identity, collection);
    // 有的 nft 可能被代理了,需要进行校正所有者
    const proxy_nfts = await fetchProxyNftList();
    r.forEach((token) => {
        const nft = proxy_nfts.find((n) => isSameNftByTokenId(n, token));
        if (nft !== undefined) {
            (token.raw.data as NftTokenOwnerMetadataCcc).proxy = token.owner; // 记录代持地址
            const owner = principal2account(nft.owner);
            (token.raw.data as NftTokenOwnerMetadataCcc).owner = owner; // ! 替换为真正的所有者
            token.owner = owner; // ! 替换为真正的所有者
        }
    });
    return r;
};

// =========================== 查询 CCC 标准的所有 token 元数据 ===========================

export const innerQueryAllTokenMetadataByCccLink = async (
    _identity: ConnectedIdentity,
    collection: string,
    token_owners: NftTokenOwner[],
    collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata[]> => {
    if (collection_data === undefined) {
        throw new Error(`collection data can not be undefined. ${collection}`);
    }

    return token_owners.map((token) => {
        if (token.raw.standard !== 'ccc') throw new Error('not ccc nft');
        if (
            ![
                'ml2cx-yqaaa-aaaah-qc2xq-cai',
                'o7ehd-5qaaa-aaaah-qc2zq-cai',
                'nusra-3iaaa-aaaah-qc2ta-cai',
            ].includes(token.raw.data.other.type)
        )
            throw new Error('wrong ccc collection');
        const data = token.raw.data as {
            owner: string;
            other: {
                type:
                    | 'ml2cx-yqaaa-aaaah-qc2xq-cai'
                    | 'o7ehd-5qaaa-aaaah-qc2zq-cai'
                    | 'nusra-3iaaa-aaaah-qc2ta-cai';
                photoLink?: string;
                videoLink?: string;
                index: string; // ? bigint -> string
            };
        };
        if (token.raw.data.other.type === 'nusra-3iaaa-aaaah-qc2ta-cai') {
            return {
                token_id: {
                    collection,
                    token_identifier: token.token_id.token_identifier,
                },
                metadata: {
                    name: `${collection_data.info.name} #${parse_token_index_with_checking(
                        collection,
                        token.token_id.token_identifier,
                    )}`,
                    mimeType: '',
                    url: `https://static.dmail.ai/CCC/video/${data.other.videoLink}`,
                    thumb: `https://static.dmail.ai/CCC/image/${data.other.photoLink}`,
                    description: collection_data.info.description ?? '',
                    traits: [],
                    onChainUrl: `https://static.dmail.ai/CCC/video/${data.other.videoLink}`,
                    yumi_traits: [],
                },
                raw: { ...token.raw, data: customStringify(token.raw.standard) },
            };
        }
        return {
            token_id: {
                collection,
                token_identifier: token.token_id.token_identifier,
            },
            metadata: {
                name: `${collection_data.info.name} #${parse_token_index_with_checking(
                    collection,
                    token.token_id.token_identifier,
                )}`,
                mimeType: '',
                url: `https://gateway.filedrive.io/ipfs/${data.other.videoLink}`,
                thumb: `https://gateway.filedrive.io/ipfs/${data.other.photoLink}`,
                description: collection_data.info.description ?? '',
                traits: [],
                onChainUrl: `https://gateway.filedrive.io/ipfs/${data.other.videoLink}`,
                yumi_traits: [],
            },
            raw: { ...token.raw, data: customStringify(token.raw.standard) },
        };
    });
};

export const queryAllTokenMetadataByCcc = async (
    identity: ConnectedIdentity,
    collection: string,
    token_owners: NftTokenOwner[],
    collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata[]> => {
    const module = getModule(collection);
    return module.queryAllTokenMetadataByCcc(identity, collection, token_owners, collection_data);
};

// =========================== CCC 标准 获取铸币人 ===========================

export const queryCollectionNftMinterByCcc = async (
    identity: ConnectedIdentity,
    collection: string,
): Promise<string> => {
    const module = getModule(collection);
    return module.queryCollectionNftMinterByCcc(identity, collection);
};

// =========================== CCC 标准 转移 ===========================

export const innerParsingTransferFromResult = (
    token_index: number,
    r: TransferResponse_module_0ae2ecf0,
): boolean => {
    return unwrapMotokoResultMap<TokenIndex_module_0ae2ecf0, any, boolean>(
        r,
        (index) => bigint2string(index) === `${token_index}`,
        throwsBy((e) => `transfer from failed: ${unwrapVariantKey(e)}`),
    );
};

export const transferFrom = async (
    identity: ConnectedIdentity,
    collection: string,
    args: {
        owner: string; // ? principal -> string
        token_index: number;
        to: string; // ? principal -> string
    },
): Promise<boolean> => {
    const module = getModule(collection);
    return module.transferFrom(identity, collection, args);
};
