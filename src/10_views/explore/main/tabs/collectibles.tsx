import { useState } from 'react';
import { useMemo } from 'react';
import _ from 'lodash';
import { parseLowerCaseSearch } from '@/02_common/data/search';
import { isYumiSpecialCollection } from '@/02_common/yumi';
import { CollectibleCollection, useExploreCollectiblesDataList } from '@/08_hooks/views/explore';
import FilterSearch from '@/09_components/nft-card/filter/search';
import FilterSelect from '@/09_components/nft-card/filter/select';
import { ROWS } from '@/09_components/nft-card/sliced';
import { CollectionCard, CollectionCardSkeleton } from '@/09_components/nft/collection-card';
import PaginatedItems from '@/09_components/ui/paginated';
import Refresh from '@/09_components/ui/refresh';

// 排序
type SortOption =
    | 'recently'
    | 'listing_low_to_high'
    | 'listing_high_to_low'
    | 'volume_low_to_high'
    | 'volume_high_to_low'
    | 'floor_low_to_high'
    | 'floor_high_to_low'
    | 'alphabetical_a_z'
    | 'alphabetical_z_a';
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'recently', label: 'Recently listed' },
    { value: 'listing_low_to_high', label: 'Listings: Low to High' },
    { value: 'listing_high_to_low', label: 'Listings: High to Low' },
    { value: 'volume_low_to_high', label: 'Total Volume: Low to High' },
    { value: 'volume_high_to_low', label: 'Total Volume: High to Low' },
    { value: 'floor_low_to_high', label: 'Floor Price: Low to High' },
    { value: 'floor_high_to_low', label: 'Floor Price: High to Low' },
    { value: 'alphabetical_a_z', label: 'Alphabetically: A-Z' },
    { value: 'alphabetical_z_a', label: 'Alphabetically: Z-A' },
];

const getRecentlyValue = (c: CollectibleCollection): bigint | undefined =>
    c.data.metadata?.createTime ? -BigInt(c.data.metadata?.createTime) : undefined;
const getListingValue = (c: CollectibleCollection): bigint | undefined =>
    c.data.metadata?.listings ? BigInt(c.data.metadata.listings.length) : undefined;
const getReverseListingValue = (c: CollectibleCollection): bigint | undefined =>
    c.data.metadata?.listings ? -BigInt(c.data.metadata.listings.length) : undefined;
const getVolumeValue = (c: CollectibleCollection): bigint | undefined =>
    c.data.metadata?.volumeTrade
        ? BigInt(c.data.metadata.volumeTrade)
        : c.statistic?.volume
        ? BigInt(c.statistic.volume)
        : undefined;
const getReverseVolumeValue = (c: CollectibleCollection): bigint | undefined =>
    c.data.metadata?.volumeTrade
        ? -BigInt(c.data.metadata?.volumeTrade)
        : c.statistic?.volume
        ? -BigInt(c.statistic.volume)
        : undefined;
const getFloorValue = (c: CollectibleCollection): bigint | undefined =>
    c.data.metadata?.floorPrice
        ? BigInt(c.data.metadata?.floorPrice)
        : c.statistic?.floor
        ? BigInt(c.statistic.floor)
        : undefined;
const getReverseFloorValue = (c: CollectibleCollection): bigint | undefined =>
    c.data.metadata?.floorPrice
        ? -BigInt(c.data.metadata?.floorPrice)
        : c.statistic?.floor
        ? -BigInt(c.statistic.floor)
        : undefined;

// 集合卡片过滤
export const collectiblesFilterList = (
    list: CollectibleCollection[] | undefined,
    search: string, // 集合名称过滤
    sort: SortOption,
) => {
    if (list === undefined) return list;
    list = [...list];
    // 1. 名称过滤
    const s = parseLowerCaseSearch(search);
    if (s) {
        list = list.filter((c) => c.data.info.name.toLowerCase().indexOf(s) > -1);
    }
    // 2. 排序
    if (list.length > 1) {
        switch (sort) {
            case 'recently':
                list = _.sortBy(list, [getRecentlyValue]);
                break;
            case 'listing_low_to_high':
                list = _.sortBy(list, [getListingValue]);
                break;
            case 'listing_high_to_low':
                list = _.sortBy(list, [getReverseListingValue]);
                break;
            case 'volume_low_to_high':
                list = _.sortBy(list, [getVolumeValue]);
                break;
            case 'volume_high_to_low':
                list = _.sortBy(list, [getReverseVolumeValue]);
                break;
            case 'floor_low_to_high':
                list = _.sortBy(list, [getFloorValue]);
                break;
            case 'floor_high_to_low':
                list = _.sortBy(list, [getReverseFloorValue]);
                break;
            case 'alphabetical_a_z':
                list = _.sortBy(list, [(s) => s.data.info.name]);
                break;
            case 'alphabetical_z_a':
                list = _.sortBy(list, [(s) => s.data.info.name]);
                _.reverse(list);
                break;
            default:
                break;
        }
    }
    // ? 3. 额外的一些集合要排在后面
    list = _.sortBy(list, [
        (s) => (isYumiSpecialCollection(s.data.info.name, s.data.info.collection) ? 1 : 0),
    ]);
    return list;
};

function ExploreCollectibles({ show }: { show: boolean }) {
    // 获取总的列表
    const { list, reload } = useExploreCollectiblesDataList();
    // 过滤条件
    const [search, setSearch] = useState('');
    // 排序条款
    const [sort, setSort] = useState<SortOption>('volume_high_to_low');

    const filteredList = useMemo(
        () => collectiblesFilterList(list, search, sort),
        [list, search, sort],
    );

    if (!show) return <></>;
    return (
        // 手机端FilterSearch和FilterSelect要调换位置
        <div className="flex flex-col">
            <div className="mt-[30px] flex h-12 flex-1 flex-shrink-0 flex-col md:flex-row">
                <div className="flex w-full">
                    <div className="mr-5 flex h-12 w-12 cursor-pointer items-center justify-center rounded-[8px] bg-[#F6F6F6]">
                        <Refresh onClick={reload} control={!list} />
                    </div>
                    <FilterSearch
                        className={
                            'ml-[0px] mr-[0px] hidden w-full flex-1 md:mr-[27px] md:flex md:w-auto'
                        }
                        search={search}
                        setSearch={setSearch}
                    />
                    <FilterSelect
                        defaultValue={sort}
                        className="ml-[0px] mr-[0px] w-full flex-1 md:mr-[27px] md:hidden md:w-auto"
                        options={SORT_OPTIONS}
                        setOption={setSort}
                    />
                </div>

                <FilterSelect
                    defaultValue={sort}
                    className="mt-[10px] hidden h-12 md:mt-0 md:block"
                    options={SORT_OPTIONS}
                    setOption={setSort}
                />
                <FilterSearch
                    className={'mt-[10px] h-12 w-full md:mt-0 md:hidden'}
                    search={search}
                    setSearch={setSearch}
                />
            </div>

            <PaginatedItems
                size={[
                    [2000, 8 * ROWS],
                    [1440, 6 * ROWS],
                    [1105, 6 * ROWS],
                    [848, 4 * ROWS],
                    [0, 2 * ROWS],
                ]}
                list={filteredList}
                Items={Items}
            />
        </div>
    );
}

export default ExploreCollectibles;

const Items = ({
    current,
    size,
}: {
    current: CollectibleCollection[] | undefined;
    size?: number;
}) => {
    return (
        <div className="w-full @container">
            <div className="mb-8 grid w-full grid-cols-2 gap-x-[15px] gap-y-[15px] pt-6 md:mx-auto md:grid-cols-3 md:gap-x-[28px]  md:gap-y-[25px] lg:grid-cols-4 xl:grid-cols-5  2xl:grid-cols-7 3xl:grid-cols-8">
                {!current &&
                    size &&
                    new Array(size)
                        .fill('')
                        .map((_, index) => <CollectionCardSkeleton key={index} />)}
                {current &&
                    current.map((item) => (
                        <CollectionCard
                            key={item.data.info.collection}
                            collection={item.data.info.collection}
                            statistic={item.statistic}
                            data={item.data}
                        />
                    ))}
            </div>
        </div>
    );
};
