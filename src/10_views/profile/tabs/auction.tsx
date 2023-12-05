import { useCallback, useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { sinceNowByByNano } from '@/02_common/data/dates';
import { isPrincipalText } from '@/02_common/ic/principals';
import { uniqueKey } from '@/02_common/nft/identifier';
import { FirstRenderByData } from '@/02_common/react/render';
import { Spend } from '@/02_common/react/spend';
import { AuctionOffer } from '@/03_canisters/yumi/yumi_core';
import { queryAllAuctionOfferList } from '@/05_utils/canisters/yumi/core';
import TokenPrice from '@/09_components/data/price';
import Usd from '@/09_components/data/usd';
import NftName from '@/09_components/nft/name';
import NftThumbnail from '@/09_components/nft/thumbnail';
import Empty from '@/09_components/ui/empty';
import Loading from '@/09_components/ui/loading';
import PaginatedItems from '@/09_components/ui/paginated';

type AuctionType = 'ALL' | 'ICP' | 'OGY';

const auctionTypes: AuctionType[] = ['ALL', 'ICP', 'OGY'];

const loadUserActivityList = (
    principal: string | undefined,
    setList: (list: AuctionOffer[]) => void,
    setLoading?: (loading: boolean) => void,
) => {
    if (!principal) return setList([]);

    setLoading && setLoading(true);

    const spend = Spend.start(`profile auction`);
    queryAllAuctionOfferList(principal)
        .then((list) => {
            // console.warn(`🚀 ~ file: auction.tsx:16 ~ .then ~ list:`, list);
            spend.mark(`${list.length}`);
            list.reverse(); // 倒序,最新的在前面
            setList(list);
        })
        .catch((e) => {
            console.error('queryAllAuctionOfferList failed', e);
            if (isPrincipalText(principal)) setList([]);
            else throw e;
        })
        .finally(() => {
            setLoading && setLoading(false);
        });
};

const showPrice = (price: string, offer: AuctionOffer) => {
    return price ? (
        offer.price === '0' ? (
            <span>--</span>
        ) : (
            <>
                <TokenPrice
                    className="font-inter-semibold text-[14px] text-stress"
                    value={{
                        value: offer.price ?? '0',
                        decimals: {
                            type: 'exponent',
                            value: offer.token.decimals === '8' ? 8 : 8,
                        },
                        scale: (v) => (v < 0.01 ? 4 : 2),
                        symbol: offer.token.symbol,
                    }}
                />
                {offer.token.symbol && (
                    <span className="font-inter-medium text-[14px] text-symbol">
                        &nbsp;≈&nbsp;
                        <Usd
                            value={{
                                value: offer.price ?? '0',
                                decimals: {
                                    type: 'exponent',
                                    value: offer.token.decimals === '8' ? 8 : 8,
                                },
                                symbol: offer.token.symbol,
                                scale: 2,
                            }}
                        />
                    </span>
                )}
            </>
        )
    ) : (
        <span>--</span>
    );
};

const Items = ({ current }: { current: AuctionOffer[] | undefined }) => {
    return (
        <div className="px-3">
            {current &&
                current.map((offer) => (
                    <div
                        className="grid grid-cols-6 items-center gap-x-3"
                        key={uniqueKey(offer.token_id)}
                    >
                        <div className="flex items-center gap-x-2">
                            <NftThumbnail
                                width="w-[41px]"
                                token_id={offer.token_id}
                                cdn_width={100}
                            />
                            <NftName token_id={offer.token_id} />
                        </div>
                        <div>{showPrice(offer.price, offer)}</div>
                        <div>
                            {offer.status === 'accepted' ? (
                                showPrice(offer.price, offer)
                            ) : (
                                <span>--</span>
                            )}
                        </div>{' '}
                        <div className="font-inter-medium text-xs text-symbol">
                            {sinceNowByByNano(offer.time)}
                        </div>
                        <div className="font-inter-regular text-xs text-stress">{offer.status}</div>
                    </div>
                ))}
        </div>
    );
};

function ProfileAuction({ showed, principal }: { showed: boolean; principal: string | undefined }) {
    // console.debug('profile auction', principal);
    // const [start] = useState(Date.now());

    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<AuctionOffer[] | undefined>(undefined);
    const [filterList, setFilterList] = useState<AuctionOffer[] | undefined>(undefined);
    // 定时获取数据并比较更新
    const [once_load] = useState(new FirstRenderByData());
    useEffect(() => {
        once_load.once([principal], () => loadUserActivityList(principal, setList, setLoading));
    }, [principal]);
    const silenceRefreshList = useCallback(() => {
        if (!showed) return; // ? 不显示不更新
        loadUserActivityList(principal, setList);
    }, [showed, principal]);
    useInterval(silenceRefreshList, 15000);

    const wrappedLoading = list === undefined || (list.length === 0 && loading);

    if (!wrappedLoading) {
        // const end = Date.now();
        // console.debug('Profile Auction spend', `${end - start}ms`);
    }
    const [activeTab, setActiveTab] = useState<AuctionType>('ALL');
    //list filter
    useEffect(() => {
        if (activeTab === 'ALL') {
            setFilterList(list);
            return;
        } else {
            const newList = list?.filter((item) => {
                return item.token.symbol.toLocaleLowerCase() === activeTab.toLocaleLowerCase();
            });
            setFilterList(newList);
        }
    }, [activeTab, list]);
    // img
    const auctionTab = {
        all: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1686221245819_all.svg',
        icp: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1686227453925_Group%20632396.svg',
        ogy: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1686220236236_shiku-ogy-icon.svg',
    };

    if (!showed) return <></>;
    return (
        <div className="pt-3">
            <div className="flex gap-x-2">
                {auctionTypes.map((type) => (
                    <div
                        key={type}
                        onClick={() => setActiveTab(type)}
                        className={cn([
                            'flex cursor-pointer items-center gap-x-1 rounded-lg border border-gray-300 px-2 py-1 text-sm font-medium',
                            type === activeTab && 'bg-black text-white',
                        ])}
                    >
                        <img
                            className="h-4 w-4 "
                            src={cdn(auctionTab[type.toLocaleLowerCase()])}
                            alt=""
                        />
                        <div>{type}</div>
                    </div>
                ))}
            </div>
            {
                // 加载中...
                wrappedLoading && <Loading />
            }
            {
                // 初始化，无数据，不显示
                !wrappedLoading && filterList === undefined && <></>
            }
            {
                // 加载完成，展示数据
                !wrappedLoading && filterList !== undefined && filterList.length === 0 && <Empty />
            }
            {
                // 加载完成，展示数据
                !wrappedLoading && filterList !== undefined && filterList.length !== 0 && (
                    <>
                        <div className="w-full">
                            <div className="grid w-full grid-cols-6 gap-x-3  px-3 text-sm font-semibold leading-10 text-[#999]">
                                <div>Item</div>
                                <div className="text-left">Price</div>
                                <div className="text-left">Bid price</div>
                                <div className="text-left">Date</div>
                                <div className="text-left">Stats</div>
                                <div className="text-left">Option</div>
                            </div>

                            <PaginatedItems
                                className="mt-[65px]"
                                size={10}
                                list={filterList}
                                Items={Items}
                            />
                        </div>
                    </>
                )
            }
        </div>
    );
}

export default ProfileAuction;
