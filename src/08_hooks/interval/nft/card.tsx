import { useCallback, useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { NftIdentifier, NftMetadata } from '@/01_types/nft';
import { CoreCollectionData } from '@/01_types/yumi';
import { isSameNft } from '@/02_common/nft/identifier';
import { getNftCardsByStoredRemote } from '@/05_utils/nft/metadata';

export const useNftCard = (
    data: CoreCollectionData | undefined,
    token_id: NftIdentifier | undefined,
    delay?: number,
): {
    card: NftMetadata | undefined;
    refresh: () => void;
} => {
    // 必须拆分, 上级可能会一直构建 NftIdentifier 对象
    const collection = token_id?.collection;
    const token_identifier = token_id?.token_identifier;

    const [card, setCard] = useState<NftMetadata | undefined>(undefined);

    // 加载信息
    const refresh = useCallback(() => {
        if (collection === undefined || data === undefined || token_identifier === undefined)
            return;

        const token_id: NftIdentifier = { collection, token_identifier };
        getNftCardsByStoredRemote(data ? [data] : [], [token_id])
            .then((list) => {
                const card = list.find((c) => isSameNft(c.owner.token_id, token_id));
                if (card) setCard(card);
            })
            .catch((e) => {
                console.error(`market nft getNftListByStoredRemote`, e);
            });
    }, [data, collection, token_identifier]);

    useEffect(refresh, [data, collection, token_identifier]);

    // 定时刷新
    if (delay !== undefined) useInterval(refresh, delay);

    return {
        card,
        refresh,
    };
};
