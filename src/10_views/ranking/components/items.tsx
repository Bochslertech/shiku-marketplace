import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { exponentNumber } from '@/02_common/data/numbers';
import { RankedCollection } from '@/04_apis/yumi/aws';
import ShowNumber from '@/09_components/data/number';
import TokenPrice from '@/09_components/data/price';
import NftMedia from '@/09_components/nft/media';

export const Items = ({ current }: { current: RankedCollection[] | undefined }) => {
    return (
        <div className="flex flex-col gap-y-5  pt-[20px]">
            {current &&
                current.map((item, index) => (
                    <Link
                        className="relative grid min-w-[800px]  cursor-pointer grid-cols-ranking-table items-center gap-x-3 px-[20px] md:rounded-[8px] md:px-[57px] md:py-[21px] md:hover:shadow-[0_2px_15px_1px_rgba(105,105,105,0.25)] "
                        key={item.collection + item.name}
                        to={'/market/' + item.collection}
                    >
                        <div className="absolute left-0 font-inter-semibold text-[14px] md:left-[15px]">
                            {index + 1}
                        </div>
                        <div className="flex w-full items-center gap-x-2 overflow-hidden">
                            <div className="w-[50px]">
                                <NftMedia src={cdn(item.logo)} className="rounded-[8px]" />
                            </div>
                            <div className="flex-1 truncate overflow-ellipsis font-inter-semibold text-[16px]">
                                {item.name}
                            </div>
                        </div>

                        <div className="flex">
                            {' '}
                            <ShowNumber
                                value={{
                                    value: exponentNumber(item.volume.toString(), -8),
                                    thousand: { symbol: ['M', 'K'] },
                                    scale: 2,
                                }}
                                className="text-[16px] leading-[20px] md:leading-[20px]"
                            />
                            <div className="text-[14px]">&nbsp;ICP</div>
                        </div>

                        <div className="flex">
                            <TokenPrice
                                value={{
                                    value: `${item.floorPrice}`,
                                    decimals: { type: 'exponent', value: 8 },
                                    scale: 2,
                                    symbol: '',
                                }}
                                className="text-[16px] leading-[20px] md:text-[16px]"
                            />
                            <div className="text-[14px] leading-[20px] text-symbol">&nbsp;ICP</div>
                        </div>
                        <div
                            className={cn(
                                'text-left font-inter-bold text-[14px] text-[#00AC4F]',
                                item.rate < 0 && 'text-[#be3636]',
                            )}
                        >
                            {(item.rate < 0 ? '' : '+') + (item.rate.toFixed(2) + '%')}
                        </div>
                        <ShowNumber
                            value={{
                                value: item.owners.toString(),
                                thousand: { symbol: ['M', 'K'] },
                                scale: 2,
                            }}
                            className="text-[14px] leading-[20px] md:leading-[20px]"
                        />
                        <ShowNumber
                            value={{
                                value: item.items.toString(),
                                thousand: { symbol: ['M', 'K'] },
                                scale: 2,
                            }}
                            className="text-right text-[14px] leading-[20px] md:leading-[20px]"
                        />
                    </Link>
                ))}
        </div>
    );
};

export const ItemsSkeleton = () => {
    return (
        <div className="flex flex-col gap-y-5  pt-[20px]">
            {new Array(20).fill('').map((_, index) => (
                <div
                    key={index}
                    className="relative grid min-w-[800px]  cursor-pointer grid-cols-ranking-table items-center gap-x-3 px-[20px] md:rounded-[8px] md:px-[57px] md:py-[21px] md:hover:shadow-[0_2px_15px_1px_rgba(105,105,105,0.25)] "
                >
                    <div className="absolute left-0 font-inter-semibold text-[14px] md:left-[15px]">
                        {index + 1}
                    </div>
                    <div className="flex w-full items-center gap-x-2 overflow-hidden">
                        <div className="w-[50px]">
                            <Skeleton.Input className="!h-[50px] !w-[50px] !min-w-0" />
                        </div>
                        <div className="flex-1 truncate overflow-ellipsis font-inter-semibold text-[16px]">
                            <Skeleton.Input className="!h-[16px] !w-[70px] !min-w-0" />
                        </div>
                    </div>

                    <div className="flex">
                        <Skeleton.Input className="!h-[16px] !w-[60px] !min-w-0" />
                    </div>

                    <div className="flex">
                        <Skeleton.Input className="!h-[16px] !w-[60px] !min-w-0" />
                    </div>
                    <div className={cn('text-left font-inter-bold text-[14px] text-[#00AC4F]')}>
                        {' '}
                        <Skeleton.Input className="!h-[16px] !w-[60px] !min-w-0" />
                    </div>
                    <div className="text-[14px] leading-[20px] md:leading-[20px]">
                        <Skeleton.Input className="!h-[16px] !w-[60px] !min-w-0" />
                    </div>
                    <div className="text-right text-[14px] leading-[20px] md:leading-[20px]">
                        <Skeleton.Input className="!h-[16px] !w-[60px] !min-w-0" />
                    </div>
                </div>
            ))}
        </div>
    );
};
