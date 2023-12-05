import { useCallback, useEffect, useState } from 'react';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata, NftTokenOwner } from '@/01_types/nft';
import { isSame } from '@/02_common/data/same';
import { isSameNftByTokenId, uniqueKey } from '@/02_common/nft/identifier';
import { FirstRenderByData } from '@/02_common/react/render';
import { isGoldListing } from '@/05_utils/apis/yumi/gold-api';
import { queryNftListingData } from '@/05_utils/nft/listing';
import { putMemoryNftListing, removeMemoryNftListing } from '@/05_utils/stores/listing.stored';
import { useIdentityStore } from '@/07_stores/identity';

// NFT 上架信息
export const useNftListing = (
    card: NftMetadata | undefined,
    updateItem?: (card: NftMetadata) => void,
): {
    loading: boolean; // 标识加载中
    listing: NftListingData | undefined; // 获得的数据
    reload: () => void; // 重新加载 会控制 loading
    refresh: () => void; // 静默刷新
} => {
    const [loading, setLoading] = useState<boolean>(false);
    const [listing, setListing] = useState<NftListingData | undefined>(card?.listing);
    useEffect(() => {
        if (card === undefined) return setListing(undefined);
        if (card.listing !== undefined && !isSame(listing, card.listing)) setListing(card.listing);
    }, [card, listing]);

    const setListingAndUpdate = (listing: NftListingData, old: NftListingData | undefined) => {
        if (card === undefined) return;
        // 缓存一份
        if (listing) putMemoryNftListing(card.owner.token_id, listing);
        else removeMemoryNftListing(card.owner.token_id);

        if (isSame(card.listing, listing) && isSame(old, listing)) return;

        setListing(listing);
        card.listing = listing;
        updateItem && updateItem(card);
    };

    // 如果有操作变动，需要回显
    const reload = useCallback(async () => {
        if (
            card === undefined ||
            isGoldListing(card.listing?.raw) // 黄金自动上架的不应该刷新
        ) {
            return;
        }
        // 1. 加载拍卖信息
        setListing(undefined);
        setLoading(true);
        queryNftListingData(card.metadata.raw.standard, card.metadata.token_id)
            .then((data) => setListingAndUpdate(data, listing))
            .catch((e) => console.error(`reload nft listing failed`, e))
            .finally(() => setLoading(false));
    }, [card]);

    const refresh = useCallback(() => {
        if (
            card === undefined ||
            isGoldListing(card.listing?.raw) // 黄金自动上架的不应该刷新
        ) {
            return;
        }
        queryNftListingData(card.metadata.raw.standard, card.metadata.token_id).then((data) =>
            setListingAndUpdate(data, listing),
        );
    }, [card]);

    // 第一次进行加载
    const [once_load_listing] = useState(new FirstRenderByData());
    useEffect(() => {
        if (card?.listing) return;
        once_load_listing.once(card && [uniqueKey(card.owner.token_id)], reload);
    }, [card]);

    // 定时获取数据并比较更新
    // useInterval(refresh, 15000); // 禁止主动更新

    // 如果批量上架变更了, 要同步进行一些操作
    const batchSales = useIdentityStore((s) => s.batchSales);
    const [once_load_listing_by_batch_sales] = useState(new FirstRenderByData());
    useEffect(() => {
        once_load_listing_by_batch_sales.once(
            // 当前 NFT 加入和移除 NFT 都要进行刷新
            // 因为批量上架后, listing 应该更改
            card && [!!batchSales.find((l) => isSameNftByTokenId(l, card.metadata))],
            refresh,
        );
    }, [batchSales]);

    return {
        loading,
        listing: listing ?? card?.listing,
        reload,
        refresh,
    };
};

// 刷新上架信息
export const refreshNftListing = (owner: NftTokenOwner | undefined) => {
    if (!owner) return;
    queryNftListingData(owner.raw.standard, owner.token_id).then((listing) => {
        if (listing) putMemoryNftListing(owner.token_id, listing);
        else removeMemoryNftListing(owner.token_id);
    });
};
