import _ from 'lodash';
import { NftMetadata } from '@/01_types/nft';

// 根据价格排序
export const sortCardsByPrice = (
    cards: NftMetadata[],
    sort: 'price_low_to_high' | 'price_high_to_low',
    icp_usd: string | undefined,
    ogy_usd: string | undefined,
): NftMetadata[] => {
    return _.sortBy(cards, [
        (card) => {
            if (card.listing?.listing.type !== 'listing') return undefined;
            const price = card.listing.listing.price;
            const symbol = card.listing.listing.token.symbol;
            const usd =
                symbol === 'ICP' && icp_usd !== undefined
                    ? Number(price) * Number(icp_usd)
                    : symbol === 'OGY' && ogy_usd !== undefined
                    ? Number(price) * Number(ogy_usd)
                    : undefined;
            if (usd === undefined) return undefined;
            if (sort === 'price_low_to_high') return usd;
            return -usd;
        },
    ]);
};
