import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import { cdn, cdn_by_assets } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { exponentNumber } from '@/02_common/data/numbers';
import { RankedCollection } from '@/04_apis/yumi/aws';
import ShowNumber from '@/09_components/data/number';
import TokenPrice from '@/09_components/data/price';
import NftMedia from '@/09_components/nft/media';
import AspectRatio from '@/09_components/ui/aspect-ratio';

const TopListItems = ({
    current,
    topIcon, // top 图标是否显示
}: {
    current: RankedCollection[];
    topIcon?: boolean;
}) => {
    return (
        <div className="flex flex-col px-[20px] py-[20px] pl-[0] md:px-[10px] lg:px-[20px]">
            {current &&
                current.map((item, index) => (
                    <Link
                        key={item.collection}
                        to={'/market/' + item.collection}
                        className="relative flex cursor-pointer grid-cols-ranking-table items-center md:rounded-[8px] md:px-[10px] md:py-[20px] md:hover:shadow-[0_2px_15px_1px_rgba(105,105,105,0.25)] lg:px-[20px] xl:px-[45px]"
                    >
                        <div className="relative mr-[15px] h-[80px] w-[80px]">
                            {topIcon && index <= 1 && (
                                <img
                                    className="absolute left-0 top-[7px] z-10"
                                    src={cdn_by_assets(`/images/ranking/top${index + 2}.svg`)}
                                />
                            )}
                            <NftMedia
                                src={cdn(item.logo)}
                                className=" rounded-[8px]"
                                imageClass="!h-full !w-full"
                            />
                        </div>
                        <div className="flex h-[80px] flex-1 flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <div className="w-[100px] truncate font-inter-bold text-[18px]">
                                    {item.name}
                                </div>
                                <div
                                    className={cn(
                                        'text-right font-inter-bold text-[14px] text-[#00AC4F]',
                                        item.rate < 0 && 'text-[#be3636]',
                                    )}
                                >
                                    {(item.rate < 0 ? '' : '+') + (item.rate.toFixed(2) + '%')}
                                </div>
                            </div>

                            <div className="mt-[5px] flex items-center justify-between">
                                <div className="flex items-baseline justify-end">
                                    <div className="text-[12px]">Vol.&nbsp;</div>
                                    <ShowNumber
                                        value={{
                                            value: exponentNumber(item.volume.toString(), -8),
                                            thousand: { symbol: ['M', 'K'] },
                                            scale: 2,
                                            paddingEnd: 2,
                                        }}
                                        className="text-[12px] leading-[20px] md:leading-[20px]"
                                    />
                                    <div className="text-[10px] leading-[20px] text-symbol">
                                        &nbsp; ICP
                                    </div>
                                </div>
                                <div className="flex items-baseline justify-end">
                                    <div className="text-[12px]">Floor &nbsp;</div>
                                    <TokenPrice
                                        value={{
                                            value: `${item.floorPrice}`,
                                            decimals: { type: 'exponent', value: 8 },
                                            scale: 2,
                                            paddingEnd: 2,
                                            symbol: '',
                                        }}
                                        className="text-[12px] leading-[20px] md:text-[14px]"
                                    />
                                    <div className="text-[10px] leading-[20px] text-symbol">
                                        &nbsp; ICP
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
        </div>
    );
};

function Top7({ list }: { list?: RankedCollection[] }) {
    const wrapped = useMemo(() => {
        if (list === undefined) return undefined;
        return list.slice(0, 7);
    }, [list]);

    if (wrapped === undefined) return <Top7Skeleton />;
    return (
        <div className="mt-[17px] hidden rounded-[24px] bg-[#C990FF12] md:mt-[40px] lg:flex">
            {wrapped.slice(0, 1).map((item) => (
                <Link
                    key={item.collection}
                    to={'/market/' + item.collection}
                    className="min-w-[304px] cursor-pointer rounded-[24px] p-[20px] hover:shadow-[0_2px_15px_1px_rgba(105,105,105,0.25)] md:min-w-[260px] lg:min-w-[304px]"
                >
                    <div className="relative w-full">
                        <img
                            className="absolute left-0 top-[14px] z-10"
                            src={cdn_by_assets('/images/ranking/top1.svg')}
                        />
                        <NftMedia src={cdn(item.featured)} className=" rounded-[16px] " />
                    </div>
                    <div className=" mt-[12px]">
                        <div className="flex items-center justify-between">
                            <div className="w-[100px] truncate font-inter-bold text-[18px]">
                                {item.name}
                            </div>
                            <div
                                className={cn(
                                    'text-right font-inter-bold text-[14px] text-[#00AC4F]',
                                    item.rate < 0 && 'text-[#be3636]',
                                )}
                            >
                                {(item.rate < 0 ? '' : '+') + (item.rate.toFixed(2) + '%')}
                            </div>
                        </div>
                        <div className="mt-[5px] flex items-center justify-between truncate text-[14px] opacity-60">
                            <div className="leading-[20px]">Floor Price:&nbsp;</div>
                            <div className="leading-[20px]">&nbsp; ICP Vol.</div>
                        </div>
                        <div className="mt-[5px] flex items-center justify-between">
                            <div className="flex items-baseline justify-end">
                                <TokenPrice
                                    value={{
                                        value: `${item.floorPrice}`,
                                        decimals: { type: 'exponent', value: 8 },
                                        scale: 2,
                                        symbol: '',
                                    }}
                                    className="text-[14px] leading-[20px] md:text-[14px]"
                                />
                                <div className="text-[12px] leading-[20px] text-symbol">
                                    &nbsp; ICP
                                </div>
                            </div>
                            <div className="flex items-baseline justify-end">
                                <ShowNumber
                                    value={{
                                        value: exponentNumber(item.volume.toString(), -8),
                                        thousand: { symbol: ['M', 'K'] },
                                        scale: 2,
                                    }}
                                    className="text-[14px] leading-[20px] md:leading-[20px]"
                                />
                                <div className="text-[12px] leading-[20px] text-symbol">
                                    &nbsp; ICP
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
            <div className="flex flex-1">
                <div className="w-[50%]">
                    <TopListItems current={wrapped.slice(1, 4)} topIcon={true} />
                </div>
                <div className="w-[50%]">
                    <TopListItems current={wrapped.slice(4, 7)} />
                </div>
            </div>
        </div>
    );
}

export default Top7;

const Top7Skeleton = () => {
    return (
        <div className="mt-[17px] hidden rounded-[24px] bg-[#C990FF12] md:mt-[40px] lg:flex">
            <div className="min-w-[304px] cursor-pointer rounded-[24px] p-[20px] hover:shadow-[0_2px_15px_1px_rgba(105,105,105,0.25)] md:min-w-[260px] lg:min-w-[304px]">
                <div className="relative w-full">
                    <img
                        className="absolute left-0 top-[14px] z-10"
                        src={cdn_by_assets('/images/ranking/top1.svg')}
                    />
                    <AspectRatio>
                        <Skeleton.Input className="!h-full !w-full !rounded-[16px]" />
                    </AspectRatio>
                    <div className="h-full w-full  " />
                </div>
                <div className=" mt-[12px]">
                    <div className="flex items-center justify-between">
                        <div className="w-[100px] truncate font-inter-bold text-[18px]">
                            {' '}
                            <Skeleton.Input className="!h-[16px] !w-[60px] !min-w-0" />
                        </div>
                        <Skeleton.Input className="!h-[16px] !w-[40px] !min-w-0" />
                    </div>
                    <div className="mt-[5px] flex items-center justify-between truncate text-[14px] opacity-60">
                        <Skeleton.Input className="!h-[16px] !w-[40px] !min-w-0" />
                        &nbsp;
                        <Skeleton.Input className="!h-[16px] !w-[40px] !min-w-0" />
                    </div>
                    <div className="mt-[5px] flex items-center justify-between">
                        <div className="flex items-baseline justify-end">
                            {' '}
                            <Skeleton.Input className="!h-[16px] !w-[40px] !min-w-0" />
                        </div>
                        <div className="flex items-baseline justify-end">
                            {' '}
                            <Skeleton.Input className="!h-[16px] !w-[40px] !min-w-0" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-1">
                <div className="w-[50%]">
                    <TopListItemsSkeleton topIcon={true} />
                </div>
                <div className="w-[50%]">
                    <TopListItemsSkeleton />
                </div>
            </div>
        </div>
    );
};

const TopListItemsSkeleton = ({
    topIcon, // top 图标是否显示
}: {
    topIcon?: boolean;
}) => {
    return (
        <div className="flex flex-col px-[20px] py-[20px] pl-[0] md:px-[10px] lg:px-[20px]">
            {['', '', ''].map((_, index) => (
                <div
                    key={index}
                    className="relative flex cursor-pointer grid-cols-ranking-table items-center md:rounded-[8px] md:px-[10px] md:py-[20px] md:hover:shadow-[0_2px_15px_1px_rgba(105,105,105,0.25)] lg:px-[20px] xl:px-[45px]"
                >
                    <div className="relative mr-[15px] h-[80px] w-[80px]">
                        {topIcon && index <= 1 && (
                            <img
                                className="absolute left-0 top-[7px] z-10"
                                src={cdn_by_assets(`/images/ranking/top${index + 2}.svg`)}
                            />
                        )}
                        <AspectRatio>
                            {' '}
                            <Skeleton.Input className="!h-full !w-full !min-w-0 !rounded-[8px]" />
                        </AspectRatio>
                    </div>
                    <div className="flex h-[80px] flex-1 flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <div className="w-[100px] truncate font-inter-bold text-[18px]">
                                <Skeleton.Input className="!h-[16px] !w-[60px] !min-w-0" />
                            </div>
                            <div>
                                <Skeleton.Input className="!h-[16px] !w-[40px] !min-w-0" />
                            </div>
                        </div>

                        <div className="mt-[5px] flex items-center justify-between">
                            <div className="flex items-baseline justify-end">
                                <Skeleton.Input className="!h-[16px] !w-[60px] !min-w-0" />
                            </div>
                            <div className="flex items-baseline justify-end">
                                <Skeleton.Input className="!h-[16px] !w-[80px] !min-w-0" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
