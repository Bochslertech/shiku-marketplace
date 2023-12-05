import _ from 'lodash';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftTokenMetadata, NftTokenOwner } from '@/01_types/nft';
import { CoreCollectionData } from '@/01_types/yumi';
import { customStringify } from '@/02_common/data/json';
import { principal2account } from '@/02_common/ic/account';
import { parse_token_identifier, parse_token_index_with_checking } from '@/02_common/nft/ext';
import { bigint2string } from '@/02_common/types/bigint';
import { principal2string, string2principal } from '@/02_common/types/principal';
import { innerParsingTransferFromResult } from '..';
import idlFactory from './ccc_b31918c2.did';
import _SERVICE from './ccc_b31918c2.did.d';

// =========================== 查询 CCC 标准的所有 token 的所有者 ===========================

export const queryAllTokenOwnersByCcc = async (
    identity: ConnectedIdentity,
    collection: string,
): Promise<NftTokenOwner[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const r = await actor.getRegistry();
    const rr = _.sortBy(r, [(s) => Number(s[1][0].index)]);
    return rr
        .flatMap((s) =>
            s[1].map((token) => ({
                owner: s[0],
                token,
            })),
        )
        .map((s) => {
            const index = Number(bigint2string(s.token.index));
            return {
                token_id: {
                    collection,
                    token_identifier: parse_token_identifier(collection, index),
                },
                owner: principal2account(principal2string(s.owner)),
                raw: {
                    standard: 'ccc',
                    data: {
                        owner: principal2string(s.owner),
                        other: {
                            type: collection as 'bjcsj-rqaaa-aaaah-qcxqq-cai',
                            bucketCanisterId: principal2string(s.token.canisterId),
                            index: bigint2string(s.token.index),
                        },
                    },
                },
            };
        });
};

// =========================== 查询 EXT 标准的所有 token 元数据 ===========================

export const queryAllTokenMetadataByCcc = async (
    _identity: ConnectedIdentity,
    collection: string,
    token_owners: NftTokenOwner[],
    collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata[]> => {
    if (collection_data === undefined) {
        throw new Error(`collection data can not be undefined. ${collection}`);
    }

    return token_owners.map((token) => {
        const bucketCanisterId = (
            token.raw.data as {
                owner: string;
                other: {
                    type: 'bjcsj-rqaaa-aaaah-qcxqq-cai';
                    bucketCanisterId: string;
                    index: string;
                };
            }
        ).other.bucketCanisterId;
        const token_index = parse_token_index_with_checking(
            collection,
            token.token_id.token_identifier,
        );
        return {
            token_id: {
                collection,
                token_identifier: token.token_id.token_identifier,
            },
            metadata: {
                name: `${collection_data.info.name} #${token_index}`,
                mimeType: '',
                url: `https://${bucketCanisterId}.raw.ic0.app/token/${token_index}`,
                thumb: `https://${bucketCanisterId}.raw.ic0.app/token/${token_index}`,
                // thumb: `https://${bucketCanisterId}.raw.ic0.app/?type=thumbnail&tokenid=${token_index}`, // 无法访问 https://i7o7s-yyaaa-aaaah-qcwda-cai.raw.ic0.app/?type=thumbnail&tokenid=2133
                description: collection_data.info.description ?? '',
                traits: [],
                onChainUrl: `https://${bucketCanisterId}.raw.ic0.app/token/${token_index}`,
                yumi_traits: [],
            },
            raw: { ...token.raw, data: customStringify(token.raw.data) },
        };
    });
};

// =========================== CCC 标准 获取铸币人 ===========================

export const queryCollectionNftMinterByCcc = async (
    identity: ConnectedIdentity,
    collection: string,
): Promise<string> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const r = await actor.getRoyaltyFeeTo();
    return principal2string(r);
};

// =========================== 转移 ===========================

export const transferFrom = async (
    identity: ConnectedIdentity,
    collection: string,
    args: {
        owner: string; // ? principal -> string
        token_index: number;
        to: string; // ? principal -> string
    },
): Promise<boolean> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const r = await actor.transferFrom(
        string2principal(args.owner),
        string2principal(args.to),
        BigInt(args.token_index),
    );
    return innerParsingTransferFromResult(args.token_index, r);
};

export default {
    queryAllTokenOwnersByCcc,
    queryAllTokenMetadataByCcc,
    queryCollectionNftMinterByCcc,
    transferFrom,
};
