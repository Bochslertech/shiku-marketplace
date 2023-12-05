import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { NftMetadata } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import { useDeviceStore } from '@/07_stores/device';
import AspectRatio from '@/09_components/ui/aspect-ratio';
import NftOption from './nft-option';

const LeftImage = ({
    card,
    refreshCard,
    refreshListing,
}: {
    card: NftMetadata | undefined;
    refreshCard: () => void;
    refreshListing: () => void;
}) => {
    const images: string[] | undefined = useMemo(() => {
        if (card === undefined) return undefined;
        const raw = card.metadata.raw.data;
        const json = JSON.parse(raw);
        return [json.preview, json.front, json.back];
    }, [card]);

    const properties: { name: string; value: string }[] | undefined = useMemo(() => {
        if (card === undefined) return undefined;
        const raw = card.metadata.raw.data;
        const json = JSON.parse(raw);
        const properties = JSON.parse(json.properties);
        return Object.keys(properties).map((name) => ({
            name,
            value: properties[name],
        }));
    }, [card]);

    const [bannerSwiper, setBannerSwiper] = useState<SwiperType | null>(null);
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);
    const [curBannerIndex, setCurBannerIndex] = useState(0);

    const tabs = useMemo(() => {
        return [
            {
                name: 'Description',
            },
            {
                name: 'Details',
            },
            {
                name: 'Properties',
            },
        ];
    }, []);

    const [selectTab, setSelectTab] = useState(tabs[0]);

    // 监听 banner 轮播
    const onSwiperChange = ({ realIndex }) => {
        setCurBannerIndex(realIndex);
    };

    // 切换 banner
    const changeSwiper = (index: number) => {
        bannerSwiper && bannerSwiper.slideToLoop(index, 200);
    };

    return (
        <div className="flex w-full flex-col items-center px-[15px] lg:w-[50%] lg:px-0">
            <div className="flex w-full flex-col items-center">
                <div className=" relative  w-full">
                    <AspectRatio>
                        {' '}
                        <Swiper
                            className=" absolute h-full w-full rounded-[16px] object-contain"
                            onInit={(ev) => {
                                setBannerSwiper(ev);
                            }}
                            grabCursor={false}
                            centeredSlides={true}
                            centeredSlidesBounds={true}
                            loop={true}
                            speed={50}
                            autoplay={true}
                            effect="coverflow"
                            onTransitionEnd={(e) => {
                                onSwiperChange(e);
                            }}
                        >
                            {images === undefined &&
                                Array(3)
                                    .fill('')
                                    .map((_, index) => (
                                        <SwiperSlide key={index}>
                                            {/* FIXME QKY 骨架图 */}
                                        </SwiperSlide>
                                    ))}
                            {images !== undefined &&
                                images.map((image) => (
                                    <SwiperSlide key={image}>
                                        <img
                                            className="absolute h-full w-full rounded-[16px] object-contain"
                                            src={cdn(image)}
                                            alt=""
                                        />
                                    </SwiperSlide>
                                ))}
                        </Swiper>
                    </AspectRatio>
                </div>
                <div className=" mt-[40px] flex w-full items-center justify-center">
                    {Array(3)
                        .fill('')
                        .map((_, index) => (
                            <div
                                key={index}
                                className={` mr-[30px] h-[8px] w-[8px] cursor-pointer rounded-[50%] ${
                                    curBannerIndex === index ? 'bg-[#000]' : 'bg-[#aaa]'
                                }`}
                                onClick={() => changeSwiper(index)}
                            />
                        ))}
                </div>
                {isMobile ? (
                    <NftOption
                        card={card}
                        refreshCard={refreshCard}
                        refreshListing={refreshListing}
                    />
                ) : (
                    ''
                )}

                <div className=" my-[20px] flex w-full rounded-[8px] bg-[#ebebeb] p-[4px] lg:w-auto">
                    {tabs.map((tab) => {
                        return (
                            <div
                                key={tab.name}
                                className={` flex h-[46px] w-[100px] flex-1 cursor-pointer items-center justify-center p-[5px] text-[14px] font-bold text-[#666666] lg:mr-[20px] lg:flex-none lg:px-[20px] lg:py-[5px] ${
                                    selectTab && selectTab.name === tab.name
                                        ? ' rounded-[8px] bg-[#ffffff]'
                                        : ''
                                }`}
                                onClick={() => setSelectTab(tab)}
                            >
                                {tab.name}
                            </div>
                        );
                    })}
                </div>

                {selectTab.name === 'Description' ? (
                    <div className=" text-[16px] font-normal text-[#737375]">
                        {card?.metadata.metadata.description}
                    </div>
                ) : selectTab.name === 'Details' ? (
                    <div className="details flex w-full flex-col items-start rounded-[16px] bg-[#ffffff] p-[21px] leading-[40px]">
                        <Link
                            to={card?.metadata.metadata.onChainUrl ?? ''}
                            target="_blank"
                            className="view-chain underline"
                        >
                            View on chain
                        </Link>
                        <div>Chain: Internet Computer</div>
                        <div>Contract Address: {card?.owner.token_id.collection}</div>
                        <div>management fee: 1%</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-x-[10px] gap-y-[20px]">
                        {(properties ?? []).map((item) => {
                            return (
                                <div
                                    key={item.name}
                                    className="flex cursor-pointer flex-col items-center rounded-[8px] border border-[#f1f1f1] px-[10px] py-[14px]"
                                >
                                    <span className=" text-[12px]">{item.name}</span>
                                    <span className="text-[14px] font-bold">{item.value}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeftImage;
