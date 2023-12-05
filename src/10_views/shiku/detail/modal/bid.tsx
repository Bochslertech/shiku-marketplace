import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Checkbox, message, Modal } from 'antd';
import { NftListingData } from '@/01_types/listing';
import { TokenInfo } from '@/01_types/nft';
import { NftMetadata } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import { exponentNumber } from '@/02_common/data/numbers';
import { alreadyMessaged } from '@/02_common/data/promise';
import { useBidShikuNft } from '@/08_hooks/exchange/single/bid-shiku';
import TokenPrice from '@/09_components/data/price';
import { IconLogoLedger } from '@/09_components/icons';

const wrapBigInt = (value: string, decimals: number): bigint =>
    BigInt(exponentNumber(value, decimals));

const unwrapBigInt = (value: bigint, decimals: number): string =>
    exponentNumber(`${value}`, -decimals);

function ShikuLandsNftBidModal({
    open,
    setOpen,
    name,
    token,
    currentPrice,
    floorPrice,
    reducePrice,
    card,
    listing,
    refreshHighest,
}: {
    open: boolean;
    setOpen: (o: boolean) => void;
    name: string | undefined;
    token: TokenInfo | undefined;
    currentPrice: string | undefined;
    floorPrice: string | undefined;
    reducePrice: string | undefined;
    card: NftMetadata | undefined;
    listing: NftListingData | undefined;
    refreshHighest: () => void;
}) {
    const [loading, setLoading] = useState(false);

    const decimals = token ? Number(token.decimals) + 4 : undefined;

    const current = decimals && currentPrice ? exponentNumber(currentPrice, -decimals) : undefined;
    const floor = decimals && floorPrice ? exponentNumber(floorPrice, -decimals) : undefined;
    const reduce = decimals && reducePrice ? exponentNumber(reducePrice, -decimals) : undefined;

    const [value, setValue] = useState(current ?? '');

    const onValueChanged = ({ target: { value } }) => {
        if (!decimals || !current || !floor || !reduce) return;
        try {
            parseFloat(value);
        } catch {
            message.error(`wrong number`);
            setValue(current);
            return;
        }
        if (wrapBigInt(value, decimals) < wrapBigInt(floor, decimals)) {
            message.error(`too small`);
            setValue(floor);
            return;
        }
        if (wrapBigInt(current, decimals) < wrapBigInt(value, decimals)) {
            message.error(`too big`);
            setValue(current);
            return;
        }
        let c = floor;
        do {
            if (c === value) {
                setValue(value);
                return;
            }
            c = `${unwrapBigInt(wrapBigInt(c, decimals) + wrapBigInt(reduce, decimals), decimals)}`;
        } while (wrapBigInt(c, decimals) <= wrapBigInt(current, decimals));
        message.error(`wrong number`);
        setValue(current);
        return;
    };

    const onDecrement = () => {
        if (!decimals || !current || !floor || !reduce) return;
        const next = `${unwrapBigInt(
            wrapBigInt(value, decimals) - wrapBigInt(reduce, decimals),
            decimals,
        )}`;
        setValue(wrapBigInt(next, decimals) < wrapBigInt(floor, decimals) ? floor : next);
    };

    const onIncrement = () => {
        if (!decimals || !current || !floor || !reduce) return;
        const next = `${unwrapBigInt(
            wrapBigInt(value, decimals) + wrapBigInt(reduce, decimals),
            decimals,
        )}`;
        setValue(wrapBigInt(current, decimals) < wrapBigInt(next, decimals) ? current : next);
    };

    const [accept, setAccept] = useState(false);
    const onAcceptChange = ({ target: { checked } }) => setAccept(checked);

    // 出价
    const {
        bid,
        // action: bidAction
    } = useBidShikuNft(); // 也许需要取消状态来判断显示

    const onSubmit = () => {
        if (!accept) return message.error('please accept term and conditions');
        if (card && token && value && listing) {
            if (listing.listing.type === 'dutch') {
                // 进行出价
                setLoading(true);
                bid(
                    card.owner.token_id,
                    card.owner.owner,
                    token,
                    exponentNumber(value, Number(token.decimals) + 4),
                    listing.listing.auction.time.end,
                )
                    .then(alreadyMessaged)
                    .then(() => {
                        message.success('Bid successful.');
                        refreshHighest();
                        setOpen(false);
                    })
                    .finally(() => setLoading(false));
            }
        }
    };
    return (
        <Modal
            footer={null}
            centered={true}
            open={open}
            className="w-full md:!w-[672px]"
            onCancel={() => setOpen(false)}
        >
            <div className="m-auto hidden h-[124px] w-[124px] flex-shrink-0 translate-y-[-65px] items-center justify-center rounded-[50%] bg-white drop-shadow-[8px_8px_15px_rgba(0,0,0,0.15)] md:flex">
                <img
                    className="h-[116px] w-[116px] rounded-[50%]"
                    src={cdn(
                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691906508356_shiku_twitter_logo_v2 1.png',
                    )}
                    alt=""
                />
            </div>
            <div className="flex items-center font-inter-medium text-[30px] text-[#151515] md:font-inter-semibold md:text-[26px] md:text-black">
                Planet Earth &nbsp;<span className="hidden md:block">{name}</span>
            </div>
            <div className="mt-[8px] font-inter-black text-[24px] text-black md:hidden">#001</div>
            <div className="mt-[22px] h-[298px] rounded-[29px]  border border-solid border-[#F6F6F6] bg-white px-[16px] pb-[23px] pt-[13px] md:mt-[20px] md:flex md:h-[75px]  md:flex-wrap md:items-center md:justify-between md:pb-0 md:pt-0">
                <div
                    onClick={onDecrement}
                    className="h-[44px] w-full cursor-pointer  rounded-[7px] bg-[#F4F6F8] text-center font-inter-extrabold text-[24px] leading-[44px] text-[#003541] md:w-[44px]"
                >
                    -
                </div>
                <div className="mt-[55px] md:mt-0">
                    <div className="font-inter-normal flex items-center justify-center text-[36px] text-[#003541] md:text-[24px]">
                        <IconLogoLedger
                            symbol={token?.symbol}
                            className="mr-[5px] block h-[25px] w-[25px] md:hidden"
                        />
                        <input
                            className="mr-[5px] h-[37px] w-[69px] rounded-[10px] bg-[#F0F5F5] text-center font-inter-semibold text-[24px] text-black"
                            type="text"
                            value={value}
                            onChange={onValueChanged}
                        />
                        {token?.symbol ?? 'ICP'}/m²
                    </div>
                    <div className="font-inter-normal mt-[6px] text-center text-[18px] text-[#003541] md:mt-0 md:text-[14px]">
                        x10,000m²=
                        <span className="font-inter-extrabold text-[#003541]">
                            <TokenPrice
                                value={{
                                    value: value ? exponentNumber(value, 4) : undefined,
                                }}
                                className="text-[16px]"
                            />{' '}
                            {token?.symbol ?? 'ICP'}
                        </span>
                    </div>
                </div>
                <div
                    onClick={onIncrement}
                    className="mt-[50px] h-[44px] w-full cursor-pointer rounded-[7px] bg-[#F4F6F8] text-center font-inter-extrabold text-[24px] leading-[44px] text-[#003541] md:mt-0 md:w-[44px]"
                >
                    +
                </div>
            </div>
            <div className="mb-[33px] mt-[35px] hidden h-[1px] w-[600px] bg-[#F6F6F6] md:block"></div>
            <div
                className="hidden h-[105px] w-[607px] rounded-[30px] pt-[24px] md:block"
                style={{
                    background: 'linear-gradient(52deg, #FBFBFB 0%, #F0F5F5 100%)',
                }}
            >
                <div className="m-auto w-[516px] font-inter-medium text-[14px] text-[#151515]">
                    Note: Thank you for participating in the auction! Please remember that each bid
                    you place is a binding commitment to the purchase. Once placed, bids cannot be
                    cancelled, but bid price can be increased
                </div>
            </div>
            <div className="mt-[16px] flex flex-col items-center justify-between md:flex-row ">
                <Checkbox onChange={onAcceptChange} checked={accept} className="shiku-checkbox">
                    <div className="flex items-center font-inter-light text-[14px] text-[#151515]">
                        I accept
                        <Link
                            to={`https://yuminftmarketplace.gitbook.io/yumi-docs/legal/shiku-metaverse-land-plots-nfts-purchase-terms`}
                            target="_blank"
                            className="ml-[4px] cursor-pointer underline"
                        >
                            term and conditions
                        </Link>
                    </div>
                </Checkbox>
                <Button
                    className="mt-[10px] !h-[61px] w-full !rounded-[8px] bg-[#0A0909] !p-0 text-center font-inter-semibold text-[16px] leading-[61px] text-white md:mt-0 md:!w-[190px]"
                    loading={loading}
                    onClick={onSubmit}
                >
                    Place a bid
                </Button>
            </div>
            {/* <Button
                className="font-inter-normal mb-[25px] mt-[26px] !h-[40px] !w-full !rounded-[8px] bg-[#151515] !p-0 text-center text-[16px] leading-[40px] text-white md:!hidden"
                loading={loading}
                onClick={onSubmit}
            >
                Place a bid
            </Button> */}
        </Modal>
    );
}

export default ShikuLandsNftBidModal;
