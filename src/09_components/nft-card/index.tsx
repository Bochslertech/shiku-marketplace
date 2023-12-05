import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import { motion } from 'framer-motion';
import { shallow } from 'zustand/shallow';
import { NftListingListing } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { cdn, cdn_by_resize } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { isSameNftByTokenId, uniqueKey } from '@/02_common/nft/identifier';
import { justPreventLink, preventLink } from '@/02_common/react/link';
import { getOgyGoldCanisterId } from '@/05_utils/canisters/nft/special';
import {
    getMediaUrlByNftMetadata,
    getNameByNftMetadata,
    getThumbnailByNftMetadata,
} from '@/05_utils/nft/metadata';
import { useDeviceStore } from '@/07_stores/device';
import { useIdentityStore } from '@/07_stores/identity';
import { useBuyNftByTransaction } from '@/08_hooks/exchange/single/buy';
import { useHoldNft } from '@/08_hooks/exchange/single/hold';
import { useSellNftByTransaction } from '@/08_hooks/exchange/single/sell';
import { useTransferNftByTransaction } from '@/08_hooks/exchange/single/transfer';
import { useShowBlindBoxButton } from '@/08_hooks/nft/functions/blind';
import { useShowBuyButton } from '@/08_hooks/nft/functions/buy';
import { useShowCartButton } from '@/08_hooks/nft/functions/cart';
import { useShowHoldButton } from '@/08_hooks/nft/functions/hold';
import { useShowChangePriceButton, useShowSellButton } from '@/08_hooks/nft/functions/sell';
import { useShowTicketButton } from '@/08_hooks/nft/functions/ticket';
import { useShowTransferButton } from '@/08_hooks/nft/functions/transfer';
import { useNftPath } from '@/08_hooks/nft/link';
import { useNftListing } from '@/08_hooks/nft/listing';
import { useNftScore } from '@/08_hooks/nft/score';
import TokenPrice from '../data/price';
import NftMedia from '../nft/media';
import AspectRatio from '../ui/aspect-ratio';
import BatchListingButton from './functions/batch';
import BlindBoxButton from './functions/blind';
import BuyButton from './functions/buy';
import CartButton from './functions/cart';
import FavoriteButton from './functions/favorite';
import HoldButton from './functions/hold';
import SellButton from './functions/sell';
import TicketButton from './functions/ticket';
import TransferButton from './functions/transfer';
import './index.less';

export type NftCardMode =
    | ':profile' // 来自个人中心展示卡片
    | ':market:middle' // 来自二级市场展示卡片 // 中等图标
    | ':market:small' // 来自二级市场展示卡片 // 小图标
    | ':gold'; // 来自黄金页面

function NftCard({
    mode,
    card,
    refreshList,
    updateItem,
}: {
    mode: NftCardMode;
    card: NftMetadata;
    refreshList?: () => void; // 被转移了需要刷新
    updateItem?: (item: NftMetadata) => void; // 被转移了需要刷新
}) {
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);

    // self
    const { connectedIdentity, sweepMode, sweepItems, sweepGoldItems } = useIdentityStore(
        (s) => ({
            connectedIdentity: s.connectedIdentity,
            sweepMode: s.sweepMode,
            sweepItems: s.sweepItems,
            sweepGoldItems: s.sweepGoldItems,
        }),
        shallow,
    );
    const self = !!connectedIdentity && card.owner.owner === connectedIdentity.account;

    // 跳转链接
    const path = useNftPath(card);

    // 稀有度展示
    const score = useNftScore(card, updateItem);

    // 上架信息
    const { loading, listing, refresh } = useNftListing(card, updateItem);

    const afterBid = useCallback(() => {
        refresh();
        refreshList && refreshList();
    }, [refreshList, refresh]);

    const { sell, executing } = useSellNftByTransaction(); // 也许需要销售状态来判断显示
    const { hold, action: holdingAction } = useHoldNft(); // 也许需要取消状态来判断显示
    const { transfer, action: transferAction } = useTransferNftByTransaction();
    const { buy, action: buyAction } = useBuyNftByTransaction(); // 也许需要取消状态来判断显示
    const { shoppingCartItems, goldShoppingCartItems } = useIdentityStore((s) => ({
        shoppingCartItems: s.shoppingCartItems,
        goldShoppingCartItems: s.goldShoppingCartItems,
    }));
    // 是否显示对应的功能按钮
    const showCartButton = useShowCartButton(card, listing);
    const showSellButton = useShowSellButton(card, listing);
    const showChangePriceButton = useShowChangePriceButton(card, listing, holdingAction);
    const showHoldButton = useShowHoldButton(card, listing);
    const showTransferButton = useShowTransferButton(card, listing);
    const showBlindBoxButton = useShowBlindBoxButton(card, listing);
    const showTicketButton = useShowTicketButton(card);

    const showBuyButton = useShowBuyButton(card, listing);

    // 是否显示展开更多功能
    const [extra, setExtra] = useState<boolean>(false);

    // 是否显示Card Border
    const batchSales = useIdentityStore((s) => s.batchSales);

    // border在sweepMode,batch list or sell显示逻辑
    const showBorder = !sweepMode
        ? batchSales.find((l) => isSameNftByTokenId(l, card.owner)) ||
          shoppingCartItems?.find((l) => isSameNftByTokenId(l, card.owner)) ||
          goldShoppingCartItems.find((l) => isSameNftByTokenId(l, card.owner))
        : mode === ':gold'
        ? sweepGoldItems.find((l) => isSameNftByTokenId(l, card.owner))
        : card.data?.info.collection &&
          sweepItems[card.data?.info.collection]?.find((l) => isSameNftByTokenId(l, card.owner));

    // 是否是market上的卡片
    const isMarket = mode === ':market:middle' || mode === ':market:small' || mode === ':gold';
    // hover时src应该预览原始资源
    const [srcUrl, setSrcUrl] = useState<string | undefined>(getThumbnailByNftMetadata(card));

    return (
        <>
            <motion.div
                initial={{ transform: 'none' }}
                whileHover={
                    !isMobile
                        ? {
                              boxShadow: '0px 8px 25px rgba(88, 88, 88, 0.15)',
                              marginTop: -5, //不要使用translate，会造成zIndex失效
                          }
                        : undefined
                }
                className={cn(
                    'relative rounded-[12px] border border-card',
                    showBorder && ' border-[#7953FF]',
                )}
                onHoverEnd={() => !isMobile && setExtra(false)}
                key={uniqueKey(card.metadata.token_id)}
            >
                <Link to={path} state={{ card }}>
                    <div
                        className={cn(
                            'group box-border flex h-full w-full cursor-pointer flex-col items-center justify-between rounded-[10px]  border-[2px] border-white  px-[7px] py-[7px]',
                            showBorder && ' border-[#7953FF]',
                        )}
                    >
                        <AspectRatio
                            className="flex items-center justify-center overflow-hidden rounded-[8px] "
                            ratio={1}
                        >
                            <div
                                className="flex h-full w-full items-center justify-center rounded-[8px]"
                                onMouseEnter={() => setSrcUrl(getMediaUrlByNftMetadata(card))}
                                onMouseLeave={() => setSrcUrl(getThumbnailByNftMetadata(card))}
                            >
                                {/* <img src={cdn(getThumbnailByNftMetadata(card))} /> */}
                                <NftMedia
                                    src={cdn_by_resize(srcUrl, {
                                        width: 800,
                                    })}
                                    metadata={card.metadata}
                                    whileHover={{
                                        scale: 1.2,
                                        transition: { duration: 0.2 },
                                    }}
                                    skeleton={false}
                                    className="rounded-[8px]"
                                />
                            </div>
                            {
                                // ! OGY 的不能够收藏
                                card.metadata.raw.standard !== 'ogy' && (
                                    <FavoriteButton card={card} identity={connectedIdentity} />
                                )
                            }
                            {/* 稀有度: */}
                            {score && (
                                <div className="absolute left-[8px] top-[9px] z-30 rounded-[4px] bg-black/25 px-[6px] py-[2px] font-inter-bold text-[12px] text-white">
                                    RR<span className="ml-[6px]">{score.score.order}</span>
                                </div>
                            )}
                            {/* 批量挂单 */}
                            {
                                <BatchListingButton
                                    card={card}
                                    listing={listing}
                                    identity={connectedIdentity}
                                />
                            }
                        </AspectRatio>
                        <div className="items-left flex w-full flex-col pt-[11px]">
                            <div
                                className={cn([
                                    'min-h-2 mb-[12px] w-full  truncate text-[12px] text-sm font-semibold text-[#999]',
                                    mode === ':gold' && 'mb-[6px] text-[14px] text-[#343434]',
                                ])}
                            >
                                {getNameByNftMetadata(card)}
                            </div>
                            {
                                // ! 黄金还要额外显示这段话
                                mode === ':gold' &&
                                    getOgyGoldCanisterId().includes(
                                        card.owner.token_id.collection,
                                    ) && (
                                        <div className=" mb-[10px] text-[12px] text-[#999]">
                                            99.99% Gold METALOR
                                        </div>
                                    )
                            }
                            <div className="mb-[7px] flex items-center justify-between">
                                {/* market里的card要单独判断 */}
                                <div
                                    className={cn(
                                        'flex items-end font-inter-medium',
                                        // isMarket && 'group-hover:hidden',
                                    )}
                                >
                                    {(!loading || mode.startsWith(':gold')) &&
                                    listing?.listing.type === 'listing' ? (
                                        <>
                                            <TokenPrice
                                                value={{
                                                    value: listing.listing.price,
                                                    token: listing.listing.token,
                                                    scale: 2,
                                                    decimals: {
                                                        type: 'exponent',
                                                        value: (
                                                            listing.listing as NftListingListing
                                                        ).token.decimals,
                                                    },
                                                    symbol: '',
                                                    thousand: { symbol: 'K' },
                                                }}
                                                className="mr-[5px] font-inter-semibold text-[14px] leading-[20px] text-black"
                                            />
                                            <span
                                                className={cn(
                                                    'font-inter-semibold text-[12px] leading-[16px] text-symbol',
                                                )}
                                            >
                                                {listing?.listing.type === 'listing'
                                                    ? listing.listing.token.symbol
                                                    : 'ICP'}
                                            </span>
                                        </>
                                    ) : (
                                        <div className="invisible text-[14px] leading-[20px]">
                                            --
                                        </div>
                                    )}
                                </div>
                                {isMarket &&
                                    !isMobile &&
                                    showCartButton &&
                                    showBuyButton &&
                                    !sweepMode && (
                                        <div className="absolute bottom-0 left-0 hidden h-[33px] w-full items-center justify-between rounded-b-[8px] bg-black group-hover:flex">
                                            <BuyButton
                                                className="h-[33px] flex-1 text-center font-inter-semibold text-[14px]  leading-[33px] text-white"
                                                card={card}
                                                listing={listing}
                                                buy={buy}
                                                action={buyAction}
                                                refreshListing={afterBid}
                                            />
                                            <CartButton
                                                className="h-[33px] border-l border-white px-[10px]"
                                                card={card}
                                                listing={listing}
                                                isMarket={isMarket}
                                            />
                                        </div>
                                    )}
                                {/* 显示门票ticket */}
                                {showTicketButton && (
                                    <div
                                        className="z-50 ml-auto mr-[10px]"
                                        onClick={justPreventLink}
                                    >
                                        <TicketButton card={card} identity={connectedIdentity} />
                                    </div>
                                )}

                                {
                                    // ! 得判断有内容才显示按钮图标
                                    (showTransferButton ||
                                        showSellButton ||
                                        showChangePriceButton ||
                                        showCartButton ||
                                        showBuyButton ||
                                        showHoldButton ||
                                        showBlindBoxButton) &&
                                        (!isMarket || (isMarket && isMobile)) && (
                                            <div
                                                className="group/edit relative h-[20px] w-[20px] cursor-pointer"
                                                onClick={justPreventLink}
                                            >
                                                <img
                                                    className="pointer-events-auto block h-[20px] w-[20px] "
                                                    src={cdn(
                                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1690948489496_dian.svg',
                                                    )}
                                                    alt=""
                                                    onMouseEnter={preventLink(() => {
                                                        setExtra(true);
                                                    })}
                                                />
                                                <div
                                                    className={cn(
                                                        'absolute right-[-50%] top-0 z-50 hidden pt-[26px]',
                                                        extra ? 'block' : 'hidden',
                                                    )}
                                                >
                                                    <ul
                                                        className="absolute right-full top-full z-50 cursor-pointer  rounded-[4px] border border-solid border-[#F4F4F4] bg-white font-inter-semibold text-[12px]  shadow-[0_2px_15px_0_rgba(81,81,81,.25)]"
                                                        onClick={() => setExtra(false)}
                                                        onMouseLeave={() => setExtra(false)}
                                                    >
                                                        {showTransferButton && (
                                                            <li className="relative h-[33px] w-[105px] hover:bg-[#F4F4F4]">
                                                                <TransferButton
                                                                    className="absolute left-0 top-0 h-[33px] w-[105px]  px-[11px] text-left  leading-[33px] text-black"
                                                                    card={card}
                                                                    listing={listing}
                                                                    identity={connectedIdentity}
                                                                    transfer={transfer}
                                                                    action={transferAction}
                                                                    refreshList={
                                                                        refreshList ?? (() => {})
                                                                    }
                                                                />
                                                            </li>
                                                        )}

                                                        {showSellButton && (
                                                            <li className="relative h-[33px] w-[105px] text-center hover:bg-[#F4F4F4]">
                                                                <SellButton
                                                                    className="absolute left-0 top-0 h-[33px] w-[105px] px-[11px] text-left leading-[33px] text-black"
                                                                    card={card}
                                                                    listing={listing}
                                                                    holdingAction={holdingAction}
                                                                    identity={connectedIdentity}
                                                                    sell={sell}
                                                                    executing={executing}
                                                                    refreshListing={refresh}
                                                                />
                                                            </li>
                                                        )}

                                                        {showChangePriceButton &&
                                                            listing?.listing.type === 'listing' && (
                                                                <li className="relative h-[33px] w-[105px] text-center hover:bg-[#F4F4F4]">
                                                                    {/* // 取消的过程中不应该显示改价的按钮 */}
                                                                    <SellButton
                                                                        className="absolute left-0 top-0 h-[33px] w-[105px] px-[11px] text-left leading-[33px] text-black"
                                                                        card={card}
                                                                        listing={listing}
                                                                        holdingAction={
                                                                            holdingAction
                                                                        }
                                                                        lastPrice={
                                                                            listing.listing.price
                                                                        }
                                                                        identity={connectedIdentity}
                                                                        sell={sell}
                                                                        executing={executing}
                                                                        refreshListing={refresh}
                                                                    />
                                                                </li>
                                                            )}

                                                        {showCartButton && (
                                                            <li className="relative h-[33px] w-[105px] px-[11px] text-left leading-[33px] text-black hover:bg-[#F4F4F4]">
                                                                <CartButton
                                                                    className="absolute left-0 top-0 h-[33px] w-[105px] px-[11px] text-left"
                                                                    card={card}
                                                                    listing={listing}
                                                                />
                                                            </li>
                                                        )}
                                                        {showBuyButton && (
                                                            <li className="relative h-[33px] w-[105px] hover:bg-[#F4F4F4]">
                                                                <BuyButton
                                                                    className="absolute left-0 top-0 h-[33px] w-[105px] px-[11px] text-left  leading-[33px] text-black"
                                                                    card={card}
                                                                    listing={listing}
                                                                    buy={buy}
                                                                    action={buyAction}
                                                                    refreshListing={afterBid}
                                                                />
                                                            </li>
                                                        )}
                                                        {showHoldButton && (
                                                            //cancel 这里需要判读下该nft是否sell，如果没有sell，则不显示，如果sell了，则显示该内容，且sell不出现
                                                            <li className="relative h-[33px] w-[105px] hover:bg-[#F4F4F4]">
                                                                <HoldButton
                                                                    className="absolute left-0 top-0 h-[33px] w-[105px] px-[11px] text-left  leading-[33px] text-black"
                                                                    card={card}
                                                                    listing={listing}
                                                                    identity={connectedIdentity}
                                                                    hold={hold}
                                                                    action={holdingAction}
                                                                    refreshListing={refresh}
                                                                />
                                                            </li>
                                                        )}
                                                        {showBlindBoxButton && (
                                                            <li className="relative h-[33px] w-[105px] hover:bg-[#F4F4F4]">
                                                                <BlindBoxButton
                                                                    className="absolute left-0 top-0 h-[33px] w-[105px] px-[11px] text-left  leading-[33px] text-black"
                                                                    card={card}
                                                                    listing={listing}
                                                                    identity={connectedIdentity}
                                                                    refreshList={
                                                                        refreshList ?? (() => {})
                                                                    }
                                                                />
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        )
                                }
                            </div>
                            <div className="hidden" onClick={justPreventLink}>
                                <div>
                                    出售:
                                    {loading && <span>Loading</span>}
                                    {!loading && listing === undefined && <></>}
                                    {!loading &&
                                        listing?.listing.type === 'holding' &&
                                        transferAction === undefined && <span>未出售 </span>}
                                    {!loading && listing?.listing.type === 'holding' && (
                                        <SellButton
                                            card={card}
                                            listing={listing}
                                            holdingAction={holdingAction}
                                            identity={connectedIdentity}
                                            sell={sell}
                                            executing={executing}
                                            refreshListing={refresh}
                                        />
                                    )}
                                    {!loading && listing?.listing.type === 'listing' && (
                                        <div>
                                            <TokenPrice
                                                value={{
                                                    value: listing.listing.price,
                                                    token: listing.listing.token,
                                                }}
                                            />

                                            {
                                                // 取消的过程中不应该显示改价的按钮
                                                holdingAction === undefined && (
                                                    <SellButton
                                                        card={card}
                                                        listing={listing}
                                                        holdingAction={holdingAction}
                                                        lastPrice={listing.listing.price}
                                                        identity={connectedIdentity}
                                                        sell={sell}
                                                        executing={executing}
                                                        refreshListing={refresh}
                                                    />
                                                )
                                            }
                                        </div>
                                    )}
                                    {
                                        <>
                                            <HoldButton
                                                card={card}
                                                listing={listing}
                                                identity={connectedIdentity}
                                                hold={hold}
                                                action={holdingAction}
                                                refreshListing={refresh}
                                            />
                                            {holdingAction}
                                        </>
                                    }
                                    {
                                        <BuyButton
                                            card={card}
                                            listing={listing}
                                            buy={buy}
                                            action={buyAction}
                                            refreshListing={afterBid}
                                        />
                                    }
                                    {!loading && listing?.listing.type === 'dutch' && (
                                        <div>
                                            <span>荷兰拍卖中,可以计算当前价格然后显示</span>
                                            {self ? (
                                                <button>取消拍卖</button>
                                            ) : (
                                                <button>出价</button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    收藏: {card.metadata.raw.standard === 'ogy' && 'OGY无法收藏'}
                                    {card.metadata.raw.standard !== 'ogy' && (
                                        <FavoriteButton card={card} identity={connectedIdentity} />
                                    )}
                                </div>
                                <div>
                                    批量:{' '}
                                    {
                                        <BatchListingButton
                                            card={card}
                                            listing={listing}
                                            identity={connectedIdentity}
                                        />
                                    }
                                </div>
                                <div>
                                    购物车:{' '}
                                    {self ? (
                                        <span>自己的不考虑购物车功能</span>
                                    ) : (
                                        <>
                                            {loading && <span>Loading</span>}
                                            {!loading && listing === undefined && <></>}
                                            {!loading && listing?.listing.type === 'listing' && (
                                                <CartButton card={card} listing={listing} />
                                            )}
                                        </>
                                    )}
                                </div>
                                <div>
                                    盲盒:
                                    <BlindBoxButton
                                        card={card}
                                        listing={listing}
                                        identity={connectedIdentity}
                                        refreshList={refreshList ?? (() => {})}
                                    />
                                </div>
                                <div>
                                    转移:
                                    {loading && <span>Loading</span>}
                                    {!loading && listing === undefined && <></>}
                                    {!loading && listing?.listing.type === 'holding' && (
                                        <TransferButton
                                            card={card}
                                            listing={listing}
                                            identity={connectedIdentity}
                                            transfer={transfer}
                                            action={transferAction}
                                            refreshList={refreshList ?? (() => {})}
                                        />
                                    )}
                                </div>
                                <div>
                                    稀有度:
                                    {!score && '暂无数据'}
                                    {score && `RR ${score.score.order}`}
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        </>
    );
}

export const NftCardSkeleton = () => {
    return (
        <div className="rounded-lg">
            <div>
                <div className="relative flex h-full w-full cursor-pointer flex-col items-center justify-between rounded-lg border border-card px-[7px] py-[7px]">
                    <AspectRatio
                        className="flex items-center justify-center overflow-hidden rounded-lg "
                        ratio={1}
                    >
                        <Skeleton.Image
                            active={true}
                            className="flex !h-full !w-full items-center justify-center rounded-[8px]"
                        />
                    </AspectRatio>
                    <div className="items-left flex w-full flex-col pt-[11px]">
                        <Skeleton.Input
                            active={true}
                            className="mb-[12px] !h-[12px] !w-[60px] !min-w-[60px]"
                        />
                        <div className="mb-[7px] flex items-center justify-between">
                            <div className="flex items-center">
                                <Skeleton.Input
                                    active={true}
                                    className="!h-[12px] !w-[40px] !min-w-[40px] "
                                />
                            </div>
                            <Skeleton.Input className="!h-[12px] !w-[20px] !min-w-[20px] " />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NftCard;
