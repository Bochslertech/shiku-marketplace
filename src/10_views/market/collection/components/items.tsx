import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';
import { NftMetadata, NftTokenOwner } from '@/01_types/nft';
import { CoreCollectionData } from '@/01_types/yumi';
import { cn } from '@/02_common/cn';
import { exponentNumber } from '@/02_common/data/numbers';
import { parseLowerCaseSearch } from '@/02_common/data/search';
import { parse_token_index } from '@/02_common/nft/ext';
import { sortCardsByPrice } from '@/02_common/nft/sort';
import { Spend } from '@/02_common/react/spend';
import { getLedgerIcpDecimals } from '@/05_utils/canisters/ledgers/special';
import { getNameByNftMetadata } from '@/05_utils/nft/metadata';
import { useDeviceStore } from '@/07_stores/device';
import { useIdentityStore } from '@/07_stores/identity';
import { useTransactionStore } from '@/07_stores/transaction';
import { useTokenRate } from '@/08_hooks/interval/token_rate';
import { useCollectionCards } from '@/08_hooks/views/market';
import { IconCloseModal } from '@/09_components/icons';
import FilterButton from '@/09_components/nft-card/filter/button';
import FilterPriceTraits, {
    FilterPriceTraitsCondition,
} from '@/09_components/nft-card/filter/price_traits';
import FilterSearch from '@/09_components/nft-card/filter/search';
import FilterSelect from '@/09_components/nft-card/filter/select';
import NftCardGrid, { NftGridType } from '@/09_components/nft-card/show/grid';
import {
    ROWS,
    SlicedCardsByMarketMiddle,
    SlicedCardsByMarketSmall,
} from '@/09_components/nft-card/sliced';
import Sweep from '@/09_components/nft/sweep';
import PaginatedItems from '@/09_components/ui/paginated';

// 排序
type SortOption =
    | 'price_low_to_high'
    | 'price_high_to_low'
    | 'minting'
    | 'viewed'
    | 'favorited'
    | 'rarity_low_to_high'
    | 'rarity_high_to_low';
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'price_low_to_high', label: 'Price: Low to High' },
    { value: 'price_high_to_low', label: 'Price: High to Low' },
    { value: 'minting', label: 'Minting' },
    { value: 'viewed', label: 'Most viewed' },
    { value: 'favorited', label: 'Most favorited' },
    { value: 'rarity_low_to_high', label: 'Rarity: Low to High' },
    { value: 'rarity_high_to_low', label: 'Rarity: High to Low' },
];

// 个人中心卡片过滤
export const filterList = (
    wrappedList: NftMetadata[] | undefined,
    condition: FilterPriceTraitsCondition, // 价格和属性过滤
    search: string, // 集合名称过滤
    sort: SortOption,
    icp_usd: string | undefined,
    ogy_usd: string | undefined,
) => {
    if (wrappedList === undefined) return wrappedList;
    let list = [...wrappedList];

    // 1. 价格和属性过滤
    // 价格过滤
    const min = condition.price.min ? Number(condition.price.min) : undefined;
    const max = condition.price.max ? Number(condition.price.max) : undefined;
    const listing = condition.listing;
    if (min !== undefined || max !== undefined || listing) {
        list = list.filter((c) => {
            if (c.listing === undefined) return false;
            if (c.listing.listing.type !== 'listing') return false;
            const price = Number(exponentNumber(c.listing.listing.price, -getLedgerIcpDecimals()));
            if (min !== undefined && price < min) return false;
            if (max !== undefined && max < price) return false;
            return true;
        });
    }
    // 属性过滤
    const traits = condition.traits
        .flatMap((a) =>
            a.values.map((v) => {
                if (!v.chosen) return undefined;
                return {
                    name: a.name,
                    value: v.value,
                };
            }),
        )
        .filter((c) => c !== undefined);
    if (traits.length) {
        list = list.filter((c) => {
            for (const trait of traits) {
                const attr = c.metadata.metadata.traits.find((a) => a.name.trim() === trait!.name);
                if (attr === undefined) return false;
                if (attr.value.trim() !== trait!.value) return false;
            }
            return true;
        });
    }

    // 2. 名称过滤
    const s = parseLowerCaseSearch(search);
    if (s) {
        list = list.filter((c) => getNameByNftMetadata(c).toLowerCase().indexOf(s) > -1);
    }

    // 3. 排序
    if (list.length > 1) {
        switch (sort) {
            case 'price_low_to_high':
                list = sortCardsByPrice(list, sort, icp_usd, ogy_usd);
                break;
            case 'price_high_to_low':
                list = sortCardsByPrice(list, sort, icp_usd, ogy_usd);
                break;
            case 'minting':
                list = _.sortBy(list, [
                    (s) =>
                        s.owner.raw.standard !== 'ogy'
                            ? parse_token_index(s.owner.token_id.token_identifier)
                            : s.owner.token_id.token_identifier,
                ]);
                break;
            case 'viewed':
                list = _.sortBy(list, [(s) => s.listing?.views && -s.listing.views]);
                break;
            case 'favorited':
                list = _.sortBy(list, [(s) => s.listing?.favorited && -s.listing.favorited.length]);
                break;
            case 'rarity_low_to_high':
                list = _.sortBy(list, [(s) => s.score?.score.order && -s.score.score.order]);
                break;
            case 'rarity_high_to_low':
                list = _.sortBy(list, [(s) => s.score?.score.order && s.score.score.order]);
                break;
            default:
                break;
        }
    }

    return list;
};

const FilterCards = ({
    condition,
    setCondition,
}: {
    condition: FilterPriceTraitsCondition;
    setCondition: (condition: FilterPriceTraitsCondition) => void;
}) => {
    const min = condition.price.min ? Number(condition.price.min) : undefined;
    const max = condition.price.max ? Number(condition.price.max) : undefined;
    const hasValue =
        condition.listing ||
        min !== undefined ||
        max !== undefined ||
        condition.traits.some((t) => t.values.some((v) => v.chosen));
    return (
        <div className={cn('flex gap-x-[15px]', hasValue && 'mb-[20px]')}>
            {condition.listing && (
                <div className="flex w-fit items-center gap-x-[30px] rounded-[8px] border-[2px] border-[#666] px-[14px] py-[9px] ">
                    <div className="text-[14px] text-symbol">Listing</div>
                    <IconCloseModal
                        className="h-[10px] w-[10px] cursor-pointer"
                        onClick={() => {
                            setCondition({ ...condition, listing: false });
                        }}
                    />
                </div>
            )}
            {(min || max) && (
                <div className="flex w-fit items-center rounded-[8px] border-[2px] border-[#666] px-[14px] py-[9px] ">
                    <div className="text-[14px] text-symbol">Price: </div>

                    <div className="ml-[2px]">{`${min || 0}~${max || 'No Limit'}`}</div>
                    <IconCloseModal
                        className="ml-[30px] h-[10px] w-[10px] cursor-pointer"
                        onClick={() => {
                            setCondition({ ...condition, price: { min: '', max: '' } });
                        }}
                    />
                </div>
            )}
            {condition.traits.map((item, index) => {
                const chosen = item.values.filter((v) => v.chosen).map((v) => v.value);
                return (
                    chosen &&
                    chosen.length > 0 && (
                        <div
                            key={item.name + index}
                            className="flex w-fit items-center rounded-[8px] border-[2px] border-[#666] px-[14px] py-[9px] "
                        >
                            <div className="text-[14px] capitalize text-symbol">{item.name}: </div>

                            <div className="ml-[2px]">{chosen.join(',')}</div>
                            <IconCloseModal
                                className="ml-[30px] h-[10px] w-[10px] cursor-pointer"
                                onClick={() => {
                                    item.values.forEach((v) => (v.chosen = false));
                                    setCondition({ ...condition, traits: [...condition.traits] });
                                }}
                            />
                        </div>
                    )
                );
            })}
        </div>
    );
};

function MarketCollectionItems({
    collection,
    data,
    owners,
    loading,
}: {
    collection: string;
    data: CoreCollectionData;
    owners: NftTokenOwner[];
    loading: boolean;
}) {
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);

    const { state }: { state?: { trait?: string; value?: string } } = useLocation();
    const chosenTrait = useMemo(() => {
        const name = state?.trait;
        const value = state?.value;
        if (!name || !value) return undefined;
        return { name, value };
    }, [state]);

    const flag = useTransactionStore((s) => s.flag);

    const { metadata, cards, refreshListings } = useCollectionCards(collection, data, owners);

    const [flag2, setFlag2] = useState(flag);
    useEffect(() => {
        if (flag !== flag2) {
            setFlag2(flag);
            refreshListings();
        }
    }, [flag, flag2]);

    const [spend_cards] = useState(Spend.start(`market cards`));
    useEffect(() => spend_cards.mark(`cards is ${cards?.length}`), [cards]);
    const identity = useIdentityStore((s) => s.connectedIdentity);
    const sweepMode = useIdentityStore((s) => s.sweepMode);
    // 启动价格属性过滤开关
    const [openPriceTraitsFilter, setOpenPriceTraitsFilter] = useState(false);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<SortOption>('price_low_to_high');
    const [grid, setGrid] = useState<NftGridType>('small');
    const [condition, setCondition] = useState<FilterPriceTraitsCondition>({
        price: { min: '', max: '' },
        traits: [],
    });

    // 初始属性判断
    useEffect(() => {
        if (isMobile) return;
        if (!chosenTrait) return;
        setOpenPriceTraitsFilter(true);
    }, [isMobile, chosenTrait]);

    const { icp_usd, ogy_usd } = useTokenRate();

    const [update, setUpdate] = useState(0);
    const updateItem = useCallback(() => setUpdate((update) => update + 1), []);

    // 计算过滤后的列表
    const filteredCards = useMemo(
        () => filterList(cards, condition, search, sort, icp_usd, ogy_usd),
        [cards, condition, search, sort, update],
    );
    const filteredListingCards = useMemo(
        () =>
            filteredCards?.filter(
                (item) =>
                    item.listing?.listing.type === 'listing' &&
                    !!item &&
                    (identity ? item.owner.owner !== identity.account : true),
            ),
        [filteredCards],
    );

    return (
        <div className="min-h-[50vh] px-[15px] md:px-[40px]">
            <div className="mb-[20px] mt-[20px] hidden md:flex">
                <FilterButton open={openPriceTraitsFilter} setOpen={setOpenPriceTraitsFilter} />
                <FilterSearch
                    className={'ml-[25px] mr-[25px] flex-1'}
                    search={search}
                    setSearch={setSearch}
                />
                <FilterSelect
                    className="mt-3 h-12"
                    defaultValue={sort}
                    options={SORT_OPTIONS}
                    setOption={setSort}
                />
                <NftCardGrid grid={grid} setGrid={setGrid} />
            </div>
            <div className="mb-[14px] mt-[15px] block md:hidden">
                <FilterSearch
                    className={'h-[30px] w-full rounded-[6px]'}
                    search={search}
                    setSearch={setSearch}
                    placeholder={'Collection name'}
                />
                <div className="mt-[15px] flex items-center justify-between">
                    <FilterButton
                        className="h-[30px] w-[115px]"
                        open={openPriceTraitsFilter}
                        setOpen={setOpenPriceTraitsFilter}
                    />
                    <FilterSelect
                        className="h-[30px] w-[216px]"
                        defaultValue={sort}
                        options={SORT_OPTIONS}
                        setOption={setSort}
                    />
                </div>
                <NftCardGrid grid={grid} setGrid={setGrid} />
            </div>
            {loading && (
                <PaginatedItems
                    className="mt-[65px]"
                    size={
                        grid === 'small'
                            ? [
                                  [2000, 20],
                                  [1440, 14],
                                  [1105, 14],
                                  [848, 10],
                                  [0, 10],
                              ]
                            : [
                                  [2000, 16],
                                  [1440, 12],
                                  [1105, 12],
                                  [848, 8],
                                  [0, 8],
                              ]
                    }
                    list={undefined}
                    Items={grid === 'middle' ? SlicedCardsByMarketMiddle : SlicedCardsByMarketSmall}
                />
            )}
            {!loading && (
                <>
                    <div className="flex gap-x-[15px]">
                        {openPriceTraitsFilter && (
                            <FilterPriceTraits
                                condition={condition}
                                setCondition={setCondition}
                                metadata={metadata}
                                setOpen={setOpenPriceTraitsFilter}
                            />
                        )}
                        <div className="flex flex-1 flex-col">
                            {!isMobile && (
                                <FilterCards condition={condition} setCondition={setCondition} />
                            )}
                            <PaginatedItems
                                size={
                                    grid === 'small'
                                        ? [
                                              [2000, 10 * ROWS],
                                              [1440, 7 * ROWS],
                                              [1105, 7 * ROWS],
                                              [848, 5 * ROWS],
                                              [0, 2 * ROWS],
                                          ]
                                        : [
                                              [2000, 8 * ROWS],
                                              [1440, 6 * ROWS],
                                              [1105, 6 * ROWS],
                                              [848, 4 * ROWS],
                                              [0, 2 * ROWS],
                                          ]
                                }
                                list={sweepMode ? filteredListingCards : filteredCards}
                                Items={
                                    grid === 'middle'
                                        ? SlicedCardsByMarketMiddle
                                        : SlicedCardsByMarketSmall
                                }
                                updateItem={updateItem}
                            />
                        </div>
                    </div>
                </>
            )}
            <Sweep update={updateItem} refresh={refreshListings} list={filteredListingCards} />
        </div>
    );
}

export default MarketCollectionItems;
