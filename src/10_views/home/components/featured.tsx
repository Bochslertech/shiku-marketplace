import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AnimationControls, motion, TargetAndTransition, VariantLabels } from 'framer-motion';
import { NftListingData } from '@/01_types/listing';
import { cdn, url_cdn_by_assets } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { uniqueKey } from '@/02_common/nft/identifier';
import { preventLink } from '@/02_common/react/link';
import { HomeFeaturedArtwork } from '@/04_apis/yumi/aws';
import { queryHomeFeaturedArtworks } from '@/05_utils/apis/yumi/aws';
import { queryNftListingData } from '@/05_utils/nft/listing';
import { useHomeFeaturedCurrent } from '@/08_hooks/interval/home';
import { useNftFavorite } from '@/08_hooks/nft/favorited';
import TokenPrice from '@/09_components/data/price';
import { IconArrowFeaturedLeft, IconArrowFeaturedRight } from '@/09_components/icons';
import AspectRatio from '@/09_components/ui/aspect-ratio';
import YumiIcon from '@/09_components/ui/yumi-icon';

function getAnimation(
    index: number,
    curIndex: number,
    length: number,
): AnimationControls | TargetAndTransition | VariantLabels | boolean | undefined {
    let duration = 1;
    if (curIndex === length / 3 + 1) {
        duration = 0;
    }
    if (curIndex === (2 * length) / 3 - 2) {
        duration = 0;
    }
    if (curIndex === index) {
        return {
            left: '50%',
            opacity: '100%',
            rotate: 0,
            transform: 'translate(-50%,-50%) scale(1)',
            transition: { duration },
        };
    } else if (curIndex === index - 1) {
        return {
            left: '65%',
            opacity: '100%',
            filter: 'brightness(80%)',
            rotate: 20,
            scale: 0.6,
            transform: 'translate(0,-30%) scale(0.6) rotate(20deg) ',
            transition: { duration },
        };
    } else if (curIndex === index + 1) {
        return {
            left: '15%',
            opacity: '100%',
            filter: 'brightness(80%)',
            transform: 'translate(0,-30%) scale(0.6) rotate(-20deg) ',
            transition: { duration },
        };
    } else if (curIndex < index) {
        return {
            right: '0',
            opacity: '0',
            scale: 0,
            transition: { duration: 0 },
        };
    } else {
        return {
            left: '0',
            opacity: '0',
            scale: 0,
            transition: { duration: 0 },
        };
    }
}

export default function HomeFeatured() {
    const { t } = useTranslation();

    const { data } = useQuery({
        queryKey: ['home_featured'],
        queryFn: queryHomeFeaturedArtworks,
        staleTime: Infinity,
    });

    const list = (() => {
        const d = data ?? [];
        if (d.length > 4) return d;
        return [...d, ...d];
    })();

    const viewList = useMemo(() => [...list, ...list, ...list], [data]);
    const { current, next, previous } = useHomeFeaturedCurrent(viewList?.length);

    return (
        <div
            className="relative mx-auto flex h-[350px] w-full max-w-[1920px] flex-col overflow-hidden bg-center md:h-[610px]"
            style={{
                backgroundImage: `${url_cdn_by_assets('/images/home/featured-artwork.png')}`,
            }}
        >
            <div className="pl-[40px] pt-[30px] font-inter-semibold text-[24px] leading-relaxed text-white 2xl:pl-[120px]">
                {t('home.featured.title')}
            </div>
            <div className="relative z-10 mt-3 flex-1">
                {viewList.map((item, index) => (
                    <motion.div
                        key={uniqueKey(item.token_id) + index}
                        className={cn(['absolute top-1/2 w-1/5'])}
                        animate={getAnimation(index, current, viewList.length)}
                        transition={{ duration: 1 }}
                    >
                        <FeaturedCard item={item} current={current === index} />
                    </motion.div>
                ))}
            </div>
            <div className="absolute left-1/2 right-0 top-1/2 z-[0] h-1/2  w-[110%] -translate-x-1/2 transform rounded-[50%] border-t-2 border-solid border-white/20"></div>
            <div className="relative mb-[40px] mt-10 flex w-full justify-center gap-x-[110px] md:mb-[70px]">
                <motion.div
                    className="h-[38px] w-[38px] cursor-pointer "
                    whileHover={{
                        scale: 1.2,
                    }}
                    transition={{ duration: 0.2 }}
                    onClick={previous}
                >
                    <IconArrowFeaturedLeft />
                </motion.div>
                <motion.div
                    className="h-[38px] w-[38px] cursor-pointer"
                    whileHover={{
                        scale: 1.2,
                    }}
                    transition={{ duration: 0.2 }}
                    onClick={next}
                >
                    <IconArrowFeaturedRight />
                </motion.div>
            </div>
        </div>
    );
}

const FeaturedCard = ({ item, current }: { item: HomeFeaturedArtwork; current: boolean }) => {
    const [listing, setListing] = useState<NftListingData | undefined>(undefined);

    useEffect(() => {
        queryNftListingData('ext', item.token_id).then(setListing);
    }, [item]);

    const [allFavorited, setAllFavorited] = useState<number | undefined>(undefined);
    useEffect(() => setAllFavorited(listing?.favorited?.length), [listing]);

    // 是否已经收藏
    const { favorited, toggle } = useNftFavorite(item.token_id);

    const toggleFavorited = () => {
        toggle().then((d) => {
            if (d !== undefined && allFavorited !== undefined) {
                setAllFavorited(allFavorited + 1 * (d ? 1 : -1));
            }
        });
    };

    return (
        <div className="relative mt-10 flex w-full cursor-pointer flex-col md:mt-0">
            <Link to={`/market/${uniqueKey(item.token_id)}`}>
                <AspectRatio ratio={1}>
                    <div className="relative flex h-full w-full flex-col justify-center rounded-[16px] bg-contain bg-center bg-no-repeat">
                        <img
                            className="h-full object-contain"
                            src={cdn(item.metadata.metadata.url)}
                            alt=""
                        />
                        {current ? (
                            <div className="relative z-10 -ml-[75%] mt-3 flex w-[250%] scale-75 justify-between text-white md:-ml-[0%] md:mt-3 md:w-[100%] md:scale-100">
                                <span className="flex flex-1 flex-col truncate">
                                    <strong className="truncate text-[12px] md:text-[16px]">
                                        {item.metadata.metadata.name}
                                    </strong>
                                    <p className="truncate text-[12px] not-italic">
                                        @{item.creator.username}
                                    </p>
                                </span>
                                <span className="mx-2 flex flex-1 flex-col items-center truncate">
                                    {allFavorited !== undefined && (
                                        <strong className="text-[12px] not-italic md:text-[16px]">
                                            {allFavorited}
                                        </strong>
                                    )}
                                    {favorited ? (
                                        <YumiIcon
                                            name="heart-fill"
                                            size={20}
                                            className="flex-shrink-0"
                                            onClick={preventLink(toggleFavorited)}
                                        />
                                    ) : (
                                        <YumiIcon
                                            name="heart"
                                            size={20}
                                            className="flex-shrink-0"
                                            onClick={preventLink(toggleFavorited)}
                                        />
                                    )}
                                </span>
                                <span className="flex flex-1 flex-col truncate">
                                    <strong className="text-right text-[12px] not-italic md:text-[16px]">
                                        <TokenPrice
                                            value={{
                                                value:
                                                    listing?.latest_price &&
                                                    listing.latest_price !== '0'
                                                        ? listing.latest_price
                                                        : undefined,
                                                decimals: { type: 'exponent', value: 8 },
                                                symbol: 'ICP',
                                                scale: 2,
                                            }}
                                        />
                                    </strong>
                                    <p className="truncate text-right text-[12px] not-italic">
                                        List price
                                    </p>
                                </span>
                            </div>
                        ) : null}
                    </div>
                </AspectRatio>
            </Link>
        </div>
    );
};
