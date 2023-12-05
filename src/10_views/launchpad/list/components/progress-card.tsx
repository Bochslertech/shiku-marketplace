import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import { cdn } from '@/02_common/cdn';
import {
    getLaunchpadCollectionStatus,
    LaunchpadCollectionInfo,
} from '@/03_canisters/yumi/yumi_launchpad';
import TokenPrice from '@/09_components/data/price';
import Usd from '@/09_components/data/usd';
import YumiIcon from '@/09_components/ui/yumi-icon';

export const ProgressCard = ({ collectionInfo }: { collectionInfo: LaunchpadCollectionInfo }) => {
    const { t } = useTranslation();

    const {
        name,
        description,
        featured,
        whitelist_price,
        open_price,
        supply: totalSupply,
        remain,
        collection,
    } = collectionInfo;

    const status = getLaunchpadCollectionStatus(collectionInfo);

    return (
        <Link
            to={`/launchpad/${collection}`}
            state={{ collectionInfo }}
            className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[8px] border bg-white shadow-lg"
        >
            <div className="relative overflow-hidden">
                <div className="relative flex w-full items-center justify-center pt-[100%]">
                    <img
                        className="absolute top-0 flex w-full object-cover transition hover:transition group-hover:scale-110"
                        src={cdn(featured)}
                        alt=""
                    />
                </div>
                <div className="absolute left-0  top-0 flex h-full w-full flex-col bg-[#000]/70 px-2 py-4 opacity-0 transition ease-in-out group-hover:opacity-100">
                    {['upcoming', 'whitelist'].includes(status) && (
                        <div className="flex h-6 w-[68px] cursor-pointer items-center justify-center rounded-[4px] bg-white/20 text-[12px] text-[#fff]">
                            {'Whitelist'}
                        </div>
                    )}
                    <div className="mt-2 line-clamp-3 w-4/5 text-[12px] text-[#fff] md:line-clamp-6">
                        {description}
                    </div>
                    <div className="mt-1 flex items-center">
                        <p className="text-[12px] font-semibold text-[#fff]">
                            {t('launchpad.main.more')}
                        </p>
                        <YumiIcon name="arrow-right" size={12} color="white" className="ml-1" />
                    </div>
                    <div className="mt-auto flex justify-between">
                        <p className="text-[12px] font-semibold text-[#fff]">
                            {t('launchpad.main.price')}
                        </p>
                        <TokenPrice
                            value={{
                                value: ['upcoming', 'whitelist'].includes(status)
                                    ? whitelist_price
                                    : open_price,
                                decimals: { type: 'exponent', value: 8 },
                                symbol: ' ICP',
                                scale: (v) => (v < 0.01 ? 4 : 2),
                            }}
                            className="text-[14px] font-semibold text-[#fff]"
                        />
                    </div>
                    <Usd
                        value={{
                            value:
                                (['upcoming', 'whitelist'].includes(status)
                                    ? whitelist_price
                                    : open_price) ?? '0',
                            decimals: { type: 'exponent', value: 8 },
                            symbol: 'ICP',
                            scale: 2,
                        }}
                        className="flex justify-end text-[12px] font-semibold text-[#fff]"
                    />
                </div>
            </div>
            <p className="mt-2 truncate px-2 font-[Inter-SemiBold] text-[14px] font-semibold text-black">
                {name}
            </p>
            <div className="mt-[5px] flex flex-col px-2 md:mt-[18px]">
                <div className="flex justify-between">
                    <p className="font-[Inter-Medium] text-[12px] text-[#666666] md:text-[14px]">
                        Total Items
                    </p>
                    <span className="text-[12px] text-[#666666] md:text-[14px]">
                        <em className="not-italic text-black">{Number(remain)}</em>/{totalSupply}
                    </span>
                </div>
                <div className="relative mb-4 mt-2 md:mb-6">
                    <div className="h-[4px] rounded-[4px] bg-[#F1F1F1]"></div>
                    <div
                        className="absolute left-0 top-0 flex h-[4px] justify-end rounded-[4px] bg-[#000]"
                        style={{
                            width: `${(Number(remain) / Number(totalSupply)) * 100}%`,
                        }}
                    >
                        <i className="relative -top-[3px] h-[10px] w-[10px] rounded-full border-[2px] border-[#000] bg-[#fff]"></i>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export const ProgressCardSkeleton = () => {
    return (
        <div className="flex flex-col overflow-hidden rounded-[8px] border bg-white pb-4 shadow-lg">
            <Skeleton.Image className="!h-[180px] !w-full xl:!h-[280px]" />
            <Skeleton.Input className="ml-2 mt-2 !h-4 !w-20 !min-w-0" />
            <Skeleton.Input className="ml-2 mt-2 !h-4 !w-[140px] !min-w-0" />
        </div>
    );
};
