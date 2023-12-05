import { NftListingData } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { ShoppingCartItem } from '@/01_types/yumi';
import { isSameNftByTokenId } from '@/02_common/nft/identifier';
import { preventLink } from '@/02_common/react/link';
import { useDeviceStore } from '@/07_stores/device';
import { useIdentityStore } from '@/07_stores/identity';
import { useShoppingCart } from '@/08_hooks/nft/cart';
import { useShowCartButton } from '@/08_hooks/nft/functions/cart';
import { useIsGoldByPath } from '@/08_hooks/views/gold';
import YumiIcon from '@/09_components/ui/yumi-icon';
import { IconCartWhiteForbidden } from '../../icons';
import message from '../../message';

function CartButton({
    card,
    listing,
    className,
    isMarket = false,
}: {
    card: NftMetadata;
    listing: NftListingData | undefined;
    className?: string;
    isMarket?: boolean; // market的card单独处理
}) {
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);

    const showCartButton = useShowCartButton(card, listing);

    const isGold = useIsGoldByPath();

    const shoppingCartItems = useIdentityStore((s) => s.shoppingCartItems);
    const goldShoppingCartItems = useIdentityStore((s) => s.goldShoppingCartItems);
    const items: ShoppingCartItem[] = isGold ? goldShoppingCartItems : shoppingCartItems ?? [];
    const item = items.find((i) => isSameNftByTokenId(i, card.metadata));

    const { add, remove, action } = useShoppingCart();

    // 变更购物车
    const onChange = async () => {
        if (action !== undefined) return; // 注意防止重复点击

        const added = !!item;
        if (added) remove(item.token_id).then(() => message.successRemoveCart());
        else add(card).then(() => message.successAddCart());
    };

    if (!showCartButton) return <></>;
    return (
        <>
            <button className={className} onClick={preventLink(onChange)}>
                {isMarket && (
                    <div className="relative">
                        <YumiIcon name="action-cart" size={18} color="white" />
                        {item && (
                            <IconCartWhiteForbidden className="absolute bottom-0 left-0 right-0 top-0" />
                        )}
                    </div>
                )}
                {action === undefined && (!isMarket || (isMarket && isMobile)) && (
                    <span>{item ? 'Remove' : 'Add'}</span>
                )}
                {action === 'DOING' && <span> 变更中</span>}
                {action === 'CHANGING' && <span>变更中</span>}
            </button>
        </>
    );
}

export default CartButton;
