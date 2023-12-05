import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import _ from 'lodash';
import { useWindowSize } from 'usehooks-ts';
import { cn } from '@/02_common/cn';
import Empty from './empty';

export const PaginatedNextLabel = ({ className }: { className?: string }) => {
    return (
        <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="right"
            width="1em"
            height="1em"
            fill="currentColor"
            className={cn('h-3 w-3', className)}
            aria-hidden="true"
        >
            <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
        </svg>
    );
};

export const PaginatedPreviousLabel = ({ className }: { className?: string }) => {
    return (
        <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="left"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
            className={cn('h-3 w-3', className)}
        >
            <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
        </svg>
    );
};

function PaginatedItems<T>({
    size,
    list,
    Items,
    refreshList,
    updateItem,
    className,
}: {
    size: number | ((width: number) => number) | [number, number][]; // 每页个数
    list: T[] | undefined; // 总内容
    Items: React.FunctionComponent<{
        current: T[] | undefined;
        refreshList?: () => void;
        updateItem?: (item: T) => void;
        size?: number;
    }>; // 显示组件
    refreshList?: () => void;
    updateItem?: (item: T) => void;
    className?: string;
}) {
    // 监听页面宽度
    const { width } = useWindowSize();

    // 动态每页个数
    const [pageSize, setPageSize] = useState(10);
    useEffect(() => {
        if (typeof size === 'number') return setPageSize(size);
        if (typeof size === 'function') return setPageSize(size(width));
        if (_.isArray(size)) {
            return setPageSize(() => {
                for (const item of size) {
                    if (item[0] <= width) return item[1];
                }
                return 10;
            });
        }
        setPageSize(10);
    }, [size, width]);

    const wrappedList = list ?? [];

    // 当前页码起始序号
    const [offset, setOffset] = useState(0);
    // 当前页码最终序号
    const endOffset = offset + pageSize;
    const current = wrappedList.slice(offset, endOffset); // 取出当前页数的内容
    const pageCount = Math.ceil(wrappedList.length / pageSize); // 计算总页数
    const [curPage, setCurPage] = useState(0);
    const maxPage = Math.ceil(wrappedList.length / pageSize) - 1;
    // 点击新页面
    const handlePageClick = ({ selected }: { selected: number }) => {
        setCurPage(selected);
        const newOffset = (selected * pageSize) % wrappedList.length; // 新选择的页码
        setOffset(newOffset);
    };

    // 第一个偏移量必须有值
    useEffect(() => {
        if (!list) return;
        if (offset < list.length) return;
        setOffset(0);
        setCurPage(0);
    }, [list, offset]);

    return (
        <>
            <Items
                current={list ? current : undefined}
                refreshList={refreshList}
                updateItem={updateItem}
                size={pageSize}
            />

            {list && (
                <div className={cn(['mt-3 flex w-full justify-center'], className)}>
                    <ReactPaginate
                        className="flex items-center gap-x-3"
                        previousLabel={
                            <PaginatedPreviousLabel
                                className={cn(curPage === 0 && 'cursor-not-allowed opacity-30')}
                            />
                        }
                        breakLabel="..."
                        nextLabel={
                            <PaginatedNextLabel
                                className={cn(
                                    curPage === maxPage && 'cursor-not-allowed opacity-30',
                                )}
                            />
                        }
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        pageClassName="text-sm text-[#0003]"
                        activeClassName="!text-black"
                        renderOnZeroPageCount={() => <Empty />}
                    />
                </div>
            )}
        </>
    );
}

export default PaginatedItems;
