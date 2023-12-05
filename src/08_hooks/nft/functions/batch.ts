import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { useIdentityStore } from '@/07_stores/identity';

export const useShowBatchListingButton = (
    card: NftMetadata | undefined,
    listing: NftListingData | undefined,
): boolean => {
    const { pathname } = useLocation();
    const isProfile = pathname.startsWith('/profile');

    const [show, setShow] = useState(false);

    // self
    const identity = useIdentityStore((s) => s.connectedIdentity);
    const self = !!identity && !!card && card.owner.owner === identity.account;

    useEffect(() => {
        setShow(() => {
            if (card === undefined) return false; // 没有数据不加入
            if (card.owner.raw.standard === 'shiku_land') return false; // shiku 不允许交易
            if (!isProfile) return false; // 只有个人中心页面的卡片, 才有批量卖出
            if (identity === undefined) return false; // 没有登录不能卖出
            if (!self) return false; // 非自己的不能加入批量卖出
            if (listing === undefined) return false; // 没有获取到上架信息
            return listing?.listing.type === 'holding'; // 当前持有才有添加按钮
        });
    }, [card, isProfile, identity, self, listing]);

    return show;
};
