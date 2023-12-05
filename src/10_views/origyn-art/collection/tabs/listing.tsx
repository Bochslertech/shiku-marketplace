import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Image, Skeleton } from 'antd';
import { NftListingData } from '@/01_types/listing';
import { NftMetadata, TokenInfo } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import { parseLowerCaseSearch } from '@/02_common/data/search';
import { uniqueKey } from '@/02_common/nft/identifier';
import { sortCardsByPrice } from '@/02_common/nft/sort';
import { justPreventLink } from '@/02_common/react/link';
import { unwrapVariant } from '@/02_common/types/variant';
import { OrigynArtCollectionData } from '@/03_canisters/yumi/yumi_origyn_art';
import { getNameByNftMetadata, getThumbnailByNftMetadata } from '@/05_utils/nft/metadata';
import { useTokenRate } from '@/08_hooks/interval/token_rate';
import TokenPrice from '@/09_components/data/price';
import { IconLogoLedger } from '@/09_components/icons';
import FilterSearch from '@/09_components/nft-card/filter/search';
import FilterSelect from '@/09_components/nft-card/filter/select';
import PaginatedItems from '@/09_components/ui/paginated';
import { UserAvatarByNavigate } from '@/09_components/user/avatar';

export type OrigynArtListingSortOption = 'price_low_to_high' | 'price_high_to_low';
export const ORIGYN_ART_LISTING_SORT_OPTIONS: {
    value: OrigynArtListingSortOption;
    label: string;
}[] = [
    { value: 'price_low_to_high', label: 'Price: Low to High' },
    { value: 'price_high_to_low', label: 'Price: High to Low' },
];

// 个人中心卡片过滤
export const filterList = (
    wrappedList: NftMetadata[] | undefined,
    search: string, // 集合名称过滤
    sort: OrigynArtListingSortOption,
    icp_usd: string | undefined,
    ogy_usd: string | undefined,
) => {
    if (wrappedList === undefined) return wrappedList;
    let list = [...wrappedList];

    // 1. 名称过滤
    const s = parseLowerCaseSearch(search);
    if (s) {
        list = list.filter((c) => getNameByNftMetadata(c).toLowerCase().indexOf(s) > -1);
    }

    // 2. 排序
    if (list.length > 1) {
        switch (sort) {
            case 'price_low_to_high':
                list = sortCardsByPrice(list, sort, icp_usd, ogy_usd);
                break;
            case 'price_high_to_low':
                list = sortCardsByPrice(list, sort, icp_usd, ogy_usd);
                break;
        }
    }

    return list;
};

function OrigynArtDetailListing({
    collectionData,
    cards,
}: {
    collectionData: OrigynArtCollectionData | undefined;
    cards: NftMetadata[] | undefined;
}) {
    // 过滤条件
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<OrigynArtListingSortOption>('price_low_to_high');

    const { icp_usd, ogy_usd } = useTokenRate();

    const filteredCards = useMemo(
        () => filterList(cards, search, sort, icp_usd, ogy_usd),
        [search, sort, cards],
    );

    return (
        <>
            <div className="mx-auto flex w-full max-w-[1440px] flex-col">
                <div className="mx-auto flex max-w-[1245px] flex-col sm:min-w-[760px] lg:min-w-[1200px]">
                    <div className="mt-[30px] flex h-12 flex-1 flex-shrink-0 flex-col md:flex-row">
                        <FilterSearch
                            className={'ml-[0px] mr-[0px] w-full flex-1 md:mr-[27px] md:w-auto'}
                            search={search}
                            setSearch={setSearch}
                        />
                        <FilterSelect
                            className="mt-3 h-[41px] md:h-[48px]"
                            defaultValue={sort}
                            options={ORIGYN_ART_LISTING_SORT_OPTIONS}
                            setOption={setSort}
                        />
                    </div>
                    <div className=" mt-[20px] flex w-full items-center justify-between">
                        <div className="text-[18px] leading-[23px] text-[#0009]">1000 Items</div>
                    </div>
                    <div className="flex w-screen flex-col sm:w-screen md:w-full lg:w-full">
                        {filteredCards === undefined &&
                            ['', '', '', '', ''].map((_, index) => <ListSkeleton key={index} />)}
                        {filteredCards !== undefined && (
                            <PaginatedItems
                                className="mt-[65px]"
                                size={20}
                                list={filteredCards}
                                Items={(props) => Items(props, collectionData)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrigynArtDetailListing;

const Items = (
    { current, size }: { current: NftMetadata[] | undefined; size?: number },
    collectionData: OrigynArtCollectionData | undefined,
) => {
    return (
        <>
            {!current &&
                size &&
                new Array(size).fill('').map((_, index) => (
                    <div key={index} className="w-screen overflow-hidden md:w-auto">
                        <ListSkeleton />
                    </div>
                ))}
            <div className="flex flex-col gap-y-5">
                {current &&
                    current.map((card) => (
                        <div
                            key={uniqueKey(card.owner.token_id)}
                            className="w-screen overflow-hidden md:w-auto"
                        >
                            <Item collectionData={collectionData} card={card} />
                        </div>
                    ))}
            </div>
        </>
    );
};

function Item({
    collectionData,
    card,
}: {
    collectionData: OrigynArtCollectionData | undefined;
    card: NftMetadata;
}) {
    const { t } = useTranslation();

    const owner: string | undefined = useMemo(() => {
        if (card.owner.raw.standard !== 'ogy') return undefined;
        const account = card.owner.raw.data.account;
        return unwrapVariant(account, 'principal');
    }, [card]);

    return (
        <Link
            to={`/origyn/art/${uniqueKey(card.owner.token_id)}`}
            state={{ card }}
            className="mt-[15px] flex cursor-pointer flex-col rounded-[4px] border border-[#E5E5E5] duration-150 hover:shadow-lg md:mt-[24px] md:flex-row"
        >
            <div className=" flex  w-full flex-col border-b border-[#E5E5E5] md:w-5/12 md:flex-row md:border-b-0 md:border-r">
                <div className="flex items-center p-[15px] pb-[10px] md:p-[30px]">
                    <div className="flex h-[60px] w-[60px] flex-shrink-0" onClick={justPreventLink}>
                        <Image
                            className="h-full w-full"
                            src={cdn(getThumbnailByNftMetadata(card))}
                            alt=""
                        />
                    </div>
                    <div className="ml-[16px] flex flex-col">
                        <div className="line-clamp-2 w-full font-[Inter-Bold] text-[16px] font-bold italic leading-[18px] text-[#151515] md:text-[22px] md:leading-[30px]">
                            {collectionData?.metadata.name ? (
                                collectionData?.metadata.name
                            ) : (
                                <Skeleton.Input />
                            )}
                        </div>
                        <span className="flex items-center">
                            <div className="font-[Inter] text-[14px] text-[#151515]">
                                {collectionData?.metadata.artAuthor ? (
                                    collectionData?.metadata.artAuthor
                                ) : (
                                    <Skeleton.Input />
                                )}{' '}
                                (
                                {collectionData?.metadata.authorBirth ? (
                                    collectionData?.metadata.authorBirth
                                ) : (
                                    <Skeleton.Input />
                                )}
                                )
                            </div>
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex w-full px-[12px] pb-[15px] pt-[15px] md:mx-[50px] md:w-7/12 md:px-0">
                <div className="mr-[15px] flex w-[30%] flex-shrink-0 items-center md:mr-[50px] md:w-[40%]">
                    {owner ? (
                        <UserAvatarByNavigate
                            className="h-[25px] min-w-[25px] rounded-full object-cover md:h-[40px] md:min-w-[40px]"
                            principal_or_account={owner}
                        />
                    ) : (
                        <img
                            className="h-[25px] w-[25px] rounded-full md:h-[40px] md:w-[40px]"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1671632010634_icon-origyn-user.svg',
                            )}
                            alt=""
                        />
                    )}

                    <div className="ml-[10px] flex w-full flex-col truncate">
                        <p className="text-[12px] text-black md:text-[14px]">
                            {t('owned.collection.map.owner')}
                        </p>
                        <p className="truncate text-[12px] font-bold text-[#151515] md:text-[15px]">
                            {owner}
                        </p>
                    </div>
                </div>
                <div className="mr-[15px] flex w-[30%] flex-shrink-0 flex-col justify-center">
                    <p className="text-[12px] text-black md:text-[14px]">
                        {t('owned.collection.map.fraction')}
                    </p>
                    <p className="truncate text-[12px] font-bold text-[#151515] md:text-[15px]">
                        #{card.owner.token_id.token_identifier}
                    </p>
                </div>
                <ShowPrice listing={card.listing} />
            </div>
        </Link>
    );
}

const ShowPrice = ({ listing }: { listing?: NftListingData }) => {
    const { t } = useTranslation();
    const { price, token }: { price?: string; token?: TokenInfo } = (() => {
        if (listing?.listing.type !== 'listing') return {};
        return { price: listing.listing.price, token: listing.listing.token };
    })();
    return (
        <div className="flex flex-1 flex-shrink-0 flex-col justify-center">
            <p className="text-[12px] text-black md:text-[14px]">
                {t('owned.collection.map.price')}
            </p>
            <p className="flex items-center text-[12px] font-bold text-[#151515] md:text-[15px]">
                <IconLogoLedger symbol={token?.symbol} className="mr-1 h-[18px] w-[18px]" />
                {price && token ? (
                    <TokenPrice
                        value={{
                            value: price,
                            token: token,
                            symbol: '',
                            scale: 2,
                            paddingEnd: 2,
                        }}
                    />
                ) : (
                    '--'
                )}{' '}
                {token?.symbol}
            </p>
        </div>
    );
};

function ListSkeleton() {
    return (
        <div className="mt-[15px] flex w-full cursor-pointer flex-col rounded-[4px] border border-[#E5E5E5] md:mt-[24px] md:flex-row">
            <div className="flex w-full flex-col border-b border-[#E5E5E5] md:w-5/12 md:flex-row md:border-none">
                <div className="flex items-center p-[15px] pb-[10px] md:p-[30px]">
                    <div className="flex h-[60px] w-[60px] flex-shrink-0">
                        <Skeleton.Button className="!h-full !w-full" />
                    </div>
                    <div className="ml-[16px] flex flex-col">
                        <div className="w-full  lg:min-w-[260px]">
                            <Skeleton.Input className="!h-[20px] !w-full" />
                        </div>
                        <span className="flex items-center">
                            <Skeleton.Input className="!h-[20px] !w-full" />
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex w-full px-[12px] pb-[15px] pt-[15px] md:mx-[50px] md:w-7/12 md:px-0">
                <div className="mr-[15px] flex w-[30%] flex-shrink-0 items-center md:mr-[50px] md:w-[40%]">
                    <div className="h-[25px] w-[25px] md:h-[40px] md:w-[40px]">
                        <Skeleton.Avatar className="!h-full !w-full" />
                    </div>
                    <div className="ml-[10px] flex w-full flex-col truncate">
                        <div className="text-[12px] text-black md:text-[14px]">
                            <Skeleton.Input className="!h-[20px] !w-[60%] !min-w-0" />
                        </div>
                        <div className="truncate text-[12px] font-bold text-[#151515] md:text-[15px]">
                            <Skeleton.Input className="!h-[20px] !w-full" />
                        </div>
                    </div>
                </div>
                <div className="mr-[15px] flex w-[30%] flex-shrink-0 flex-col justify-center">
                    <div className="text-[12px] text-black md:text-[14px]">
                        <Skeleton.Input className="!h-[20px] !w-[60%] !min-w-0" />
                    </div>
                    <div className="truncate text-[12px] font-bold text-[#151515] md:text-[15px]">
                        <Skeleton.Input className="!h-[20px] !w-full !min-w-0" />
                    </div>
                </div>
                <div className="flex flex-1 flex-shrink-0 flex-col justify-center">
                    <div className="text-[12px] text-black md:text-[14px]">
                        <Skeleton.Input className="!h-[20px] !w-[60%] !min-w-0" />
                    </div>
                    <div className="flex items-center text-[12px] font-bold text-[#151515] md:text-[15px]">
                        <Skeleton.Input className="!h-[20px] !w-full !min-w-0" />
                    </div>
                </div>
            </div>
        </div>
    );
}
