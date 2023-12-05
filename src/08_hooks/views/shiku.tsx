import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { parse_token_index } from '@/02_common/nft/ext';
import { isSameNftByTokenId, uniqueKey } from '@/02_common/nft/identifier';
import { FirstRenderByData } from '@/02_common/react/render';
import { AuctionOffer, ShikuNftDutchAuctionDealPrice } from '@/03_canisters/yumi/yumi_core';
import {
    queryShikuLandsDealPrice,
    queryShikuLandsHighestOffer,
} from '@/05_utils/canisters/yumi/core';
import { getYumiShikuLandsCollection } from '@/05_utils/canisters/yumi/special';
import { getTokenMetadata, getTokenOwners } from '@/05_utils/combined/collection';
import { queryNftListingDataByList } from '@/05_utils/nft/listing';
import { useNftListing } from '../nft/listing';

export const useShikuLandsCards = (): NftMetadata[] | undefined => {
    const [cards, setCards] = useState<NftMetadata[] | undefined>(undefined);

    const [once_check_cards] = useState(new FirstRenderByData());
    useEffect(
        () =>
            once_check_cards.once(
                [(cards ?? []).map((c) => uniqueKey(c.owner.token_id)).join('|')],
                () => {
                    const collection = getYumiShikuLandsCollection();
                    getTokenOwners(collection, 'stored_remote').then((token_owners) => {
                        if (token_owners) {
                            getTokenMetadata(collection, {
                                from: 'stored_remote',
                                token_owners,
                            }).then((token_metadata) => {
                                if (token_metadata) {
                                    const cards: NftMetadata[] = [];
                                    for (const owner of token_owners) {
                                        const m = token_metadata.find((m) =>
                                            isSameNftByTokenId(m, owner),
                                        );
                                        if (m === undefined) throw new Error('metadata not found');
                                        const card: NftMetadata = {
                                            owner,
                                            metadata: m,
                                        };
                                        cards.push(card);
                                    }
                                    // 第一次也要把价格加上
                                    queryNftListingDataByList(
                                        cards.map((card) => ({
                                            standard: card.owner.raw.standard,
                                            token_id: card.owner.token_id,
                                        })),
                                    )
                                        .then((listings) => {
                                            for (const card of cards)
                                                card.listing =
                                                    listings[uniqueKey(card.owner.token_id)];
                                        })
                                        .finally(() => setCards(cards));
                                }
                            });
                        }
                    });
                },
            ),
        [cards],
    );

    return cards;
};

export const useShikuLandsInfo = (): {
    position: string;
    setPosition: (p: string) => void;
    cards: NftMetadata[] | undefined;
    card: NftMetadata | undefined;
    listing: NftListingData | undefined;
    refresh: () => void;
} => {
    const navigate = useNavigate();
    const [position, setPosition] = useState<string>('');

    const { token_index } = useParams();

    const cards = useShikuLandsCards();

    const [once_check_token_index] = useState(new FirstRenderByData());
    useEffect(
        () =>
            once_check_token_index.once([token_index, (cards ?? []).length], () => {
                if (cards === undefined) return;
                if (token_index === undefined) return setPosition('6-6');
                if (
                    /\d+-\d+/.test(token_index) &&
                    !cards.find(
                        (c) =>
                            `${parse_token_index(c.owner.token_id.token_identifier)}` ===
                            token_index,
                    )
                ) {
                    setPosition(token_index); // 也支持坐标形式
                    return;
                }
                try {
                    const index = parseInt(token_index);
                    const card = cards.find((card) => {
                        const i = parse_token_index(card.owner.token_id.token_identifier);
                        return i === index;
                    });
                    if (card === undefined) return setPosition('6-6');
                    const raw = JSON.parse(card.metadata.raw.data);
                    setPosition(`${raw[1].pos.x}-${raw[1].pos.y}`); // 设置当前路径指定的地块
                } catch (e) {
                    console.debug(`🚀 ~ file: index.tsx:51 ~ once_check_token_index.once ~ e:`, e);
                    setPosition('6-6');
                }
            }),
        [token_index, cards],
    );

    const [card, setCard] = useState<NftMetadata | undefined>(undefined);
    useEffect(() => {
        if (!cards || !position) return setCard(undefined);
        const [x, y] = position.split('-');
        const card = cards.find((card) => {
            const raw = JSON.parse(card.metadata.raw.data);
            return x === raw[1].pos.x && y === raw[1].pos.y;
        });
        setCard(card);
        if (card !== undefined) {
            // 页面路径也更换
            navigate(`/shiku/${parse_token_index(card.owner.token_id.token_identifier)}`, {
                replace: true,
            });
        } else {
            navigate(`/shiku/${position}`, { replace: true });
        }
    }, [cards, position]);

    const { listing, refresh } = useNftListing(card);

    return {
        position,
        setPosition,
        cards,
        card,
        listing,
        refresh,
    };
};

export const useShikuLandsNftHighestOffer = (
    card: NftMetadata | undefined,
): {
    offer: AuctionOffer | undefined;
    refresh: () => void;
} => {
    const [offer, setOffer] = useState<AuctionOffer | undefined>(undefined);

    const refresh = useCallback(() => {
        if (card === undefined) return setOffer(undefined);
        // setOffer(undefined);
        queryShikuLandsHighestOffer(card.owner.token_id.token_identifier).then(setOffer);
    }, [card]);

    useEffect(refresh, [card]);

    return { offer, refresh };
};

export const useShikuLandsNftDealPrice = (
    card: NftMetadata | undefined,
): {
    price: ShikuNftDutchAuctionDealPrice | undefined;
    refresh: () => void;
} => {
    const [price, setPrice] = useState<ShikuNftDutchAuctionDealPrice | undefined>(undefined);

    const refresh = useCallback(() => {
        if (card === undefined) return setPrice(undefined);
        // setPrice(undefined);
        queryShikuLandsDealPrice(card.owner.token_id.token_identifier).then(setPrice);
    }, [card]);

    useEffect(refresh, [card]);

    return { price, refresh };
};

export type ShikuNftState =
    | 'Coming soon'
    | 'Not started'
    | 'Auctioning'
    | 'Auction ended'
    | 'Sold out'
    | undefined;

export const useShikuLandsNftState = (
    listing: NftListingData | undefined,
    deal: ShikuNftDutchAuctionDealPrice | undefined,
): ShikuNftState => {
    const state: ShikuNftState = useMemo(() => {
        if (listing === undefined) return 'Coming soon';
        if (deal !== undefined) return 'Sold out';
        if (listing.listing.type !== 'dutch') return 'Coming soon';
        const dutch = listing.listing;
        const { start, end } = dutch.auction.time;
        const now = Date.now() * 1e6;
        if (now < Number(start)) return 'Not started';
        if (now < Number(end)) return 'Auctioning';
        if (listing.latest_price === undefined) return 'Auction ended';
        return undefined;
    }, [listing, deal]);

    return state;
};
