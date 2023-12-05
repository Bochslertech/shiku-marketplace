import _ from 'lodash';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftTokenMetadata, NftTokenOwner } from '@/01_types/nft';
import { ExtUser } from '@/01_types/nft-standard/ext';
import { NftTokenOwnerMetadataShikuLand } from '@/01_types/nft-standard/shiku_land';
import { CoreCollectionData } from '@/01_types/yumi';
import { customStringify } from '@/02_common/data/json';
import { parse_token_identifier } from '@/02_common/nft/ext';
import { bigint2string } from '@/02_common/types/bigint';
import { unwrapOption, wrapOption } from '@/02_common/types/options';
import { principal2string, string2principal } from '@/02_common/types/principal';
import { unwrapMotokoResult, unwrapMotokoResultMap } from '@/02_common/types/results';
import { mapping_false, throwsBy, throwsVariantError } from '@/02_common/types/variant';
import idlFactory from './shiku_land.did';
import _SERVICE, {
    TransferResponseDetails as CandidTransferResponseDetails,
} from './shiku_land.did.d';

// =========================== 查询 SHIKU_LAND 标准的所有 token 的所有者 ===========================

export const queryAllTokenOwnersByShikuLand = async (
    identity: ConnectedIdentity,
    collection: string,
): Promise<NftTokenOwner[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const r = await actor.land_info();
    const rr = _.sortBy(r, [(s) => Number(s[0])]);
    return rr.map((s) => ({
        token_id: {
            collection,
            token_identifier: parse_token_identifier(collection, Number(bigint2string(s[0]))),
        },
        owner: unwrapOption(s[1].owner) ?? '',
        raw: {
            standard: 'shiku_land',
            data: JSON.parse(customStringify(s)),
        },
    }));
};

// =========================== 查询 SHIKU_LAND 标准的所有 token 元数据 ===========================

export const queryAllTokenMetadataByShikuLand = async (
    _identity: ConnectedIdentity,
    collection: string,
    token_owners: NftTokenOwner[],
    _collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata[]> => {
    // 直接拼接
    return token_owners.map((token) => {
        const raw = (token.raw as { standard: 'shiku_land'; data: NftTokenOwnerMetadataShikuLand })
            .data;

        return {
            token_id: {
                collection,
                token_identifier: token.token_id.token_identifier,
            },
            metadata: {
                name: raw[1].name,
                mimeType: '',
                url: raw[1].image_url[1] ?? '',
                thumb: ``,
                description: JSON.stringify({
                    area: raw[1].area,
                    dimension: raw[1].dimension,
                    number: raw[1].number,
                    planet: raw[1].planet,
                }),
                traits: [],
                onChainUrl: ``,
                yumi_traits: [],
            },
            raw: { ...token.raw, data: customStringify(raw) },
        };
    });
};

// =========================== 查询 SHIKU_LAND 标准的指定 nft 的所有者 ===========================

export const querySingleTokenOwnerByShikuLand = async (
    identity: ConnectedIdentity,
    collection: string,
    token_identifier: string,
): Promise<string> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const result = await actor.bearer(token_identifier);
    const owner = unwrapMotokoResult(
        result,
        throwsBy((e) => `${JSON.stringify(e)}`),
    );
    return owner;
};

// =========================== SHIKU_LAND 标准 获取铸币人 ===========================

export const queryCollectionNftMinterByShikuLand = async (
    identity: ConnectedIdentity,
    collection: string,
): Promise<string> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const r = await actor.getMinter();
    return principal2string(r);
};

// =========================== SHIKU_LAND 标准 查询授权 ===========================

export const allowance = async (
    identity: ConnectedIdentity,
    collection: string,
    args: {
        token_identifier: string;
        owner: ExtUser;
        spender: string;
    },
): Promise<boolean> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const result = await actor.allowance({
        owner: args.owner.principal
            ? { principal: string2principal(args.owner.principal) }
            : { address: args.owner.address! },
        token: args.token_identifier,
        spender: string2principal(args.spender),
    });
    return unwrapMotokoResultMap<BigInt, any, boolean>(
        result,
        (n) => bigint2string(n) === '1',
        mapping_false,
    );
};

// =========================== SHIKU_LAND 标准 授权 ===========================

export const approve = async (
    identity: ConnectedIdentity,
    collection: string,
    args: {
        token_identifier: string;
        spender: string;
        subaccount?: number[];
    },
): Promise<boolean> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const result = await actor.approve({
        token: args.token_identifier,
        spender: string2principal(args.spender),
        subaccount: args.subaccount ? [args.subaccount] : [],
        allowance: BigInt(1),
    });
    return result;
};

// =========================== EXT 标准 转移 ===========================

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
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const result = await actor.transfer({
        token: args.token_identifier,
        from: args.from.principal
            ? { principal: string2principal(args.from.principal) }
            : { address: args.from.address! },
        to: args.to.principal
            ? { principal: string2principal(args.to.principal) }
            : { address: args.to.address! },
        subaccount: wrapOption(args.subaccount),
        memo: args.memo ?? [],
        notify: true,
        amount: BigInt(1),
    });
    return unwrapMotokoResultMap<bigint, CandidTransferResponseDetails, boolean>(
        result,
        (n) => bigint2string(n) === '1',
        throwsVariantError,
    );
};
