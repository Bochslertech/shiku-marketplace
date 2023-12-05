import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { useIdentityStore } from '@/07_stores/identity';

export const useShowCartButton = (
    card: NftMetadata | undefined,
    listing: NftListingData | undefined,
): boolean => {
    const [show, setShow] = useState(false);

    // self
    const identity = useIdentityStore((s) => s.connectedIdentity);
    const self = !!identity && !!card && card.owner.owner === identity.account;

    // 当前页面是否黄金页面
    const location = useLocation();
    const isGold = location.pathname.slice(0, 5) === '/gold';
    const shoppingCartItems = useIdentityStore((s) => s.shoppingCartItems);

    useEffect(() => {
        setShow(() => {
            if (card === undefined) return false; // 没有数据不加入
            if (card.owner.raw.standard === 'shiku_land') return false; // shiku 不允许
            // if (identity === undefined) return false; // 没有登录 // 可以显示加入购物车按钮，跳登录页呗
            if (self) return false; // 自己的不能加入购物车
            if (listing === undefined) return false; // 没有获取到上架信息
            if (listing?.listing.type !== 'listing') return false; // ! 当前只支持 listing 进行加入购物车
            if (isGold) return true; // 如果是黄金页面,已经可以上架了
            if (card.owner.raw.standard === 'ogy') return false; // ! OGY 标准不许上架
            if (identity && shoppingCartItems === undefined) return false; // 购物车还没加载好 // 如果登录了，但是没有，则不显示
            return true;
        });
    }, [card, self, listing, shoppingCartItems]);

    return show;
};
