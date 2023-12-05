import { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { NftIdentifier, NftMetadata } from '@/01_types/nft';
import { CoreCollectionData } from '@/01_types/yumi';
import { isSameNft, uniqueKey } from '@/02_common/nft/identifier';
import { OatCollectionEvent } from '@/03_canisters/yumi/yumi_oat';
import { CollectionStatistics, ExploreArtCard } from '@/04_apis/yumi/aws';
import { queryExploreArtList } from '@/05_utils/apis/yumi/aws';
import { queryAllArtistNftTokenIdList } from '@/05_utils/canisters/yumi/artist_router';
import {
    queryAllOatCollectionEventList,
    queryClaimableByUser,
} from '@/05_utils/canisters/yumi/oat';
import { queryNftListingDataByList } from '@/05_utils/nft/listing';
import { getNftMetadata, loadNftCardsByStoredRemote } from '@/05_utils/nft/metadata';
import { fetchMemoryNftListing, putMemoryNftListing } from '@/05_utils/stores/listing.stored';
import { useCollectionStore } from '@/07_stores/collection';
import { useIdentityStore } from '@/07_stores/identity';
import { useCollectionDataList, useCoreCollectionDataList } from '../nft/collection';

// ===================== 收藏列表 =====================

export type CollectibleCollection = {
    data: CoreCollectionData;
    statistic?: CollectionStatistics;
};

export const useExploreCollectiblesDataList = (): {
    list: CollectibleCollection[] | undefined;
    reload: () => void;
} => {
    const reloadCoreCollectionDataList = useCollectionStore((s) => s.reloadCoreCollectionDataList);
    const coreCollectionDataList = useCoreCollectionDataList();

    const [collectionList, setCollectionList] = useState<CollectibleCollection[] | undefined>(
        undefined,
    );

    useEffect(() => {
        if (coreCollectionDataList === undefined) {
            setCollectionList(undefined);
            return;
        }
        const list: CollectibleCollection[] = coreCollectionDataList
            // .filter((data) => data.info.isVisible) // ? 后端说不用过滤了
            .map((data) => ({
                data,
                statistic:
                    collectionList === undefined
                        ? undefined
                        : collectionList.find(
                              (c) => c.data.info.collection === data.info.collection,
                          )?.statistic, // 尽量继承原来的数据
            }));
        setCollectionList([...list]);
        // 8 秒后去获取地板价数据
        // setTimeout(() => {
        //     Promise.all(
        //         list.map(
        //             (item) =>
        //                 new Promise<CollectionStatistics | undefined>((resolve) => {
        //                     getCollectionStatistics(item.data.info.collection)
        //                         .then(resolve)
        //                         .catch(() => resolve(undefined)); // ! TODO 这列表里面有 OGY 的罐子,是查不到统计数据的
        //                 }),
        //         ),
        //     ).then((statistic_list) => {
        //         list.forEach((item, index) => {
        //             const statistic = statistic_list[index];
        //             if (!statistic || isSame(item.statistic, statistic)) return;
        //             item.statistic = statistic;
        //         });
        //         setCollectionList([...list]);
        //     });
        // }, 8000);
    }, [coreCollectionDataList]);

    const reload = useCallback(() => {
        setCollectionList(undefined);
        reloadCoreCollectionDataList();
    }, []);

    return {
        list: collectionList,
        reload,
    };
};

export const useExploreCollectiblesLength = (): number | undefined => {
    const coreCollectionDataList = useCoreCollectionDataList();

    const [length, setLength] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (coreCollectionDataList === undefined) {
            setLength(undefined);
            return;
        }
        setLength(coreCollectionDataList.length);
    }, [coreCollectionDataList]);

    return length;
};

// ===================== OAT =====================

const sortExploreOatList = (list: OatCollectionEvent[]): OatCollectionEvent[] => {
    return _.sortBy(list, [(item) => -BigInt(item.oat_release_end)]);
};

export const useExploreOatDataList = (): {
    list: OatCollectionEvent[] | undefined;
    claimable: string[];
} => {
    const identity = useIdentityStore((s) => s.connectedIdentity);

    const [list, setList] = useState<OatCollectionEvent[] | undefined>(undefined);
    useEffect(() => {
        queryAllOatCollectionEventList().then((list) => setList(sortExploreOatList(list)));
    }, []);

    const [claimable, setClaimable] = useState<string[]>([]);
    useEffect(() => {
        if (!identity || !list) return setClaimable([]);
        const old = [...claimable];
        setClaimable(old);
        const cached: string[] = [];
        Promise.all(
            list.map((item) => {
                queryClaimableByUser(identity, item.id).then((r) => {
                    if (r) {
                        old.push(item.id);
                        cached.push(item.id);
                        setClaimable([...old]);
                    }
                });
            }),
        ).then(() => setClaimable(cached));
    }, [identity, list]);
    return {
        list,
        claimable,
    };
};

// ===================== ART =====================

export type ArtStandoutCard = {
    art: ExploreArtCard;
    card?: NftMetadata;
};
export const useExploreArtTab = (flag: number): ArtStandoutCard[] | undefined => {
    const collectionDataList = useCollectionDataList();
    const [standout, setStandout] = useState<ArtStandoutCard[] | undefined>(undefined);
    useEffect(() => {
        queryExploreArtList().then((list) => {
            const stand_out: ArtStandoutCard[] = list.map((art) => ({ art }));

            const needs = stand_out.filter((o) => !fetchMemoryNftListing(o.art.token_id));
            Promise.all([
                queryNftListingDataByList(
                    needs.map((item) => ({
                        standard: 'ext',
                        token_id: item.art.token_id,
                    })),
                ),
                ...stand_out.map((item) =>
                    getNftMetadata(collectionDataList, item.art.token_id, 'stored_remote'),
                ),
            ]).then((d) => {
                const [listings] = d;
                const findCard = (token_id: NftIdentifier): NftMetadata | undefined => {
                    for (let i = 1; i < d.length; i++) {
                        if (isSameNft(token_id, d[i].owner.token_id)) return d[i] as NftMetadata;
                    }
                    return undefined;
                };
                stand_out.forEach((item) => {
                    const card = findCard(item.art.token_id);
                    item.card = card;
                    if (card) {
                        const listing =
                            listings[uniqueKey(item.art.token_id)] ??
                            fetchMemoryNftListing(card.owner.token_id);
                        if (listing) putMemoryNftListing(item.art.token_id, listing);
                        card.listing = listing;
                    }
                });
                setStandout(stand_out);
            });
        });
    }, [flag]);

    return standout;
};

export const useExportArtCards = (): NftMetadata[] | undefined => {
    const collectionDataList = useCollectionDataList();
    // 所有的 token id
    const [tokenIdList, setTokenIdList] = useState<NftIdentifier[] | undefined>(undefined);
    useEffect(() => {
        queryAllArtistNftTokenIdList().then(setTokenIdList);
    }, []);

    const [cards, setCards] = useState<NftMetadata[] | undefined>(undefined);

    useEffect(() => {
        if (tokenIdList === undefined) return;
        // 0. 先每一种 collection 挑一个出来预加载
        const preload = _.uniqBy(tokenIdList, (item) => item.collection);
        loadNftCardsByStoredRemote(collectionDataList, preload)
            .catch((e) => {
                console.error('art preload failed', e);
            })
            .finally(() => {
                const needs = tokenIdList!.filter((token_id) => !fetchMemoryNftListing(token_id));

                Promise.all([
                    loadNftCardsByStoredRemote(collectionDataList, tokenIdList),
                    queryNftListingDataByList(
                        needs.map((token_id) => ({
                            standard: 'ext',
                            token_id,
                        })),
                    ),
                ]).then((d) => {
                    const [cards, listings] = d;
                    for (const card of cards) {
                        const listing =
                            listings[uniqueKey(card.owner.token_id)] ??
                            fetchMemoryNftListing(card.owner.token_id);
                        if (listing) putMemoryNftListing(card.owner.token_id, listing);
                        card.listing = listing;
                    }
                    setCards(cards);
                });
            });
    }, [tokenIdList]);

    return cards;
};
