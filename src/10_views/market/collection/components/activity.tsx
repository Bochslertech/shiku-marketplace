import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import { UniqueCollectionData } from '@/01_types/yumi';
import { sinceNowByByNano } from '@/02_common/data/dates';
import { parse_nft_identifier } from '@/02_common/nft/ext';
import { CollectionEvent } from '@/04_apis/yumi/aws';
import { queryCollectionsEvents } from '@/05_utils/apis/yumi/aws';
import { getLedgerIcpDecimals } from '@/05_utils/canisters/ledgers/special';
import TokenPrice from '@/09_components/data/price';
import Usd from '@/09_components/data/usd';
import NftName from '@/09_components/nft/name';
import NftThumbnail from '@/09_components/nft/thumbnail';
import Empty from '@/09_components/ui/empty';
import Loading from '@/09_components/ui/loading';
import PaginatedItems from '@/09_components/ui/paginated';
import Username from '@/09_components/user/username';
import { DashBoard } from '@/10_views/gold/market/tabs/components/dash-board';

const Items = ({
    current,
    data,
}: {
    current: CollectionEvent[] | undefined;
    data?: UniqueCollectionData;
}) => {
    return (
        <div className="flex flex-col gap-y-5  pt-[20px]">
            {current &&
                current.map((activity) => (
                    <div
                        className="flex h-[69px] min-w-[900px] cursor-pointer items-center justify-between gap-x-3 md:rounded-[8px] md:px-[23px] md:py-[13px] md:hover:shadow-[0_2px_15px_1px_rgba(105,105,105,0.25)] "
                        key={activity.index + activity.token_identifier}
                    >
                        <div className="w-[10%]">
                            {activity.type === 'sold' && 'sale'}
                            {activity.type === 'claim' && 'claim'}
                        </div>
                        <Link
                            to={`/market/${activity.collection}/${activity.token_identifier}`}
                            className="flex w-[30%] items-center gap-x-2 overflow-hidden"
                        >
                            <NftThumbnail
                                token_id={parse_nft_identifier(activity.token_identifier)}
                                cdn_width={100}
                                width="w-[41px]"
                            />
                            <NftName
                                token_id={parse_nft_identifier(activity.token_identifier)}
                                data={data}
                            />
                        </Link>
                        <div className="w-[20%]">
                            {activity.price ? (
                                activity.price === '0' ? (
                                    <span>--</span>
                                ) : (
                                    <>
                                        <TokenPrice
                                            className="font-inter-semibold text-[14px] text-stress"
                                            value={{
                                                value: activity.price ?? '0',
                                                decimals: {
                                                    type: 'exponent',
                                                    value: getLedgerIcpDecimals(),
                                                },
                                                paddingEnd: 2,
                                                scale: (v) => (v < 0.01 ? 4 : 2),
                                            }}
                                        />
                                        <span className="ml-[3px] font-inter-bold text-[12px] text-symbol">
                                            ICP
                                        </span>
                                        {
                                            <span className="font-inter-medium text-[14px] text-symbol">
                                                <Usd
                                                    className="text-[14px]"
                                                    value={{
                                                        value: activity.price ?? '0',
                                                        decimals: {
                                                            type: 'exponent',
                                                            value: getLedgerIcpDecimals(),
                                                        },
                                                        symbol: 'ICP',
                                                        scale: 2,
                                                    }}
                                                />
                                            </span>
                                        }
                                    </>
                                )
                            ) : (
                                <span>--</span>
                            )}
                        </div>

                        <div className="w-[15%]">
                            <Username
                                className=" font-inter-medium text-[14px] text-stress"
                                principal_or_account={activity.from}
                            />
                        </div>
                        <div className="w-[15%]">
                            <Username
                                className="font-inter-medium text-[14px] text-symbol"
                                principal_or_account={activity.to}
                            />
                        </div>
                        <div className="w-[10%] font-inter-medium text-[14px] text-stress">
                            {sinceNowByByNano(activity.created)}
                        </div>
                    </div>
                ))}
        </div>
    );
};
function MarketActivity({ collection, data }: { collection: string; data?: UniqueCollectionData }) {
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<CollectionEvent[] | undefined>(undefined);
    useEffect(() => {
        setLoading(true);
        queryCollectionsEvents(collection)
            .then(setList)
            .catch((e) => message.error(`get activity failed: ${e}`))
            .finally(() => setLoading(false));
    }, []);
    const wrappedLoading = list === undefined || (list.length === 0 && loading);

    if (!wrappedLoading) {
        // const end = Date.now();
        // console.debug('Profile Activity spend', `${end - start}ms`);
    }
    return (
        <div className="w-full pt-[30px]">
            {
                // 加载中...
                wrappedLoading && <Loading />
            }
            {
                // 初始化，无数据，不显示
                !wrappedLoading && list === undefined && <></>
            }
            {
                // 加载完成，展示数据
                !wrappedLoading && list !== undefined && list.length === 0 && <Empty />
            }
            {
                // 加载完成，展示数据
                !wrappedLoading && list !== undefined && list.length !== 0 && (
                    <>
                        <div className="w-full overflow-x-scroll px-[15px] md:overflow-x-hidden md:px-[40px]">
                            <div className="flex w-full min-w-[900px] items-center justify-between gap-x-3 font-inter-semibold text-[12px] text-[#999] md:px-[23px] md:text-[14px]">
                                <div className="w-[10%]">Event</div>
                                <div className="w-[30%]">Item</div>
                                <div className="w-[20%]">Price</div>
                                <div className="w-[15%]">From</div>
                                <div className="w-[15%]">To</div>
                                <div className="w-[10%]">Time</div>
                            </div>

                            <div className="mt-[10px] w-auto rounded-[8px] md:border md:border-[#f3f3f3]">
                                <PaginatedItems
                                    className="mt-[65px]"
                                    size={10}
                                    list={list}
                                    Items={({
                                        current,
                                    }: {
                                        current: CollectionEvent[] | undefined;
                                    }) => Items({ current, data })}
                                />
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
}
function MarketCollectionActivity({
    collection,
    data,
}: {
    collection: string;
    data?: UniqueCollectionData;
}) {
    return (
        <div className="flex w-full flex-col justify-center">
            <div className="flex w-full justify-center">
                <DashBoard collection={collection} />
            </div>
            <MarketActivity collection={collection} data={data} />
        </div>
    );
}

export default MarketCollectionActivity;
