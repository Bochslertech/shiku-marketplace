import { useEffect, useState } from 'react';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { useIdentityStore } from '@/07_stores/identity';

export const useShowTransferButton = (
    card: NftMetadata | undefined,
    listing: NftListingData | undefined,
): boolean => {
    const [show, setShow] = useState(false);

    // self
    const identity = useIdentityStore((s) => s.connectedIdentity);
    const self = !!identity && !!card && card.owner.owner === identity.account;

    useEffect(() => {
        setShow(() => {
            if (card === undefined) return false; // 没有数据不加入
            if (card.owner.raw.standard === 'shiku_land') return false; // shiku 不允许
            if (card.owner.raw.standard === 'ogy') return false; // ogy 不允许
            if (identity === undefined) return false; // 没有登录不能卖出
            if (!self) return false; // 非自己的不能转移
            if (listing === undefined) return false; // 没有获取到上架信息
            return listing.listing.type === 'holding'; // 只有当前状态处于持有中,才能转移
        });
    }, [card, identity, self, listing]);

    return show;
};
