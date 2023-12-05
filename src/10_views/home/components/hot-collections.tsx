import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { cdn, cdn_by_assets } from '@/02_common/cdn';
import { queryHomeHotCollections } from '@/05_utils/apis/yumi/aws';
import { CollectionCard, CollectionCardSkeleton } from '@/09_components/nft/collection-card';
import { Button } from '@/09_components/ui/button';
import YumiIcon from '@/09_components/ui/yumi-icon';

type SpecialInfo = {
    name: string;
    subtitle: string;
    description: string;
    path: string;
    image: string;
};

const SPECIAL_LIST: SpecialInfo[] = [
    {
        name: 'Co-Owned Physical Artworks',
        subtitle: 'Suzanne Walking in Leather Skirt from Julian Opie' /* cspell: disable-line */,
        description: `Invest in iconic artworks and become part of an exclusive
        community of co-owners and masterpiece collectors around the
        world.`,
        path: '/origyn',
        image: cdn_by_assets('/images/home/origyn-art-cover.png ')!,
    },
    {
        name: 'GLD NFT',
        subtitle: 'New way to own physical gold',
        description: `It's time for a change in the global financial system. NFTs and
        blockchain technology are revolutionizing the trading process,
        providing a new level of transparency and accessibility.`,
        path: '/gold',
        image: cdn_by_assets('/images/home/gold-cover.jpeg')!,
    },
];

export default function HomeHotCollections() {
    const { t } = useTranslation();

    const { data } = useQuery({
        queryKey: ['home_hot_collections'],
        queryFn: queryHomeHotCollections,
        staleTime: Infinity,
    });

    return (
        <div className="relative w-full bg-white px-[15px] py-[25px] dark:bg-black md:px-[40px] md:py-[70px]">
            <div className="relative mx-auto w-full max-w-[1920px]">
                <div className="mb-[12px] flex items-center justify-between font-inter-semibold text-[16px] leading-[39px] text-[#000] md:mb-[30px] md:text-[26px]">
                    <div className="text-[24px]">{t('home.notable.title')}</div>{' '}
                    <Link
                        to={'/explore'}
                        className="flex cursor-pointer items-center opacity-70 hover:opacity-100"
                    >
                        <span className="mr-[3px] text-[16px] text-[#999]">
                            {t('home.notable.more')}
                        </span>
                        <YumiIcon
                            name="arrow-right"
                            size={16}
                            className="inline-block cursor-pointer text-[#999] hover:text-[#666]"
                        />
                    </Link>
                </div>
                <div className="grid min-h-[300px] w-full grid-cols-2 gap-x-[10px] gap-y-[10px] md:grid-cols-4 md:gap-x-[28.5px] md:gap-y-[0px]">
                    {data
                        ? data.map((hot) => (
                              <CollectionCard
                                  key={hot.info.collection}
                                  collection={hot.info.collection}
                                  hot={hot}
                              />
                          ))
                        : ['', '', '', ''].map((_, index) => (
                              <CollectionCardSkeleton key={index} />
                          ))}
                </div>
                <div className="mt-[30px] grid hidden min-h-[300px] grid-cols-1 gap-x-[30px] gap-y-[20px] md:mt-[70px] md:grid-cols-2 md:flex-col md:gap-y-[0]">
                    {SPECIAL_LIST.map((info, index) => (
                        <SpecialCard key={index} info={info} />
                    ))}
                </div>
            </div>
        </div>
    );
}

const SpecialCard = ({ info }: { info: SpecialInfo }) => {
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-between rounded-[16px] border-2 border-[#f1f1f1] px-[20px] py-[27px]">
            <div className="flex w-3/5 flex-col">
                <div className="font-inter-bold text-[16px] leading-none md:text-[26px] ">
                    {info.name}
                </div>
                <div className=" mb-[20px] mt-[14px] font-inter-medium text-[15px] leading-[22px] text-symbol ">
                    {info.subtitle}
                </div>
                <div className="font-inter-regular text-[14px] leading-[22px] text-[#999] ">
                    {info.description}
                </div>
                <Link to={info.path}>
                    <Button className="mt-[42px] h-[48px] w-[126px] rounded-[8px] font-inter-bold text-[16px]">
                        {t('home.notable.explore')}
                    </Button>
                </Link>
            </div>
            <img
                src={cdn(info.image)}
                className="ml-4 h-[224px] w-[140px] rounded-[8px] md:ml-0 md:h-[320px] md:w-[160px]"
                alt="cover image"
            />
        </div>
    );
};
