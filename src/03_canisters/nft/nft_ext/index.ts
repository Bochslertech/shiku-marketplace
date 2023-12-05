import _ from 'lodash';
import { ConnectedIdentity } from '@/01_types/identity';
import {
    NftMetadataTrait,
    NftTokenMetadata,
    NftTokenOwner,
    NftTokenScore,
    SupportedNftStandard,
} from '@/01_types/nft';
import { CccProxyNft } from '@/01_types/nft-standard/ccc';
import { ExtUser, NftTokenOwnerMetadataExt } from '@/01_types/nft-standard/ext';
import { CoreCollectionData } from '@/01_types/yumi';
import { array2string } from '@/02_common/data/arrays';
import { principal2account } from '@/02_common/ic/account';
import { parse_token_identifier, parse_token_index_with_checking } from '@/02_common/nft/ext';
import { isSameNftByTokenId } from '@/02_common/nft/identifier';
import { execute_and_join } from '@/02_common/tasks';
import { bigint2string } from '@/02_common/types/bigint';
import { unwrapOption, wrapOption } from '@/02_common/types/options';
import { principal2string, string2principal } from '@/02_common/types/principal';
import {
    parseMotokoResult,
    unwrapMotokoResult,
    unwrapMotokoResultMap,
} from '@/02_common/types/results';
import {
    mapping_false,
    throwsBy,
    throwsVariantError,
    unwrapVariant2Map,
} from '@/02_common/types/variant';
import { NFT_EXT_WITHOUT_APPROVE } from '../special';
import idlFactory from './ext.did';
import _SERVICE, {
    ExtCommonError,
    ExtListing,
    ExtTokenMetadata,
    ExtTransferError,
} from './ext.did.d';

// =========================== 查询 EXT 标准的所有 token 的所有者 ===========================

export const queryAllTokenOwnersByExt = async (
    identity: ConnectedIdentity,
    collection: string,
    fetchProxyNftList: () => Promise<CccProxyNft[]>,
): Promise<NftTokenOwner[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);

    // ! 特别处理 测试环境的罐子,不知道干嘛的
    if (collection === 'ezo5a-taaaa-aaaah-abkfa-cai') {
        // 这个罐子没有 getRegistry 方法
        const r = await actor.getTokens();
        return r.map((s) => {
            const data = s[1];
            const metadata = unwrapVariant2Map(
                data,
                ['fungible', throwsBy(`fungible token is not support`)],
                ['nonfungible', (n) => unwrapOption(n.metadata)],
            );
            if (metadata === undefined)
                throw new Error(`metadata of nonfungible token can not be none`);
            const json = array2string(new Uint8Array(metadata));
            const raw = JSON.parse(json); // ! 当成 json 解析
            return {
                token_id: {
                    collection,
                    token_identifier: parse_token_identifier(collection, s[0]),
                },
                owner: principal2account(raw.owner),
                raw: {
                    standard: 'ext',
                    data: {
                        index: s[0],
                        owner: principal2account(raw.owner),
                    },
                },
            };
        });
    }

    const r = await actor.getRegistry();

    const rr = _.sortBy(r, [(s) => s[0]]);

    const result: NftTokenOwner[] = rr.map((s) => ({
        token_id: {
            collection,
            token_identifier: parse_token_identifier(collection, s[0]),
        },
        owner: s[1],
        raw: {
            standard: 'ext',
            data: {
                index: s[0],
                owner: s[1],
            },
        },
    }));

    if (NFT_EXT_WITHOUT_APPROVE.includes(collection)) {
        // 有的 nft 可能被代理了,需要进行校正所有者
        const proxy_nfts = await fetchProxyNftList();
        result.forEach((token) => {
            const nft = proxy_nfts.find((n) => isSameNftByTokenId(n, token));
            if (nft !== undefined) {
                (token.raw.data as NftTokenOwnerMetadataExt).proxy = token.owner; // 记录代持地址
                const owner = principal2account(nft.owner);
                (token.raw.data as NftTokenOwnerMetadataExt).owner = owner; // ! 替换为真正的所有者
                token.owner = owner; // ! 替换为真正的所有者
            }
        });
    }

    return result;
};

// =========================== 查询 EXT 标准的所有 token 元数据 ===========================

const parseTraits = (traits: any, key = 'trait_type'): NftMetadataTrait[] => {
    if (!traits) return [];
    if (traits.length === undefined) return [];
    return traits
        .filter((a: any) => a[key] && a.value !== undefined) // NFT 的元数据属性
        .map((a: any) => ({ name: a[key], value: `${a.value}` }));
};

const CANISTER_METADATA_TIMES: Record<string, number> = {
    // ! 分 2 批查询
    'pvu3q-aqaaa-aaaap-aamaq-cai': 2,
    'v5mzt-tqaaa-aaaah-abjoa-cai': 2,
    '47moi-iqaaa-aaaap-aa3tq-cai': 2,
    '3hzxy-fyaaa-aaaap-aaiiq-cai': 2,
    'jezzy-xqaaa-aaaap-aaybq-cai': 2,
    'fab4i-diaaa-aaaah-acr2q-cai': 2,
    'qv3zw-kqaaa-aaaap-aa27q-cai': 2,
    'doscv-wyaaa-aaaap-aaksq-cai': 2, // * 预发布环境
    'cg5fv-5yaaa-aaaap-aagzq-cai': 2, // * 预发布环境
    // ! 分 3 批查询
    'fnzxe-niaaa-aaaap-aa6qq-cai': 3,
    'uwiqe-caaaa-aaaap-aa2eq-cai': 3, // * 预发布环境
    '4diuz-7qaaa-aaaap-aa3rq-cai': 3, // * 预发布环境
    '6qlam-vaaaa-aaaah-abddq-cai': 3, // ? 测试环境
    '52b2m-tyaaa-aaaai-qpbpa-cai': 3,
    '7h4ue-aqaaa-aaaai-qpbaq-cai': 3, // TODO 这个罐子是动态的,将来部署其他代码后,这里就不需要设置了
    // ! 分 4 批查询
    'm7vrl-xaaaa-aaaap-aah3a-cai': 4,
    // ! 分 7 批查询
    'ah2fs-fqaaa-aaaak-aalya-cai': 7,
};
export const parseExtTokenMetadata = (
    collection: string,
    token_identifier: string,
    metadata: number[] | undefined,
): NftTokenMetadata => {
    const token_index = parse_token_index_with_checking(collection, token_identifier);

    let name: string = '';
    let mimeType: string = '';
    let url: string = '';
    let thumb: string = '';
    let description: string = '';
    let traits: NftMetadataTrait[] = [];
    let onChainUrl: string = '';
    let yumi_traits: NftMetadataTrait[] = [];

    // ? ======================== ↓↓↓ 特别处理 ↓↓↓ ========================
    // ! entrepot 的 NFT
    // ? ICPunks 独立处理
    if (collection === 'bxdf4-baaaa-aaaah-qaruq-cai') {
        url = `https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/${token_index}`;
        thumb = url;
        onChainUrl = url;
        return {
            token_id: { collection, token_identifier },
            metadata: {
                name,
                mimeType,
                url,
                thumb,
                description,
                traits,
                onChainUrl,
                yumi_traits,
            },
            raw: { standard: 'ext', data: '{}' },
        };
    }
    // ? ======================== ↑↑↑ 特别处理 ↑↑↑ ========================

    let json: string;
    if (metadata === undefined) {
        // console.error(
        //     `metadata of nonfungible token can not be none: ${collection} #${token_index}`,
        // );
        json = '{}'; // 没有数据就置空
    } else {
        json = array2string(new Uint8Array(metadata));
    }

    let raw: Record<string, any>;
    try {
        raw = JSON.parse(json.replace(/\n/g, '\\n').replace(/\r/g, '\\r')); // ! 当成 json 解析
    } catch (e) {
        console.error('parse metadata json failed', collection, token_index, json, e);
        raw = {};
    }
    name = raw.name ?? '';
    mimeType = raw.mimeType ?? '';
    url = raw.url ?? `https://${collection}.raw.ic0.app/?tokenid=${token_identifier}`;
    thumb =
        raw.thumb ??
        `https://${collection}.raw.ic0.app/?tokenid=${token_identifier}&type=thumbnail`;
    description = raw.description ?? '';
    traits = parseTraits(raw.attributes);
    onChainUrl = `https://${collection}.raw.ic0.app/?tokenid=${token_identifier}`;
    yumi_traits = parseTraits(raw.yumi_traits, 'name');
    return {
        token_id: {
            collection,
            token_identifier,
        },
        metadata: { name, mimeType, url, thumb, description, traits, onChainUrl, yumi_traits },
        raw: {
            standard: 'ext',
            data: JSON.stringify(raw),
        },
    };
};
export const queryAllTokenMetadataByExt = async (
    identity: ConnectedIdentity,
    collection: string,
    token_owners: NftTokenOwner[],
    collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    let r: [number, ExtTokenMetadata][];
    if (CANISTER_METADATA_TIMES[collection]) {
        r = await execute_and_join(
            token_owners.map((t) =>
                parse_token_index_with_checking(collection, t.token_id.token_identifier),
            ),
            actor.getTokensByIds,
            CANISTER_METADATA_TIMES[collection], // ! 分多批次查询
        );
    } else {
        r = await actor.getTokens();
    }

    // ? ======================== ↓↓↓ 特别处理 ↓↓↓ ========================
    if (collection === 'n46fk-6qaaa-aaaai-ackxa-cai') {
        if (collection_data === undefined) {
            throw new Error(`collection data can not be undefined. ${collection}`);
        }
        return r.map((s) => {
            const data = s[1];
            const metadata = unwrapVariant2Map(
                data,
                ['fungible', throwsBy(`fungible token is not support`)],
                ['nonfungible', (n) => unwrapOption(n.metadata)],
            );
            if (metadata === undefined)
                throw new Error(`metadata of nonfungible token can not be none`);
            const json = array2string(new Uint8Array(metadata));
            const token_identifier = parse_token_identifier(collection, s[0]);
            return {
                token_id: {
                    collection,
                    token_identifier,
                },
                metadata: {
                    name: `${collection_data.info.name} #${s[0] + 1}`,
                    mimeType: '',
                    url: json, // * 这个罐子直接就是一个 url
                    thumb: json,
                    description: collection_data.info.description ?? '',
                    traits: [],
                    onChainUrl: `https://${collection}.raw.ic0.app/?tokenid=${token_identifier}`,
                    yumi_traits: [],
                },
                raw: {
                    standard: 'ext',
                    data: json,
                },
            };
        });
    }
    if (collection === 'mfhqa-iyaaa-aaaai-abona-cai') {
        if (collection_data === undefined) {
            throw new Error(`collection data can not be undefined. ${collection}`);
        }
        // ic love 罐子
        return r.map((s) => {
            const data = s[1];
            const metadata = unwrapVariant2Map(
                data,
                ['fungible', throwsBy(`fungible token is not support`)],
                ['nonfungible', (n) => unwrapOption(n.metadata)],
            );
            let json: string;
            if (metadata === undefined) {
                // console.log(`metadata of nonfungible token can not be none: ${collection} #${s[0]}`);
                json = '{}'; // 没有数据就置空
            } else {
                json = array2string(new Uint8Array(metadata));
            }
            const token_identifier = parse_token_identifier(collection, s[0]);
            return {
                token_id: {
                    collection,
                    token_identifier,
                },
                metadata: {
                    name: `${collection_data.info.name} #${s[0] + 1}`,
                    mimeType: '',
                    url: `https://${collection}.raw.ic0.app/?type=thumbnail&tokenid=${token_identifier}`,
                    thumb: `https://${collection}.raw.ic0.app/?type=thumbnail&tokenid=${token_identifier}`,
                    description: collection_data.info.description ?? '',
                    traits: [],
                    onChainUrl: `https://${collection}.raw.ic0.app/?tokenid=${token_identifier}`,
                    yumi_traits: [],
                },
                raw: {
                    standard: 'ext',
                    data: json,
                },
            };
        });
    }
    // ? ======================== ↑↑↑ 特别处理 ↑↑↑ ========================

    return r.map((s) => {
        const data = s[1];
        const metadata = unwrapVariant2Map(
            data,
            ['fungible', throwsBy(`fungible token is not support`)],
            ['nonfungible', (n) => unwrapOption(n.metadata)],
        );
        return parseExtTokenMetadata(
            collection,
            parse_token_identifier(collection, s[0]),
            metadata,
        );
    });
};

// =========================== 查询所有标准的所有 token 的稀有度 ===========================

// 每个标准要用不同的方法
export const queryAllTokenScoresByExt = async (
    identity: ConnectedIdentity,
    collection: string,
): Promise<NftTokenScore[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const r = await actor.getScore();
    if (r.length === 0) return [];
    const scores = r.map((s) => ({
        token_id: {
            collection,
            token_identifier: parse_token_identifier(collection, s[0]),
        },
        score: {
            value: s[1],
            order: 0,
        },
        raw: {
            standard: 'ext' as SupportedNftStandard,
        },
    }));
    const orders = _.sortBy(scores, [(s) => -s.score.value]); // 按照分数值排序, 从大到小
    const record: Record<string, number> = {};
    for (let i = 0; i < orders.length; i++) {
        const score = `${orders[i].score.value}`;
        if (record[score] === undefined) record[score] = i + 1;
        orders[i].score.order = record[score];
    }
    return scores;
};

// =========================== 查询 EXT 标准的指定 owner 的 token 元数据 ===========================

export const queryOwnerTokenMetadataByExt = async (
    identity: ConnectedIdentity,
    collection: string,
    account: string,
    collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata[]> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const result = await actor.tokens_ext(account);
    const r = unwrapMotokoResult(
        parseMotokoResult<
            Array<[number, [] | [ExtListing], [] | [Array<number>]]>,
            ExtCommonError,
            Array<[number, [] | [Array<number>]]>,
            ExtCommonError
        >(
            result,
            (ok) => ok.map((o) => [o[0], o[2]]),
            (e) => e,
        ),
        (e) => {
            if (e['Other'] === 'No tokens') return [];
            throw new Error(`${JSON.stringify(e)}`);
        },
    );

    // ? ======================== ↓↓↓ 特别处理 ↓↓↓ ========================
    if (collection === 'n46fk-6qaaa-aaaai-ackxa-cai') {
        if (collection_data === undefined) {
            throw new Error(`collection data can not be undefined. ${collection}`);
        }
        return r.map((s) => {
            const data = s[1];
            const metadata = unwrapOption(data);
            if (metadata === undefined)
                throw new Error(`metadata of nonfungible token can not be none`);
            const json = array2string(new Uint8Array(metadata));
            const token_identifier = parse_token_identifier(collection, s[0]);
            return {
                token_id: {
                    collection,
                    token_identifier,
                },
                metadata: {
                    name: `${collection_data.info.name} #${s[0] + 1}`,
                    mimeType: '',
                    url: json, // * 这个罐子直接就是一个 url
                    thumb: json,
                    description: collection_data.info.description ?? '',
                    traits: [],
                    onChainUrl: `https://${collection}.raw.ic0.app/?tokenid=${token_identifier}`,
                    yumi_traits: [],
                },
                raw: {
                    standard: 'ext',
                    data: json,
                },
            };
        });
    }
    if (collection === 'mfhqa-iyaaa-aaaai-abona-cai') {
        if (collection_data === undefined) {
            throw new Error(`collection data can not be undefined. ${collection}`);
        }
        // ic love 罐子
        return r.map((s) => {
            const data = s[1];
            const metadata = unwrapOption(data);
            let json: string;
            if (metadata === undefined) {
                // console.log(`metadata of nonfungible token can not be none: ${collection} #${s[0]}`);
                json = '{}'; // 没有数据就置空
            } else {
                json = array2string(new Uint8Array(metadata));
            }
            const token_identifier = parse_token_identifier(collection, s[0]);
            return {
                token_id: {
                    collection,
                    token_identifier,
                },
                metadata: {
                    name: `${collection_data.info.name} #${s[0] + 1}`,
                    mimeType: '',
                    url: `https://${collection}.raw.ic0.app/?type=thumbnail&tokenid=${token_identifier}`,
                    thumb: `https://${collection}.raw.ic0.app/?type=thumbnail&tokenid=${token_identifier}`,
                    description: collection_data.info.description ?? '',
                    traits: [],
                    onChainUrl: `https://${collection}.raw.ic0.app/?tokenid=${token_identifier}`,
                    yumi_traits: [],
                },
                raw: {
                    standard: 'ext',
                    data: json,
                },
            };
        });
    }
    // ? ======================== ↑↑↑ 特别处理 ↑↑↑ ========================

    return r.map((s) =>
        parseExtTokenMetadata(
            collection,
            parse_token_identifier(collection, s[0]),
            unwrapOption(s[1]),
        ),
    );
};

// =========================== 查询 EXT 标准的指定 nft 的 token 元数据 ===========================
export const querySingleTokenMetadataByExt = async (
    identity: ConnectedIdentity,
    collection: string,
    token_identifier: string,
    collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const result = await actor.metadata(token_identifier);
    const metadata = unwrapVariant2Map(
        unwrapMotokoResult<ExtTokenMetadata, ExtCommonError>(
            result,
            throwsBy((e) => `${JSON.stringify(e)}`),
        ),
        ['fungible', throwsBy(`fungible token is not support`)],
        ['nonfungible', (n) => unwrapOption(n.metadata)],
    );

    // ? ======================== ↓↓↓ 特别处理 ↓↓↓ ========================
    if (collection === 'n46fk-6qaaa-aaaai-ackxa-cai') {
        if (collection_data === undefined) {
            throw new Error(`collection data can not be undefined. ${collection}`);
        }
        if (metadata === undefined)
            throw new Error(`metadata of nonfungible token can not be none`);
        const json = array2string(new Uint8Array(metadata));
        const token_index = parse_token_index_with_checking(collection, token_identifier);
        return {
            token_id: {
                collection,
                token_identifier,
            },
            metadata: {
                name: `${collection_data.info.name} #${token_index + 1}`,
                mimeType: '',
                url: json, // * 这个罐子直接就是一个 url
                thumb: json,
                description: collection_data.info.description ?? '',
                traits: [],
                onChainUrl: `https://${collection}.raw.ic0.app/?tokenid=${token_identifier}`,
                yumi_traits: [],
            },
            raw: {
                standard: 'ext',
                data: json,
            },
        };
    }
    if (collection === 'mfhqa-iyaaa-aaaai-abona-cai') {
        if (collection_data === undefined) {
            throw new Error(`collection data can not be undefined. ${collection}`);
        }
        // ic love 罐子
        let json: string;
        if (metadata === undefined) {
            // console.log(`metadata of nonfungible token can not be none: ${collection} #${s[0]}`);
            json = '{}'; // 没有数据就置空
        } else {
            json = array2string(new Uint8Array(metadata));
        }
        const token_index = parse_token_index_with_checking(collection, token_identifier);
        return {
            token_id: {
                collection,
                token_identifier,
            },
            metadata: {
                name: `${collection_data.info.name} #${token_index + 1}`,
                mimeType: '',
                url: `https://${collection}.raw.ic0.app/?type=thumbnail&tokenid=${token_identifier}`,
                thumb: `https://${collection}.raw.ic0.app/?type=thumbnail&tokenid=${token_identifier}`,
                description: collection_data.info.description ?? '',
                traits: [],
                onChainUrl: `https://${collection}.raw.ic0.app/?tokenid=${token_identifier}`,
                yumi_traits: [],
            },
            raw: {
                standard: 'ext',
                data: json,
            },
        };
    }
    // ? ======================== ↑↑↑ 特别处理 ↑↑↑ ========================

    return parseExtTokenMetadata(collection, token_identifier, metadata);
};

// =========================== 查询 EXT 标准的指定 nft 的所有者 ===========================

export const querySingleTokenOwnerByExt = async (
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

// =========================== EXT 标准 获取铸币人 ===========================

export const queryCollectionNftMinterByExt = async (
    identity: ConnectedIdentity,
    collection: string,
): Promise<string> => {
    const { creator } = identity;
    const actor: _SERVICE = await creator(idlFactory, collection);
    const r = await actor.getMinter();
    return principal2string(r);
};

// =========================== EXT 标准 查询授权 ===========================

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

// =========================== EXT 标准 授权 ===========================

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
        // ! 此处默认写 true
        // 由于 nwyv2-gaaaa-aaaaj-arc2a-cai 这个罐子写 true 的话，会转移失败
        // 因此, 单独这个罐子是 false
        notify: collection !== 'nwyv2-gaaaa-aaaaj-arc2a-cai',
        amount: BigInt(1),
    });
    return unwrapMotokoResultMap<bigint, ExtTransferError, boolean>(
        result,
        (n) => bigint2string(n) === '1',
        throwsVariantError,
    );
};
