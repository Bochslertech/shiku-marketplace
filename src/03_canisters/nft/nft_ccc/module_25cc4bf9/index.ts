import _ from 'lodash';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftTokenMetadata, NftTokenOwner } from '@/01_types/nft';
import { CoreCollectionData } from '@/01_types/yumi';
import { principal2account } from '@/02_common/ic/account';
import { parse_token_identifier } from '@/02_common/nft/ext';
import { bigint2string } from '@/02_common/types/bigint';
import { unwrapOption } from '@/02_common/types/options';
import { principal2string, string2principal } from '@/02_common/types/principal';
import { innerParsingTransferFromResult, innerQueryAllTokenMetadataByCccLink } from '..';
import idlFactory from './ccc_25cc4bf9.did';
import _SERVICE from './ccc_25cc4bf9.did.d';

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
                            type: collection as 'nusra-3iaaa-aaaah-qc2ta-cai',
                            photoLink: unwrapOption(s.token.photoLink),
                            videoLink: unwrapOption(s.token.videoLink),
                            index: bigint2string(s.token.index),
                        },
                    },
                },
            };
        });
};

// =========================== 查询 EXT 标准的所有 token 元数据 ===========================

export const queryAllTokenMetadataByCcc = async (
    identity: ConnectedIdentity,
    collection: string,
    token_owners: NftTokenOwner[],
    collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata[]> => {
    return innerQueryAllTokenMetadataByCccLink(identity, collection, token_owners, collection_data);
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
