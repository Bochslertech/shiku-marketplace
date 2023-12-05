import { useMemo, useState } from 'react';
import { Tooltip } from 'antd';
import { NftListingData } from '@/01_types/listing';
import { TokenInfo } from '@/01_types/nft';
import { NftMetadata } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import { exponentNumber } from '@/02_common/data/numbers';
import { useShikuNotStartedCountdown } from '@/08_hooks/interval/shiku';
import TokenPrice from '@/09_components/data/price';
import ShikuLandsNftBidModal from '../modal/bid';
import TipText from './tip_text';

function ShikuNftNotStarted({
    card,
    listing,
    name,
    refreshHighest,
}: {
    card: NftMetadata | undefined;
    listing: NftListingData | undefined;
    name: string | undefined;
    refreshHighest: () => void;
}) {
    const { days, hours, minutes, seconds } = useShikuNotStartedCountdown(listing);

    const {
        token,
        startPrice,
        floorPrice,
        reducePrice,
        reduceTime,
    }: {
        token?: TokenInfo;
        startPrice?: string;
        floorPrice?: string;
        reducePrice?: string;
        reduceTime?: string;
    } = useMemo(() => {
        if (listing === undefined) return {};
        if (listing.listing.type !== 'dutch') return {};
        return {
            token: listing.listing.token,
            startPrice: listing.listing.auction.price.start,
            floorPrice: listing.listing.auction.price.floor,
            reducePrice: listing.listing.auction.price.reduce,
            reduceTime: listing.listing.auction.time.reduce,
        };
    }, [listing]);

    // 预出价
    const [bid, setBid] = useState<boolean>(false);
    const onBid = () => setBid(true);

    return (
        <>
            <div className="mt-[36px] w-full rounded-[29px] bg-[#F0F5F5] pt-[19px]">
                <Tooltip
                    placement="bottom"
                    trigger="hover"
                    overlayClassName="shiku-wrap-question"
                    className="!md:block !hidden"
                    title={TipText}
                >
                    <div className="ml-auto mr-[20px] h-[18px] w-[18px] cursor-pointer rounded-[50%] bg-[#003541] text-center font-inter-extrabold text-[12px] leading-[18px] text-white">
                        ?
                    </div>
                </Tooltip>

                <div className="m-auto mt-[45px] h-[29px] w-[136px] rounded-[16px] bg-[#003541] text-center font-inter-semibold text-[14px] leading-[29px] text-[#F0F5F5] md:mt-[-6px] md:text-[16px]">
                    Sales starts in
                </div>
                <ul className="mb-[22px] mt-[17px] flex list-none items-center justify-center md:mb-[28px] md:mt-[22px]">
                    <li className="mr-[9px] h-[70px] w-[68px] flex-shrink-0 rounded-[10px] bg-[#FCFFFF] md:mr-[13px] md:h-[97px] md:w-[95px]">
                        <div className="mt-[7px] w-full text-center font-inter-extrabold text-[35px] leading-[38px] text-[#003541] md:mt-[11px] md:text-[45px] md:leading-[48px]">
                            {days ?? '--'}
                        </div>
                        <div className="w-full text-center font-inter-semibold text-[12px] leading-[13px] text-[#003541] md:text-[16px] md:leading-[19px]">
                            days
                        </div>
                    </li>
                    <li className="mr-[9px] h-[70px] w-[68px] flex-shrink-0 rounded-[10px] bg-[#FCFFFF] md:mr-[13px] md:h-[97px] md:w-[95px]">
                        <div className="mt-[7px] w-full text-center font-inter-extrabold text-[35px] leading-[38px] text-[#003541] md:mt-[11px] md:text-[45px] md:leading-[48px]">
                            {hours ?? '--'}
                        </div>
                        <div className="w-full text-center font-inter-semibold text-[12px] leading-[13px] text-[#003541] md:text-[16px] md:leading-[19px]">
                            hours
                        </div>
                    </li>
                    <li className="mr-[9px] h-[70px] w-[68px] flex-shrink-0 rounded-[10px] bg-[#FCFFFF] md:mr-[13px] md:h-[97px] md:w-[95px]">
                        <div className="mt-[7px] w-full text-center font-inter-extrabold text-[35px] leading-[38px] text-[#003541] md:mt-[11px] md:text-[45px] md:leading-[48px]">
                            {minutes ?? '--'}
                        </div>
                        <div className="w-full text-center font-inter-semibold text-[12px] leading-[13px] text-[#003541] md:text-[16px] md:leading-[19px]">
                            minutes
                        </div>
                    </li>
                    <li className="mr-[9px] h-[70px] w-[68px] flex-shrink-0 rounded-[10px] bg-[#FCFFFF] md:mr-[13px] md:h-[97px] md:w-[95px]">
                        <div className="mt-[7px] w-full text-center font-inter-extrabold text-[35px] leading-[38px] text-[#003541] md:mt-[11px] md:text-[45px] md:leading-[48px]">
                            {seconds ?? '--'}
                        </div>
                        <div className="w-full text-center font-inter-semibold text-[12px] leading-[13px] text-[#003541] md:text-[16px] md:leading-[19px]">
                            seconds
                        </div>
                    </li>
                </ul>
                <div className="mb-[5px] text-center font-inter-semibold text-[14px] text-[#003541]">
                    Price starts at{' '}
                    <TokenPrice
                        value={{
                            value: startPrice,
                            token: token,
                            symbol: '',
                        }}
                    />{' '}
                    {token?.symbol ?? 'ICP'}
                </div>
                <div className="font-inter-normal pb-[45px] pl-[40px] pr-[35px] text-center text-[14px] text-[#7E9095] md:pb-[26px] md:pl-0 md:pr-0">
                    Every{' '}
                    {reduceTime ? Math.floor(Number(exponentNumber(reduceTime, -9)) / 60) : '--'}{' '}
                    minutes, the unit price drops by{' '}
                    <TokenPrice
                        value={{
                            value: reducePrice,
                            decimals: {
                                type: 'exponent',
                                value: token ? Number(token.decimals) + 4 : 12,
                            },
                        }}
                    />{' '}
                    {token?.symbol ?? 'ICP'}/m² until someone bids
                </div>
                <div
                    className="m-auto flex h-[55px] w-full cursor-pointer items-center justify-center rounded-b-[30px] rounded-t-[8px] font-inter-bold text-[16px] text-white md:w-[613px]"
                    style={{
                        background: 'linear-gradient(174deg, #000 0%, #003541 100%)',
                        // borderRadius: '8px 8px 30px 30px',
                    }}
                    onClick={onBid}
                >
                    <img
                        className="mr-[10px] h-[22px] w-[22px]"
                        src={cdn(
                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691842294870_card-pos.svg',
                        )}
                        alt=""
                    />
                    Place a bid in advance
                </div>
            </div>
            {/* 预出价弹窗 */}
            {bid && (
                <ShikuLandsNftBidModal
                    open={bid}
                    setOpen={setBid}
                    name={name}
                    token={token}
                    currentPrice={startPrice}
                    floorPrice={floorPrice}
                    reducePrice={reducePrice}
                    card={card}
                    listing={listing}
                    refreshHighest={refreshHighest}
                />
            )}
        </>
    );
}

export default ShikuNftNotStarted;
