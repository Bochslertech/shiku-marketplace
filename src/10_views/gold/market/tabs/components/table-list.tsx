import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Empty, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { cn } from '@/02_common/cn';
import { sinceNowByMills } from '@/02_common/data/dates';
import { shrinkText } from '@/02_common/data/text';
import { GoldActivityType } from '@/04_apis/yumi/gold-api';
import { PaginatedNextLabel, PaginatedPreviousLabel } from '@/09_components/ui/paginated';

const TableList = ({ list, total, setPage }) => {
    const [size] = useState(20);
    // 点击新页面
    const handlePageClick = ({ selected }: { selected: number }) => {
        setPage(selected);
    };

    const pageCount = Math.ceil(total / size); // 计算总页数

    return (
        <div className="my-[8px] w-full text-[14px]">
            <div className="mb-[30px] mt-[66px] px-[15px] font-inter-bold text-[18px] lg:px-0">
                Activity
            </div>
            {list && list.length > 0 ? (
                <div className="overflow-auto overflow-x-scroll">
                    <div className="w-full min-w-[1200px] lg:min-w-0">
                        <table className="w-full min-w-full border-collapse rounded-lg border-2 border-transparent md:min-w-0">
                            <thead>
                                <tr className="text-left text-[#999]">
                                    <td style={{ width: '10%' }} className=" p-[10px]">
                                        Event
                                    </td>
                                    <td style={{ width: '20%' }}>Item</td>
                                    <td style={{ width: '20%' }}>Price</td>
                                    <td style={{ width: '20%' }}>From</td>
                                    <td style={{ width: '20%' }}>To</td>
                                    <td style={{ width: '10%' }}>Time</td>
                                </tr>
                            </thead>
                        </table>
                        <table className="w-full min-w-full border-separate rounded-[16px] border-2 border-[#e7e7e7] md:min-w-0">
                            <tbody>
                                {list.map((item: GoldActivityType, index: number) => (
                                    <tr
                                        className="px-[4px] py-[3px] text-left"
                                        key={`${item.collection} + ${index}`}
                                    >
                                        <td
                                            style={{ width: '10%' }}
                                            className=" px-[10px] py-[15px]"
                                        >
                                            {' '}
                                            {item.type}
                                        </td>
                                        <td style={{ width: '20%' }}>{item.token_id}</td>
                                        <td style={{ width: '20%' }} className="font-bold">
                                            {item.token_amount
                                                ? (item.token_amount / 1e8).toFixed(2)
                                                : '--'}
                                            <span className="ml-[5px] text-[14px] font-normal text-symbol">
                                                {item.token_symbol}≈$
                                                {item.usd_price ? item.usd_price.toFixed(2) : '--'}
                                            </span>
                                        </td>
                                        <td style={{ width: '20%' }}>
                                            <Tooltip
                                                title={item.from}
                                                style={{ borderRadius: '6px', color: '#000' }}
                                            >
                                                {shrinkText(item.from)}
                                            </Tooltip>
                                        </td>

                                        <td style={{ width: '20%' }}>
                                            <Tooltip
                                                title={item.to}
                                                style={{ borderRadius: '6px', color: '#000' }}
                                            >
                                                {shrinkText(item.to)}
                                            </Tooltip>
                                        </td>
                                        <td style={{ width: '10%' }}>
                                            {sinceNowByMills(
                                                dayjs(item.timestamp).toDate().getTime(),
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                ''
            )}
            <div className={cn(['mt-3 flex w-full justify-center'])}>
                <ReactPaginate
                    className="flex items-center gap-x-3"
                    previousLabel={<PaginatedPreviousLabel />}
                    breakLabel="..."
                    nextLabel={<PaginatedNextLabel />}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    pageClassName="text-sm text-[#0003]"
                    activeClassName="!text-black"
                    renderOnZeroPageCount={() => <Empty />}
                />
            </div>
        </div>
    );
};
export default TableList;
