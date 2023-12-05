import { useMemo, useState } from 'react';
import { Skeleton } from 'antd';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { parse_token_index } from '@/02_common/nft/ext';
import {
    useShikuLandsNftDealPrice,
    useShikuLandsNftHighestOffer,
    useShikuLandsNftState,
} from '@/08_hooks/views/shiku';
import TokenPrice from '@/09_components/data/price';
import { IconLogoLedger } from '@/09_components/icons';
import ShikuLandsNftAuctioning from './components/auctioning';
import ShikuLandsNftAuctioningCountdown from './components/auctioning_countdown';
import ShikuNftNotStarted from './components/not_started';
import ShikuDetailHeader, { ShikuDetailHeaderSkeleton } from './header';

function ShikuDetail({
    cards,
    card,
    listing,
    refreshAll,
}: {
    cards: NftMetadata[] | undefined;
    card: NftMetadata | undefined;
    listing: NftListingData | undefined;
    refreshAll: () => void;
}) {
    const token_index = useMemo(() => {
        if (card === undefined) return undefined;
        return parse_token_index(card.owner.token_id.token_identifier);
    }, [card]);

    const name: string | undefined = useMemo(() => {
        if (card === undefined) return undefined;
        const raw = JSON.parse(card.metadata.raw.data);
        // believe science
        if (raw[1].name === 'No. 004') {
            return 'No.Φ';
        }
        return raw[1].name;
    }, [card]);

    // 计算当前状态
    const { offer: highest, refresh: refreshHighest } = useShikuLandsNftHighestOffer(card);
    const { price: deal } = useShikuLandsNftDealPrice(card);
    // console.debug(`🚀 ~ file: index.tsx:40 ~ deal:`, deal, highest, listing);

    const state = useShikuLandsNftState(listing, deal);
    // console.debug(`🚀 ~ file: index.tsx:43 ~ state:`, state);
    // console.debug(`🚀 ~ file: index.tsx:48 ~ const state:ShikuNftState=useMemo ~ state:`, state);

    const [tab, setTab] = useState<'Auctions' | 'Details'>('Auctions');

    return (
        <div className="mt-[65px] w-full md:ml-[60px] md:mt-0 md:w-[615px]">
            {(!cards || !state) && (
                <>
                    <ShikuDetailHeaderSkeleton />
                    <ContentSkeleton />
                    <NftInfoSkeleton />
                </>
            )}
            {state && (
                <>
                    <ShikuDetailHeader
                        card={card}
                        name={name}
                        token_index={token_index}
                        listing={listing}
                        state={state}
                    />
                    {state !== undefined &&
                        ['Coming soon', 'Auction ended', 'Sold out'].includes(state) && (
                            <div>
                                <div className="mb-[43px] h-[177px]   w-full rounded-[26px] bg-[#F0F5F5] md:w-[615px] md:rounded-[29px]">
                                    {state === 'Coming soon' && (
                                        <>
                                            <div className="text-[rgba(0, 53, 65, 0.80)] mb-[8px] pt-[26px] text-center font-inter-semibold text-[13px]">
                                                Auction
                                            </div>
                                            <div className="px-[17px]">
                                                <div className="m-auto  h-[75px] w-full rounded-[10px] bg-white  text-center font-inter-extrabold text-[26px] leading-[75px] text-[#003541] md:w-[373px] md:text-[45px]">
                                                    not started yet
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {state === 'Auction ended' && (
                                        <>
                                            <div className="text-[rgba(0, 53, 65, 0.80)] mb-[8px] pt-[26px] text-center font-inter-semibold text-[13px]">
                                                Auction
                                            </div>
                                            <div className="px-[17px]">
                                                <div className="m-auto  h-[75px] w-full rounded-[10px] bg-white  text-center font-inter-extrabold text-[26px] leading-[75px] text-[#003541] md:w-[373px] md:text-[45px]">
                                                    ended
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {state === 'Sold out' && (
                                        <>
                                            <div className="mb-[8px] pt-[26px] text-center font-inter-semibold text-[13px] text-[#003541]/80">
                                                Sold for
                                            </div>
                                            <div className="mx-auto flex h-[75px] w-fit items-center justify-center rounded-[10px] bg-white px-[10px] font-inter-extrabold text-[35px] text-[#003541] md:text-[45px]">
                                                <IconLogoLedger
                                                    symbol={deal?.token.symbol}
                                                    className="ml-[10px] mr-[8px] h-[26px] w-[26px]"
                                                />
                                                <TokenPrice
                                                    value={{
                                                        value: deal?.price,
                                                        token: deal?.token,
                                                        symbol: '',
                                                        thousand: { comma: true },
                                                    }}
                                                    className="font-inter-extrabold text-[35px] md:text-[45px]"
                                                />
                                                &nbsp;
                                                {deal?.token.symbol ?? 'ICP'}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <NftInfo />
                            </div>
                        )}
                    {/* 这是正常的tab切换的 flex*/}
                    {state !== undefined && ['Not started', 'Auctioning'].includes(state) && (
                        <>
                            <div className="flex h-[40px] items-center border-b border-solid border-[#999]">
                                {['Auctions', 'Details'].map((t) => (
                                    <div
                                        key={t}
                                        className={cn(
                                            'text-[rgba(141, 141, 141, 0.80)] mr-[34px] h-[40px] cursor-pointer  text-[16px] font-normal text-[#003541CC]',
                                            tab === t &&
                                                'border-b border-solid border-[#335D67] font-semibold text-[#003541CC] ',
                                        )}
                                        onClick={() => setTab(t as 'Auctions' | 'Details')}
                                    >
                                        {t}
                                    </div>
                                ))}
                                {/* 时钟样式 */}
                                {['Not started', 'Coming soon'].includes(state) && (
                                    <div className="mb-[9px] ml-auto flex h-[30px] w-[127px] flex-shrink-0 items-center justify-center rounded-[100px] bg-[#7953FF] font-inter-extrabold text-[12px] text-white md:text-[13px]">
                                        <img
                                            className="mr-[5px] hidden h-[15px] w-[15px] md:block"
                                            src={cdn(
                                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691834225902_clock_icon.svg',
                                            )}
                                            alt=""
                                        />
                                        <img
                                            className="mr-[5px] block h-[12px] w-[12px] md:hidden"
                                            src={cdn(
                                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691982722065_clock_icon.svg',
                                            )}
                                            alt=""
                                        />
                                        {'Coming soon'}
                                    </div>
                                )}
                                {/* 具体时间 看设计稿出现的条件 */}
                                <ShikuLandsNftAuctioningCountdown listing={listing} state={state} />
                            </div>
                            {tab === 'Auctions' && (
                                <>
                                    {/* 设计图第一和第二结合 */}
                                    {state === 'Not started' && (
                                        <ShikuNftNotStarted
                                            card={card}
                                            listing={listing}
                                            name={name}
                                            refreshHighest={refreshHighest}
                                        />
                                    )}
                                    {/* 设计图第三部分 有计算的*/}
                                    {state === 'Auctioning' && (
                                        <ShikuLandsNftAuctioning
                                            card={card}
                                            listing={listing}
                                            highest={highest}
                                            name={name}
                                            refreshHighest={refreshHighest}
                                            refreshAll={refreshAll}
                                        />
                                    )}
                                </>
                            )}
                            {tab === 'Details' && <NftInfo />}
                        </>
                    )}
                </>
            )}
        </div>
    );
}

const NftInfo = () => {
    return (
        <div className="">
            <div className="mb-[20px] mt-[30px] font-inter-semibold text-[13px] text-stress md:mb-[6px] md:text-[16px]">
                Step into the future of the metaverse with Shiku Land Parcel NFTs.
            </div>
            <div className="border-b border-solid border-black/30 pb-[40px] font-inter-light text-[12px] text-symbol md:pb-[50px] md:text-[16px]">
                As an exclusive Earth DAO member and land NFT owner, you'll have the power to create
                and own a piece of this exciting new world.
            </div>
            <div className="mt-[16px] flex w-full flex-wrap justify-between border-b border-solid border-black/30 pb-[19px] md:items-center  md:px-[10px]">
                <div className="">
                    <div className="font-inter-normal flex items-center text-[12px] leading-tight text-black/60">
                        <img
                            className="mr-[5px] block h-[14px] w-[16px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691841264598_planet.svg',
                            )}
                            alt=""
                        />
                        Planet
                    </div>
                    <div className="mt-[12px] font-inter-bold text-[14px] leading-tight text-black">
                        Earth
                    </div>
                </div>
                <div className="">
                    <div className="font-inter-normal flex items-center text-[12px] leading-tight text-black/60">
                        <img
                            className="mr-[5px] block h-[14px] w-[16px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691841264581_image 4.svg',
                            )}
                            alt=""
                        />
                        Land Parcel Size
                    </div>
                    <div className="mt-[12px] font-inter-bold text-[14px] leading-tight text-black">
                        100m x 100m
                    </div>
                </div>
                <div className="md:ml-0 md:mt-0">
                    <div className="font-inter-normal flex items-center text-[12px] leading-tight text-black/60">
                        <img
                            className="mr-[5px] block h-[14px] w-[16px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691841264592_nb_icon.svg',
                            )}
                            alt=""
                        />
                        Number of Land Parcels
                    </div>
                    <div className="mt-[12px] font-inter-bold text-[14px] leading-tight text-black">
                        100m x 100m
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContentSkeleton = () => {
    return (
        <div className="mb-[43px] flex h-[177px] w-full   flex-col rounded-[29px] bg-black/10 md:w-[615px]">
            {
                <>
                    <div className="mt-[26px] flex w-full  justify-center">
                        <Skeleton.Input className="text-[rgba(0, 53, 65, 0.80)] mb-[8px]  !h-[20px] !w-[50px] !min-w-0 text-center font-inter-semibold text-[13px]" />
                    </div>
                    <div className="mx-auto flex h-[75px]  w-fit items-center justify-center gap-x-[10px] rounded-[10px] bg-white px-[10px] font-inter-extrabold text-[45px] text-[#003541]">
                        <Skeleton.Input className="ml-[10px] mr-[8px] !h-[26px]  !w-[50px] !min-w-0" />
                        <Skeleton.Input className="!h-[50px] !w-[180px] !min-w-0  text-[18px] md:text-[45px]" />
                    </div>
                </>
            }
        </div>
    );
};

const NftInfoSkeleton = () => {
    return (
        <div className="">
            <div className="mb-[20px] mt-[20px] font-inter-semibold text-[13px] text-stress md:mb-[6px] md:mt-[29px] md:text-[16px]">
                Step into the future of the metaverse with Shiku Land Parcel NFTs.
            </div>
            <div className="border-b border-solid border-black/30 pb-[40px] font-inter-light text-[12px] text-symbol md:pb-[50px] md:text-[16px]">
                As an exclusive Earth DAO member and land NFT owner, you'll have the power to create
                and own a piece of this exciting new world.
            </div>
            <div className="mt-[16px] flex w-full flex-wrap justify-between border-b border-solid border-black/30 pb-[19px] md:items-center  md:px-[10px]">
                <div className="">
                    <div className="font-inter-normal flex items-center text-[12px] text-black/60">
                        <img
                            className="mr-[5px] block h-[14px] w-[16px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691841264598_planet.svg',
                            )}
                            alt=""
                        />
                        Planet
                    </div>
                    <Skeleton.Input className="!mt-[3px] !h-[20px] !w-[56px] !min-w-0 md:!mt-[12px] " />
                </div>
                <div className="">
                    <div className="font-inter-normal flex items-center text-[12px] text-black/60">
                        <img
                            className="mr-[5px] block h-[14px] w-[16px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691841264581_image 4.svg',
                            )}
                            alt=""
                        />
                        Land Parcel Size
                    </div>
                    <Skeleton.Input className="!mt-[3px] !h-[20px] !w-[114px] !min-w-0 md:!mt-[12px]" />
                </div>
                <div className="">
                    <div className="font-inter-normal flex items-center text-[12px] text-black/60">
                        <img
                            className="mr-[5px] block h-[14px] w-[16px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691841264592_nb_icon.svg',
                            )}
                            alt=""
                        />
                        Number of Land Parcels
                    </div>
                    <Skeleton.Input className="!mt-[3px] !h-[20px] !w-[157px] !min-w-0 md:!mt-[12px]" />
                </div>
            </div>
        </div>
    );
};

export default ShikuDetail;
