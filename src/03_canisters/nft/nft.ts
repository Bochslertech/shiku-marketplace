import { ConnectedIdentity } from '@/01_types/identity';
import { NftTokenMetadata, NftTokenOwner, NftTokenScore } from '@/01_types/nft';
import { CccProxyNft } from '@/01_types/nft-standard/ccc';
import { CoreCollectionData } from '@/01_types/yumi';
import {
    queryAllTokenMetadataByCcc,
    queryAllTokenOwnersByCcc,
    queryCollectionNftMinterByCcc,
} from './nft_ccc';
import {
    queryAllTokenMetadataByExt,
    queryAllTokenOwnersByExt,
    queryAllTokenScoresByExt,
    queryCollectionNftMinterByExt,
    queryOwnerTokenMetadataByExt,
    querySingleTokenMetadataByExt,
    querySingleTokenOwnerByExt,
} from './nft_ext';
import {
    queryAllTokenMetadataByIcnaming,
    queryAllTokenOwnersByIcnaming,
    queryCollectionNftMinterByIcnaming,
    querySingleTokenMetadataByIcnaming,
    querySingleTokenOwnerByIcnaming,
} from './nft_icnaming';
import {
    queryAllTokenMetadataByOgy,
    queryAllTokenOwnersByOgy,
    queryCollectionNftMinterByOgy,
    querySingleTokenMetadataByOgy,
    querySingleTokenOwnerByOgy,
} from './nft_ogy';
import {
    queryAllTokenMetadataByShikuLand,
    queryAllTokenOwnersByShikuLand,
    queryCollectionNftMinterByShikuLand,
    querySingleTokenOwnerByShikuLand,
} from './nft_shiku_land';
import { NFT_CCC, NFT_EXT_WITHOUT_APPROVE, NFT_ICNAMING, NFT_OGY, NFT_SHIKU_LAND } from './special';

// =========================== 查询所有标准的所有 token 的所有者 ===========================

// 每个标准要用不同的方法
export const queryAllTokenOwners = async (
    identity: ConnectedIdentity,
    collection: string,
    fetchProxyNftList: () => Promise<CccProxyNft[]>,
): Promise<NftTokenOwner[]> => {
    const r: NftTokenOwner[] = await (async () => {
        try {
            // 如果是 CCC 标准
            if (NFT_CCC.includes(collection)) {
                return await queryAllTokenOwnersByCcc(identity, collection, fetchProxyNftList);
            }
            // 如果是 OGY 标准
            if (NFT_OGY.includes(collection)) {
                return await queryAllTokenOwnersByOgy(identity, collection);
            }
            // 如果是 ICNAMING 标准
            if (NFT_ICNAMING.includes(collection)) {
                return await queryAllTokenOwnersByIcnaming(identity, collection);
            }
            // 如果是 SHIKU_LAND 标准
            if (NFT_SHIKU_LAND.includes(collection)) {
                return await queryAllTokenOwnersByShikuLand(identity, collection);
            }

            // 默认用 EXT 标准
            const r = await queryAllTokenOwnersByExt(identity, collection, fetchProxyNftList);
            // console.log('queryAllTokenOwners', collection, r);
            return r;
        } catch (e: any) {
            console.log('queryAllTokenOwners', collection, e.message);
            return [];
        }
    })();
    return r.filter((n) => n.owner !== ''); // ! 约定 如果 register 的值是 '' 就表示销毁了, 因此不应该显示了
};

// =========================== 查询所有标准的所有 token 的元数据 ===========================

// 每个标准要用不同的方法
export const queryAllTokenMetadata = async (
    identity: ConnectedIdentity,
    collection: string,
    token_owners: NftTokenOwner[],
    collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata[]> => {
    try {
        // 如果是 CCC 标准
        if (NFT_CCC.includes(collection)) {
            return await queryAllTokenMetadataByCcc(
                identity,
                collection,
                token_owners,
                collection_data,
            );
        }
        // 如果是 OGY 标准
        if (NFT_OGY.includes(collection)) {
            return await queryAllTokenMetadataByOgy(collection, token_owners, collection_data);
        }
        // 如果是 ICNAMING 标准
        if (NFT_ICNAMING.includes(collection)) {
            return await queryAllTokenMetadataByIcnaming(
                identity,
                collection,
                token_owners,
                collection_data,
            );
        }
        // 如果是 SHIKU_LAND 标准
        if (NFT_SHIKU_LAND.includes(collection)) {
            return await queryAllTokenMetadataByShikuLand(
                identity,
                collection,
                token_owners,
                collection_data,
            );
        }

        // 默认用 EXT 标准
        const r = await queryAllTokenMetadataByExt(
            identity,
            collection,
            token_owners,
            collection_data,
        );
        // console.log('queryAllTokenMetadata', collection, r);
        return r;
    } catch (e: any) {
        console.log('queryAllTokenMetadata', collection, e.message, e);
        return [];
    }
};

// =========================== 查询所有标准的所有 token 的稀有度 ===========================

// ! 有的 EXT 标准没有 getScore 接口的
const CANISTER_NO_GET_SCORE = [
    'q2elr-eaaaa-aaaah-abwwq-cai',
    'kafas-uaaaa-aaaao-aaofq-cai',
    'y5cyv-vaaaa-aaaah-abxaq-cai',
    'a2laq-5qaaa-aaaah-abv3q-cai',
    'wekml-7yaaa-aaaah-abwca-cai',
    'n46fk-6qaaa-aaaai-ackxa-cai',
    'ujnhf-3yaaa-aaaag-qcj6q-cai', // getRegister 也没有
    'xpegl-kaaaa-aaaah-abcrq-cai',
    'bqeck-7aaaa-aaaah-abv4q-cai',
    '4pwl6-pyaaa-aaaah-abpaa-cai',
    '5fzje-niaaa-aaaah-abpha-cai',
    'upr6o-taaaa-aaaah-abowq-cai',
    '6op7h-lqaaa-aaaah-abpnq-cai',
    '53lcn-vyaaa-aaaah-ab4mq-cai',
    's7la6-viaaa-aaaah-abrgq-cai',
    'ripyo-cqaaa-aaaah-abolq-cai',
    'yubtj-diaaa-aaaah-abxba-cai',
    '3rvic-6aaaa-aaaah-abxkq-cai',
    '2szbe-kyaaa-aaaah-abxma-cai',
];

// 每个标准要用不同的方法
export const queryAllTokenScores = async (
    identity: ConnectedIdentity,
    collection: string,
): Promise<NftTokenScore[]> => {
    try {
        // 如果是 CCC 标准
        if (NFT_CCC.includes(collection)) {
            return []; // ? 没有稀有度
        }
        // 如果是 OGY 标准
        if (NFT_OGY.includes(collection)) {
            return []; // ? 没有稀有度
        }
        // 如果是 ICNAMING 标准
        if (NFT_ICNAMING.includes(collection)) {
            return []; // ? 没有稀有度
        }
        // 如果是 SHIKU_LAND 标准
        if (NFT_SHIKU_LAND.includes(collection)) {
            return []; // ? 没有稀有度
        }

        // ! 有的 EXT 标准没有 getScore 接口的
        if (
            CANISTER_NO_GET_SCORE.includes(collection) ||
            NFT_EXT_WITHOUT_APPROVE.includes(collection) // 这里面的都没有 getScore
        ) {
            console.log(`canister ${collection} has no query method 'getScore'`);
            return [];
        }

        // 默认用 EXT 标准
        const r = await queryAllTokenScoresByExt(identity, collection);
        // console.log('queryAllTokenScores', collection, r);
        return r;
    } catch (e: any) {
        console.log('queryAllTokenScores', collection, e.message);
        return [];
    }
};

// =========================== tokens_ext 查询 EXT 标准的指定 owner 的 token 元数据  ===========================
const CANISTER_NO_TOKENS_EXT = [
    'xzrh4-zyaaa-aaaaj-qagaa-cai', // ! nft gaga 罐子，已经移除
];

export const queryOwnerTokenMetadata = async (
    identity: ConnectedIdentity,
    collection: string,
    account: string,
    collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata[]> => {
    // 如果是 CCC 标准
    if (NFT_CCC.includes(collection)) {
        throw new Error("ccc nft has no query method 'tokens_ext'");
    }
    // 如果是 OGY 标准
    if (NFT_OGY.includes(collection)) {
        throw new Error("ogy nft has no query method 'tokens_ext'");
    }
    // 如果是 ICNAMING 标准
    if (NFT_ICNAMING.includes(collection)) {
        throw new Error("icnaming nft has no query method 'tokens_ext'");
    }
    // 如果是 SHIKU_LAND 标准
    if (NFT_SHIKU_LAND.includes(collection)) {
        throw new Error("shiku_land nft has no query method 'tokens_ext'"); // ? 不知道怎么使用啊
    }

    // 有的EXT 标准没有 tokens_ext 接口的
    if (CANISTER_NO_TOKENS_EXT.includes(collection)) {
        throw new Error(`canister ${collection} has no query method 'tokens_ext'`);
    }

    try {
        // 默认用 EXT 标准
        const r = await queryOwnerTokenMetadataByExt(
            identity,
            collection,
            account,
            collection_data,
        );
        // console.log('queryOwnerTokenMetadata', collection, r);
        return r;
    } catch (e: any) {
        console.log('queryOwnerTokenMetadata', collection, e.message);
        throw e;
    }
};

// =========================== metadata 查询指定 nft 的 token 元数据  ===========================

export const querySingleTokenMetadata = async (
    identity: ConnectedIdentity,
    collection: string,
    token_identifier: string,
    collection_data?: CoreCollectionData,
): Promise<NftTokenMetadata> => {
    // 如果是 CCC 标准
    if (NFT_CCC.includes(collection)) {
        throw new Error("ccc nft has no query method 'metadata'");
    }

    // 如果是 SHIKU_LAND 标准
    if (NFT_SHIKU_LAND.includes(collection)) {
        throw new Error("shiku_land nft has no query method 'metadata'");
    }

    try {
        // 如果是 OGY 标准
        if (NFT_OGY.includes(collection)) {
            return await querySingleTokenMetadataByOgy(
                collection,
                token_identifier,
                collection_data,
            );
        }

        // 如果是 ICNAMING 标准
        if (NFT_ICNAMING.includes(collection)) {
            return await querySingleTokenMetadataByIcnaming(
                identity,
                collection,
                token_identifier,
                collection_data,
            );
        }

        // 默认用 EXT 标准
        const r = await querySingleTokenMetadataByExt(
            identity,
            collection,
            token_identifier,
            collection_data,
        );
        // console.log('querySingleTokenMetadata', collection, r);
        return r;
    } catch (e) {
        console.log('querySingleTokenMetadata', collection, `${e}`);
        throw e;
    }
};

// =========================== bearer 查询指定 nft 的所有者 ===========================

export const querySingleTokenOwner = async (
    identity: ConnectedIdentity,
    collection: string,
    token_identifier: string,
): Promise<string> => {
    // 如果是 CCC 标准
    if (NFT_CCC.includes(collection)) {
        throw new Error("ccc nft has no query method 'metadata'");
    }

    try {
        // 如果是 OGY 标准
        if (NFT_OGY.includes(collection)) {
            return await querySingleTokenOwnerByOgy(identity, collection, token_identifier);
        }

        // 如果是 ICNAMING 标准
        if (NFT_ICNAMING.includes(collection)) {
            return await querySingleTokenOwnerByIcnaming(identity, collection, token_identifier);
        }

        // 如果是 SHIKU_LAND 标准
        if (NFT_ICNAMING.includes(collection)) {
            return await querySingleTokenOwnerByShikuLand(identity, collection, token_identifier);
        }

        // 默认用 EXT 标准
        const r = await querySingleTokenOwnerByExt(identity, collection, token_identifier);
        // console.log('querySingleTokenOwner', collection, r);
        return r;
    } catch (e) {
        console.log('querySingleTokenOwner', collection, `${e}`);
        throw e;
    }
};

// ===========================  获取铸币人 ===========================

export const queryCollectionNftMinter = async (
    identity: ConnectedIdentity,
    collection: string,
    token_identifier: string,
): Promise<string> => {
    try {
        // 如果是 CCC 标准
        if (NFT_CCC.includes(collection)) {
            return await queryCollectionNftMinterByCcc(identity, collection);
        }
        // 如果是 OGY 标准
        if (NFT_OGY.includes(collection)) {
            return await queryCollectionNftMinterByOgy(identity, collection, token_identifier);
        }
        // 如果是 ICNAMING 标准
        if (NFT_ICNAMING.includes(collection)) {
            return await queryCollectionNftMinterByIcnaming(identity, collection);
        }
        // 如果是 SHIKU_LAND 标准
        if (NFT_ICNAMING.includes(collection)) {
            return await queryCollectionNftMinterByShikuLand(identity, collection);
        }

        // 默认用 EXT 标准
        const r = await queryCollectionNftMinterByExt(identity, collection);
        // console.log('querySingleTokenOwner', collection, r);
        return r;
    } catch (e) {
        console.log('queryCollectionNftMinter', collection, `${e}`);
        throw e;
    }
};
