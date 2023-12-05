import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { message } from 'antd';
import { useInterval } from 'usehooks-ts';
import { NftIdentifier, NftMetadata } from '@/01_types/nft';
import { GoldNftInfo } from '@/04_apis/yumi/gold-api';
import { queryTokenExchangePriceList } from '@/05_utils/apis/yumi/api';
import { isGoldListing, queryGoldNft } from '@/05_utils/apis/yumi/gold-api';
import { useAppStore } from '@/07_stores/app';
import { useNftListing } from '../interval/nft/listing';

// 当前是否在gold marketplace
export const useIsGoldByPath = (): boolean => {
    const { pathname } = useLocation();
    return ['/gold/market', '/gold'].includes(pathname);
};

// 黄金回购价格信息
export const useGoldBuyBack = (
    card: NftMetadata,
): {
    price: string | undefined;
    gold: NftMetadata | undefined;
} => {
    const [gold, setGold] = useState<NftMetadata | undefined>(undefined);
    useEffect(() => {
        queryGoldNft(card.owner.token_id)
            .then(setGold)
            .catch((e) => {
                console.error(`queryGoldNft failed`, e);
                message.error(`${e}`);
            });
    }, [card]);

    const icp_usd = useAppStore((s) => s.icp_usd);

    const [xau_usd, setXau] = useState<number | undefined>(undefined);
    useEffect(() => {
        queryTokenExchangePriceList().then((d) => {
            for (const dd of d) {
                if (dd.symbol === 'XAU') {
                    setXau(Number(dd.price));
                }
            }
        });
    }, [card]);

    const [price, setPrice] = useState<string | undefined>(undefined);
    useEffect(() => {
        if (!gold || !xau_usd || !icp_usd) return setPrice(undefined);
        const weight = (JSON.parse(gold.metadata.raw.data) as GoldNftInfo).weight;
        const price = (weight * xau_usd * 0.97) / Number(icp_usd);
        setPrice(`${Number((price * 1e2).toFixed(0)) * 1e6}`);
    }, [gold, xau_usd, icp_usd]);

    return { price, gold };
};

// 黄金 NFT 元数据
export const useGoldNftCard = (
    token_id: NftIdentifier | undefined,
    delay?: number,
): {
    card: NftMetadata | undefined;
    refresh: () => void;
} => {
    const collection = token_id?.collection;
    const token_identifier = token_id?.token_identifier;

    const [card, setCard] = useState<NftMetadata | undefined>(undefined);

    // 加载信息
    const refresh = useCallback(() => {
        if (collection === undefined || token_identifier === undefined) return setCard(undefined);

        const token_id: NftIdentifier = { collection, token_identifier };
        queryGoldNft(token_id)
            .then(setCard)
            .catch((e) => {
                console.error(`gold nft queryGoldNft`, e);
            });
    }, [collection, token_identifier]);

    useEffect(refresh, [collection, token_identifier]);

    // 定时刷新
    if (delay !== undefined) useInterval(refresh, delay);

    return {
        card,
        refresh,
    };
};

// 使用集合元素的所有信息
export const useGoldCollectionNftMetadata = (
    collection: string | undefined,
    token_identifier: string | undefined,
): {
    card: NftMetadata | undefined;
    refreshCard: () => void;
    refreshListing: () => void;
} => {
    const [card, setCard] = useState<NftMetadata | undefined>(undefined);

    // NFT 的元数据信息
    const { card: nakedCard, refresh: refreshCard } = useGoldNftCard(
        collection && token_identifier ? { collection, token_identifier } : undefined,
        15000,
    );
    useEffect(() => {
        setCard((c) => (c === undefined ? nakedCard : { ...c, ...nakedCard }));
    }, [nakedCard]);

    // NFT 的上架信息
    const { listing, refresh: refreshListing } = useNftListing(nakedCard, 30000);

    useEffect(() => {
        if (nakedCard === undefined) return;
        if (isGoldListing(nakedCard.listing?.raw)) return;
        if (listing !== undefined) setCard({ ...nakedCard, listing });
    }, [nakedCard, listing]);

    return { card, refreshCard, refreshListing };
};
