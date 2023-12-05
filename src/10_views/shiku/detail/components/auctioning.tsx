import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { message, Tooltip } from 'antd';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import { exponentNumber } from '@/02_common/data/numbers';
import { AuctionOffer } from '@/03_canisters/yumi/yumi_core';
import { useCheckKyc } from '@/08_hooks/common/kyc';
import { useShikuAuctioningData } from '@/08_hooks/interval/shiku';
import ShowNumber from '@/09_components/data/number';
import TokenPrice from '@/09_components/data/price';
import { IconLogoLedger } from '@/09_components/icons';
import ShikuLandsNftBidModal from '../modal/bid';
import ShikuLandsNftBuyModal from '../modal/buy';
import ShikuLandsNftContactUsModal from '../modal/contact-us';
import TipText from './tip_text';

function ShikuLandsNftAuctioning({
    card,
    listing,
    highest,
    name,
    refreshHighest,
    refreshAll,
}: {
    card: NftMetadata | undefined;
    listing: NftListingData | undefined;
    highest: AuctionOffer | undefined;
    name: string | undefined;
    refreshHighest: () => void;
    refreshAll: () => void;
}) {
    const {
        token,
        price,
        remain,
        block,
        remainTime,
        reduceTime,
        reducePrice,
        startPrice,
        floorPrice,
    } = useShikuAuctioningData(listing);

    // 购买
    const [buyModal, setBuyModal] = useState<boolean>(false);
    const onBuy = () => setBuyModal(true);

    // 预出价
    const [bidModal, setBidModal] = useState<boolean>(false);
    const onBid = () => setBidModal(true);

    // 联系我们
    const [contactUsModal, setContactUsModal] = useState<boolean>(false);
    const onContactUs = () => setContactUsModal(true);

    // 获取kyc状态
    const [verified, setVerified] = useState<boolean>(false);
    const checkKyc = useCheckKyc();
    useEffect(() => {
        checkKyc()
            .then(setVerified)
            .catch((err) => message.error(`get kyc failed ${err}`));
    }, []);

    const symbol = highest?.token.symbol ?? token?.symbol;
    return (
        <>
            <div className="relative mt-[13px] w-full rounded-[29px] bg-[#F0F5F5] py-[15px] ">
                <div className="mb-[14px] ml-[17px] mt-[42px] flex items-center md:ml-[33px] md:mt-[19px]">
                    <div className="mr-[8px] flex h-[75px]  items-center justify-center bg-white px-[10px] ">
                        <IconLogoLedger
                            symbol={symbol}
                            className="ml-[10px] mr-[4px] block h-[26px] w-[26px]"
                        />
                        <div className="h-[76px] text-center font-inter-extrabold text-[45px] text-[#003541]">
                            {price && token
                                ? exponentNumber(price, -Number(token?.decimals) - 4)
                                : ''}
                        </div>
                    </div>
                    <div className="font-inter-normal flex text-[24px] text-[#003541]">
                        /m² x10,000m²
                        <span className="hidden font-inter-extrabold text-[#003541] md:block">
                            ={' '}
                            <TokenPrice
                                value={{
                                    value: price,
                                    token,
                                    symbol: '',
                                    thousand: { comma: true },
                                }}
                                className="text-[24px] md:text-[24px]"
                            />{' '}
                            {token?.symbol ?? 'ICP'}
                        </span>
                    </div>
                </div>
                <div className="mb-[27px] mt-[11px] text-center font-inter-extrabold text-[#003541] md:hidden">
                    ={' '}
                    <TokenPrice
                        value={{
                            value: price,
                            token,
                            symbol: '',
                            thousand: { comma: true },
                        }}
                        className="text-[24px]"
                    />{' '}
                    {token?.symbol ?? 'ICP'}
                </div>
                <Tooltip
                    placement="bottom"
                    trigger="hover"
                    overlayClassName="shiku-wrap-question"
                    title={TipText}
                >
                    <div className="absolute right-[20px] top-[20px] h-[18px] w-[18px] cursor-pointer rounded-[50%] bg-[#003541] text-center font-inter-extrabold text-[12px] leading-[18px] text-white">
                        ?
                    </div>
                </Tooltip>
                <div className="w-full px-[17px] md:px-[33px]">
                    <div className="relative mb-[14px] h-[6px] w-full rounded-[7px] bg-white">
                        <div
                            className="absolute h-[6px]  rounded-[7px] bg-[#003541] "
                            style={{
                                width: `${(Number(remain) / Number(block)) * 100}%`,
                            }}
                        ></div>
                    </div>
                </div>
                <div className="mb-[17px] flex  w-full items-center justify-between gap-x-[10px] px-[17px] md:px-[33px] ">
                    <div className="w-[50px]  font-inter-bold text-[14px] text-[#7E9095]">
                        {remainTime}
                    </div>
                    <div className="w-[80%] text-center font-inter text-[14px] text-[#7E9095] md:w-auto md:pl-0 md:pr-0">
                        Every{' '}
                        {reduceTime
                            ? Math.floor(Number(exponentNumber(reduceTime, -9)) / 60)
                            : '--'}{' '}
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
                </div>
                <div className="flex w-full justify-center">
                    <div className="flex h-[47px] items-center justify-center rounded-[24px] bg-white">
                        <img
                            className="my-[3px] ml-[4px] mr-[8px] h-[41px] w-[41px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691850764751_icon.svg',
                            )}
                            alt=""
                        />
                        <div className="font-inter-normal mr-[2px] text-sm text-symbol md:mr-[6px]">
                            Current highest bid
                        </div>
                        <IconLogoLedger
                            symbol={symbol}
                            className="mr-[3px] block h-[16px] w-[16px] md:h-[26px] md:w-[26px]"
                        />
                        <div className="mr-[6px] w-[91px] font-inter-medium text-[14px] text-black md:mr-[13px] md:w-[110px] md:text-[18px]">
                            <TokenPrice
                                value={{
                                    value: highest?.price,
                                    token: highest?.token,
                                    symbol: '',
                                }}
                                className="text-[14px] md:text-[18px]"
                            />{' '}
                            {symbol ?? 'ICP'}
                        </div>
                    </div>
                </div>
                {/* 这是三个按钮 手机端 flex*/}
                {verified && (
                    <div className="mt-[17px] flex w-full flex-wrap items-center px-[30px] md:hidden">
                        <div className="flex w-full justify-between">
                            <div
                                className="mr-[35px] h-[37px] w-[118px] cursor-pointer rounded-[6px] bg-black text-center font-inter-bold text-[14px] leading-[37px] text-white"
                                onClick={onBuy}
                            >
                                Buy now
                            </div>
                            <div
                                className="h-[37px] w-[118px] cursor-pointer rounded-[6px] border border-solid border-black bg-[#F0F5F5] text-center font-inter-bold text-[14px] leading-[37px] text-black"
                                onClick={onBid}
                            >
                                Place a bid
                            </div>
                        </div>
                        <div
                            className="mt-[18px] h-[45px] w-full cursor-pointer rounded-[8px] border border-solid border-black bg-[#F0F5F5] text-[12px] text-[#020202]"
                            onClick={onContactUs}
                        >
                            <div className="font-iter-light mt-[4px] text-center">
                                Don’t have crypto?
                            </div>
                            <div className="text-center font-inter-bold">Contact us</div>
                        </div>
                    </div>
                )}
            </div>
            {!verified && (
                <div className="mt-[17px] flex w-full justify-center ">
                    <Link
                        to={'/kyc/introduction'}
                        className=" w-full rounded-[8px] bg-[#0A0909] px-[20px] py-[10px] text-center font-inter-bold text-[16px] text-white md:px-[100px]"
                    >
                        Upgrade your verification status
                    </Link>
                </div>
            )}
            {/* 这是三个按钮 PC端 flex*/}
            {verified && (
                <div className="mt-[17px] hidden items-center justify-between md:flex">
                    <div
                        className="h-[61px] w-[190px] cursor-pointer rounded-[8px] bg-black text-center font-inter-bold text-[16px] leading-[61px] text-white"
                        onClick={onBuy}
                    >
                        Buy now
                    </div>
                    <div
                        className="h-[61px] w-[190px] cursor-pointer rounded-[8px] border border-solid border-black bg-white text-center font-inter-bold text-[16px] leading-[61px] text-black"
                        onClick={onBid}
                    >
                        Place a bid
                    </div>
                    <div
                        className="h-[61px] w-[190px] cursor-pointer rounded-[8px] border border-solid border-black bg-white text-[12px] text-[#020202]"
                        onClick={onContactUs}
                    >
                        <div className="font-iter-light mt-[12px] text-center">
                            Don’t have crypto?
                        </div>
                        <div className="text-center font-inter-bold">Contact us</div>
                    </div>
                </div>
            )}

            {/* PC端 */}
            <div
                className="mt-[19px] hidden h-[59px] w-full items-center rounded-[100px] md:flex"
                style={{
                    background: 'linear-gradient(52deg, #FBFBFB 0%, #F0F5F5 100%)',
                }}
            >
                <div className="ml-[6px] flex items-center rounded-[24px] bg-white">
                    <img
                        className="my-[3px] ml-[4px] mr-[9px] block h-[41px] w-[41px]"
                        src={cdn(
                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691839362707_Group 633534.svg',
                        )}
                        alt=""
                    />
                    <IconLogoLedger symbol={symbol} className="mr-[3px] block h-[16px] w-[16px]" />
                    <div className="w-[120px] pr-[17px] font-inter-medium text-[18px] text-black">
                        {startPrice && token ? (
                            <ShowNumber
                                value={{
                                    value: exponentNumber(startPrice, -Number(token.decimals)),
                                    thousand: { symbol: ['M', 'K'] },
                                }}
                                className="text-[18px]"
                            />
                        ) : (
                            '--'
                        )}{' '}
                        {token?.symbol ?? 'ICP'}
                    </div>
                </div>
                <div className="font-inter-normal ml-[6px] mr-[28px] text-[12px] text-symbol">
                    Initial Price
                </div>
                <div className="flex items-center rounded-[24px] bg-white">
                    <img
                        className="my-[3px] ml-[4px] mr-[9px] block h-[41px] w-[41px]"
                        src={cdn(
                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691839362712_Group 633534 (1).svg',
                        )}
                        alt=""
                    />
                    <IconLogoLedger symbol={symbol} />
                    <div className="w-[120px] pr-[17px] font-inter-medium text-[18px] text-black">
                        {floorPrice && token ? (
                            <ShowNumber
                                value={{
                                    value: exponentNumber(floorPrice, -Number(token.decimals)),
                                    thousand: { symbol: ['M', 'K'] },
                                }}
                                className="text-[18px]"
                            />
                        ) : (
                            '--'
                        )}{' '}
                        {token?.symbol ?? 'ICP'}
                    </div>
                </div>
                <div className="font-inter-normal ml-[9px] text-[12px] text-symbol">
                    Reserve price
                </div>
            </div>
            {/* 手机端 */}
            <div
                className="mb-[7px] mt-[20px] flex h-[59px] w-full items-center rounded-[100px] md:hidden"
                style={{
                    background: 'linear-gradient(52deg, #FBFBFB 0%, #F0F5F5 100%)',
                }}
            >
                <div className="ml-[6px] flex items-center rounded-[24px] bg-white">
                    <img
                        className="my-[3px] ml-[4px] mr-[9px] block h-[41px] w-[41px]"
                        src={cdn(
                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691839362707_Group 633534.svg',
                        )}
                        alt=""
                    />
                    <IconLogoLedger symbol={symbol} className="mr-[3px] block h-[16px] w-[16px]" />
                    <div className="w-[120px] pr-[17px] font-inter-medium text-[18px] text-black">
                        {startPrice && token ? (
                            <ShowNumber
                                value={{
                                    value: exponentNumber(startPrice, -Number(token.decimals)),
                                    thousand: { symbol: ['M'] },
                                }}
                                className="text-[18px]"
                            />
                        ) : (
                            '--'
                        )}{' '}
                        {token?.symbol ?? 'ICP'}
                    </div>
                </div>
                <div className="font-inter-normal ml-[6px] mr-[28px] text-[12px] text-symbol">
                    Initial Price
                </div>
            </div>
            {/* 手机端 */}
            <div
                className="flex h-[59px] w-full items-center rounded-[100px] md:hidden"
                style={{
                    background: 'linear-gradient(52deg, #FBFBFB 0%, #F0F5F5 100%)',
                }}
            >
                <div className="ml-[6px] flex items-center rounded-[24px] bg-white">
                    <img
                        className="my-[3px] ml-[4px] mr-[9px] block h-[41px] w-[41px]"
                        src={cdn(
                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691839362712_Group 633534 (1).svg',
                        )}
                        alt=""
                    />
                    <IconLogoLedger symbol={symbol} className="mr-[3px] block h-[16px] w-[16px]" />
                    <div className="w-[120px] pr-[17px] font-inter-medium text-[18px] text-black">
                        {floorPrice && token ? (
                            <ShowNumber
                                value={{
                                    value: exponentNumber(floorPrice, -Number(token.decimals)),
                                    thousand: { symbol: ['M', 'K'] },
                                }}
                                className="text-[18px] "
                            />
                        ) : (
                            '--'
                        )}{' '}
                        {token?.symbol ?? 'ICP'}
                    </div>
                </div>
                <div className="font-inter-normal ml-[9px] text-[12px] text-symbol">
                    Reserve price
                </div>
            </div>

            {/* 预出价弹窗 */}
            {buyModal && (
                <ShikuLandsNftBuyModal
                    open={buyModal}
                    setOpen={setBuyModal}
                    name={name}
                    token={token}
                    price={price}
                    card={card}
                    listing={listing}
                    refreshAll={refreshAll}
                />
            )}
            {/* 预出价弹窗 */}
            {bidModal && (
                <ShikuLandsNftBidModal
                    open={bidModal}
                    setOpen={setBidModal}
                    name={name}
                    token={token}
                    currentPrice={price}
                    floorPrice={floorPrice}
                    reducePrice={reducePrice}
                    card={card}
                    listing={listing}
                    refreshHighest={refreshHighest}
                />
            )}
            {/* 联系我们弹窗 */}
            <ShikuLandsNftContactUsModal open={contactUsModal} setOpen={setContactUsModal} />
        </>
    );
}

export default ShikuLandsNftAuctioning;
