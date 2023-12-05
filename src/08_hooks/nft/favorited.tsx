import { useCallback, useEffect, useState } from 'react';
import { NftIdentifier } from '@/01_types/nft';
import { isSameNft } from '@/02_common/nft/identifier';
import { favoriteByCore } from '@/05_utils/canisters/yumi/core';
import { useIdentityStore } from '@/07_stores/identity';
import { useCheckIdentity } from '../common/identity';

// NFT 的收藏和取消收藏
export type FavoritedAction =
    | undefined // 未开始
    | 'DOING' // 开始
    | 'CHANGING'; // 1. 开始更改

export const useNftFavorite = (
    token_id: NftIdentifier | undefined,
): {
    favorited: boolean | undefined;
    toggle: () => Promise<boolean | undefined>;
    action: FavoritedAction;
} => {
    const checkIdentity = useCheckIdentity();

    const all_favorited = useIdentityStore((s) => s.favorited);
    const addFavorited = useIdentityStore((s) => s.addFavorited);
    const removeFavorited = useIdentityStore((s) => s.removeFavorited);

    const [favorited, setFavorited] = useState<boolean | undefined>(undefined);
    useEffect(() => {
        if (all_favorited === undefined || token_id === undefined) return setFavorited(undefined);
        setFavorited(!!all_favorited.find((c) => isSameNft(c, token_id)));
    }, [all_favorited, token_id]);

    const [action, setAction] = useState<FavoritedAction>(undefined);

    const toggle = useCallback(async (): Promise<boolean | undefined> => {
        const identity = checkIdentity();
        if (favorited === undefined || token_id === undefined) {
            console.error(`favorite can not be undefined`);
            return undefined;
        }
        if (action !== undefined) {
            return undefined; // 防止重复点击
        }
        setAction('DOING');
        // 下面进行收藏
        const current = !favorited;
        try {
            setAction('CHANGING');
            favoriteByCore(identity, {
                token_identifier: token_id.token_identifier,
                favorite: current,
            }); // 直接异步了, 默认就是成功的
        } catch (e) {
            console.debug(`🚀 ~ file: nft.tsx:193 ~ toggle ~ e:`, e);
        } finally {
            setAction(undefined); // 恢复状态
        }
        if (current) {
            addFavorited(token_id); // 取消收藏
        } else {
            removeFavorited(token_id); // 收藏
        }
        return current;
    }, [checkIdentity, favorited, token_id]);

    return { favorited, toggle, action };
};
