import { useCallback, useState } from 'react';
import { message } from 'antd';
import { ConnectedIdentity } from '@/01_types/identity';
import { NftIdentifier, NftMetadata } from '@/01_types/nft';
import { ShoppingCartItem } from '@/01_types/yumi';
import { uniqueKey } from '@/02_common/nft/identifier';
import { Spend } from '@/02_common/react/spend';
import { addShoppingCartItems, removeShoppingCartItems } from '@/05_utils/canisters/yumi/core';
import { getNameByNftMetadata, getThumbnailByNftMetadata } from '@/05_utils/nft/metadata';
import { useIdentityStore } from '@/07_stores/identity';
import { useCheckAction } from '../common/action';
import { useCheckIdentity } from '../common/identity';
import { useIsGoldByPath } from '../views/gold';

// 购物车状态
export type ShoppingCartAction =
    | undefined // 未开始
    | 'DOING' // 开始转移
    | 'CHANGING'; // 1. 正在改变

export type AddShoppingCartExecutor = (card: NftMetadata) => Promise<void>;
export type RemoveShoppingCartExecutor = (token_id: NftIdentifier) => Promise<void>;

export const useShoppingCart = (): {
    isGold: boolean;
    add: AddShoppingCartExecutor;
    remove: RemoveShoppingCartExecutor;
    action: ShoppingCartAction;
} => {
    const checkIdentity = useCheckIdentity();
    const checkAction = useCheckAction();

    // 标记当前状态
    const [action, setAction] = useState<ShoppingCartAction>(undefined);

    const isGold = useIsGoldByPath();

    const addShoppingCartItem = useIdentityStore((s) => s.addShoppingCartItem);
    const removeShoppingCartItem = useIdentityStore((s) => s.removeShoppingCartItem);
    const addGoldShoppingCartItem = useIdentityStore((s) => s.addGoldShoppingCartItem);
    const removeGoldShoppingCartItem = useIdentityStore((s) => s.removeGoldShoppingCartItem);

    const addShoppingCart = isGold ? addGoldShoppingCartItem : addShoppingCartItem;
    const removeShoppingCart = isGold ? removeGoldShoppingCartItem : removeShoppingCartItem;

    const add = useCallback(
        async (card: NftMetadata): Promise<void> => {
            const identity = checkIdentity();
            checkAction(action, `Adding`); // 防止重复点击

            setAction('DOING');
            try {
                const spend = Spend.start(
                    `add nft to shopping cart nft ${uniqueKey(card.owner.token_id)}`,
                );

                // ? 1. 加入
                await doAdd(setAction, isGold, identity, card, addShoppingCart, spend);

                // ? 2. 圆满完成
            } catch (e) {
                console.debug(`🚀 ~ file: cart.tsx:86 ~ e:`, e);
                message.error(`Add NFT to Shopping Cart failed: ${e}`);
            } finally {
                setAction(undefined); // 恢复状态
            }
        },
        [checkIdentity, action, addShoppingCart],
    );

    const remove = useCallback(
        async (token_id: NftIdentifier): Promise<void> => {
            const identity = checkIdentity();
            checkAction(action, `Removing`); // 防止重复点击

            setAction('DOING');
            try {
                const spend = Spend.start(`remove nft to shopping cart nft ${uniqueKey(token_id)}`);

                // ? 1. 移除
                await doRemove(setAction, isGold, identity, token_id, removeShoppingCart, spend);

                // ? 2. 圆满完成
            } catch (e) {
                console.debug(`🚀 ~ file: cart.tsx:86 ~ e:`, e);
                message.error(`Remove NFT from Shopping Cart failed: ${e}`);
            } finally {
                setAction(undefined); // 恢复状态
            }
        },
        [checkIdentity, action, addShoppingCart],
    );

    return { isGold, add, remove, action };
};

const doAdd = async (
    setAction: (action: ShoppingCartAction) => void,
    isGold: boolean,
    identity: ConnectedIdentity,
    card: NftMetadata,
    addShoppingCart: (item: ShoppingCartItem) => void,
    spend: Spend,
): Promise<void> => {
    setAction('CHANGING');
    if (!isGold) {
        addShoppingCartItems(identity!, [
            {
                token_identifier: card.metadata.token_id.token_identifier,
                url: getThumbnailByNftMetadata(card),
                name: getNameByNftMetadata(card),
            },
        ]).catch((e) => message.error(`${e}`));
    }
    addShoppingCart({
        token_id: card.metadata.token_id,
        card,
        listing: card.listing?.listing,
    });
    spend.mark(`CHANGING DONE`);
};

const doRemove = async (
    setAction: (action: ShoppingCartAction) => void,
    isGold: boolean,
    identity: ConnectedIdentity,
    token_id: NftIdentifier,
    removeShoppingCart: (token: NftIdentifier) => void,
    spend: Spend,
): Promise<void> => {
    setAction('CHANGING');
    if (!isGold) {
        removeShoppingCartItems(identity!, token_id.token_identifier).catch((e) =>
            message.error(`${e}`),
        );
    }
    removeShoppingCart(token_id);
    spend.mark(`CHANGING DONE`);
};
