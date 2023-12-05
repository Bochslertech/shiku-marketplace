import { useCallback, useEffect, useRef, useState } from 'react';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';
import { Skeleton, Tooltip } from 'antd';
import { NftListingData } from '@/01_types/listing';
import { NftIdentifier, NftMetadata } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { exponentNumber } from '@/02_common/data/numbers';
import { principal2account } from '@/02_common/ic/account';
import { uniqueKey } from '@/02_common/nft/identifier';
import { OrigynArtCollectionData } from '@/03_canisters/yumi/yumi_origyn_art';
import { queryCollectionInfoByOgy } from '@/05_utils/canisters/nft/ogy';
import { getThumbnailByNftMetadata } from '@/05_utils/nft/metadata';
import { useDeviceStore } from '@/07_stores/device';
import { useIdentityStore } from '@/07_stores/identity';
import { useBuyNft } from '@/08_hooks/exchange/single/buy';
import { useHoldNft } from '@/08_hooks/exchange/single/hold';
import { useSellNftByTransaction } from '@/08_hooks/exchange/single/sell';
import ShowNumber from '@/09_components/data/number';
import { IconLogoLedgerIcp } from '@/09_components/icons';
import OrigynArtBuyModal from '@/09_components/nft-card/components/buy/origyn-art';
import HoldButton from '@/09_components/nft-card/functions/hold';
import SellButton from '@/09_components/nft-card/functions/sell';
import { UserAvatarByNavigate } from '@/09_components/user/avatar';
import Username from '@/09_components/user/username';
import { unwrapCoordinateData } from '../coordinate';
import './index.less';

type Cross = {
    id: string; // token id string
    token_id: NftIdentifier;
    width: number; //每个地块的大小
    height: number;
    x: number; // 每个地块在图片中的坐标
    y: number;
    listed?: boolean; // 是否已经上架
    price: string;
    owner: string; // 地块的owner  id
};
// !TODO 骨架屏
const OrigynArtDetailMap = ({
    collectionData,
    cards,
}: {
    collectionData: OrigynArtCollectionData | undefined;
    cards: NftMetadata[] | undefined;
}) => {
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);

    // identity
    const collectionMetadata = collectionData?.metadata;
    const identity = useIdentityStore((s) => s.connectedIdentity);
    const principal = identity?.principal;
    // 集合信息
    const [collectionInfo, setCollectionInfo] = useState<{ total_supply?: string } | undefined>(
        undefined,
    );
    console.debug('🚀 ~ file: map.tsx:46 ~ OrigynArtDetailMap ~ collectionInfo:', collectionInfo);
    // 更新状态
    const [flag, setFlag] = useState(0);
    const onUpdated = () => setFlag((flag) => flag + 1);
    useEffect(() => {
        if (collectionData === undefined) return;
        queryCollectionInfoByOgy(collectionData.collection).then(setCollectionInfo);
    }, [collectionData, flag]);

    // 获取集合的所有 NFT 信息
    // 选中的token id
    const [selected, setSelected] = useState('');
    // 选中的信息
    const [selectedInfo, setSelectedInfo] = useState<{
        owner?: string; // 地块的owner
        percentX: [string, string];
        percentY: [string, string];
        qrCode: string;
        price: string;
        listed: boolean;
    }>();
    // 所有地块所需信息list
    const [cross, setCross] = useState<Cross[] | []>([]);
    const [expanded, setExpanded] = useState(false);

    const leftImage = useRef<HTMLImageElement>(null);
    const coord_map = useRef<HTMLDivElement>(null);
    const pinchRef = useRef<QuickPinchZoom>(null);
    // 使用单个nft card 和listing
    const selectedCard =
        cards && cards.find((item) => item.metadata.token_id.token_identifier === selected);
    // 购买
    const { buy, action: buyAction } = useBuyNft();
    const [buyNft, setBuyNft] = useState<
        { card: NftMetadata; listing: NftListingData } | undefined
    >(undefined);

    const onBuy = () => {
        if (selectedCard === undefined || selectedCard.listing === undefined) return;
        setBuyNft({ card: selectedCard, listing: selectedCard.listing });
    };
    const onCleanBuyNft = () => setBuyNft(undefined);

    //
    const { sell, executing } = useSellNftByTransaction(); // 也许需要销售状态来判断显示
    const { hold, action: holdingAction } = useHoldNft(); // 也许需要取消状态来判断显示
    // 左侧图片是否在loading
    const [coverImageLoading, setImageLoading] = useState(true);
    const onLoad = () => {
        setImageLoading(false);
    };
    // 获取图标地块的坐标
    useEffect(() => {
        const cross: Cross[] = [];
        // 图片加载成功且cards存在时采取计算
        if (coverImageLoading || !cards) {
            return;
        }
        // 默认选择第一个有价格的地块
        const findInfo = cards?.find((item) => item.listing?.listing.type === 'listing');
        if (findInfo && findInfo.listing?.raw) {
            const coordinate = unwrapCoordinateData(
                findInfo.owner.token_id.collection,
                JSON.parse(findInfo.listing?.raw).metadata,
            );

            if (coordinate) {
                // 获取单位坐标
                const {
                    x_coordinate_start,
                    x_coordinate_end,
                    y_coordinate_start,
                    y_coordinate_end,
                } = coordinate;

                setSelected(findInfo.metadata.token_id.token_identifier);
                setSelectedInfo({
                    percentX: [
                        `${(x_coordinate_start * 100).toFixed(1)}`,
                        `${(x_coordinate_end * 100).toFixed(1)}`,
                    ],
                    percentY: [
                        `${(y_coordinate_start * 100).toFixed(1)}`,
                        `${(y_coordinate_end * 100).toFixed(1)}`,
                    ],
                    owner: findInfo?.owner.owner,
                    qrCode: getThumbnailByNftMetadata(findInfo),
                    listed: findInfo.listing?.listing.type === 'listing',
                    price:
                        findInfo.listing?.listing.type === 'listing'
                            ? findInfo.listing?.listing.price
                            : '',
                });
            }
        }

        for (let i = 0; i < cards.length; i++) {
            const item = cards[i];

            // 如果metadata不存在则跳过
            if (!item.listing?.raw) {
                continue;
            }

            const coordinate = unwrapCoordinateData(
                item.owner.token_id.collection,
                JSON.parse(item.listing?.raw).metadata,
            );

            // 如果计算不出则跳过
            if (!coordinate) {
                continue;
            }
            // 获取单位坐标
            const { x_coordinate_start, x_coordinate_end, y_coordinate_start, y_coordinate_end } =
                coordinate;

            // 如果图片为加载出来则跳过
            if (!leftImage.current) {
                continue;
            }
            // 计算大小和位置
            const width = (x_coordinate_end - x_coordinate_start) * leftImage.current.clientWidth;
            const height = (y_coordinate_end - y_coordinate_start) * leftImage.current.clientHeight;
            const x = x_coordinate_start * leftImage.current.clientWidth;
            const y = y_coordinate_start * leftImage.current.clientHeight;

            // push
            cross.push({
                id: item.metadata.token_id.token_identifier,
                token_id: item.metadata.token_id,
                width,
                height,
                x,
                y,
                listed: item.listing?.listing.type === 'listing',
                price:
                    item.listing?.listing.type === 'listing' && item.listing?.listing.price
                        ? item.listing?.listing.price
                        : '',
                owner: item.owner.owner,
            });
        }
        // 更新状态
        setCross(cross);
    }, [cards, coverImageLoading]);

    const onUpdate = useCallback(({ x, y, scale }) => {
        const { current: div } = coord_map;
        if (div) {
            const value = make3dTransformValue({ x, y, scale });
            div.style.setProperty('transform', value);
        }
    }, []);

    const [curScale, setCurScale] = useState<number>(1);

    const onScaleClick = (scale) => {
        const { current } = leftImage;
        if (!current) {
            return;
        }
        let nowScale = curScale * scale;
        //如果 nowScale<1则不缩小
        nowScale = nowScale < 1 ? 1 : nowScale;
        pinchRef.current?.scaleTo({
            x: current.clientWidth / 2,
            y: current.clientHeight / 2,
            scale: nowScale,
        });
        setCurScale(nowScale);
    };

    //  选择地图中的地块
    const onImageClick = (e) => {
        setSelected(e.target.id);

        const findInfo = cards?.find(
            (item) => item.metadata.token_id.token_identifier === e.target.id,
        );
        // 如果没有找到则跳过
        if (!findInfo || !findInfo.listing) {
            return;
        }
        const coordinate = unwrapCoordinateData(
            findInfo.owner.token_id.collection,
            JSON.parse(findInfo.listing?.raw).metadata,
        );
        if (!coordinate) {
            return;
        }
        // 获取单位坐标
        const { x_coordinate_start, x_coordinate_end, y_coordinate_start, y_coordinate_end } =
            coordinate;

        setSelectedInfo({
            percentX: [
                `${(x_coordinate_start * 100).toFixed(1)}`,
                `${(x_coordinate_end * 100).toFixed(1)}`,
            ],
            percentY: [
                `${(y_coordinate_start * 100).toFixed(1)}`,
                `${(y_coordinate_end * 100).toFixed(1)}`,
            ],
            owner: findInfo?.owner.owner,
            qrCode: getThumbnailByNftMetadata(findInfo),
            listed: findInfo.listing?.listing.type === 'listing',
            price:
                findInfo.listing?.listing.type === 'listing' ? findInfo.listing?.listing.price : '',
        });
        if (box) box.style.setProperty('bottom', '-260px');
    };

    const box = document.getElementById('mobile-ogy-map-box');

    let touchStartPos;
    let boxStartPos = -260;
    let distance = 0;

    const dragStart = (e) => {
        if (box) {
            touchStartPos = e.touches[0].pageY;
            boxStartPos = parseInt(box.style.getPropertyValue('bottom'));
            if (isNaN(boxStartPos)) boxStartPos = -260;
        }
    };

    const drag = (e) => {
        distance = touchStartPos - e.touches[0].pageY;
        if (box) {
            box.style.setProperty('bottom', distance + boxStartPos + 'px');
        }
    };
    const dragEnd = () => {
        if (Math.abs(distance) <= 10) return;
        if (box) {
            if (distance > 0) {
                box.style.setProperty('bottom', '54px');
            } else if (boxStartPos == -260) {
                box.style.setProperty('bottom', '-400px');
            } else {
                box.style.setProperty('bottom', '-260px');
            }
        }
    };
    return (
        <div className="origyn-art-detail-map mt-[20px]">
            <div id="left-image" className="image">
                <QuickPinchZoom enabled={true} onUpdate={onUpdate} ref={pinchRef}>
                    <div ref={coord_map} className="zoom-container">
                        <img
                            className={cn('hidden', !coverImageLoading && 'block')}
                            src={collectionMetadata?.coverImage}
                            onLoad={onLoad}
                            ref={leftImage}
                        />
                        {coverImageLoading && (
                            <Skeleton.Image
                                className={cn(
                                    'block !h-[722px] !w-[337.797px] !min-w-0',
                                    !coverImageLoading && 'hidden',
                                )}
                            />
                        )}
                        <div id="coordinate" className="coordinate">
                            {cross.length !== 0 &&
                                cross.map((item: Cross, index) => (
                                    <Tooltip
                                        key={uniqueKey(item.token_id) + index}
                                        color={'#292929'}
                                        title={
                                            item.listed && (
                                                <div className="tool-tip">
                                                    <div className="tool-tip-status">
                                                        <div className="tool-tip-status-icon"></div>
                                                        <div className="tool-tip-status-text">
                                                            LISTED
                                                        </div>
                                                    </div>
                                                    <div className="tool-tip-number-id">
                                                        Fraction #{index + 1}
                                                    </div>
                                                    <div className="tool-tip-price mt-[3px]">
                                                        <img
                                                            src={cdn(
                                                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/icon_icp.png',
                                                            )}
                                                        />
                                                        <ShowNumber
                                                            value={{
                                                                value: exponentNumber(
                                                                    item?.price.toString() || '',
                                                                    -8,
                                                                ),
                                                                thousand: { symbol: ['M', 'K'] },
                                                                scale: 2,
                                                            }}
                                                            className="text-[14px] leading-[20px] md:leading-[20px]"
                                                        />
                                                        <span>&nbsp;ICP</span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        getPopupContainer={() =>
                                            document.getElementById('left-image') as HTMLElement
                                        }
                                        placement="top"
                                        autoAdjustOverflow={false}
                                        trigger={
                                            item.owner !== principal ? ['hover'] : []
                                            // &&
                                            // appType !== 'mobile'
                                            //     ? ['hover']
                                            //     : []
                                        }
                                    >
                                        <div
                                            id={item.id}
                                            className={cn(
                                                'part  border-[0.5px]  border-[#a0a0a0]',

                                                item.listed && ' border-[2px] border-[#34B479]',
                                                principal &&
                                                    item.owner === principal2account(principal) &&
                                                    '!border-[#ea4c89]',
                                                selected === item.id &&
                                                    'border-[2px] border-[#fffff]',
                                            )}
                                            style={{
                                                width: item.width,
                                                height: item.height,
                                                top: item.y,
                                                left: item.x,
                                            }}
                                            onClick={onImageClick}
                                        ></div>
                                    </Tooltip>
                                ))}
                        </div>
                    </div>
                </QuickPinchZoom>
                <div
                    className="image-legend"
                    style={expanded ? { bottom: '24px' } : {}}
                    onClick={() => setExpanded(!expanded)}
                >
                    <Tooltip
                        color="#292929"
                        title={
                            <div>
                                <div className="listed">Listed</div>
                                <div className="owned">Owned</div>
                                <div className="non-listed">Non-Listed</div>
                            </div>
                        }
                        getPopupContainer={() =>
                            document.getElementById('left-image') as HTMLElement
                        }
                        showArrow={false}
                        placement="bottomLeft"
                        open={isMobile ? expanded : false}
                    >
                        <div
                            className="arrow"
                            style={
                                expanded ? { transform: 'rotate(225deg) translateX(-2px) ' } : {}
                            }
                        ></div>
                        LEGEND
                    </Tooltip>
                </div>
                {expanded ? (
                    <div className="image-legend-detail">
                        <div className="listed">Listed</div>
                        <div className="owned">Owned</div>
                        <div className="non-listed">Non-Listed</div>
                    </div>
                ) : null}
                <div className="control-component">
                    <div className="zoom-in" onClick={() => onScaleClick(1.5)}></div>
                    <div className="zoom-out" onClick={() => onScaleClick(0.6)}></div>
                </div>
            </div>
            {/* pc端ui */}
            <div className="hidden w-full md:block md:w-auto md:overflow-auto">
                <div className={cn('option !px-0 md:!px-[40px]')}>
                    <div className="title">
                        {collectionMetadata?.name ? (
                            collectionMetadata?.name
                        ) : (
                            <Skeleton.Input className="!h-full !w-full !min-w-0" />
                        )}
                    </div>
                    <div className="author">
                        {collectionMetadata?.artAuthor}
                        <div className="author-birth">
                            {collectionMetadata?.authorBirth ? (
                                '(' + collectionMetadata?.authorBirth + ')'
                            ) : (
                                <Skeleton.Input className="!h-full !w-full !min-w-0" />
                            )}
                        </div>
                    </div>
                    <div className="selected-text">Selected fraction</div>
                    <div className="selected-box">
                        {selectedInfo?.listed ? (
                            <div className="status">Listed</div>
                        ) : (
                            <div className="status" style={{ backgroundColor: '#a0a0a0' }}>
                                <span>Non-Listed</span>
                            </div>
                        )}
                        <div className="token-id">{selected}</div>
                        <div className="coord-and-image">
                            <div className="left-info">
                                <div className="user-info">
                                    <div className="mr-[10px] w-[24px] flex-shrink-0 rounded-full">
                                        <UserAvatarByNavigate
                                            principal_or_account={selectedInfo?.owner}
                                            className="rounded-full"
                                        />
                                    </div>
                                    <Username principal_or_account={selectedInfo?.owner} />
                                </div>
                                <div className="coord-data">
                                    <div className="coord-data-item">
                                        <div className="coord-data-item-title">X</div>
                                        <div className="coord-data-item-content">
                                            {selectedInfo?.percentX[0]}% ~{' '}
                                            {selectedInfo?.percentX[1]}%
                                        </div>
                                    </div>
                                    <div className="coord-data-item">
                                        <div className="coord-data-item-title">Y</div>
                                        <div className="coord-data-item-content">
                                            {selectedInfo?.percentY[0]}% ~{' '}
                                            {selectedInfo?.percentY[1]}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="right-qr">
                                <img src={cdn(selectedInfo?.qrCode)} />
                                <div className="scan">SCAN TO SEE DETAILS</div>
                            </div>
                        </div>
                        <div
                            className={cn(
                                'buy-box hidden',
                                (selectedInfo?.listed || selectedInfo?.owner === principal) &&
                                    'block',
                            )}
                        >
                            <div className={cn('price hidden', selectedInfo?.listed && 'block')}>
                                <IconLogoLedgerIcp />
                                <ShowNumber
                                    value={{
                                        value: exponentNumber(
                                            selectedInfo?.price.toString() || '',
                                            -8,
                                        ),
                                        thousand: { symbol: ['M', 'K'] },
                                        scale: 2,
                                    }}
                                    className="text-[26px] leading-[26px] md:leading-[26px]"
                                />
                                <span>&nbsp;ICP</span>
                            </div>
                            {selectedInfo?.owner === principal && selectedInfo?.listed && (
                                <div className={'buy-btn relative'}>
                                    Cancel listing
                                    {selectedCard && (
                                        <HoldButton
                                            className="absolute bottom-0 left-0 right-0 top-0 text-center  leading-[33px]  text-black opacity-0"
                                            card={selectedCard}
                                            listing={selectedCard.listing}
                                            identity={identity}
                                            hold={hold}
                                            action={holdingAction}
                                            refreshListing={onUpdated}
                                        />
                                    )}
                                </div>
                            )}
                            {selectedInfo?.owner === principal && !selectedInfo?.listed && (
                                <div className={'buy-btn relative'}>
                                    List for sale
                                    {selectedCard && (
                                        <SellButton
                                            className="absolute bottom-0 left-0 right-0 top-0 text-center  leading-[33px]  text-black opacity-0"
                                            card={selectedCard}
                                            listing={selectedCard.listing}
                                            holdingAction={holdingAction}
                                            identity={identity}
                                            sell={sell}
                                            executing={executing}
                                            refreshListing={onUpdated}
                                        />
                                    )}
                                </div>
                            )}
                            {selectedInfo?.owner !== principal && selectedInfo?.listed && (
                                <div
                                    className={'buy-btn'}
                                    onClick={() => {
                                        onBuy();
                                    }}
                                >
                                    Buy now
                                </div>
                            )}
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
                </div>
            </div>
            {/* mobile端ui */}
            <div
                className="mobile-buy-box block md:hidden"
                onTouchMove={drag}
                id="mobile-ogy-map-box"
                onTouchStart={dragStart}
                onTouchEnd={dragEnd}
            >
                <div className="drag-bar"></div>
                <div className="selected-box">
                    <div className="token-id">{selected}</div>
                    <div className="user-info">
                        <div className="mr-[10px] w-[24px] flex-shrink-0 rounded-full">
                            <UserAvatarByNavigate
                                principal_or_account={selectedInfo?.owner}
                                className="rounded-full"
                            />
                        </div>
                        <Username principal_or_account={selectedInfo?.owner} />
                    </div>
                    {selectedInfo?.listed ? (
                        <div className="mt-[10px] flex items-center gap-x-[10px]">
                            <div className="status !mt-0 w-fit rounded-full bg-[#34b479] px-[10px]">
                                Listed
                            </div>
                            <div
                                className={cn(
                                    'price  hidden h-fit rounded-full bg-[#434343] px-[10px] text-white  ',
                                    selectedInfo?.listed && 'flex items-center',
                                )}
                            >
                                <IconLogoLedgerIcp />
                                <ShowNumber
                                    value={{
                                        value: exponentNumber(
                                            selectedInfo?.price.toString() || '',
                                            -8,
                                        ),
                                        thousand: { symbol: ['M', 'K'] },
                                        scale: 2,
                                    }}
                                    className="ml-[5px] text-[16px] leading-[16px]"
                                />
                                <span className=" font-inter-semibold ">&nbsp;ICP</span>
                            </div>
                        </div>
                    ) : (
                        <div className="status w-fit rounded-full bg-[#a0a0a0] px-[10px]">
                            <span>Non-Listed</span>
                        </div>
                    )}
                    <div className="coord-and-image">
                        <div className="left-info">
                            <div className="coord-data">
                                <div className="title">COORDINATES</div>
                                <div className="coord-data-item">
                                    <div className="coord-data-item-title">X</div>
                                    <div className="coord-data-item-content">
                                        {selectedInfo?.percentX[0]}% ~ {selectedInfo?.percentX[1]}%
                                    </div>
                                </div>
                                <div className="coord-data-item">
                                    <div className="coord-data-item-title">Y</div>
                                    <div className="coord-data-item-content">
                                        {selectedInfo?.percentY[0]}% ~ {selectedInfo?.percentY[1]}%
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="right-qr" onClick={() => window.open(selectedInfo?.qrCode)}>
                            <img src={selectedInfo?.qrCode} id="qr-image" />
                            <div className="scan">CLICK TO OPEN</div>
                        </div>
                    </div>
                    <div
                        className={cn(
                            'buy-box hidden',
                            (selectedInfo?.listed || selectedInfo?.owner === principal) && 'block',
                        )}
                    >
                        {selectedInfo?.owner === principal && selectedInfo?.listed && (
                            <div className={'buy-btn relative'}>
                                Cancel listing
                                {selectedCard && (
                                    <HoldButton
                                        className="absolute bottom-0 left-0 right-0 top-0 text-center  leading-[33px]  text-black opacity-0"
                                        card={selectedCard}
                                        listing={selectedCard.listing}
                                        identity={identity}
                                        hold={hold}
                                        action={holdingAction}
                                        refreshListing={onUpdated}
                                    />
                                )}
                            </div>
                        )}
                        {selectedInfo?.owner === principal && !selectedInfo?.listed && (
                            <div className={'buy-btn relative'}>
                                List for sale
                                {selectedCard && (
                                    <SellButton
                                        className="absolute bottom-0 left-0 right-0 top-0 text-center  leading-[33px]  text-black opacity-0"
                                        card={selectedCard}
                                        listing={selectedCard.listing}
                                        holdingAction={holdingAction}
                                        identity={identity}
                                        sell={sell}
                                        executing={executing}
                                        refreshListing={onUpdated}
                                    />
                                )}
                            </div>
                        )}
                        {selectedInfo?.owner !== principal && selectedInfo?.listed && (
                            <div
                                className={'buy-btn'}
                                onClick={() => {
                                    onBuy();
                                }}
                            >
                                Buy now
                            </div>
                        )}
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
            </div>
        </div>
    );
};

export default OrigynArtDetailMap;
//
