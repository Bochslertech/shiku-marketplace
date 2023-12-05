import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import { motion } from 'framer-motion';
import { UniqueCollectionData } from '@/01_types/yumi';
import { cdn } from '@/02_common/cdn';
import { CollectionStatistics, HomeHotCollection } from '@/04_apis/yumi/aws';
import { getCollectionStatistics } from '@/05_utils/apis/yumi/aws';
import { useDeviceStore } from '@/07_stores/device';
import { useCollectionDataList } from '@/08_hooks/nft/collection';
import TokenPrice from '../data/price';
import NftMedia from './media';

export function CollectionCard({
    collection,
    hot,
    statistic,
    data,
}: {
    collection: string;
    hot?: HomeHotCollection; // 优先显示的基本信息
    statistic?: CollectionStatistics; // 优先显示的统计信息
    data?: UniqueCollectionData; // 次要显示的信息
}) {
    const { t } = useTranslation();

    const { isMobile } = useDeviceStore((s) => s.deviceInfo);

    const collectionDataList = useCollectionDataList();

    const [innerStatistic, setInnerStatistic] = useState<CollectionStatistics | undefined>(
        undefined,
    );
    useEffect(() => {
        if (statistic !== undefined) return;
        getCollectionStatistics(collection).then(setInnerStatistic);
    }, [collection, statistic]);

    const [innerData, setInnerData] = useState<UniqueCollectionData | undefined>(undefined);
    useEffect(() => {
        if (data !== undefined) return;
        setInnerData(collectionDataList.find((c) => c.info.collection === collection));
    }, [collection, data]);

    const featured = hot?.info.featured ?? data?.info.featured ?? innerData?.info.featured;
    const logo = hot?.info.logo ?? data?.info.logo ?? innerData?.info.logo;
    const name = hot?.info.name ?? data?.info.name ?? innerData?.info.name;

    const floor =
        data?.metadata?.floorPrice ??
        innerData?.metadata?.floorPrice ??
        statistic?.floor ??
        innerStatistic?.floor;
    const owners = statistic?.owners ?? innerStatistic?.owners;
    const volume =
        data?.metadata?.volumeTrade ??
        innerData?.metadata?.volumeTrade ??
        statistic?.volume ??
        innerStatistic?.volume;

    return (
        <motion.div
            className="flex cursor-pointer flex-col overflow-hidden rounded-[8px] shadow-home-card"
            whileHover={
                !isMobile
                    ? {
                          transform: 'translateY(-8px)',
                          transition: {
                              duration: 0.2,
                          },
                      }
                    : undefined
            }
        >
            <Link to={`/market/${collection}`}>
                <NftMedia src={cdn(featured)} skeleton={false} />
                <div className="px-[9px] pb-3 pt-4">
                    <div className="flex items-center">
                        <img
                            className="mr-[6px] h-[24px] rounded-[8px] md:h-[33px] md:w-[33px]"
                            src={cdn(logo)}
                        />
                        <div className="truncate overflow-ellipsis font-[Inter-SemiBold] text-[10px] leading-[20px] text-[#000] md:ml-0 md:text-[14px]">
                            {name}
                        </div>
                    </div>
                    <div className="mt-[5px] grid grid-cols-3 md:mt-[13.7px]">
                        <div className="flex w-fit flex-shrink-0 flex-col gap-y-[6px] md:gap-y-[12px]">
                            <span className="scale-[0.8] text-left font-inter-medium text-[12px] text-[#999] md:scale-100">
                                {t('home.notable.floor')}
                            </span>
                            <div className="flex scale-[0.8] items-center text-[12px] font-semibold leading-4 text-stress md:scale-100 md:text-[16px]">
                                <TokenPrice
                                    value={{
                                        value: floor && Number(floor) > 0 ? floor : undefined,
                                        decimals: { type: 'exponent', value: 8 },
                                        scale: 1,
                                        paddingEnd: 1,
                                        thousand: { symbol: 'K' },
                                    }}
                                />
                                <b className="text-[12px] leading-4 text-symbol md:text-[14px]">
                                    &nbsp;ICP
                                </b>
                            </div>
                        </div>
                        <div className="flex w-full flex-shrink-0 flex-col items-center gap-y-[6px] md:gap-y-[12px]">
                            <span className="scale-[0.8] text-center font-inter-medium text-[12px] text-[#999] md:scale-100">
                                {t('home.notable.owners')}
                            </span>
                            <div className="flex scale-[0.8] items-center text-[12px] font-semibold leading-4 text-stress md:scale-100 md:text-[16px]">
                                {owners ?? '--'}
                            </div>
                        </div>
                        <div className="flex w-full flex-shrink-0 flex-col gap-y-[6px] md:gap-y-[12px]">
                            <span className="scale-[0.8] truncate  overflow-ellipsis text-right font-inter-medium text-[12px] text-[#999] md:scale-100">
                                {t('home.notable.volume')}
                            </span>
                            <div className="flex scale-[0.8] items-center justify-end text-[12px] font-semibold leading-4 text-stress md:scale-100 md:text-[16px]">
                                <TokenPrice
                                    value={{
                                        value: volume,
                                        decimals: { type: 'exponent', value: 8 },
                                        scale: 1,
                                        thousand: { symbol: 'K' },
                                    }}
                                />
                                <b className="text-[12px] leading-4 text-symbol md:text-[14px]">
                                    &nbsp;ICP
                                </b>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export const CollectionCardSkeleton = () => {
    return (
        <div className="flex cursor-pointer flex-col overflow-hidden rounded-[8px] shadow-home-card">
            <Skeleton.Image className="!h-[180px] !w-full md:!h-[290px]" />
            <div className="flex w-full px-3 py-3">
                <div className="flex !h-[33px] !w-1/2">
                    <Skeleton.Button className="flex !h-[33px] !w-full" />
                </div>
            </div>
            <div className="grid w-full grid-cols-3 gap-x-[10px] px-3 pb-1 md:gap-x-[30px]">
                <div className="flex !h-[20px]">
                    <Skeleton.Input className="flex !h-[20px] !w-full !min-w-0" />
                </div>
                <div className="flex !h-[20px]">
                    <Skeleton.Input className="flex !h-[20px] !w-full !min-w-0" />
                </div>
                <div className="flex !h-[20px]">
                    <Skeleton.Input className="flex !h-[20px] !w-full !min-w-0" />
                </div>
            </div>
            <div className="grid w-full grid-cols-3 gap-x-[10px] px-3 pb-3 md:gap-x-[30px]">
                <div className="flex !h-[20px]">
                    <Skeleton.Input className="flex !h-[20px] !w-full !min-w-0" />
                </div>
                <div className="flex !h-[20px]">
                    <Skeleton.Input className="flex !h-[20px] !w-full !min-w-0" />
                </div>
                <div className="flex !h-[20px]">
                    <Skeleton.Input className="flex !h-[20px] !w-full !min-w-0" />
                </div>
            </div>
        </div>
    );
};
