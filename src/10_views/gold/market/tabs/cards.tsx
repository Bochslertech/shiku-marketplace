import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Empty } from 'antd';
import _ from 'lodash';
import { useWindowSize } from 'usehooks-ts';
import { NftMetadata } from '@/01_types/nft';
import { cn } from '@/02_common/cn';
import { uniqueKey } from '@/02_common/nft/identifier';
import { GoldSortOption, GoldWeight } from '@/04_apis/yumi/gold-api';
import { queryGoldNftList } from '@/05_utils/apis/yumi/gold-api';
import { useIdentityStore } from '@/07_stores/identity';
import { useTransactionStore } from '@/07_stores/transaction';
import NftCard, { NftCardSkeleton } from '@/09_components/nft-card';
import FilterSearch from '@/09_components/nft-card/filter/search';
import FilterSelect from '@/09_components/nft-card/filter/select';
import { ROWS } from '@/09_components/nft-card/sliced';
import Sweep from '@/09_components/nft/sweep';
import { PaginatedNextLabel, PaginatedPreviousLabel } from '@/09_components/ui/paginated';
import CardList from './components/card-list';
import FilterGoldWeight from './filter/weight';
import GoldCardOrList, { GoldCardOrListType } from './show/card_list';

// 排序
const SORT_OPTIONS: { value: GoldSortOption; label: string }[] = [
    { value: 'price_low_to_high', label: 'Price: Low to High' },
    { value: 'price_high_to_low', label: 'Price: High to Low' },
];
const GOLD_LIST_SIZE = [
    [2000, 10 * ROWS],
    [1440, 7 * ROWS],
    [1105, 7 * ROWS],
    [848, 5 * ROWS],
    [0, 2 * ROWS],
];
const MAX_SWEEP = 50;
// 队列请求
let requesting = false;
const request_list: (() => Promise<void>)[] = [];
let lastWeight: GoldWeight = '1';
function GoldCards() {
    // 过滤条件
    const [weight, setWeight] = useState<GoldWeight>(lastWeight);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<GoldSortOption>('price_low_to_high');
    // 显示样式
    const [type, setType] = useState<GoldCardOrListType>('card');
    // sweep mode
    const sweepMode = useIdentityStore((s) => s.sweepMode);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);

    // 异步交易成功后刷新列表
    const refreshBatchBuyGoldFlags = useTransactionStore((s) => s.refreshFlags['batch-buy-gold']);

    useEffect(() => setPage(0), [weight]);

    const [list, setList] = useState<NftMetadata[] | undefined>(undefined);
    // console.debug(`🚀 ~ file: cards.tsx:36 ~ GoldCards ~ list:`, list);

    const [refresh, setRefresh] = useState(0);
    const checkAndRefresh = () => {
        if (requesting) return setTimeout(checkAndRefresh, 33); // 等待上个请求返回了, 再继续
        if (request_list.length === 0) return;
        requesting = true;
        const list = request_list.splice(0, request_list.length);
        list[list.length - 1]().finally(() => (requesting = false)); // 直接使用最新的
    };
    // 监听页面宽度
    const { width } = useWindowSize();

    // 动态每页个数
    const [pageSize, setPageSize] = useState<number>(60);
    useEffect(() => {
        if (sweepMode) {
            setPageSize(MAX_SWEEP);
            return;
        }
        if (_.isArray(GOLD_LIST_SIZE)) {
            return setPageSize(() => {
                for (const item of GOLD_LIST_SIZE) {
                    if (item[0] <= width) return item[1];
                }
                return 10;
            });
        }
        setPageSize(10);
    }, [width, sweepMode]);

    // ! 参数触发太快的话, 会异步返回数据, 出现顺序不一致情况, 下面把请求都加入到队列
    const request = useCallback(() => {
        request_list.push(
            async (): Promise<void> =>
                new Promise((resolve) => {
                    queryGoldNftList(weight, search, sort, page + 1, pageSize)
                        .then((d) => {
                            setTotal(d.total);
                            setList(d.data);
                        })
                        .finally(resolve);
                }),
        );
        setTimeout(checkAndRefresh, 0);
    }, [weight, search, sort, page, pageSize]);
    useEffect(() => {
        setList(undefined);
        request();
    }, [weight, search, sort, page, pageSize]);

    // silence更新list
    useEffect(() => {
        request();
    }, [refresh]);

    // silence更新list
    useEffect(() => {
        refreshBatchBuyGoldFlags && request();
    }, [refreshBatchBuyGoldFlags]);

    // 购物车更新
    const goldShoppingCartFlag = useIdentityStore((s) => s.goldShoppingCartFlag);
    const identity = useIdentityStore((s) => s.connectedIdentity);

    useEffect(() => setRefresh((r) => r + 1), [goldShoppingCartFlag]);

    // 分页
    const pageCount = Math.ceil(total / pageSize); // 计算总页数
    // 点击新页面
    const listContainer = useRef<HTMLDivElement>(null);
    const handlePageClick = ({ selected }: { selected: number }) => {
        window.scrollTo({
            top: listContainer.current?.clientTop || 0,
            behavior: 'smooth',
        });
        setPage(selected);
    };
    const filteredListingCards = useMemo(
        () =>
            list?.filter(
                (item) =>
                    item.listing?.listing.type === 'listing' &&
                    !!item &&
                    (identity ? item.owner.owner !== identity.account : true),
            ),
        [list, identity],
    );
    const viewList = sweepMode ? filteredListingCards : list;
    return (
        <>
            <div>
                <div className={`my-[20px] flex w-full flex-col lg:flex-row`}>
                    <div className="flex flex-1">
                        <FilterGoldWeight
                            weight={weight}
                            setWeight={(w) => {
                                setWeight(w);
                                lastWeight = w;
                            }}
                        />
                        <FilterSearch
                            search={search}
                            setSearch={setSearch}
                            placeholder="Search"
                            className="z-2 relative mr-0 h-[36px] flex-1 flex-grow overflow-hidden font-inter-medium text-[16px] placeholder-[#b6b6b6] outline-none lg:mr-[15px] lg:h-12 "
                        />
                    </div>
                    <div className="mt-[10px] flex lg:mt-0 lg:w-[330px]">
                        <FilterSelect
                            defaultValue={sort}
                            options={SORT_OPTIONS}
                            setOption={setSort}
                            className="lg:w-[200px]"
                        />
                        <GoldCardOrList type={type} setType={setType} />
                    </div>
                </div>

                <div ref={listContainer} className="min-h-[60vh]">
                    <div className="w-full @container">
                        <div
                            className={cn(
                                'grid grid-cols-2 grid-rows-1 gap-3 px-0 @md:grid-cols-5 @md:gap-2.5 @lg:grid-cols-7 @2xl:grid-cols-10',
                            )}
                        >
                            {type === 'card' &&
                                viewList === undefined &&
                                new Array(pageSize / 2).fill('').map((_, index) => (
                                    <div key={index} className="mb-[20px] w-full">
                                        <NftCardSkeleton />
                                    </div>
                                ))}
                            {type === 'card' && viewList !== undefined && (
                                <>
                                    {viewList.map((card) => (
                                        <div
                                            className="mb-[20px] w-full"
                                            key={uniqueKey(card.owner.token_id)}
                                        >
                                            <NftCard
                                                mode={':gold'}
                                                card={card}
                                                refreshList={() => setRefresh((r) => r + 1)}
                                            />
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                    {type === 'list' && viewList === undefined && <div className="hidden"></div>}
                    {type === 'list' && viewList !== undefined && <CardList list={viewList} />}
                </div>

                <div className={cn('mt-3 flex w-full justify-center', sweepMode && 'hidden')}>
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
                        renderOnZeroPageCount={() =>
                            !requesting && (!list || list.length === 0) && <Empty />
                        }
                    />
                </div>
            </div>
            {type === 'card' && (
                <Sweep refresh={() => setRefresh((prev) => prev + 1)} list={filteredListingCards} />
            )}
        </>
    );
}

export default GoldCards;
