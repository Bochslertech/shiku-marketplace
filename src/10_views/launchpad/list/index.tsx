import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'antd';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { Spend } from '@/02_common/react/spend';
import { AllLaunchpadCollections } from '@/03_canisters/yumi/yumi_launchpad/index';
import { combinedQueryLaunchpadCollectionsWithStatus } from '@/05_utils/combined/yumi/launchpad';
import YumiIcon from '@/09_components/ui/yumi-icon';
import { PastCard, PastCardSkeleton } from './components/past-card';
import { ProgressCard, ProgressCardSkeleton } from './components/progress-card';
import SwiperCard from './components/swiper-card';

function LaunchpadListPage() {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);

    const [collectionsInfo, setCollectionsInfo] = useState<AllLaunchpadCollections>();

    useEffect(() => {
        setLoading(true);
        const spend = Spend.start('all launchpad collection');
        spend.mark('start');
        combinedQueryLaunchpadCollectionsWithStatus()
            .then((collectionsInfo) => {
                spend.mark('over');
                setCollectionsInfo(collectionsInfo);
            })
            .finally(() => setLoading(false));
    }, []);

    const [bannerSwiper, setBannerSwiper] = useState<SwiperType | null>(null);

    const bannerList = useMemo(
        () => [...(collectionsInfo?.whitelist ?? []), ...(collectionsInfo?.open ?? [])],
        [collectionsInfo],
    );
    const expired = useMemo(() => [...(collectionsInfo?.expired ?? [])], [collectionsInfo]);

    return (
        <>
            <div className="mx-auto w-full">
                {loading || bannerList.length === 0 ? (
                    <div className="h-[650px] w-full py-8 md:h-[572px] md:py-0">
                        <Skeleton.Image className="!h-full !w-full" active={true} />
                    </div>
                ) : (
                    <div className="relative w-full bg-[#F0F0F0] py-14 md:h-[572px] md:py-0">
                        <Swiper
                            className="h-full"
                            spaceBetween={20}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{
                                disableOnInteraction: true,
                                delay: 5000,
                            }}
                            modules={[Autoplay]}
                            onSwiper={setBannerSwiper}
                        >
                            {bannerList.map((info) => (
                                <SwiperSlide
                                    key={info.collection}
                                    className="!flex h-full !flex-col content-center items-center justify-center md:!flex-row"
                                >
                                    <SwiperCard info={info} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className="bottom-[104px] z-10 mt-5 flex w-full items-center justify-center md:absolute md:right-[108px] md:mt-10 md:w-auto">
                            <div
                                onClick={() => bannerSwiper?.slidePrev()}
                                className="flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-[4px] bg-white drop-shadow-md transition hover:transition md:h-10 md:w-10 md:rounded-[8px] md:hover:scale-[1.2]"
                            >
                                <YumiIcon
                                    name="direction"
                                    size={14}
                                    color="#666666"
                                    className="overflow:hidden"
                                />
                            </div>
                            <div
                                onClick={() => bannerSwiper?.slideNext()}
                                className="ml-6 flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-[4px] bg-white drop-shadow-md transition hover:transition md:h-10 md:w-10 md:rounded-[8px] md:hover:scale-[1.2]"
                            >
                                <YumiIcon
                                    name="direction"
                                    size={14}
                                    color="#666666"
                                    className="overflow:hidden rotate-180"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="mx-auto w-full">
                <div className="mx-[16px] flex flex-col md:mx-[40px] xl:mx-[60px] 2xl:mx-[120px]">
                    <h2 className="mt-7 font-[Inter-SemiBold] text-[18px] font-semibold text-stress md:mt-10">
                        {t('launchpad.main.progress')}
                    </h2>
                    <div className="mt-3 grid grid-cols-2 gap-x-[15px] gap-y-[15px] md:mt-6 md:grid-cols-4 md:gap-x-[32px] md:gap-y-[25px]  xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7">
                        {loading ? (
                            <>
                                {['', '', '', ''].map((_, index) => (
                                    <ProgressCardSkeleton key={index} />
                                ))}
                            </>
                        ) : (
                            <>
                                {bannerList.map((item) => (
                                    <ProgressCard key={item.collection} collectionInfo={item} />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div
                className={`mx-auto mt-2 w-full md:mt-5 ${
                    !loading && !collectionsInfo?.upcoming.length && 'hidden'
                }`}
            >
                <div className="mx-[16px] flex flex-col md:mx-[40px] xl:mx-[60px] 2xl:mx-[120px]">
                    <h2 className="mt-[30px] font-[Inter-SemiBold] text-[18px] font-semibold text-stress">
                        {t('launchpad.main.upcoming')}
                    </h2>
                    <div className="mt-3 grid grid-cols-2 gap-x-[15px] gap-y-[15px] md:mt-6 md:grid-cols-4 md:gap-x-[32px] md:gap-y-[25px]  xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7">
                        {loading ? (
                            <>
                                {new Array(4).fill('').map((_, index) => (
                                    <ProgressCardSkeleton key={index} />
                                ))}
                            </>
                        ) : (
                            <>
                                {collectionsInfo?.upcoming.map((item, index) => (
                                    <ProgressCard collectionInfo={item} key={index} />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-2 w-full md:mt-5">
                <div className="mx-[16px] flex flex-col md:mx-[40px] xl:mx-[60px] 2xl:mx-[120px]">
                    <h2 className="mt-[30px] font-[Inter-SemiBold] text-[18px] font-semibold text-stress">
                        {t('launchpad.main.past')}
                    </h2>
                    <div className="mt-3 grid grid-cols-2 gap-x-[10px] gap-y-[10px] md:mt-6 md:grid-cols-4 md:gap-x-[15px] md:gap-y-[15px] lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 3xl:grid-cols-12 ">
                        {loading ? (
                            <>
                                {new Array(6).fill('').map((_, index) => (
                                    <PastCardSkeleton key={index} />
                                ))}
                            </>
                        ) : (
                            <>
                                {expired.map((info) => (
                                    <PastCard key={info.collection} info={info} />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default LaunchpadListPage;
