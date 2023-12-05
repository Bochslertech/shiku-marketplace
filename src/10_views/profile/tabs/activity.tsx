import { useCallback, useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { sinceNowByByNano } from '@/02_common/data/dates';
import { FirstRenderByData } from '@/02_common/react/render';
import { Spend } from '@/02_common/react/spend';
import { UserActivity } from '@/03_canisters/yumi/yumi_user_record';
import { getLedgerIcpDecimals, getLedgerOgyDecimals } from '@/05_utils/canisters/ledgers/special';
import { queryAllUserActivityList } from '@/05_utils/canisters/yumi/user_record';
import TokenPrice from '@/09_components/data/price';
import Usd from '@/09_components/data/usd';
import NftName from '@/09_components/nft/name';
import NftThumbnail from '@/09_components/nft/thumbnail';
import Empty from '@/09_components/ui/empty';
import Loading from '@/09_components/ui/loading';
import PaginatedItems from '@/09_components/ui/paginated';
import Username from '@/09_components/user/username';

// 有的不是 NFT 的操作也混入到记录里了，需要剔除 2
const INVALID_TOKEN_IDENTIFIERS = [
    'POINT_TX_SUCC',
    'POINT_TX_FALL',
    'ICP_TX_SUCC',
    'ICP_TX_FAIL',
    'SEND_SUBACCOUNT_ICP_FAIL',
    'TO_USER_ICP_TX_SUCC',
    'TO_USER_ICP_TX_FAIL',
    'ICP_TX_SUCC',
    'ICP_TX_FAIL',
];

const loadUserActivityList = (
    account: string,
    setList: (list: UserActivity[]) => void,
    setLoading?: (loading: boolean) => void,
) => {
    setLoading && setLoading(true);

    const spend = Spend.start(`profile activity`);
    queryAllUserActivityList(account)
        .then((list) => {
            // console.warn(`🚀 ~ file: activity.tsx:18 ~ .then ~ list:`, list);
            spend.mark(`${list.length}`);
            list = list.filter((a) => !INVALID_TOKEN_IDENTIFIERS.includes(a.token_identifier));
            spend.mark(`${list.length}`);
            list.reverse(); // 倒序,最新的在前面
            setList(list);
        })
        .finally(() => {
            setLoading && setLoading(false);
        });
};

const Items = ({ current }: { current: UserActivity[] | undefined }) => {
    return (
        <div className="flex flex-col gap-y-5  pt-[20px]">
            {current &&
                current.map((activity) => (
                    <div
                        className="grid h-[69px] min-w-[800px] cursor-pointer grid-cols-activity-table items-center gap-x-3 md:rounded-[8px] md:px-[23px] md:py-[13px] md:hover:shadow-[0_2px_15px_1px_rgba(105,105,105,0.25)] "
                        key={activity.index + activity.token_id}
                    >
                        <div className="flex w-full items-center gap-x-2 overflow-hidden ">
                            <NftThumbnail
                                token_id={activity.token_id}
                                width="w-[41px]"
                                cdn_width={100}
                            />
                            <div className="flex-1 overflow-hidden">
                                <NftName token_id={activity.token_id} />
                            </div>
                        </div>
                        <div className="">
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
                                                    value:
                                                        activity.tokenSymbol === 'ICP'
                                                            ? getLedgerIcpDecimals()
                                                            : activity.tokenSymbol === 'OGY'
                                                            ? getLedgerOgyDecimals()
                                                            : 8,
                                                },
                                                scale: (v) => (v < 0.01 ? 4 : 2),
                                                symbol: activity.tokenSymbol,
                                            }}
                                        />
                                        {activity.tokenSymbol && (
                                            <span className="font-inter-bold text-symbol">
                                                &nbsp;
                                                <Usd
                                                    value={{
                                                        value: activity.price ?? '0',
                                                        decimals: {
                                                            type: 'exponent',
                                                            value:
                                                                activity.tokenSymbol === 'ICP'
                                                                    ? getLedgerIcpDecimals()
                                                                    : activity.tokenSymbol === 'OGY'
                                                                    ? getLedgerOgyDecimals()
                                                                    : 8,
                                                        },
                                                        symbol: activity.tokenSymbol,
                                                        scale: 2,
                                                    }}
                                                    className="text-[14px]"
                                                />
                                            </span>
                                        )}
                                    </>
                                )
                            ) : (
                                <span>--</span>
                            )}
                        </div>

                        <Username
                            className="font-inter-medium text-[14px] text-stress underline"
                            principal_or_account={activity.from}
                        />

                        <Username
                            className="font-inter-medium text-[14px] text-symbol underline"
                            principal_or_account={activity.to}
                        />

                        <div className="font-inter-medium text-[14px] text-stress">
                            {sinceNowByByNano(activity.date)}
                        </div>
                    </div>
                ))}
        </div>
    );
};

function ProfileActivity({ showed, account }: { showed: boolean; account: string }) {
    // console.debug('profile activity', principal);
    // const [start] = useState(Date.now());

    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<UserActivity[] | undefined>(undefined);

    // 定时获取数据并比较更新
    const [once_load] = useState(new FirstRenderByData());
    useEffect(() => {
        once_load.once([account], () => loadUserActivityList(account, setList, setLoading));
    }, [account]);
    const silenceRefreshList = useCallback(() => {
        if (!showed) return; // ? 不显示不更新
        loadUserActivityList(account, setList);
    }, [showed, account]);
    useInterval(silenceRefreshList, 15000);

    const wrappedLoading = list === undefined || (list.length === 0 && loading);

    if (!wrappedLoading) {
        // const end = Date.now();
        // console.debug('Profile Activity spend', `${end - start}ms`);
    }

    if (!showed) return <></>;
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
                        <div className="w-full overflow-x-scroll md:overflow-x-hidden">
                            <div className="grid w-full min-w-[800px] grid-cols-activity-table justify-between gap-x-3   font-inter-semibold text-[12px] text-[#999] md:px-[23px] md:text-[14px]">
                                <div>Item</div>
                                <div className="">Price</div>
                                <div className="">From</div>
                                <div className="">To</div>
                                <div className="">Time</div>
                            </div>

                            <PaginatedItems
                                className="mt-[65px]"
                                size={10}
                                list={list}
                                Items={Items}
                            />
                        </div>
                    </>
                )
            }
        </div>
    );
}

export default ProfileActivity;
