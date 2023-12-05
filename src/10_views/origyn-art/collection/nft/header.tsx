import { useMemo } from 'react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Skeleton } from 'antd';
import { NftListingData, NftListingListing } from '@/01_types/listing';
import { NftMetadata } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import { shrinkPrincipal } from '@/02_common/data/text';
import { unwrapVariant } from '@/02_common/types/variant';
import { OrigynArtCollectionData } from '@/03_canisters/yumi/yumi_origyn_art';
import { useIdentityStore } from '@/07_stores/identity';
import { useBuyNft } from '@/08_hooks/exchange/single/buy';
import { useHoldNft } from '@/08_hooks/exchange/single/hold';
import { useSellNftByTransaction } from '@/08_hooks/exchange/single/sell';
import { useShowBuyButton } from '@/08_hooks/nft/functions/buy';
import { useOrigynArtCollectionNftListingData } from '@/08_hooks/views/origyn-art';
import TokenPrice from '@/09_components/data/price';
import { IconLogoLedgerIcp } from '@/09_components/icons';
import OrigynArtBuyModal from '@/09_components/nft-card/components/buy/origyn-art';
import HoldButton from '@/09_components/nft-card/functions/hold';
import SellButton from '@/09_components/nft-card/functions/sell';
import AspectRatio from '@/09_components/ui/aspect-ratio';
import { Button } from '@/09_components/ui/button';
import YumiIcon from '@/09_components/ui/yumi-icon';
import { UserAvatarByNavigate } from '@/09_components/user/avatar';
import { unwrapCoordinateData } from '../coordinate';

function OrigynArtCollectionNftHeader({
    collectionData,
}: {
    collectionData: OrigynArtCollectionData | undefined;
}) {
    const { token_identifier } = useParams();

    const names = useMemo(() => {
        if (collectionData === undefined) return;
        return collectionData.metadata.name.split(',');
    }, [collectionData]);

    const [flag, setFlag] = useState(0);
    const onUpdated = () => setFlag((flag) => flag + 1);

    const { card, listing } = useOrigynArtCollectionNftListingData(
        collectionData?.collection,
        token_identifier,
        flag,
    );
    const identity = useIdentityStore((s) => s.connectedIdentity);
    const account = identity?.account;
    const preview =
        collectionData &&
        token_identifier &&
        `https://${collectionData.collection}.raw.ic0.app/-/${token_identifier}/preview`;

    // 坐标
    const coordinate = useMemo(() => {
        if (card === undefined || listing === undefined) return undefined;
        return unwrapCoordinateData(
            card.owner.token_id.collection,
            JSON.parse(listing.raw).metadata,
        );
    }, [card, listing]);

    const owner: string | undefined = useMemo(() => {
        if (card?.owner.raw.standard !== 'ogy') return undefined;
        const account = card.owner.raw.data.account;
        return unwrapVariant(account, 'principal');
    }, [card]);

    // 购买
    const showBuyButton = useShowBuyButton(card, listing);
    const { buy, action: buyAction } = useBuyNft();
    const [buyNft, setBuyNft] = useState<
        { card: NftMetadata; listing: NftListingData } | undefined
    >(undefined);
    const onBuy = () => {
        if (card === undefined || listing === undefined) return;
        setBuyNft({ card, listing });
    };
    const onCleanBuyNft = () => setBuyNft(undefined);
    // sell and cancel listing
    const { sell, executing } = useSellNftByTransaction();
    const { hold, action: holdingAction } = useHoldNft();

    const isListing = listing?.listing.type === 'listing';
    return (
        <div className="mb-[30px] w-full bg-gradient-to-b  from-gray-100  to-transparent font-montserrat md:mb-[95px] md:flex-row">
            <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-between p-[20px] md:flex-row md:py-[78px] md:pt-[65px] xl:px-[114px]">
                <div className="flex  w-full md:w-auto">
                    <div className="flex flex-col text-base md:gap-y-[19px]">
                        <div className="mb-[12px] flex w-full font-[Inter-Bold] text-[24px] font-bold italic leading-[30px] md:text-[36px] md:leading-[50px]">
                            <span>
                                {names ? (
                                    <>
                                        <span>{names[0]}</span>
                                        {','}
                                        {<span className="not-italic">{names[1]}</span>}
                                    </>
                                ) : (
                                    <>
                                        {' '}
                                        <Skeleton.Input className="!h-[60px] !w-[325px] min-w-0 md:!h-[200px] md:!w-[278px]" />
                                    </>
                                )}{' '}
                            </span>
                        </div>

                        <div className=" text-gray-900">
                            {collectionData?.metadata && (
                                <>
                                    {collectionData?.metadata.artAuthor}
                                    {collectionData?.metadata.authorBirth}
                                </>
                            )}
                            {!collectionData?.metadata && <Skeleton.Input className="" />}
                        </div>
                        <div className="flex flex-col gap-y-[10px]">
                            {collectionData?.metadata && (
                                <>
                                    <p>{collectionData?.metadata.artworkMedium} </p>
                                    <p className="font-semibold">
                                        {collectionData?.metadata.artworkSize}
                                    </p>
                                    <p>{collectionData?.metadata.authorProvenance}</p>
                                </>
                            )}
                            {!collectionData?.metadata && <Skeleton.Input className="!h-[92px]" />}
                        </div>
                    </div>
                </div>
                <div className="mt-[10px] flex h-[400px] w-full items-center justify-center p-[15px]  md:mt-0">
                    {collectionData ? (
                        <img
                            className="flex h-full"
                            src={collectionData.metadata.coverImage}
                            alt=""
                        />
                    ) : (
                        <Skeleton.Input className="mx-auto !h-[370px] !w-[184.34px]" />
                    )}
                </div>
                {/* pc端显示 */}
                <div className="hidden w-full flex-col md:mt-0 md:flex">
                    <div className="flex justify-between border-b border-t border-gray-300 px-[2px] py-[14px] text-[16px]">
                        <div className="">
                            <div className="">Price</div>
                            <div className="flex gap-x-[7px]">
                                <IconLogoLedgerIcp />
                                <div className="font-semibold">
                                    {isListing ? (
                                        <TokenPrice
                                            value={{
                                                value: (listing.listing as NftListingListing).price,
                                                token: (listing.listing as NftListingListing).token,
                                                symbol: '',
                                                scale: 2,
                                                paddingEnd: 2,
                                            }}
                                        />
                                    ) : (
                                        '--'
                                    )}{' '}
                                    ICP
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>Fraction ID</div>
                            <div>
                                <div className="font-semibold">{token_identifier}</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between gap-x-[19px] border-gray-300 px-[2px] py-[14px] text-[16px]">
                        <div className="w-1/5">
                            {preview ? (
                                <AspectRatio>
                                    <img src={cdn(preview)} alt="" />
                                </AspectRatio>
                            ) : (
                                <Skeleton.Input className="!h-[91px] !w-[91px] !min-w-0" />
                            )}
                        </div>

                        <div className="flex flex-1 flex-col justify-between text-[13px]">
                            <div>
                                This fraction represents a unique proof of ownership of the artwork.
                            </div>
                            <Link to={preview ?? ''} target="_blank" className="flex gap-x-[5px]">
                                <div className="font-semibold underline">View NFT on chain</div>
                                <div className="flex h-full items-center justify-center">
                                    <YumiIcon
                                        name="arrow-right-origyn"
                                        size={12}
                                        color="#636464"
                                        className="scale-y-[0.7]"
                                    />
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between gap-y-[10px] border-b border-t border-gray-300 px-[2px] py-[14px] text-[16px]">
                        <div className="">Coordinates</div>
                        {coordinate ? (
                            <div className="flex  justify-between">
                                <div className="flex">
                                    <div className="rounded-l-[8px] bg-gray-300 bg-opacity-30 p-[15px]">
                                        x
                                    </div>
                                    <div className="rounded-r-[8px] border border-l-0 p-[15px]">
                                        {coordinate.x_coordinate_start}% ~{' '}
                                        {coordinate.x_coordinate_end}%
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="rounded-l-[8px] bg-gray-300 bg-opacity-30 p-[15px]">
                                        y
                                    </div>
                                    <div className="rounded-r-[8px] border border-l-0 p-[15px]">
                                        {coordinate.y_coordinate_start}% ~{' '}
                                        {coordinate.y_coordinate_end}%
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex  justify-between">
                                <Skeleton.Input className="!h-[57px] !w-[152px]" />
                                <Skeleton.Input className="!h-[57px] !w-[152px]" />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-start gap-x-[17px] px-[2px] py-[14px]">
                        <div className="flex justify-between  gap-x-[10px]">
                            <div className="w-[40px]">
                                {owner ? (
                                    <UserAvatarByNavigate
                                        className="h-[25px] w-[25px] rounded-full md:h-[40px] md:w-[40px]"
                                        principal_or_account={owner}
                                    />
                                ) : (
                                    <img
                                        className="h-[25px] w-[25px] rounded-full md:h-[40px] md:w-[40px]"
                                        src={cdn(
                                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1671632010634_icon-origyn-user.svg',
                                        )}
                                        alt=""
                                    />
                                )}
                            </div>
                            <div className="flex flex-col justify-between">
                                <div className="text-[14px]">Owner</div>
                                <div className="font-inter-semibold text-[15px] ">
                                    {shrinkPrincipal(owner)}
                                </div>
                            </div>
                        </div>
                    </div>
                    {card?.owner.owner === account && isListing && (
                        <Button
                            className={
                                'relative mt-[15px] h-[50px] w-[320px] px-[50px] py-[15px] font-inter text-[15px]'
                            }
                        >
                            Cancel listing
                            {
                                <HoldButton
                                    className="absolute bottom-0 left-0 right-0 top-0 text-center  leading-[33px]  text-black opacity-0"
                                    card={card!}
                                    listing={listing}
                                    identity={identity}
                                    hold={hold}
                                    action={holdingAction}
                                    refreshListing={onUpdated}
                                />
                            }
                        </Button>
                    )}
                    {card?.owner.owner === account && !isListing && (
                        <Button
                            className={
                                'relative mt-[15px] h-[50px] w-[320px] px-[50px] py-[15px] font-inter text-[15px]'
                            }
                        >
                            List for sale
                            {
                                <SellButton
                                    className="absolute bottom-0 left-0 right-0 top-0 text-center  leading-[33px]  text-black opacity-0"
                                    card={card!}
                                    lastPrice={listing?.latest_price}
                                    listing={listing}
                                    holdingAction={holdingAction}
                                    identity={identity}
                                    sell={sell}
                                    executing={executing}
                                    refreshListing={onUpdated}
                                />
                            }
                        </Button>
                    )}
                    {showBuyButton && (
                        <Button
                            onClick={onBuy}
                            className="mt-[15px] h-[50px] w-[320px] px-[50px] py-[15px] font-inter text-[15px]"
                        >
                            Buy Now
                        </Button>
                    )}
                </div>
                {/* 手机端显示 */}
                <div className="flex w-full flex-col md:mt-0 md:hidden">
                    <div className="flex justify-center  border border-[#E5E5E5] bg-white  px-[2px] py-[14px] text-[16px]">
                        <div className="">
                            <div className="">Price</div>
                            <div className="flex gap-x-[7px]">
                                <IconLogoLedgerIcp />
                                <div className="font-semibold">
                                    {listing?.listing.type === 'listing' ? (
                                        <TokenPrice
                                            value={{
                                                value: listing.listing.price,
                                                token: listing.listing.token,
                                                symbol: '',
                                                scale: 2,
                                                paddingEnd: 2,
                                            }}
                                            className="text-[16px]"
                                        />
                                    ) : (
                                        '--'
                                    )}{' '}
                                    ICP
                                </div>
                            </div>
                        </div>
                    </div>
                    {showBuyButton && (
                        <Button
                            onClick={onBuy}
                            className="w-full rounded-none py-[15px] text-[15px] font-semibold"
                        >
                            Buy Now
                        </Button>
                    )}
                    {card?.owner.owner === account && isListing && (
                        <Button
                            className={
                                'relative w-full rounded-none py-[15px] text-[15px] font-semibold'
                            }
                        >
                            Cancel listing
                            {
                                <HoldButton
                                    className="absolute bottom-0 left-0 right-0 top-0 text-center  leading-[33px]  text-black opacity-0"
                                    card={card!}
                                    listing={listing}
                                    identity={identity}
                                    hold={hold}
                                    action={holdingAction}
                                    refreshListing={onUpdated}
                                />
                            }
                        </Button>
                    )}
                    {card?.owner.owner === account && !isListing && (
                        <Button
                            className={
                                'relative w-full rounded-none py-[15px] text-[15px] font-semibold'
                            }
                        >
                            List for sale
                            {
                                <SellButton
                                    className="absolute bottom-0 left-0 right-0 top-0 text-center  leading-[33px]  text-black opacity-0"
                                    card={card!}
                                    lastPrice={listing?.latest_price}
                                    listing={listing}
                                    holdingAction={holdingAction}
                                    identity={identity}
                                    sell={sell}
                                    executing={executing}
                                    refreshListing={onUpdated}
                                />
                            }
                        </Button>
                    )}
                    <div className="mt-[23px] grid w-full grid-cols-3 grid-rows-2 gap-[10px]">
                        <div className="rounded-[5px] border border-[#E5E5E5] bg-white p-[8px]">
                            <div className="text-[8px]">Artist</div>
                            <div className="text-[10px] font-semibold">
                                {collectionData?.metadata.artAuthor ?? (
                                    <Skeleton.Input className="!h-[18px] !w-full !min-w-0" />
                                )}
                            </div>
                            <div className="text-[10px]">
                                {collectionData?.metadata.authorBirth ?? (
                                    <Skeleton.Input className="!h-[18px] !w-full !min-w-0" />
                                )}
                            </div>
                        </div>
                        <div className="rounded-[5px] border border-[#E5E5E5] bg-white p-[8px]">
                            <div className="text-[8px]">Provenance</div>
                            <div className="text-[10px] font-semibold">
                                {collectionData?.metadata.authorProvenance ?? (
                                    <Skeleton.Input className="!h-[36px] !w-full !min-w-0" />
                                )}
                            </div>
                        </div>{' '}
                        <div className="rounded-[5px] border border-[#E5E5E5] bg-white p-[8px]">
                            <div className="line-clamp-2 text-[8px]">
                                {collectionData?.metadata.artworkMedium ?? (
                                    <Skeleton.Input className="!h-[18px] !w-full !min-w-0" />
                                )}
                            </div>
                            <div className="text-[8px] font-semibold">
                                {collectionData?.metadata.artworkSize ?? (
                                    <Skeleton.Input className="!h-[36px] !w-full !min-w-0" />
                                )}
                            </div>
                        </div>{' '}
                        <div className="rounded-[5px] border border-[#E5E5E5] bg-white p-[8px]">
                            <div className="text-[8px]">Owner</div>
                            {owner ? (
                                <div className="text-[10px] font-semibold">
                                    {shrinkPrincipal(owner)}
                                </div>
                            ) : (
                                <Skeleton.Input className="!h-[18px] !w-full !min-w-0" />
                            )}
                        </div>{' '}
                        <div className="col-span-2 flex items-center gap-x-[15px] p-[8px]">
                            <div className="w-[48px]">
                                {preview ? (
                                    <AspectRatio>
                                        <img src={cdn(preview)} alt="" />
                                    </AspectRatio>
                                ) : (
                                    <Skeleton.Input className="!h-[48px] !w-[48px] !min-w-0" />
                                )}
                            </div>

                            <div className="flex flex-1 flex-col justify-between text-[10px]">
                                <div>
                                    This fraction represents a unique proof of ownership of the
                                    artwork.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {buyNft && (
                <OrigynArtBuyModal
                    collectionData={collectionData}
                    card={buyNft.card}
                    listing={buyNft.listing}
                    buy={buy}
                    action={buyAction}
                    refreshListing={onUpdated}
                    onClose={onCleanBuyNft}
                />
            )}
        </div>
    );
}

export default OrigynArtCollectionNftHeader;
