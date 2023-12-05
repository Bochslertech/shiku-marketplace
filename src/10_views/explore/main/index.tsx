import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from 'antd';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { cdn_by_resize } from '@/02_common/cdn';
import { FirstRenderByData } from '@/02_common/react/render';
import { ExploreBanner } from '@/04_apis/yumi/aws';
import { queryExploreBanners } from '@/05_utils/apis/yumi/aws';
import { useExploreCollectiblesLength } from '@/08_hooks/views/explore';
import './index.less';
import ExploreArt from './tabs/art';
import ExploreCollectibles from './tabs/collectibles';
import ExploreOat from './tabs/oat';

type ExploreTab = 'collectibles' | 'oat' | 'art';
const EXPLORE_TABS: ExploreTab[] = ['collectibles', 'oat', 'art'];
export const isValidExploreTab = (tab: string): boolean => EXPLORE_TABS.includes(tab as ExploreTab);

type NavigateItem = {
    label: string;
    path: string;
};

function ExploreMainPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // 1. banner 的接口
    const [banners, setBanners] = useState<ExploreBanner[] | undefined>(undefined);
    useEffect(() => {
        queryExploreBanners().then(setBanners); // Link 的路径 `/market/${item.collection}`
    }, []);

    // 2. collection长度 的接口
    const length = useExploreCollectiblesLength();

    const [currentBanner, setCurrentBanner] = useState<number>(0);

    const onSlideChange = (e: any) => setCurrentBanner(e.realIndex);

    const tabs: NavigateItem[] = [
        {
            label: t('home.nav.collectibles'),
            path: '/explore',
        },
        {
            label: t('home.nav.oat'),
            path: '/explore/oat',
        },
        {
            label: t('home.nav.art'),
            path: '/explore/art',
        },
    ];

    const param = useParams(); // 获取参数
    const tab: ExploreTab = param.tab ? (param.tab as ExploreTab) : 'collectibles'; // 默认是 collectibles 标签页
    const [once_check_params] = useState(new FirstRenderByData());
    useEffect(
        () =>
            once_check_params.once([tab], () => {
                if (!isValidExploreTab(tab)) return navigate('/explore', { replace: true }); // ! tab 不对，进入 explore 主页
            }),
        [tab],
    );

    return (
        <>
            {banners === undefined ? (
                <div className="h-[300px] w-full py-8 md:h-[300px] md:py-0">
                    <Skeleton.Image className="!h-full !w-full" />
                </div>
            ) : (
                <div className="relative flex h-[300px] w-full items-center justify-center overflow-hidden">
                    <Swiper
                        className="h-full w-full"
                        spaceBetween={20}
                        slidesPerView={1}
                        loop={true}
                        centeredSlides={true}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        modules={[Autoplay]}
                        onSlideChange={(e) => onSlideChange(e)}
                    >
                        {banners.map((banner) => (
                            <SwiperSlide
                                key={banner.collection}
                                className="flex h-[300px] cursor-pointer flex-col content-center items-center justify-center md:h-auto md:flex-row"
                            >
                                <Link to={`/market/${banner.collection}`} className="h-full w-full">
                                    <img
                                        className="h-full w-full object-cover"
                                        src={cdn_by_resize(banner.banner, { width: 1080 })}
                                        alt=""
                                    />
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="absolute bottom-5 z-10 flex items-center overflow-hidden rounded-[20px]">
                        {banners.map((_, index) => (
                            <div
                                key={index}
                                className={`h-[5px] w-[50px] bg-[#e2e2e2]/50 ${
                                    index === currentBanner && 'rounded-[20px] !bg-white'
                                }`}
                            ></div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mx-auto flex w-full flex-col ">
                <div className="mx-[16px] flex flex-col md:mx-[40px]">
                    <span className="mt-[30px] flex items-center font-[Inter-Bold]">
                        <h2 className="text-[24px] font-bold text-[#000]">
                            {t('explore.main.title')}
                        </h2>
                        <em className="ml-5 font-inter-medium text-[16px] not-italic text-symbol">
                            {length ?? '--'} {t('explore.main.collections')}
                        </em>
                    </span>
                    <p className="mt-3 max-w-[680px] text-[14px] text-[#999]">
                        {t('explore.main.tip')}
                    </p>

                    {/* TAB */}
                    <div className="mt-[23px] flex">
                        {tabs.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                className={`mr-9 flex h-[35px] cursor-pointer items-center rounded-[8px] px-3 text-[16px] font-semibold text-black duration-100 ${
                                    location.pathname === item.path && 'bg-black text-white'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {<ExploreCollectibles show={tab === 'collectibles'} />}
                    {<ExploreOat show={tab === 'oat'} />}
                    {<ExploreArt show={tab === 'art'} />}
                </div>
            </div>
        </>
    );
}

export default ExploreMainPage;
