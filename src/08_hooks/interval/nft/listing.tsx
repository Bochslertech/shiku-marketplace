import { useCallback, useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { isSame } from '@/02_common/data/same';
import { uniqueKey } from '@/02_common/nft/identifier';
import { FirstRenderByData } from '@/02_common/react/render';
import { isGoldListing } from '@/05_utils/apis/yumi/gold-api';
import { queryNftListingData, queryNftListingDataByList } from '@/05_utils/nft/listing';
import { putMemoryNftListing, removeMemoryNftListing } from '@/05_utils/stores/listing.stored';

export const useNftListing = (
    card: NftMetadata | undefined,
    delay = 15000,
): {
    listing: NftListingData | undefined;
    refresh: () => void;
} => {
    const [listing, setListing] = useState<NftListingData | undefined>(card?.listing);

    // 加载上架信息
    const refresh = useCallback(() => {
        if (
            card === undefined ||
            isGoldListing(card.listing?.raw) // 黄金自动上架的不应该刷新
        ) {
            return;
        }
        queryNftListingData(card.owner.raw.standard, card.owner.token_id).then((listing) => {
            // 缓存一份
            if (listing) putMemoryNftListing(card.owner.token_id, listing);
            else removeMemoryNftListing(card.owner.token_id);

            card.listing = listing;
            setListing(listing);
        });
    }, [card]);

    // 先执行一次
    const [once_check_listings] = useState(new FirstRenderByData());
    useEffect(() => {
        once_check_listings.once(card && [card.owner.token_id], refresh);
    }, [card]);

    // 定时刷新
    useInterval(refresh, delay); // 定时刷新价格

    return {
        listing,
        refresh,
    };
};

// 刷新价格
export const useReloadAllListingData = (
    showed: boolean,
    doResort: () => void,
    listing: NftMetadata[] | undefined,
    loadings: boolean[],
) => {
    const reloadAllListingData = useCallback(
        (listing: NftMetadata[] | undefined) => {
            if (!showed) return; // ? 不显示不更新
            if (listing === undefined) return;
            const block_list = [...listing];
            queryNftListingDataByList(
                block_list.map((card) => ({
                    standard: card.owner.raw.standard,
                    token_id: card.owner.token_id,
                })),
            ).then((r) => {
                let changed: NftMetadata | undefined = undefined;
                for (const card of block_list) {
                    const key = uniqueKey(card.owner.token_id);
                    const listing = r[key];
                    if (listing) putMemoryNftListing(card.owner.token_id, listing); // 缓存一份
                    if (!listing || isSame(card.listing, listing)) continue;
                    changed = card;
                    card.listing = listing;
                }
                if (changed) doResort();
            });
        },
        [showed, doResort],
    );
    const [once_load_all_listing] = useState(new FirstRenderByData());
    useEffect(() => {
        if (!showed) return; // ? 不显示不更新
        once_load_all_listing.once(loadings, () => reloadAllListingData(listing));
    }, loadings);

    // 定时刷新
    useInterval(() => reloadAllListingData(listing), 15000);
};
