import { NftIdentifier, NftMetadata, NftTokenMetadata } from '@/01_types/nft';
import { UniqueCollectionData } from '@/01_types/yumi';
import { shrinkText } from '@/02_common/data/text';
import { isSameNft, parseTokenIndex, uniqueKey } from '@/02_common/nft/identifier';
import { Spend } from '@/02_common/react/spend';
import { unchanging } from '@/02_common/types/variant';
import { NFT_EXT_WITHOUT_APPROVE, NFT_ICNAMING, NFT_OGY_ART } from '@/03_canisters/nft/special';
import { getOgyGoldCanisterId } from '../canisters/nft/special';
import { getTokenMetadata, getTokenOwners } from '../combined/collection';

// =========================== 获取 NFT 的缩略图 ===========================

const ENCODE_CHARS = [
    ' ', // 空格不支持直接访问
];
// 有时候没有 thumb 变量, 就使用 url
export const getThumbnailByNftTokenMetadata = (token_metadata: NftTokenMetadata): string => {
    const url =
        token_metadata.metadata.thumb ||
        token_metadata.metadata.url ||
        token_metadata.metadata.onChainUrl;
    if (url.indexOf('%') >= 0) return url; // 如果有百分号, 不用进行编码
    for (const c of ENCODE_CHARS) if (url.indexOf(c) >= 0) return encodeURI(url); // 如果有特定字符 需要进行编码
    return url;
};

export const getThumbnailByNftMetadata = (card: NftMetadata): string => {
    return getThumbnailByNftTokenMetadata(card.metadata);
};
// =========================== 获取 NFT 的媒体数据 ===========================

// 有的集合有 bug url 无法显示, 就显示 thumb 吧
const MEDIA_THUMBNAIL_NFT_LIST: string[] = [];
const MEDIA_THUMBNAIL_COLLECTION_LIST: string[] = [
    'drbbg-zaaaa-aaaap-aannq-cai',
    'nkg3l-qaaaa-aaaah-adnqa-cai',
    'jouun-viaaa-aaaah-adnlq-cai',
    '3bag5-taaaa-aaaah-adoka-cai',
    'vnpdo-yqaaa-aaaah-adpla-cai',
];

// 使用 url
export const getMediaUrlByNftMetadata = (card: NftMetadata | undefined): string | undefined => {
    if (card === undefined) return undefined;
    if (
        MEDIA_THUMBNAIL_COLLECTION_LIST.includes(card.owner.token_id.collection) ||
        MEDIA_THUMBNAIL_NFT_LIST.includes(uniqueKey(card.owner.token_id))
    ) {
        return getThumbnailByNftMetadata(card);
    }
    const url = card.metadata.metadata.url || card.metadata.metadata.onChainUrl;
    if (url.indexOf('%') >= 0) return url; // 如果有百分号, 不用进行编码
    for (const c of ENCODE_CHARS) if (url.indexOf(c) >= 0) return encodeURI(url); // 如果有特定字符 需要进行编码
    return url;
};

// =========================== 获取 NFT 的名称 ===========================

// * 有的集合的 NFT 名称需要加 1
const INCREMENT_INDEX_COLLECTIONS = [
    'ah2fs-fqaaa-aaaak-aalya-cai',
    ...NFT_EXT_WITHOUT_APPROVE, // 貌似 Entrepot 里面的 NFT 都要加 1
];
const INCREMENT_NEEDLESS = [
    'bxdf4-baaaa-aaaah-qaruq-cai', // ICPunks
];

// 有时候没有 name 变量, 就判断一下
export const getNameByNftMetadata = (card: NftMetadata): string => {
    if (card.metadata.metadata.name) return card.metadata.metadata.name;
    if (card.data !== undefined) {
        const name = card.data.info.name;
        try {
            const token_index = parseTokenIndex(card.metadata.token_id);
            if (
                !INCREMENT_NEEDLESS.includes(card.owner.token_id.collection) &&
                INCREMENT_INDEX_COLLECTIONS.includes(card.owner.token_id.collection)
            ) {
                return `${name} #${token_index + 1}`;
            }
            return `${name} #${token_index}`; // 默认不加 1
        } catch (e) {
            console.error(`can not parse token index`, uniqueKey(card.metadata.token_id), e);
        }
    }
    // 如果是 ICNAMING 的罐子,可以显示域名
    if (NFT_ICNAMING.includes(card.metadata.token_id.collection)) {
        return card.metadata.raw.data as string;
    }
    return card.metadata.token_id.token_identifier;
};

// =========================== 获取 购物车 NFT 的名称 特别压缩 ===========================

// * 有的集合的 NFT 名称需要加 1

// 有时候没有 name 变量, 就判断一下
export const getNameByNftMetadataForCart = (card: NftMetadata): string => {
    if (card.metadata.metadata.name) return shrinkText(card.metadata.metadata.name, 14)!;
    if (card.data !== undefined) {
        const name = shrinkText(card.data.info.name, 14, 0);
        try {
            const token_index = parseTokenIndex(card.metadata.token_id);
            if (INCREMENT_INDEX_COLLECTIONS.includes(card.owner.token_id.collection)) {
                return `${name} #${token_index + 1}`;
            }
            return `${name} #${token_index}`; // 默认不加 1
        } catch (e) {
            console.error(`can not parse token index`, uniqueKey(card.metadata.token_id), e);
        }
    }
    // 如果是 ICNAMING 的罐子,可以显示域名
    if (NFT_ICNAMING.includes(card.metadata.token_id.collection)) {
        return card.metadata.raw.data as string;
    }
    return card.metadata.token_id.token_identifier;
};

// =========================== 获取 NFT 所属集合的名称 ===========================

// 有时候没有 name 变量, 就判断一下
export const getCollectionNameByNftMetadata = (card: NftMetadata | undefined): string => {
    if (card === undefined) return '';
    // origyn art 单独处理
    if (NFT_OGY_ART.includes(card.metadata.token_id.collection)) {
        return 'Co-Owned';
    }
    return card.data?.info.name ?? '';
};

// =========================== 获取 NFT 的跳转链接 ===========================

// 有时候没有 name 变量, 就判断一下
export const getNftPathByNftMetadata = (
    card: NftMetadata,
    artistCollectionIdList: string[],
    origynArtCollectionIdList: string[],
): string => {
    if (artistCollectionIdList.includes(card.metadata.token_id.collection)) {
        return `/art/${uniqueKey(card.metadata.token_id)}`;
    }
    if (origynArtCollectionIdList.includes(card.metadata.token_id.collection)) {
        return `/origyn/art/${uniqueKey(card.metadata.token_id)}`;
    }
    if (getOgyGoldCanisterId().includes(card.metadata.token_id.collection)) {
        return `/gold/${uniqueKey(card.metadata.token_id)}`;
    }
    return `/market/${uniqueKey(card.metadata.token_id)}`;
};

// =========================== 查找指定 NFT 的元数据 ===========================

// 通过本地和远程查找元数据

const byStoredRemote = async (
    token_id: NftIdentifier,
    data?: UniqueCollectionData,
): Promise<NftMetadata> => {
    const token_owners = await getTokenOwners(token_id.collection, 'stored_remote');
    if (token_owners === undefined) {
        // ! 完全找不到这个集合的所有权数据
        throw new Error(`can not find token owners for ${token_id.collection}`);
    }
    const owners = token_owners.filter((o) => isSameNft(o.token_id, token_id));
    if (owners.length === 0) {
        // ! 这个集合下没有该 NFT
        console.error('should not be empty', uniqueKey(token_id), token_owners);
        throw new Error(
            `can not find token ${token_id.token_identifier} in ${token_id.collection}`,
        );
    }
    if (owners.length !== 1) {
        // ! 这个集合有多个该 NFT
        console.error('should be only one', uniqueKey(token_id), token_owners);
        throw new Error(
            `find too many tokens ${token_id.token_identifier} in ${token_id.collection}`,
        );
    }
    const owner = owners[0]; // ? 取出所有者信息
    const token_metadata = await getTokenMetadata(token_id.collection, {
        from: 'stored_remote',
        token_owners,
        data,
    });
    if (token_metadata === undefined) {
        // ! 完全找不到这个集合的元数据
        throw new Error(`can not find token metadata for ${token_id.collection}`);
    }
    const metadata = token_metadata.find((m) => isSameNft(m.token_id, token_id));
    if (metadata === undefined) {
        // ! 这个集合的元数据下没有该 NFT
        console.error(`can not find token metadata for ${uniqueKey(token_id)}`);
        throw new Error(
            `can not find token metadata ${token_id.token_identifier} in ${token_id.collection}`,
        );
    }
    // ? 返回找到的数据
    return { data, owner, metadata };
};

const byRemote = async (
    token_id: NftIdentifier,
    data?: UniqueCollectionData,
): Promise<NftMetadata> => {
    const token_owners = await getTokenOwners(token_id.collection, 'remote');
    if (token_owners === undefined) {
        // ! 完全找不到这个集合的所有权数据
        throw new Error(`can not find token owners for ${token_id.collection}`);
    }
    const owners = token_owners.filter((o) => isSameNft(o.token_id, token_id));
    if (owners.length === 0) {
        // ! 这个集合下没有该 NFT
        console.warn('should not be empty', uniqueKey(token_id), token_owners);
        throw new Error(
            `can not find token ${token_id.token_identifier} in ${token_id.collection}`,
        );
    }
    if (owners.length !== 1) {
        // ! 这个集合有多个该 NFT
        console.error('should be only one', uniqueKey(token_id), token_owners);
        throw new Error(
            `find too many tokens ${token_id.token_identifier} in ${token_id.collection}`,
        );
    }
    const owner = owners[0]; // ? 取出所有者信息
    const token_metadata = await getTokenMetadata(token_id.collection, {
        from: 'remote',
        token_owners,
        data,
    });
    if (token_metadata === undefined) {
        // ! 完全找不到这个集合的元数据
        throw new Error(`can not find token metadata for ${token_id.collection}`);
    }
    const metadata = token_metadata.find((m) => isSameNft(m.token_id, token_id));
    if (metadata === undefined) {
        // ! 这个集合的元数据下没有该 NFT
        console.error(`can not find token metadata for ${uniqueKey(token_id)}`);
        throw new Error(
            `can not find token metadata ${token_id.token_identifier} in ${token_id.collection}`,
        );
    }
    // ? 返回找到的数据
    return { data, owner, metadata };
};

export const getNftMetadata = async (
    collectionDataList: UniqueCollectionData[],
    token_id: NftIdentifier,
    from: 'stored_remote' | 'remote',
): Promise<NftMetadata> => {
    const data = collectionDataList.find((d) => d.info.collection === token_id.collection);
    return new Promise((resolve) => {
        // 1. 先尝试读取本地缓存
        const spend = Spend.start(`loadNftList ${token_id.collection}`, true);
        switch (from) {
            case 'stored_remote': {
                byStoredRemote(token_id, data)
                    .then((card) => {
                        spend.mark('load stored_remote success');
                        resolve(card);
                    })
                    .catch((e) => {
                        console.error(e.message);
                        spend.mark('load stored_remote failed');
                        throw e;
                    });
                break;
            }
            case 'remote': {
                byRemote(token_id, data)
                    .then((card) => {
                        spend.mark('load remote success');
                        resolve(card);
                    })
                    .catch((e) => {
                        console.error(e.message);
                        spend.mark('load remote failed');
                        throw e;
                    });
                break;
            }
            default:
                throw new Error(`what a option from: ${from}`);
        }
    });
};

// 获取多个 NFT 的 metadata
const innerFetchNftCards = async (
    collectionDataList: UniqueCollectionData[],
    token_list: NftIdentifier[],
    from: 'stored_remote' | 'remote',
): Promise<NftMetadata[]> => {
    const spend_owners = Spend.start(`nft token owners and metadata`, true);
    return Promise.all(
        token_list.map(
            (token_id) =>
                new Promise<NftMetadata[]>((resolve) => {
                    getNftMetadata(collectionDataList, token_id, from)
                        .then((card) => resolve([card]))
                        .catch(() => resolve([]));
                }),
        ),
    ).then((got_cards) => {
        spend_owners.mark(
            `metadata success:${got_cards.map((c) => c.length).reduce((a, b) => a + b, 0)}/${
                got_cards.length
            }`,
        );
        const cards = got_cards.flatMap(unchanging);
        console.debug('all cards', from, token_list.length, '->', cards.length);
        return cards;
    });
};

// 远程获取多个NFT的metadata
export const getNftCardsByRemote = async (
    collectionDataList: UniqueCollectionData[],
    token_list: NftIdentifier[],
): Promise<NftMetadata[]> => {
    return innerFetchNftCards(collectionDataList, token_list, 'remote');
};

// 优先从本地获取多个NFT的metadata
export const getNftCardsByStoredRemote = async (
    collectionDataList: UniqueCollectionData[],
    token_list: NftIdentifier[],
): Promise<NftMetadata[]> => {
    return innerFetchNftCards(collectionDataList, token_list, 'stored_remote');
};

// ! 支持渐进式加载
// 加载指定用户所拥有的 NFT, 使用 缓存 全部远程
export const loadNftCardsByStoredRemote = async (
    collectionDataList: UniqueCollectionData[],
    token_id_list: NftIdentifier[],
    setList?: (list: NftMetadata[]) => void,
): Promise<NftMetadata[]> => {
    // console.error('nfts', nfts);

    const all_cards: NftMetadata[] = [];
    const push_card = (cards: NftMetadata[]) => {
        all_cards.push(...cards);
        if (all_cards.length) setList && setList(all_cards);
    };
    const spend_owners = Spend.start(`profile token owners and metadata`, true);
    return Promise.all(
        token_id_list.map(
            (token_id) =>
                new Promise<NftMetadata[]>((resolve) => {
                    getNftMetadata(collectionDataList, token_id, 'stored_remote')
                        .then((card) => {
                            push_card([card]);
                            resolve([card]);
                        })
                        .catch(() => resolve([]));
                }),
        ),
    ).then((got_cards) => {
        spend_owners.mark(
            `metadata success:${got_cards.map((c) => c.length).reduce((a, b) => a + b, 0)}/${
                got_cards.length
            }`,
        );
        const cards = got_cards.flatMap(unchanging);
        console.debug('all cards', 'stored_remote', token_id_list.length, '->', cards.length);
        setList && setList(cards);
        return cards;
    });
};
