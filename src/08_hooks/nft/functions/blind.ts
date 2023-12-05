import { useEffect, useState } from 'react';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { useIdentityStore } from '@/07_stores/identity';

export const useShowBlindBoxButton = (
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
            if (identity === undefined) return false; // 没有登录不能卖出
            if (!self) return false; // 非自己的不能打开盲盒
            if (listing === undefined) return false; // 没有获取到上架信息
            if (listing?.listing.type !== 'holding') return false; // 挂单的不能开

            const metadata_raw = card.metadata.raw.data;
            if (
                !metadata_raw ||
                typeof metadata_raw !== 'string' ||
                !metadata_raw.startsWith('{') ||
                !metadata_raw.endsWith('}')
            )
                return false;
            // 取出数据
            let json: any = {};
            try {
                json = JSON.parse(metadata_raw);
            } catch {
                console.error('can not parse metadata raw data', card, metadata_raw);
            }

            return json['isopen'] === false /* cspell: disable-line */;
        });
    }, [card, identity, self, listing]);

    return show;
};
