import { Principal } from '@dfinity/principal';
import _ from 'lodash';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftListing, NftListingData } from '@/01_types/listing';
import { NftIdentifier, NftTokenMetadata, NftTokenOwner, TokenInfo } from '@/01_types/nft';
import { OgyCandyValue_2f2a0ab9, OgyCandyValue_47a7c018 } from '@/01_types/nft-standard/ogy-candy';
import { CoreCollectionData } from '@/01_types/yumi';
import { customStringify } from '@/02_common/data/json';
import { canister_module_hash_and_time } from '@/02_common/ic/status';
import { bigint2string } from '@/02_common/types/bigint';
import { unwrapOption, unwrapOptionMap } from '@/02_common/types/options';
import { principal2string } from '@/02_common/types/principal';
import {
    unchanging,
    unwrapVariant2Map,
    unwrapVariant4Map,
    unwrapVariant5Map,
    unwrapVariant6Map,
    unwrapVariantKey,
} from '@/02_common/types/variant';
import {
    unwrapCandyValue_2f2a0ab9,
    unwrapCandyValue_47a7c018,
    unwrapCandyValue_243d1642,
} from '../../nft/nft_ogy/candy';
import { NFT_OGY } from '../special';
import module_2f2a0ab9 from './module_2f2a0ab9';
import { CollectionInfo as CollectionInfo_2f2a0ab9 } from './module_2f2a0ab9/ogy_2f2a0ab9.did.d';
import module_47a7c018 from './module_47a7c018';
import {
    AuctionConfig as AuctionConfig_47a7c018,
    AuctionStateShared as AuctionStateShared_47a7c018,
    CollectionInfo as CollectionInfo_47a7c018,
    ICTokenSpec as ICTokenSpec_47a7c018,
} from './module_47a7c018/ogy_47a7c018.did.d';
import module_243d1642 from './module_243d1642';
import { CollectionInfo as CollectionInfo_243d1642 } from './module_243d1642/ogy_243d1642.did.d';
import {
    AuctionStateShared as AuctionStateStable_243d1642,
    ICTokenSpec as ICTokenSpec_243d1642,
} from './module_243d1642/ogy_243d1642.did.d';
import module_568a07bb from './module_568a07bb';
import module_9293bd34 from './module_9293bd34';
import module_b99da57c from './module_b99da57c';
import module_be8972b0 from './module_be8972b0';
import {
    AuctionConfig as AuctionConfig_be8972b0,
    AuctionStateStable as AuctionStateStable_be8972b0,
    CollectionInfo as CollectionInfo_be8972b0,
    ICTokenSpec as ICTokenSpec_be8972b0,
} from './module_be8972b0/ogy_be8972b0.did.d';
import module_db6f76c6 from './module_db6f76c6';
import {
    AuctionConfig as AuctionConfig_db6f76c6,
    AuctionStateStable as AuctionStateStable_db6f76c6,
    DutchStateStable as DutchStateStable_db6f76c6,
    ICTokenSpec as ICTokenSpec_db6f76c6,
    NiftyStateStable as NiftyStateStable_db6f76c6,
} from './module_db6f76c6/ogy_db6f76c6.did.d';

const MAPPING_MODULES = {
    ['db6f76c6af70df9e0a0ff7d2e42fc98e4ae1613b288cac8e4b923ec5bb3f256f']: module_db6f76c6,
    ['be8972b0c80cfb53461767e93b5156eec9a5bce39c4b00847a56041edee1df18']: module_be8972b0,
    ['b99da57c816845e912e5a89ab93922db7a2875afdf1d3c60e7d63aa5833ee4b1']: module_b99da57c,
    ['2f2a0ab9f5d2f78e6aee2bb2c704be6b18e8cdfc1869bbb7ca56bd18598ccaa7']: module_2f2a0ab9,
    ['568a07bba024f17fc2c71ba912218dbc7de7662eaa6742c312618b454e2b4e05']: module_568a07bb,
    ['9293bd3455eceb221f9968ff5ecb0dda8556b9209aa8a0c9963a5a63aa994f8c']: module_9293bd34,
    ['47a7c018dffb00a609c2ab0caffb909335756f82253f6510f5de07affc312e55']: module_47a7c018,
    ['243d164214b17363967d52697b1685531b2ab3960b72c89655e353c608fc0545']: module_243d1642,
};

const MAPPING_CANISTERS: Record<
    string,
    | 'db6f76c6af70df9e0a0ff7d2e42fc98e4ae1613b288cac8e4b923ec5bb3f256f'
    | 'be8972b0c80cfb53461767e93b5156eec9a5bce39c4b00847a56041edee1df18'
    | 'b99da57c816845e912e5a89ab93922db7a2875afdf1d3c60e7d63aa5833ee4b1'
    | '2f2a0ab9f5d2f78e6aee2bb2c704be6b18e8cdfc1869bbb7ca56bd18598ccaa7'
    | '568a07bba024f17fc2c71ba912218dbc7de7662eaa6742c312618b454e2b4e05'
    | '9293bd3455eceb221f9968ff5ecb0dda8556b9209aa8a0c9963a5a63aa994f8c'
    | '47a7c018dffb00a609c2ab0caffb909335756f82253f6510f5de07affc312e55'
    | '243d164214b17363967d52697b1685531b2ab3960b72c89655e353c608fc0545'
> = {
    // OGY
    // ! 正式环境
    ['j2zek-uqaaa-aaaal-acoxa-cai']:
        'db6f76c6af70df9e0a0ff7d2e42fc98e4ae1613b288cac8e4b923ec5bb3f256f',
    // ! 正式环境
    ['s5eo5-gqaaa-aaaag-qa3za-cai']:
        'be8972b0c80cfb53461767e93b5156eec9a5bce39c4b00847a56041edee1df18',
    // ? 测试环境
    ['2l7gd-5aaaa-aaaak-qcfvq-cai']:
        'b99da57c816845e912e5a89ab93922db7a2875afdf1d3c60e7d63aa5833ee4b1',
    // origyn art
    // ! 正式环境 一级
    ['2htsr-ziaaa-aaaaj-azrkq-cai']:
        '2f2a0ab9f5d2f78e6aee2bb2c704be6b18e8cdfc1869bbb7ca56bd18598ccaa7',
    // ! 正式环境 二级
    ['2oqzn-paaaa-aaaaj-azrla-cai']:
        '2f2a0ab9f5d2f78e6aee2bb2c704be6b18e8cdfc1869bbb7ca56bd18598ccaa7',
    // * 预发布环境 一级
    ['3d65d-aiaaa-aaaaj-azrmq-cai']:
        '568a07bba024f17fc2c71ba912218dbc7de7662eaa6742c312618b454e2b4e05',
    // * 预发布环境 二级
    ['3e73x-nqaaa-aaaaj-azrma-cai']:
        '9293bd3455eceb221f9968ff5ecb0dda8556b9209aa8a0c9963a5a63aa994f8c',
    // ? 测试环境 一级
    ['zkpdr-hqaaa-aaaak-ac4lq-cai']:
        '9293bd3455eceb221f9968ff5ecb0dda8556b9209aa8a0c9963a5a63aa994f8c',
    // ? 测试环境 二级
    ['lcaww-uyaaa-aaaag-aaylq-cai']:
        '9293bd3455eceb221f9968ff5ecb0dda8556b9209aa8a0c9963a5a63aa994f8c',
    // gold
    // ! 正式环境
    ['io7gn-vyaaa-aaaak-qcbiq-cai']:
        '243d164214b17363967d52697b1685531b2ab3960b72c89655e353c608fc0545',
    // ! 正式环境
    ['sy3ra-iqaaa-aaaao-aixda-cai']:
        '243d164214b17363967d52697b1685531b2ab3960b72c89655e353c608fc0545',
    // ! 正式环境
    ['zhfjc-liaaa-aaaal-acgja-cai']:
        '243d164214b17363967d52697b1685531b2ab3960b72c89655e353c608fc0545',
    // ! 正式环境
    ['7i7jl-6qaaa-aaaam-abjma-cai']:
        '243d164214b17363967d52697b1685531b2ab3960b72c89655e353c608fc0545',
    // * 预发布环境 和测试环境相同
    ['himny-aiaaa-aaaak-aepca-cai']:
        '47a7c018dffb00a609c2ab0caffb909335756f82253f6510f5de07affc312e55',
    // * 预发布环境 和测试环境相同
    ['yf3vu-uqaaa-aaaam-abfra-cai']:
        'db6f76c6af70df9e0a0ff7d2e42fc98e4ae1613b288cac8e4b923ec5bb3f256f',
    // "cc09947456a344bd3c8f6a56b3e06bbfd754668d3e6246c00f2b6aa5c8e089a4" // 这个罐子升级代码了
};

// 检查每一个罐子的 module 有没有改变,如果变化了就要通知
export const checkOgyCanisterModule = async () => {
    for (const canister_id of _.uniq(NFT_OGY)) {
        const r = await canister_module_hash_and_time(canister_id, import.meta.env.CONNECT_HOST);
        const current = MAPPING_CANISTERS[canister_id];
        if (r.module_hash !== current) {
            console.error(
                'OGY canister module is changed',
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
        console.error('OGY canister is not implement', key, module);
    }
}

const getModule = (collection: string) => {
    const module_hex = MAPPING_CANISTERS[collection];
    if (module_hex === undefined) throw new Error(`unknown ogy canister id: ${collection}`);
    const module = MAPPING_MODULES[module_hex];
    if (module === undefined) throw new Error(`unknown ogy canister id: ${collection}`);
    return module;
};

// =========================== 查询 OGY 集合信息 ===========================

export type OgyCollectionInfo_2f2a0ab9<T> = {
    name?: string;
    logo?: string;
    symbol?: string;
    network?: string; // ? principal -> string
    metadata?: T;
    fields?: [
        string,
        string | undefined, // ? bigint -> string
        string | undefined, // ? bigint -> string
    ][];

    created_at?: string; // ? bigint -> string
    upgraded_at?: string; // ? bigint -> string

    owner?: string; // ? principal -> string
    managers?: string[]; // ? principal -> string

    total_supply?: string; // ? bigint -> string
    token_ids?: string[];
    token_ids_count?: string; // ? bigint -> string

    unique_holders?: string; // ? bigint -> string
    transaction_count?: string; // ? bigint -> string

    allocated_storage?: string; // ? bigint -> string
    available_space?: string; // ? bigint -> string

    multi_canister?: string[]; // ? principal -> string
    multi_canister_count?: string; // ? bigint -> string
};

export const parseOgyCollectionInfo_2f2a0ab9 = (
    info: CollectionInfo_2f2a0ab9,
): OgyCollectionInfo_2f2a0ab9<OgyCandyValue_2f2a0ab9> => {
    return {
        name: unwrapOption(info.name),
        logo: unwrapOption(info.logo),
        symbol: unwrapOption(info.symbol),
        network: unwrapOptionMap(info.network, principal2string),
        metadata: unwrapOptionMap(info.metadata, (metadata) => unwrapCandyValue_2f2a0ab9(metadata)),
        fields: unwrapOptionMap(info.fields, (fields) =>
            fields.map((f) => [
                f[0],
                unwrapOptionMap(f[1], bigint2string),
                unwrapOptionMap(f[1], bigint2string),
            ]),
        ),

        created_at: unwrapOptionMap(info.created_at, bigint2string),
        upgraded_at: unwrapOptionMap(info.upgraded_at, bigint2string),

        owner: unwrapOptionMap(info.owner, principal2string),
        managers: unwrapOptionMap(info.multi_canister, (s) => s.map(principal2string)),

        total_supply: unwrapOptionMap(info.total_supply, bigint2string),
        token_ids: unwrapOption(info.token_ids),
        token_ids_count: unwrapOptionMap(info.token_ids_count, bigint2string),

        unique_holders: unwrapOptionMap(info.unique_holders, bigint2string),
        transaction_count: unwrapOptionMap(info.transaction_count, bigint2string),

        allocated_storage: unwrapOptionMap(info.allocated_storage, bigint2string),
        available_space: unwrapOptionMap(info.available_space, bigint2string),

        multi_canister: unwrapOptionMap(info.multi_canister, (s) => s.map(principal2string)),
        multi_canister_count: unwrapOptionMap(info.multi_canister_count, bigint2string),
    };
};

export const parseOgyCollectionInfo_47a7c018 = (
    info: CollectionInfo_47a7c018,
): OgyCollectionInfo_2f2a0ab9<OgyCandyValue_47a7c018> => {
    return {
        name: unwrapOption(info.name),
        logo: unwrapOption(info.logo),
        symbol: unwrapOption(info.symbol),
        network: unwrapOptionMap(info.network, principal2string),
        metadata: unwrapOptionMap(info.metadata, (metadata) => unwrapCandyValue_47a7c018(metadata)),
        fields: unwrapOptionMap(info.fields, (fields) =>
            fields.map((f) => [
                f[0],
                unwrapOptionMap(f[1], bigint2string),
                unwrapOptionMap(f[1], bigint2string),
            ]),
        ),

        created_at: unwrapOptionMap(info.created_at, bigint2string),
        upgraded_at: unwrapOptionMap(info.upgraded_at, bigint2string),

        owner: unwrapOptionMap(info.owner, principal2string),
        managers: unwrapOptionMap(info.multi_canister, (s) => s.map(principal2string)),

        total_supply: unwrapOptionMap(info.total_supply, bigint2string),
        token_ids: unwrapOption(info.token_ids),
        token_ids_count: unwrapOptionMap(info.token_ids_count, bigint2string),

        unique_holders: unwrapOptionMap(info.unique_holders, bigint2string),
        transaction_count: unwrapOptionMap(info.transaction_count, bigint2string),

        allocated_storage: unwrapOptionMap(info.allocated_storage, bigint2string),
        available_space: unwrapOptionMap(info.available_space, bigint2string),

        multi_canister: unwrapOptionMap(info.multi_canister, (s) => s.map(principal2string)),
        multi_canister_count: unwrapOptionMap(info.multi_canister_count, bigint2string),
    };
};

export const parseOgyCollectionInfo_243d1642 = (
    info: CollectionInfo_243d1642,
): OgyCollectionInfo_2f2a0ab9<OgyCandyValue_47a7c018> => {
    return {
        name: unwrapOption(info.name),
        logo: unwrapOption(info.logo),
        symbol: unwrapOption(info.symbol),
        network: unwrapOptionMap(info.network, principal2string),
        metadata: unwrapOptionMap(info.metadata, (metadata) => unwrapCandyValue_243d1642(metadata)),
        fields: unwrapOptionMap(info.fields, (fields) =>
            fields.map((f) => [
                f[0],
                unwrapOptionMap(f[1], bigint2string),
                unwrapOptionMap(f[1], bigint2string),
            ]),
        ),

        created_at: unwrapOptionMap(info.created_at, bigint2string),
        upgraded_at: unwrapOptionMap(info.upgraded_at, bigint2string),

        owner: unwrapOptionMap(info.owner, principal2string),
        managers: unwrapOptionMap(info.multi_canister, (s) => s.map(principal2string)),

        total_supply: unwrapOptionMap(info.total_supply, bigint2string),
        token_ids: unwrapOption(info.token_ids),
        token_ids_count: unwrapOptionMap(info.token_ids_count, bigint2string),

        unique_holders: unwrapOptionMap(info.unique_holders, bigint2string),
        transaction_count: unwrapOptionMap(info.transaction_count, bigint2string),

        allocated_storage: unwrapOptionMap(info.allocated_storage, bigint2string),
        available_space: unwrapOptionMap(info.available_space, bigint2string),

        multi_canister: unwrapOptionMap(info.multi_canister, (s) => s.map(principal2string)),
        multi_canister_count: unwrapOptionMap(info.multi_canister_count, bigint2string),
    };
};

export type OgyCollectionInfo_be8972b0<T> = {
    name?: string;
    logo?: string;
    symbol?: string;
    network?: string; // ? principal -> string
    metadata?: T;
    fields?: [
        string,
        string | undefined, // ? bigint -> string
        string | undefined, // ? bigint -> string
    ][];

    owner?: string; // ? principal -> string
    managers?: string[]; // ? principal -> string

    total_supply?: string; // ? bigint -> string
    token_ids?: string[];
    token_ids_count?: string; // ? bigint -> string

    allocated_storage?: string; // ? bigint -> string
    available_space?: string; // ? bigint -> string

    multi_canister?: string[]; // ? principal -> string
    multi_canister_count?: string; // ? bigint -> string
};

export const parseOgyCollectionInfo_be8972b0 = (
    info: CollectionInfo_be8972b0,
): OgyCollectionInfo_be8972b0<OgyCandyValue_2f2a0ab9> => {
    return {
        name: unwrapOption(info.name),
        logo: unwrapOption(info.logo),
        symbol: unwrapOption(info.symbol),
        network: unwrapOptionMap(info.network, principal2string),
        metadata: unwrapOptionMap(info.metadata, (metadata) => unwrapCandyValue_2f2a0ab9(metadata)),
        fields: unwrapOptionMap(info.fields, (fields) =>
            fields.map((f) => [
                f[0],
                unwrapOptionMap(f[1], bigint2string),
                unwrapOptionMap(f[1], bigint2string),
            ]),
        ),

        owner: unwrapOptionMap(info.owner, principal2string),
        managers: unwrapOptionMap(info.multi_canister, (s) => s.map(principal2string)),

        total_supply: unwrapOptionMap(info.total_supply, bigint2string),
        token_ids: unwrapOption(info.token_ids),
        token_ids_count: unwrapOptionMap(info.token_ids_count, bigint2string),

        allocated_storage: unwrapOptionMap(info.allocated_storage, bigint2string),
        available_space: unwrapOptionMap(info.available_space, bigint2string),

        multi_canister: unwrapOptionMap(info.multi_canister, (s) => s.map(principal2string)),
        multi_canister_count: unwrapOptionMap(info.multi_canister_count, bigint2string),
    };
};

export const queryCollectionInfoByOgy = async (
    identity: ConnectedIdentity,
    collection: string,
): Promise<
    | OgyCollectionInfo_2f2a0ab9<OgyCandyValue_2f2a0ab9>
    | OgyCollectionInfo_2f2a0ab9<OgyCandyValue_47a7c018>
    | OgyCollectionInfo_be8972b0<OgyCandyValue_2f2a0ab9>
> => {
    const module = getModule(collection);
    return module.queryCollectionInfoByOgy(identity, collection);
};

// =========================== 查询 OGY 标准的所有 token 的所有者 ===========================

export const queryAllTokenOwnersByIdList = async (
    identity: ConnectedIdentity,
    collection: string,
    id_list: string[] | undefined,
): Promise<NftTokenOwner[]> => {
    const module = getModule(collection);
    return module.queryAllTokenOwnersByIdList(identity, collection, id_list);
};

// =========================== 查询 OGY 标准的所有 token 的所有者 ===========================

export const queryAllTokenOwnersByOgy = async (
    identity: ConnectedIdentity,
    collection: string,
): Promise<NftTokenOwner[]> => {
    const module = getModule(collection);
    return module.queryAllTokenOwnersByOgy(identity, collection);
};

// =========================== 查询 OGY 标准的所有 token 元数据 ===========================

export const queryAllTokenMetadataByOgy = async (
    collection: string,
    token_owners: NftTokenOwner[],
    _collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata[]> => {
    // 直接拼接
    return token_owners.map((token) => {
        return {
            token_id: {
                collection,
                token_identifier: token.token_id.token_identifier,
            },
            metadata: {
                name: token.token_id.token_identifier,
                mimeType: '',
                url: `https://prptl.io/-/${collection}/-/${token.token_id.token_identifier}`,
                thumb: `https://prptl.io/-/${collection}/-/${token.token_id.token_identifier}/preview`,
                description: '',
                traits: [],
                onChainUrl: `https://prptl.io/-/${collection}/-/${token.token_id.token_identifier}`,
                yumi_traits: [],
            },
            raw: { ...token.raw, data: customStringify(token.raw.data) },
        };
    });
};

// =========================== 查询 OGY 标准的指定 token 元数据 ===========================

export const querySingleTokenMetadataByOgy = async (
    collection: string,
    token_identifier: string,
    _collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata> => {
    // 直接拼接
    return {
        token_id: {
            collection,
            token_identifier,
        },
        metadata: {
            name: token_identifier,
            mimeType: '',
            url: `https://prptl.io/-/${collection}/-/${token_identifier}`,
            thumb: `https://prptl.io/-/${collection}/-/${token_identifier}/preview`,
            description: '',
            traits: [],
            onChainUrl: `https://prptl.io/-/${collection}/-/${token_identifier}`,
            yumi_traits: [],
        },
        raw: {
            standard: 'ogy',
            data: customStringify({ token_id: token_identifier }),
        },
    };
};

// =========================== 查询 OGY 标准的指定 nft 的所有者 ===========================

export const querySingleTokenOwnerByOgy = async (
    identity: ConnectedIdentity,
    collection: string,
    token_identifier: string,
): Promise<string> => {
    const module = getModule(collection);
    return module.querySingleTokenOwnerByOgy(identity, collection, token_identifier);
};

// =========================== OGY 标准下架 ===========================

export const retrieveNftFromListingByOgy = async (
    identity: ConnectedIdentity,
    collection: string,
    token_identifier: string,
): Promise<boolean> => {
    const module = getModule(collection);
    return module.retrieveNftFromListingByOgy(identity, collection, token_identifier);
};

// =========================== OGY 标准上架 ===========================

export const listingByOgy = async (
    identity: ConnectedIdentity,
    collection: string,
    args: {
        broker_id?: string; // 代理商的 id
        token_identifier: string;
        token: TokenInfo; // 设定的代币信息
        price: string; // 注意是已经乘以单位精度的值
        allow_list?: string[]; // 允许回购的白名单
    },
): Promise<boolean> => {
    const module = getModule(collection);
    return module.listingByOgy(identity, collection, args);
};

// =========================== 查询 OGY 标准的指定 nft 的上架信息 ===========================

export const parseOgyNiftyToNftListing_db6f76c6 = (
    _nifty: NiftyStateStable_db6f76c6,
): NftListing => {
    // TODO 不知道是啥
    // console.error(`nifty type is not supported`);
    // return { type: 'holding' };
    throw new Error('nifty type is not supported');
};
export const parseOgyAuctionToNftListing_db6f76c6 = (
    sale_id: string,
    auction: AuctionStateStable_db6f76c6,
    yumi_ogy_broker: string,
): NftListing => {
    // 折算成定价销售
    const status = unwrapVariantKey(auction.status);
    if (['closed', 'not_started'].includes(status)) return { type: 'holding' };
    const winner = unwrapOption(auction.winner);
    if (winner !== undefined) return { type: 'holding' };

    // ? 检查代理人, 如果不是 yumi, 就算没上架
    const broker = unwrapOptionMap(auction.current_broker_id, principal2string);
    if (broker !== yumi_ogy_broker) return { type: 'holding' }; // ! 代理人不是 yumi, 不算上架

    // ! 直接读取里面的 buy now 和 token
    // 错误处理
    const throwError = (config_key: string) => {
        throw new Error(`module_db6f76c6 config type is not supported: ${config_key}`);
    };
    const config_auction = unwrapVariant6Map<
        any,
        any,
        any,
        any,
        AuctionConfig_db6f76c6,
        any,
        AuctionConfig_db6f76c6
    >(
        auction.config,
        ['flat', () => throwError('flat')],
        ['extensible', () => throwError('extensible')],
        ['instant', () => throwError('instant')],
        ['nifty', () => throwError('nifty')],
        ['auction', unchanging],
        ['dutch', () => throwError('dutch')],
    );
    const time = bigint2string(config_auction.start_date);
    // 卖家指定的卖出的代币信息
    const token = unwrapVariant2Map<ICTokenSpec_db6f76c6, any, TokenInfo>(
        config_auction.token,
        [
            'ic',
            (token: ICTokenSpec_db6f76c6) => {
                const token_info: TokenInfo = {
                    id: unwrapOptionMap(token.id, bigint2string),
                    symbol: token.symbol,
                    canister: principal2string(token.canister),
                    standard: (() => {
                        const key = unwrapVariantKey(token.standard);
                        switch (key) {
                            case 'Ledger':
                            case 'ICRC1':
                            case 'DIP20':
                            case 'EXTFungible':
                                return { type: key };
                            case 'Other':
                                return {
                                    type: 'Other',
                                    raw: customStringify(token.standard['Other']),
                                };
                        }
                        throw new Error(`module_db6f76c6 unknown token standard: ${key}`);
                    })(),
                    decimals: bigint2string(token.decimals),
                    fee: unwrapOptionMap(token.fee, bigint2string),
                };
                return token_info;
            },
        ],
        [
            'extensible',
            () => {
                throw new Error(`module_db6f76c6 token type is not supported: extensible`);
            },
        ],
    );
    // 出售价格 // ? bigint -> string
    const price = unwrapOptionMap(config_auction.buy_now, bigint2string);
    if (price === undefined) return { type: 'holding' }; // ! 代理人不是 yumi, 不算上架
    return {
        type: 'listing',
        time,
        token,
        price,
        raw: {
            type: 'ogy',
            sale_id,
            raw: customStringify(auction),
        },
    };
};
export const parseOgyAuctionToNftListing_243d1642 = (
    sale_id: string,
    auction: AuctionStateStable_243d1642,
    yumi_ogy_broker: string,
): NftListing => {
    // 折算成定价销售
    const status = unwrapVariantKey(auction.status);
    if (['closed', 'not_started'].includes(status)) return { type: 'holding' };
    const winner = unwrapOption(auction.winner);
    if (winner !== undefined) return { type: 'holding' };

    // ? 检查代理人, 如果不是 yumi, 就算没上架
    const broker = unwrapOptionMap(auction.current_broker_id, principal2string);
    if (broker !== yumi_ogy_broker) return { type: 'holding' }; // ! 代理人不是 yumi, 不算上架

    // ! 直接读取里面的 buy now 和 token
    // 错误处理
    const throwError = (config_key: string) => {
        throw new Error(`module_db6f76c6 config type is not supported: ${config_key}`);
    };
    const config_auction = unwrapVariant6Map<
        any,
        any,
        any,
        any,
        AuctionConfig_db6f76c6,
        any,
        AuctionConfig_db6f76c6
    >(
        auction.config,
        ['flat', () => throwError('flat')],
        ['extensible', () => throwError('extensible')],
        ['instant', () => throwError('instant')],
        ['nifty', () => throwError('nifty')],
        ['auction', unchanging],
        ['dutch', () => throwError('dutch')],
    );
    const time = bigint2string(config_auction.start_date);
    // 卖家指定的卖出的代币信息
    const token = unwrapVariant2Map<ICTokenSpec_db6f76c6, any, TokenInfo>(
        config_auction.token,
        [
            'ic',
            (token: ICTokenSpec_db6f76c6) => {
                const token_info: TokenInfo = {
                    id: unwrapOptionMap(token.id, bigint2string),
                    symbol: token.symbol,
                    canister: principal2string(token.canister),
                    standard: (() => {
                        const key = unwrapVariantKey(token.standard);
                        switch (key) {
                            case 'Ledger':
                            case 'ICRC1':
                            case 'DIP20':
                            case 'EXTFungible':
                                return { type: key };
                            case 'Other':
                                return {
                                    type: 'Other',
                                    raw: customStringify(token.standard['Other']),
                                };
                        }
                        throw new Error(`module_db6f76c6 unknown token standard: ${key}`);
                    })(),
                    decimals: bigint2string(token.decimals),
                    fee: unwrapOptionMap(token.fee, bigint2string),
                };
                return token_info;
            },
        ],
        [
            'extensible',
            () => {
                throw new Error(`module_db6f76c6 token type is not supported: extensible`);
            },
        ],
    );
    // 出售价格 // ? bigint -> string
    const price = unwrapOptionMap(config_auction.buy_now, bigint2string);
    if (price === undefined) return { type: 'holding' }; // ! 代理人不是 yumi, 不算上架
    return {
        type: 'listing',
        time,
        token,
        price,
        raw: {
            type: 'ogy',
            sale_id,
            raw: customStringify(auction),
        },
    };
};
export const parseOgyDutchAuctionToNftListing_db6f76c6 = (
    _dutch: DutchStateStable_db6f76c6,
): NftListing => {
    // console.error(`dutch type is not supported`);
    // return { type: 'holding' };
    // TODO 折算成荷兰拍卖
    throw new Error('dutch type is not supported');
};

export const parseOgyAuctionToNftListing_be8972b0 = (
    sale_id: string,
    auction: AuctionStateStable_be8972b0,
    yumi_ogy_broker: string,
): NftListing => {
    // 折算成定价销售
    const status = unwrapVariantKey(auction.status);
    if (['closed', 'not_started'].includes(status)) return { type: 'holding' };
    const winner = unwrapOption(auction.winner);
    if (winner !== undefined) return { type: 'holding' };

    // ? 检查代理人, 如果不是 yumi, 就算没上架
    const broker = unwrapOptionMap(auction.current_broker_id, principal2string);
    if (broker !== yumi_ogy_broker) return { type: 'holding' }; // ! 代理人不是 yumi, 不算上架

    // ! 直接读取里面的 buy now 和 token
    // 错误处理
    const throwError = (config_key: string) => {
        throw new Error(`module_be8972b0 config type is not supported: ${config_key}`);
    };
    const config_auction = unwrapVariant5Map<
        any,
        any,
        any,
        AuctionConfig_be8972b0,
        any,
        AuctionConfig_be8972b0
    >(
        auction.config,
        ['flat', () => throwError('flat')],
        ['extensible', () => throwError('extensible')],
        ['instant', () => throwError('instant')],
        ['auction', unchanging],
        ['dutch', () => throwError('dutch')],
    );
    const time = bigint2string(config_auction.start_date);
    // 卖家指定的卖出的代币信息
    const token = unwrapVariant2Map<ICTokenSpec_be8972b0, any, TokenInfo>(
        config_auction.token,
        [
            'ic',
            (token: ICTokenSpec_be8972b0) => {
                const token_info: TokenInfo = {
                    symbol: token.symbol,
                    canister: principal2string(token.canister),
                    standard: (() => {
                        const key = unwrapVariantKey(token.standard);
                        switch (key) {
                            case 'Ledger':
                            case 'ICRC1':
                            case 'DIP20':
                            case 'EXTFungible':
                                return { type: key };
                        }
                        throw new Error(`module_be8972b0 unknown token standard: ${key}`);
                    })(),
                    decimals: bigint2string(token.decimals),
                    fee: bigint2string(token.fee),
                };
                return token_info;
            },
        ],
        [
            'extensible',
            () => {
                throw new Error(`module_be8972b0 token type is not supported: extensible`);
            },
        ],
    );
    // 出售价格 // ? bigint -> string
    const price = unwrapOptionMap(config_auction.buy_now, bigint2string);
    if (price === undefined) return { type: 'holding' }; // ! 代理人不是 yumi, 不算上架
    return {
        type: 'listing',
        time,
        token,
        price,
        raw: {
            type: 'ogy',
            sale_id,
            raw: customStringify(auction),
        },
    };
};

export const parseOgyAuctionToNftListing_47a7c018 = (
    sale_id: string,
    auction: AuctionStateShared_47a7c018,
    yumi_ogy_broker: string,
): NftListing => {
    // 折算成定价销售
    const status = unwrapVariantKey(auction.status);
    if (['closed', 'not_started'].includes(status)) return { type: 'holding' };
    const winner = unwrapOption(auction.winner);
    if (winner !== undefined) return { type: 'holding' };

    // ? 检查代理人, 如果不是 yumi, 就算没上架
    const broker = unwrapOptionMap(auction.current_broker_id, principal2string);
    if (broker !== yumi_ogy_broker) return { type: 'holding' }; // ! 代理人不是 yumi, 不算上架

    // ! 直接读取里面的 buy now 和 token
    // 错误处理
    const throwError = (config_key: string) => {
        throw new Error(`module_47a7c018 config type is not supported: ${config_key}`);
    };
    const config_auction = unwrapVariant4Map<
        any,
        any,
        any,
        AuctionConfig_47a7c018,
        AuctionConfig_47a7c018
    >(
        auction.config,
        ['ask', () => throwError('ask')],
        ['extensible', () => throwError('extensible')],
        ['instant', () => throwError('instant')],
        ['auction', unchanging],
    );
    const time = bigint2string(config_auction.start_date);
    // 卖家指定的卖出的代币信息
    const token = unwrapVariant2Map<ICTokenSpec_47a7c018, any, TokenInfo>(
        config_auction.token,
        [
            'ic',
            (token: ICTokenSpec_47a7c018) => {
                const token_info: TokenInfo = {
                    id: unwrapOptionMap(token.id, bigint2string),
                    symbol: token.symbol,
                    canister: principal2string(token.canister),
                    standard: (() => {
                        const key = unwrapVariantKey(token.standard);
                        switch (key) {
                            case 'Ledger':
                            case 'ICRC1':
                            case 'DIP20':
                            case 'EXTFungible':
                                return { type: key };
                            case 'Other':
                                return {
                                    type: 'Other',
                                    raw: customStringify(token.standard['Other']),
                                };
                        }
                        throw new Error(`module_47a7c018 unknown token standard: ${key}`);
                    })(),
                    decimals: bigint2string(token.decimals),
                    fee: unwrapOptionMap(token.fee, bigint2string),
                };
                return token_info;
            },
        ],
        [
            'extensible',
            () => {
                throw new Error(`module_47a7c018 token type is not supported: extensible`);
            },
        ],
    );
    // 出售价格 // ? bigint -> string
    const price = unwrapOptionMap(config_auction.buy_now, bigint2string);
    if (price === undefined) return { type: 'holding' }; // ! 代理人不是 yumi, 不算上架
    return {
        type: 'listing',
        time,
        token,
        price,
        raw: {
            type: 'ogy',
            sale_id,
            raw: customStringify(auction),
        },
    };
};

export const queryTokenListingByOgy = async (
    identity: ConnectedIdentity,
    collection: string,
    token_id_list: NftIdentifier[],
    yumi_ogy_broker: string,
): Promise<NftListingData[]> => {
    const module = getModule(collection);
    return module.queryTokenListingByOgy(identity, collection, token_id_list, yumi_ogy_broker);
};

// =========================== OGY 查询购买充值地址 ===========================

export const queryRechargeAccountByOgy = async (
    identity: ConnectedIdentity,
    collection: string,
    principal: string, // 谁要购买
): Promise<string> => {
    const module = getModule(collection);
    return module.queryRechargeAccountByOgy(identity, collection, principal);
};

// =========================== OGY 购买 ===========================

export type BidNftArg = {
    sale_id: string;
    broker_id?: string; // 代理商的 id
    token_identifier: string;
    seller: string; // ? principal -> string
    buyer: string; // ? principal -> string
    token: TokenInfo; // 设定的代币信息
    amount: string; // 使用的代币数量
};

export const bidNftByOgy = async (
    identity: ConnectedIdentity,
    collection: string,
    args: BidNftArg,
): Promise<NftIdentifier> => {
    const module = getModule(collection);
    return module.bidNftByOgy(identity, collection, args);
};

// =========================== OGY 批量 购买 ===========================

export const batchBidNftByOgy = async (
    identity: ConnectedIdentity,
    collection: string,
    args: BidNftArg[],
): Promise<NftIdentifier[]> => {
    const module = getModule(collection);
    return module.batchBidNftByOgy(identity, collection, args);
};

// =========================== OGY 查询活跃的 token ===========================

interface SaleStatusStable {
    token_id: string;
    sale_type: any; // 类型太多，统一字符串了
    broker_id: [] | [Principal];
    original_broker_id: [] | [Principal];
    sale_id: string;
}
export type OgyTokenSale = {
    token_id: string;
    sale_type: string; // auction | nifty | dutch // 文本化了
    broker_id?: string; // ? principal -> string
    original_broker_id?: string; // ? principal -> string
    sale_id: string;
};
type OgyTokenStatus =
    | {
          name: 'unminted'; // 不知道啥意思 内容是空的 /* cspell: disable-line */
          sale?: undefined;
      }
    | {
          name: string;
          sale?: OgyTokenSale;
      };

export type OgyTokenActive = {
    eof: boolean;
    count: string; // ? bigint -> string
    records: OgyTokenStatus[];
};

export const unwrapActiveRecords = (active: {
    eof: boolean;
    records: Array<[string, [] | [SaleStatusStable]]>;
    count: bigint;
}): OgyTokenActive => {
    return {
        eof: active.eof,
        count: bigint2string(active.count),
        records: active.records.map((item) => ({
            name: item[0],
            sale: unwrapOptionMap(item[1], (stable) => {
                return {
                    token_id: stable.token_id,
                    sale_type: customStringify(stable.sale_type),
                    broker_id: unwrapOptionMap(stable.broker_id, principal2string),
                    original_broker_id: unwrapOptionMap(
                        stable.original_broker_id,
                        principal2string,
                    ),
                    sale_id: stable.sale_id,
                };
            }),
        })),
    };
};

export const queryTokenActiveRecordsByOgy = async (
    identity: ConnectedIdentity,
    collection: string,
): Promise<OgyTokenActive> => {
    const module = getModule(collection);
    return module.queryTokenActiveRecordsByOgy(identity, collection);
};

// =========================== OGY 查询 历史记录 ===========================

export type OgyTokenHistory = {
    eof: boolean;
    count: string; // ? bigint -> string
    records: OgyTokenSale[];
};

export const unwrapHistoryRecords = (active: {
    eof: boolean;
    records: Array<[] | [SaleStatusStable]>;
    count: bigint;
}): OgyTokenHistory => {
    return {
        eof: active.eof,
        count: bigint2string(active.count),
        records: active.records
            .map((item) =>
                unwrapOptionMap(item, (stable) => {
                    return {
                        token_id: stable.token_id,
                        sale_type: customStringify(stable.sale_type),
                        broker_id: unwrapOptionMap(stable.broker_id, principal2string),
                        original_broker_id: unwrapOptionMap(
                            stable.original_broker_id,
                            principal2string,
                        ),
                        sale_id: stable.sale_id,
                    };
                }),
            )
            .filter((item) => item) as OgyTokenSale[],
    };
};

export const queryTokenHistoryRecordsByOgy = async (
    identity: ConnectedIdentity,
    collection: string,
): Promise<OgyTokenHistory> => {
    const module = getModule(collection);
    return module.queryTokenHistoryRecordsByOgy(identity, collection);
};

// =========================== OGY 标准 获取铸币人 ===========================

export const queryCollectionNftMinterByOgy = async (
    identity: ConnectedIdentity,
    collection: string,
    token_identifier: string,
): Promise<string> => {
    const module = getModule(collection);
    return module.queryCollectionNftMinterByOgy(identity, collection, token_identifier);
};
