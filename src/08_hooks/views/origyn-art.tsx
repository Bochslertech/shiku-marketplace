import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata, NftTokenMetadata, NftTokenOwner } from '@/01_types/nft';
import { isCanisterIdText } from '@/02_common/ic/principals';
import { isSameNftByTokenId, uniqueKey } from '@/02_common/nft/identifier';
import { FirstRender, FirstRenderByData } from '@/02_common/react/render';
import { Spend } from '@/02_common/react/spend';
import { OrigynArtCollectionData } from '@/03_canisters/yumi/yumi_origyn_art';
import { canisterQueryOrigynArtCardsByStored } from '@/04_apis/canister-query/origyn/art';
import {
    queryAllTokenOwnersByIdList,
    queryCollectionInfoByOgy,
} from '@/05_utils/canisters/nft/ogy';
import { getYumiOrigynArtCanisterId } from '@/05_utils/canisters/yumi/special';
import { getTokenMetadata, getTokenOwners } from '@/05_utils/combined/collection';
import { combinedQueryOrigynArtCollectionDataList } from '@/05_utils/combined/yumi/origyn-art';
import { queryNftListingData, queryNftListingDataByList } from '@/05_utils/nft/listing';
import { getNftMetadata } from '@/05_utils/nft/metadata';
import { fetchMemoryNftListing, putMemoryNftListing } from '@/05_utils/stores/listing.stored';

export const useOrigynArtCollectionData = (
    collection: string | undefined,
): OrigynArtCollectionData | undefined => {
    const navigate = useNavigate();

    const backend_canister_id = getYumiOrigynArtCanisterId();

    // 检查 collection 对不对
    const [once_check_collection] = useState(new FirstRender());
    useEffect(
        once_check_collection.once(() => {
            if (!isCanisterIdText(collection)) return navigate('/origyn/market', { replace: true });
        }),
        [],
    );

    // 集合信息
    const [collectionData, setCollectionData] = useState<OrigynArtCollectionData | undefined>(
        undefined,
    );
    useEffect(() => {
        combinedQueryOrigynArtCollectionDataList(backend_canister_id).then((data_list) => {
            const data = data_list.find((item) => item.collection === collection);
            if (data === undefined) {
                message.error(`wrong collection: ${collection}`);
                return navigate('/origyn/market', { replace: true });
            }
            setCollectionData(data);
        });
    }, [collection]);

    return collectionData;
};

export const useOrigynArtCollectionCards = (
    collection: string | undefined,
): NftMetadata[] | undefined => {
    const [cards, setCards] = useState<NftMetadata[] | undefined>(undefined);

    const [owners, setOwners] = useState<NftTokenOwner[] | undefined>(undefined);
    useEffect(() => {
        if (collection === undefined) return;
        getTokenOwners(collection, 'stored_remote').then(setOwners);
    }, [collection]);
    const [once_check_owners_spend] = useState(new FirstRenderByData());
    const [spend_owners] = useState(Spend.start(`origyn art collection owners !!!!!!!!!!!!!!!`));
    useEffect(() => {
        once_check_owners_spend.once([!!owners], () => {
            spend_owners.mark(`owners is ${owners ? 'exist' : 'not exist'}`);
        });
    }, [owners]);

    const [once_load_cards] = useState(new FirstRenderByData());
    useEffect(() => {
        once_load_cards.once(owners && [owners.map((o) => uniqueKey(o.token_id)).join('|')], () => {
            const needs = owners!.filter((o) => !fetchMemoryNftListing(o.token_id));
            const spend_metadata_listings = Spend.start(
                `origyn art collection metadata and listings:${needs.length} @@@@@@@@@@@@@@@`,
            );
            // 并发请求元数据和价格
            Promise.all([
                getTokenMetadata(collection!, {
                    from: 'stored_remote',
                    token_owners: owners!,
                }),
                queryNftListingDataByList(
                    needs.map((owner) => ({
                        standard: owner.raw.standard,
                        token_id: owner.token_id,
                    })),
                ),
            ])
                .then((d) => {
                    spend_metadata_listings.mark('over');
                    const [metadata, listings] = d;
                    if (metadata) {
                        const cards: NftMetadata[] = [];

                        for (const owner of owners!) {
                            const listing = listings[uniqueKey(owner.token_id)];
                            if (listing) putMemoryNftListing(owner.token_id, listing);

                            const m = metadata!.find((m) => isSameNftByTokenId(m, owner));
                            if (m === undefined) throw new Error('metadata not found');
                            const card: NftMetadata = {
                                owner,
                                metadata: m,
                                listing: listing ?? fetchMemoryNftListing(owner.token_id),
                            };
                            cards.push(card);
                        }
                        setCards(cards);
                    } else throw new Error('find metadata failed');
                })
                .catch((e) => {
                    console.error('fetch metadata and listings failed', e);
                    message.error(`${e.message}`);
                });
        });
    }, [owners]);

    return cards;
};

const loadCards = (
    collection: string,
    setCards: (cards: NftMetadata[]) => void,
    navigate: () => void,
) => {
    const spend_metadata_listings = Spend.start(`origyn art collection cards @@@@@@@@@@@@@@@`);
    queryCollectionInfoByOgy(collection)
        .then((info) => {
            spend_metadata_listings.mark('info');
            const id_list = info.token_ids;
            if (id_list === undefined) throw new Error('');
            const token_id_list = id_list.map((token_identifier) => ({
                collection,
                token_identifier,
            }));
            const needs = token_id_list.filter((token_id) => !fetchMemoryNftListing(token_id));
            spend_metadata_listings.mark(`needs: ${needs.length}`);
            // 并发请求元数据和价格
            Promise.all([
                new Promise<{
                    owners: NftTokenOwner[];
                    metadata: NftTokenMetadata[] | undefined;
                }>((resolve, reject) => {
                    queryAllTokenOwnersByIdList(collection, id_list)
                        .then((owners) => {
                            getTokenMetadata(collection!, {
                                from: 'stored_remote',
                                token_owners: owners!,
                            })
                                .then((metadata) => resolve({ owners, metadata }))
                                .catch(reject);
                        })
                        .catch(reject);
                }),
                queryNftListingDataByList(needs.map((token_id) => ({ standard: 'ogy', token_id }))),
            ])
                .then((d) => {
                    spend_metadata_listings.mark('over');
                    const [{ owners, metadata }, listings] = d;
                    if (metadata) {
                        const cards: NftMetadata[] = [];

                        for (const owner of owners!) {
                            const listing = listings[uniqueKey(owner.token_id)];
                            if (listing) putMemoryNftListing(owner.token_id, listing);

                            const m = metadata!.find((m) => isSameNftByTokenId(m, owner));
                            if (m === undefined) throw new Error('metadata not found');
                            const card: NftMetadata = {
                                owner,
                                metadata: m,
                                listing: listing ?? fetchMemoryNftListing(owner.token_id),
                            };
                            cards.push(card);
                        }
                        setCards(cards);
                    } else throw new Error('find metadata failed');
                })
                .catch((e) => {
                    console.error('fetch metadata and listings failed', e);
                    message.error(`${e.message}`);
                });
        })
        .catch((e) => {
            console.debug(`🚀 ~ file: collection.tsx:134 ~ queryCollectionInfoByOgy ~ e:`, e);
            message.error({
                content: 'wrong canister id',
                duration: 2000,
                onClose: navigate,
            });
        });
};

export const useOrigynArtCollectionCards2 = (
    collection: string | undefined,
): NftMetadata[] | undefined => {
    const navigate = useNavigate();

    const [cards, setCards] = useState<NftMetadata[] | undefined>(undefined);

    const [once_load_cards] = useState(new FirstRenderByData());
    useEffect(() => {
        if (collection === undefined) return;
        once_load_cards.once([collection], () => {
            loadCards(collection, setCards, () => navigate('/', { replace: true }));
        });
    }, [collection]);

    return cards;
};

export const useOrigynArtCollectionCards3 = (
    collection: string | undefined,
): NftMetadata[] | undefined => {
    const navigate = useNavigate();

    const [cards, setCards] = useState<NftMetadata[] | undefined>(undefined);

    const [once_load_cards] = useState(new FirstRenderByData());
    useEffect(() => {
        if (collection === undefined) return;
        once_load_cards.once([collection], () => {
            const spend_metadata_listings = Spend.start(
                `origyn art collection cards @@@@@@@@@@@@@@@`,
            );
            canisterQueryOrigynArtCardsByStored(collection).then((cards) => {
                spend_metadata_listings.mark(`over with ${cards ? 'success' : 'empty'}`);
                if (cards) {
                    setCards(cards);
                } else {
                    loadCards(collection, setCards, () => navigate('/', { replace: true }));
                }
            });
        });
    }, [collection]);

    return cards;
};

export const useOrigynArtCollectionNftListingData = (
    collection: string | undefined,
    token_identifier: string | undefined,
    flag?: number,
): { card: NftMetadata | undefined; listing: NftListingData | undefined } => {
    const navigate = useNavigate();

    // 检查 token_identifier 对不对
    const [once_check_token_identifier] = useState(new FirstRender());
    useEffect(
        once_check_token_identifier.once(() => {
            if (!token_identifier)
                return navigate(collection ? `/origyn/art/${collection}` : '/origyn/market', {
                    replace: true,
                });
        }),
        [],
    );

    const { state }: { state?: { card?: NftMetadata } } = useLocation();

    // 元数据信息
    const [card, setCard] = useState<NftMetadata | undefined>(state?.card);
    useEffect(() => {
        if (collection === undefined || token_identifier === undefined) return setCard(undefined);
        getNftMetadata([], { collection, token_identifier }, 'stored_remote').then(setCard);
    }, [collection, token_identifier, flag]);

    // 挂单信息
    const [listing, setListing] = useState<NftListingData | undefined>(card?.listing);
    useEffect(() => {
        if (collection === undefined || token_identifier === undefined)
            return setListing(undefined);
        queryNftListingData('ogy', { collection, token_identifier }).then(setListing);
    }, [collection, token_identifier, flag]);

    return { card, listing };
};
