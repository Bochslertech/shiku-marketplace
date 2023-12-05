import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { cdn } from '@/02_common/cdn';
import { uniqueKey } from '@/02_common/nft/identifier';
import { getThumbnailByNftMetadata } from '@/05_utils/nft/metadata';
import { ArtStandoutCard, useExploreArtTab } from '@/08_hooks/views/explore';
import FilterSearch from '@/09_components/nft-card/filter/search';
import FilterSelect from '@/09_components/nft-card/filter/select';
import { ArtBannerSkeleton, ArtSwiperSlideItem } from './components/art-banner';
import {
    ArtCardList,
    EXPLORE_ART_SORT_OPTIONS,
    ExploreArtSortOption,
} from './components/art-cards';

function ExploreArt({ show }: { show: boolean }) {
    const { t } = useTranslation();

    // 过滤条件
    const [search, setSearch] = useState('');
    // 排序条件
    const [sort, setSort] = useState<ExploreArtSortOption>('price_low_to_high');

    const [currentBannerCover, setCurrentBannerCover] = useState<ArtStandoutCard | undefined>(
        undefined,
    );
    const [swiperLoading, setSwiperLoading] = useState(true);
    // child node all data
    const [flag, setFlag] = useState(0);
    const artistCarouselList = useExploreArtTab(flag);

    const onSwiperChange = (e: any) => {
        setCurrentBannerCover(artistCarouselList ? artistCarouselList[e.realIndex] : undefined);
    };
    useEffect(() => {
        if (artistCarouselList) {
            setSwiperLoading(false);
            setCurrentBannerCover(artistCarouselList[0]);
            return;
        }
        setSwiperLoading(false);
    }, [artistCarouselList]);

    const onUpdate = useCallback(() => setFlag((flag) => flag + 1), []);

    if (!show) return <></>;
    return (
        <div className="flex flex-col">
            <div className="mt-[30px] flex h-12 flex-1  flex-shrink-0 flex-col md:flex-row">
                <FilterSearch
                    className={'ml-[0px] mr-[0px] w-full flex-1 md:mr-[27px] md:w-auto'}
                    search={search}
                    setSearch={setSearch}
                />
                <FilterSelect
                    className="mt-[10px] h-12 md:mt-0"
                    defaultValue={sort}
                    options={EXPLORE_ART_SORT_OPTIONS}
                    setOption={setSort}
                />
            </div>
            <div className="mt-3 flex h-9 items-center justify-end md:mt-[30px]">
                <Link to={'/art/create'}>
                    <div className="flex h-9 cursor-pointer items-center rounded-[8px] border border-[#999] px-[23px] font-[Inter-SemiBold] text-[14px] text-[#999] hover:border-[#000] hover:bg-black hover:text-[#fff]">
                        {t('explore.art.creator')}
                    </div>
                </Link>
            </div>

            {swiperLoading ? (
                <ArtBannerSkeleton />
            ) : (
                <>
                    <div className="mt-3 hidden justify-center overflow-hidden lg:flex lg:h-[504px] xl:h-[753px]">
                        <div className="mr-[96px] hidden items-center justify-center lg:flex lg:h-[504px] lg:w-[467px] xl:h-[753px] xl:w-[698px]">
                            {!currentBannerCover || currentBannerCover.card === undefined ? (
                                <div className="!h-[calc(100%-15px)] !w-full overflow-hidden rounded-[8px]">
                                    <Skeleton.Image className="!h-full !w-full" />
                                </div>
                            ) : (
                                <Link
                                    className="h-full"
                                    to={`/market/${uniqueKey(
                                        currentBannerCover.card.owner.token_id,
                                    )}`}
                                >
                                    <img
                                        className="h-[calc(100%-15px)] rounded-[16px] object-cover"
                                        src={cdn(
                                            getThumbnailByNftMetadata(currentBannerCover.card),
                                        )}
                                        alt=""
                                    />
                                </Link>
                            )}
                        </div>
                        <div className="flex  flex-col ">
                            <div className="flex h-full w-full">
                                <Swiper
                                    className="w-full"
                                    direction={'vertical'}
                                    pagination={{
                                        clickable: true,
                                    }}
                                    loop={true}
                                    autoplay={{
                                        disableOnInteraction: false,
                                        delay: 8000,
                                    }}
                                    modules={[Autoplay]}
                                    slidesPerView={3}
                                    onSlideChange={(e) => onSwiperChange(e)}
                                >
                                    {artistCarouselList &&
                                        artistCarouselList.map((item, index) => (
                                            <SwiperSlide key={uniqueKey(item.art.token_id) + index}>
                                                <ArtSwiperSlideItem item={item} update={onUpdate} />
                                            </SwiperSlide>
                                        ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <ArtCardList search={search} sort={sort} />
        </div>
    );
}

export default ExploreArt;
