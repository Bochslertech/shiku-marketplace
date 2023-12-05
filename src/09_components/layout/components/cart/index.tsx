import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { NftListingData, NftListingListing } from '@/01_types/listing';
import { ShoppingCartItem } from '@/01_types/yumi';
import { cn } from '@/02_common/cn';
import { exponentNumber } from '@/02_common/data/numbers';
import { isSameNftByTokenId, uniqueKey } from '@/02_common/nft/identifier';
import { getYumiOgyBroker } from '@/02_common/nft/ogy';
import { FirstRenderByData } from '@/02_common/react/render';
import { unwrapVariantKey } from '@/02_common/types/variant';
import { goldAutoSell } from '@/05_utils/apis/yumi/gold-api';
import { queryTokenListingByOgy } from '@/05_utils/canisters/nft/ogy';
import { queryTokenListing, removeShoppingCartItems } from '@/05_utils/canisters/yumi/core';
import { getYumiServiceFee } from '@/05_utils/nft/fee';
import { loadNftCardsByStoredRemote } from '@/05_utils/nft/metadata';
import { useIdentityStore } from '@/07_stores/identity';
import { useBatchBuyNftByTransaction } from '@/08_hooks/exchange/batch/buy';
import { useBatchBuyGoldNftByTransaction } from '@/08_hooks/exchange/batch/buy-gold';
import { useYumiPlatformFee } from '@/08_hooks/interval/platform_fee';
import { useCollectionDataList } from '@/08_hooks/nft/collection';
import { useIsGoldByPath } from '@/08_hooks/views/gold';
import Usd from '../../../data/usd';
import message from '../../../message';
import './index.less';
import CartItem from './item';

// 批量自动上架黄金购物车以及sweep
export const autoListGoldShoppingCartItems: (
    items: ShoppingCartItem[],
) => Promise<NftListingData[]> = (items: ShoppingCartItem[]) => {
    // 包装是否要上架
    return Promise.all(
        items.map(
            (item) =>
                new Promise<NftListingData>((resolve, reject) => {
                    const listing = item.card?.listing;
                    if (!listing) {
                        reject('gold not listed');
                        return;
                    }
                    if (item?.card?.owner.raw.standard !== 'ogy') return resolve(listing);
                    if (listing.listing.type !== 'listing') return resolve(listing);
                    if (listing.listing.raw.type !== 'ogy') return resolve(listing);
                    if (listing.listing.raw.sale_id) return resolve(listing);
                    goldAutoSell(item?.card?.owner.token_id, listing)
                        .then(resolve)
                        .catch(reject);
                }),
        ),
    );
};

const once_load_shopping_cart = new FirstRenderByData();

function CartModal() {
    // 是否展示
    const showShoppingCart = useIdentityStore((s) => s.showShoppingCart);
    const toggleShowShoppingCart = useIdentityStore((s) => s.toggleShowShoppingCart);
    const [open, setOpen] = useState(showShoppingCart);
    useEffect(() => setOpen(showShoppingCart), [showShoppingCart]);

    const identity = useIdentityStore((s) => s.connectedIdentity);
    const yumiPlatformFee = useYumiPlatformFee();

    const collectionDataList = useCollectionDataList();

    const navigate = useNavigate();
    const isGold = useIsGoldByPath();
    // 远程购物车
    const shoppingCartItems = useIdentityStore((s) => s.shoppingCartItems);
    const updateShoppingCartItem = useIdentityStore((s) => s.updateShoppingCartItem);
    const removeShoppingCartItem = useIdentityStore((s) => s.removeShoppingCartItem);
    const cleanShoppingCartItems = useIdentityStore((s) => s.cleanShoppingCartItems);

    // 本地 Gold 购物车
    const goldShoppingCartItems = useIdentityStore((s) => s.goldShoppingCartItems);
    const updateGoldShoppingCartItem = useIdentityStore((s) => s.updateGoldShoppingCartItem);
    const removeGoldShoppingCartItem = useIdentityStore((s) => s.removeGoldShoppingCartItem);
    const cleanGoldShoppingCartItems = useIdentityStore((s) => s.cleanGoldShoppingCartItems);

    const items: ShoppingCartItem[] = isGold ? goldShoppingCartItems : shoppingCartItems ?? [];
    const total_icp = items
        .filter((t) => t.listing?.type === 'listing')
        .map((t) => ({
            symbol: (t.listing as NftListingListing).token.symbol,
            decimals: (t.listing as NftListingListing).token.decimals,
            fee: (t.listing as NftListingListing).token.fee,
            price: (t.listing as NftListingListing).price,
        }))
        .filter((t) => t.symbol === 'ICP')
        .filter((t) => t.price)
        .map((t) => BigInt(t.price ?? '0') + BigInt(t.fee ?? '0'))
        .reduce((a, b) => a + b, BigInt(0));
    const total_ogy = items
        .filter((t) => t.listing?.type === 'listing')
        .map((t) => ({
            symbol: (t.listing as NftListingListing).token.symbol,
            decimals: (t.listing as NftListingListing).token.decimals,
            fee: (t.listing as NftListingListing).token.fee,
            price: (t.listing as NftListingListing).price,
        }))
        .filter((t) => t.symbol === 'OGY')
        .filter((t) => t.price)
        .map((t) => BigInt(t.price ?? '0') + BigInt(t.fee ?? '0'))
        .reduce((a, b) => a + b, BigInt(0));

    // 查找元数据
    useEffect(() => {
        if (isGold) return; // 黄金的不需要动
        once_load_shopping_cart.once(
            [isGold, (shoppingCartItems ?? []).map((id) => uniqueKey(id.token_id))],
            () => {
                loadNftCardsByStoredRemote(
                    collectionDataList,
                    items.map((item) => item.token_id),
                    () => {},
                ).then((card_list) => {
                    // 查找上架信息
                    Promise.all(
                        card_list.map(
                            (card) =>
                                new Promise<NftListingData | undefined>((resolve) => {
                                    if (card.metadata.raw.standard === 'ogy') {
                                        queryTokenListingByOgy(card.metadata.token_id.collection, [
                                            card.metadata.token_id,
                                        ])
                                            .then((d) => resolve(d[0]))
                                            .catch(() => resolve(undefined));
                                    } else {
                                        queryTokenListing([card.metadata.token_id])
                                            .then((d) => resolve(d[0]))
                                            .catch(() => resolve(undefined));
                                    }
                                }),
                        ),
                    ).then((listing_list) => {
                        for (const item of items) {
                            const card = card_list.find((c) =>
                                isSameNftByTokenId(c.metadata, item),
                            );
                            const listing_data = listing_list
                                .filter((c) => !!c)
                                .find((c) => isSameNftByTokenId(c!, item));
                            item.card = card;
                            item.listing = listing_data?.listing;
                            if (isGold) updateGoldShoppingCartItem(item);
                            else updateShoppingCartItem(item);
                        }
                    });
                });
            },
        );
    }, [isGold, shoppingCartItems]);

    // 清空
    const clean = async () => {
        if (isGold) {
            cleanGoldShoppingCartItems();
        } else {
            if (!identity) return navigate('/connect');
            // 需要调用接口
            removeShoppingCartItems(identity).catch((e) => {
                message.error(`${e}`); // 要不要刷新？
            });
            cleanShoppingCartItems(); // 远程有结果后，修改本地
        }
    };
    const { batchBuy, action } = useBatchBuyNftByTransaction();
    const { batchBuyGold, executing } = useBatchBuyGoldNftByTransaction();

    // 黄金批量购买
    const onConfirmGold = async () => {
        const nft_list = items.filter(
            (t) =>
                t.card !== undefined &&
                t.card.owner.raw.standard === 'ogy' &&
                t.listing?.type === 'listing',
        );
        if (nft_list.length === 0) {
            message.error('add nft please');
            return;
        }
        batchBuyGold(
            nft_list.map((item) => ({
                owner: item.card!.owner,
                listing: item.listing!,
                raw: (() => {
                    if (item.card?.owner.raw.standard !== 'ogy') {
                        throw new Error(`card must be ogy`);
                    }
                    // ! 要求当前所有者一定是 principal
                    const account = item.card?.owner.raw.data.account;
                    const key = unwrapVariantKey(account);
                    if (key !== 'principal') {
                        throw new Error(`the owner of nft must be principal`);
                    }
                    const principal = account[key] as string;
                    if (item.listing?.type !== 'listing' || item.listing?.raw.type !== 'ogy') {
                        throw new Error(`wrong listing data`);
                    }
                    return {
                        standard: 'ogy',
                        sale_id: item.listing?.raw.sale_id,
                        broker_id: getYumiOgyBroker(),
                        seller: principal,
                    };
                })(),
            })),
        ).then();
        toggleShowShoppingCart();
    };
    const [goldAutoSelling, setGoldAutoSelling] = useState<boolean>(false);

    const onConfirm = async () => {
        if (isGold) {
            setGoldAutoSelling(true);
            // 包装是否要上架
            autoListGoldShoppingCartItems(items)
                .then(() => {
                    onConfirmGold();
                })
                .finally(() => setGoldAutoSelling(false));
            return;
        }
        const nft_list = items.filter((t) => t.card !== undefined && t.listing?.type === 'listing');
        if (nft_list.length === 0) {
            message.error('add nft please');
            return;
        }
        // 隐藏购物车
        toggleShowShoppingCart();
        batchBuy(
            nft_list.map((item) => ({
                owner: item.card!.owner,
                listing: item.listing!,
            })),
        ).then();
    };

    return (
        <Modal
            open={open}
            footer={null}
            //onOk={onConfirm}
            onCancel={toggleShowShoppingCart}
            className="cart-modal-wrap"
        >
            <div className="flex items-center pl-[30px] pt-[30px]">
                <div className="mr-[9px] font-inter-bold text-[22px] leading-[21px] text-black">
                    Cart
                </div>
                {!!items.length && (
                    <div className="mr-[33px] h-[21px] w-[21px] flex-shrink-0 rounded-[4px] bg-[#E31111] text-center font-inter-bold text-[12px] leading-[21px] text-white">
                        {`${items.length}`}
                    </div>
                )}
                {!!items.length && (
                    <div
                        className="cursor-pointer font-inter-bold text-[16px] text-[#999]"
                        onClick={clean}
                    >
                        Clear All
                    </div>
                )}
            </div>
            {!items.length && (
                <div className="m-auto mb-[20px] mt-[23px] h-[1px] w-[328px] border border-[#F1F1F1]"></div>
            )}
            {!items.length && (
                <div className="mb-[39px] px-[30px] font-inter-medium text-[14px] text-symbol">
                    There are no items in the cart
                </div>
            )}
            {!items.length && (
                <Link
                    to={isGold ? '/gold' : '/explore'}
                    className="m-auto block h-[48px] w-[328px] rounded-[8px] bg-black text-center font-inter-semibold text-[14px] leading-[48px] text-white"
                >
                    {isGold ? 'Gold' : 'Explore'}
                </Link>
            )}
            <div className="mt-[40px] flex-1 overflow-y-scroll">
                {items
                    .filter((item) => item.card && item.listing)
                    .map((item) => (
                        <CartItem
                            key={uniqueKey(item.token_id)}
                            item={item}
                            remove={isGold ? removeGoldShoppingCartItem : removeShoppingCartItem}
                        />
                    ))}
            </div>
            {!!items.length && (
                <ul className="m-auto mb-[19px] mt-[30px] flex w-[323px] list-none items-center p-0">
                    <li className="mr-[14px] font-inter-semibold text-[12px] text-black">Fees:</li>
                    <li className="font-inter-normal mr-[14px] text-[12px] text-black text-opacity-75">
                        Service fee
                    </li>
                    <li className="font-inter-semibold text-[12px] text-black">
                        {getYumiServiceFee(yumiPlatformFee) ?? '--'}%
                    </li>
                </ul>
            )}
            {!!items.length && (
                <ul className="m-auto mb-[15px] flex h-[49px] w-[323px] flex-shrink-0 list-none items-center justify-end rounded-[8px] bg-[#F0F0F0] p-0 px-[16px]">
                    <li className="mr-auto font-inter-medium text-[12px] text-black">
                        Total Price
                    </li>
                    {isGold ? (
                        // {/* gold */}
                        <li className="text-right font-inter-semibold text-[13px] text-black">
                            <div className="mb-[10px] leading-[9px]">
                                {Number(exponentNumber(`${total_icp}`, -8)).toFixed(2)} ICP
                            </div>
                            <div className="leading-[9px]">
                                {Number(exponentNumber(`${total_ogy}`, -8)).toFixed(2)} OGY
                            </div>
                        </li>
                    ) : (
                        <>
                            {/* explorer */}
                            <li className="font-inter-semibold text-[12px] text-black">
                                {exponentNumber(`${total_icp}`, -8)} ICP
                            </li>
                            <li className="font-inter-normal ml-[8px] mr-[16px] text-[13px] text-black text-opacity-40">
                                (
                                <Usd
                                    value={{
                                        value: `${total_icp}`,
                                        decimals: { type: 'exponent', value: 8 },
                                        symbol: 'ICP',
                                        scale: 2,
                                    }}
                                />
                                )
                            </li>
                        </>
                    )}
                </ul>
            )}

            {!!items.length && (
                <div
                    className={cn([
                        'm-auto h-[45px] w-[323px] rounded-[8px] bg-black text-center font-inter-semibold text-[14px] leading-[45px] text-white',
                        !action && !executing && 'cursor-pointer',
                    ])}
                    onClick={onConfirm}
                >
                    {isGold
                        ? goldAutoSelling && <LoadingOutlined className="mr-2" />
                        : action && <LoadingOutlined className="mr-2" />}
                    Check out
                </div>
            )}
        </Modal>
    );
}

export default CartModal;
