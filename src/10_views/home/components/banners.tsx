import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useWindowSize } from 'usehooks-ts';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { HomeBanner } from '@/04_apis/yumi/aws';
import { queryHomeBanners } from '@/05_utils/apis/yumi/aws';
import { useHomeBannerCurrent } from '@/08_hooks/interval/home';

// 计算链接地址
const getPath = (banner: HomeBanner) => {
    switch (banner.link.type) {
        case 'outside':
            return banner.link.url;
        case 'market':
            return `/market/${banner.link.collection}`;
        case 'launchpad':
            return `/launchpad/${banner.link.collection}`;
    }
    return '';
};

export default function HomeBanners() {
    const { t } = useTranslation();

    const { data } = useQuery<HomeBanner[]>({
        queryKey: ['home_banners'],
        queryFn: queryHomeBanners,
        staleTime: Infinity,
    });

    const current = useHomeBannerCurrent(data?.length);

    // set dynamic right container height
    const rightContainerRef = useRef<HTMLDivElement>(null);
    const size = useWindowSize();
    useEffect(() => {
        const rightContainer = rightContainerRef.current;
        if (!rightContainer) return;
        const w = rightContainer.clientWidth ?? 0;
        rightContainer.style.height = `${w + 40}px`;
    }, [rightContainerRef, size]);

    return (
        <section className="mx-auto w-full max-w-[1920px]">
            <div
                className={cn('relative mx-auto w-full bg-cover bg-top bg-no-repeat')}
                style={{ backgroundImage: data && `url(${cdn(data[current].image)})` }}
            >
                <div className="z-2 absolute left-0 top-0 h-full w-full bg-[#0009] backdrop-blur-3xl"></div>
                <div className="z-2 relative flex h-full flex-col-reverse items-center justify-between gap-y-[18px] overflow-hidden px-[32px] py-[26px] md:flex-row md:gap-y-0 md:px-[144px] md:py-[100px]">
                    <div className="flex-col">
                        <div className="text-center font-inter text-[26px] font-semibold leading-[108%] text-white md:text-left md:text-[58px]">
                            {t('home.banner.nft')}
                            <br /> {t('home.banner.marketplace')}
                        </div>
                        <div className="mt-[20px] w-full text-center text-[12px] leading-normal text-gray-400 md:w-[429px] md:text-left md:text-base">
                            {t('home.banner.tip')}
                        </div>
                        <div className="mt-[18px] flex w-full justify-center gap-x-[56px] px-[33px] font-inter-regular md:mt-[63px] md:justify-start md:px-0">
                            <Link to={'/explore/collections'}>
                                <div className="flex h-[36px] w-[96px] cursor-pointer items-center justify-center rounded-[8px] border-[1px] border-white bg-transparent text-[14px] font-semibold text-white transition duration-300 hover:bg-white hover:text-black md:h-12 md:w-[122px] md:border-2 md:text-lg">
                                    {t('home.banner.explore')}
                                </div>
                            </Link>
                            <Link to={'/artist/creator'}>
                                <div className="flex h-[36px] w-[96px] cursor-pointer items-center justify-center rounded-[8px] border-[1px] border-white bg-transparent text-[14px] font-semibold text-white transition duration-300 hover:bg-white hover:text-black md:h-12 md:w-[122px] md:border-2 md:text-lg">
                                    {t('home.banner.create')}
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div
                        className="relative flex h-full min-h-fit w-[70%] flex-col items-center justify-center md:w-[32%]"
                        ref={rightContainerRef}
                    >
                        {data &&
                            data.map((item, index) => {
                                return (
                                    <motion.div
                                        className={cn([
                                            'absolute left-0 top-0  h-auto w-full overflow-hidden rounded-[16px] ',
                                        ])}
                                        key={item.name}
                                        initial="collapsed"
                                        animate={index === current ? 'open' : 'collapsed'}
                                        variants={{
                                            open: {
                                                opacity: 1,
                                                scale: 1,
                                            },
                                            collapsed: {
                                                opacity: 0,
                                                scale: 0,
                                            },
                                        }}
                                        transition={{ duration: 1 }}
                                    >
                                        <Link
                                            to={getPath(item)}
                                            target={item.link.target ?? '_self'}
                                        >
                                            <img
                                                src={cdn(item.image)}
                                                className="w-full"
                                                alt="banner image"
                                            />
                                        </Link>
                                    </motion.div>
                                );
                            })}

                        <div className="absolute bottom-0 h-[2px] w-[66%] md:h-[5px] md:w-[80%]">
                            <div className="mx-auto flex h-full w-full rounded-2xl bg-[#e2e2e247]">
                                {data &&
                                    data.map((item, index) => {
                                        return (
                                            <span
                                                key={item.name}
                                                className={cn(
                                                    'h-full w-[20%] rounded-2xl',
                                                    index === current && 'bg-white',
                                                )}
                                            ></span>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
