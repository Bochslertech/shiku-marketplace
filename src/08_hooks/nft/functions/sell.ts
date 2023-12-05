import { useEffect, useState } from 'react';
import { HoldingAction } from '@/01_types/exchange/single-hold';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { string2bigint } from '@/02_common/types/bigint';
import { useIdentityStore } from '@/07_stores/identity';

export const useShowSellButton = (
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
            if (identity === undefined) return false; // 没有登录不能卖出
            if (!self) return false; // 非自己的不能出售
            if (listing === undefined) return false; // 没有获取到上架信息

            // 没到释放时间的collection不允许挂单
            if (!card.data?.info.releaseTime) return true; // 没有传release time的默认可以卖
            if (string2bigint(card.data?.info.releaseTime) / BigInt(1e6) > BigInt(Date.now()))
                return false;

            return listing?.listing.type === 'holding'; // 只有当前状态处于持有中,才能出售 // ? 默认所有的 NFT 都能够出售
            // return true; // 就算已经出售了也可以改价 // 和改价分开吧
        });
    }, [card, identity, self, listing]);

    return show;
};

export const useShowChangePriceButton = (
    card: NftMetadata | undefined,
    listing: NftListingData | undefined,
    holdingAction: HoldingAction,
): boolean => {
    const [show, setShow] = useState(false);

    // self
    const identity = useIdentityStore((s) => s.connectedIdentity);
    const self = !!identity && !!card && card.owner.owner === identity.account;

    useEffect(() => {
        setShow(() => {
            if (card === undefined) return false; // 没有数据不加入
            if (card.owner.raw.standard === 'shiku_land') return false; // shiku 不允许
            if (identity === undefined) return false; // 没有登录不能卖出
            if (holdingAction !== undefined) return false; // 正在取消售出,不能显示改价按钮
            if (!self) return false; // 非自己的不能出售
            if (listing === undefined) return false; // 没有获取到上架信息
            return listing?.listing.type === 'listing'; // 只有当前状态处于持有中,才能出售 // ? 默认所有的 NFT 都能够出售
            return true; // 就算已经出售了也可以改价 // 和售出分开吧
        });
    }, [card, identity, holdingAction, self, listing]);

    return show;
};
