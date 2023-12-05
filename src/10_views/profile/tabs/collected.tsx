import { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useInterval } from 'usehooks-ts';
import { NftMetadata, NftTokenMetadata, NftTokenOwner } from '@/01_types/nft';
import { UniqueCollectionData } from '@/01_types/yumi';
import { principal2account } from '@/02_common/ic/account';
import { isSameNftByTokenId, parseTokenIndex, uniqueKey } from '@/02_common/nft/identifier';
import { FirstRenderByData } from '@/02_common/react/render';
import { Spend } from '@/02_common/react/spend';
import { unchanging } from '@/02_common/types/variant';
import { queryUserGoldNft } from '@/05_utils/apis/yumi/api';
import { queryOwnerTokenMetadata } from '@/05_utils/canisters/nft/nft';
import { getTokenMetadata, getTokenOwners } from '@/05_utils/combined/collection';
import { loadNftCardsByStoredRemote } from '@/05_utils/nft/metadata';
import {
    collectionTokenMetadataStored,
    collectionTokenOwnersStored,
    collectionTokenScoresStored,
    getCccProxyNfts,
} from '@/05_utils/stores/collection.stored';
import { fetchMemoryNftListing } from '@/05_utils/stores/listing.stored';
import { useDeviceStore } from '@/07_stores/device';
import { useIdentityStore } from '@/07_stores/identity';
import { useReloadAllListingData } from '@/08_hooks/interval/nft/listing';
import { useTokenRate } from '@/08_hooks/interval/token_rate';
import ShowNumber from '@/09_components/data/number';
import BatchSalesList from '@/09_components/nft-card/components/batch';
import FilterButton from '@/09_components/nft-card/filter/button';
import FilterCollections, {
    FilterCollection,
    FilterCollectionOption,
} from '@/09_components/nft-card/filter/collections';
import FilterSearch from '@/09_components/nft-card/filter/search';
import FilterSelect from '@/09_components/nft-card/filter/select';
import { SlicedCardsByProfile } from '@/09_components/nft-card/sliced';
import Empty from '@/09_components/ui/empty';
import PaginatedItems from '@/09_components/ui/paginated';
import Refresh from '@/09_components/ui/refresh';
import {
    PROFILE_CARD_SIZE,
    PROFILE_SORT_OPTIONS,
    profileFilterList,
    ProfileSortOption,
    setCollectionOptionsByList,
} from '../common';
import BatchBar from '../components/batch-bar';

const parseCards = (
    owners: NftTokenOwner[],
    token_metadata: NftTokenMetadata[],
    data?: UniqueCollectionData,
): NftMetadata[] => {
    const cards: NftMetadata[] = [];
    for (const o of owners) {
        const metadata = token_metadata.find((m) => isSameNftByTokenId(m, o));
        if (metadata === undefined) {
            console.error(`can not find token metadata for ${uniqueKey(o.token_id)}`);
            continue;
        }
        cards.push({
            data,
            owner: o,
            metadata,
        });
    }
    return cards;
};

const byStored = async (
    collection: string,
    owner: string,
    data?: UniqueCollectionData,
): Promise<NftMetadata[]> => {
    const token_owners = await getTokenOwners(collection, 'stored');
    if (token_owners === undefined) {
        // ! 完全找不到这个集合的所有权数据
        throw new Error(`can not find token owners for ${collection}`);
    }
    const owners = token_owners.filter((o) => o.owner === owner);
    if (owners.length === 0) return [];
    const token_metadata = await getTokenMetadata(collection, {
        from: 'stored',
        token_owners,
    });
    if (token_metadata === undefined) {
        // ! 完全找不到这个集合的元数据
        throw new Error(`can not find token metadata for ${collection}`);
    }
    return parseCards(owners, token_metadata, data);
};

const byExtTokensExt = async (
    collection: string,
    owner: string,
    data?: UniqueCollectionData,
): Promise<NftMetadata[]> =>
    queryOwnerTokenMetadata(collection, owner, data).then((token_metadata) => {
        // 取得了元数据
        const cards: NftMetadata[] = token_metadata.map((m) => ({
            data,
            owner: {
                token_id: m.token_id,
                owner,
                raw: {
                    standard: 'ext', // ! 只有 ext 标准才有
                    data: {
                        index: parseTokenIndex(m.token_id),
                        owner,
                    },
                },
            },
            metadata: m,
        }));
        return cards;
    });

const byStoredRemote = async (
    collection: string,
    owner: string,
    data?: UniqueCollectionData,
): Promise<NftMetadata[]> => {
    const token_owners = await getTokenOwners(collection, 'stored_remote');
    if (token_owners === undefined) {
        // ! 完全找不到这个集合的所有权数据
        throw new Error(`can not find token owners for ${collection}`);
    }
    const owners = token_owners.filter((o) => o.owner === owner);
    if (owners.length === 0) return [];
    const token_metadata = await getTokenMetadata(collection, {
        from: 'stored_remote',
        token_owners,
        data,
    });
    if (token_metadata === undefined) {
        // ! 完全找不到这个集合的元数据
        throw new Error(`can not find token metadata for ${collection}`);
    }
    return parseCards(owners, token_metadata, data);
};

const byRemote = async (
    collection: string,
    owner: string,
    data?: UniqueCollectionData,
): Promise<NftMetadata[]> => {
    const token_owners = await getTokenOwners(collection, 'remote');
    if (token_owners === undefined) {
        // ! 完全找不到这个集合的所有权数据
        throw new Error(`can not find token owners for ${collection}`);
    }
    const owners = token_owners.filter((o) => o.owner === owner);
    if (owners.length === 0) return [];
    const token_metadata = await getTokenMetadata(collection, {
        from: 'remote',
        token_owners,
        data,
    });
    if (token_metadata === undefined) {
        // ! 完全找不到这个集合的元数据
        throw new Error(`can not find token metadata for ${collection}`);
    }
    return parseCards(owners, token_metadata, data);
};

const getNftMetadataByOwner = async (
    collectionDataList: UniqueCollectionData[],
    collection: string,
    owner: string,
    type: 'stored_remote' | 'remote',
): Promise<NftMetadata[]> => {
    const data = collectionDataList.find((d) => d.info.collection === collection);
    return new Promise((resolve) => {
        // 1. 先尝试读取本地缓存
        const spend = Spend.start(`getNftMetadataByOwner ${collection}`, true);
        switch (type) {
            case 'stored_remote': {
                byStored(collection, owner, data)
                    .then((cards) => {
                        spend.mark('load local success');
                        resolve(cards);
                    })
                    .catch((_e) => {
                        byExtTokensExt(collection, owner, data)
                            .then((cards) => {
                                spend.mark('load tokens_ext success');
                                resolve(cards);
                            })
                            .catch((_e) => {
                                byStoredRemote(collection, owner, data)
                                    .then((cards) => {
                                        spend.mark('load stored_remote success');
                                        resolve(cards);
                                    })
                                    .catch((e) => {
                                        console.error(e.message);
                                        spend.mark('load stored_remote failed');
                                        resolve([]);
                                    });
                            });
                    });
                break;
            }
            case 'remote': {
                byExtTokensExt(collection, owner, data)
                    .then((cards) => {
                        spend.mark('load tokens_ext success');
                        resolve(cards);
                    })
                    .catch((_e) => {
                        byRemote(collection, owner, data)
                            .then((cards) => {
                                spend.mark('load remote success');
                                resolve(cards);
                            })
                            .catch((e) => {
                                console.error(e.message);
                                spend.mark('load remote failed');
                                resolve([]);
                            });
                    });
                break;
            }
            default:
                throw new Error(`what a option type: ${type}`);
        }
    });
};

// 检索代理的 NFT
const getProxyNft = async (
    collectionDataList: UniqueCollectionData[],
    account: string,
): Promise<NftMetadata[]> => {
    const spend_proxy = Spend.start(`profile token owners and metadata proxy`, false);
    return getCccProxyNfts().then((list) => {
        list = list.filter((item) => principal2account(item.owner) === account);
        spend_proxy.mark(`proxy success: ${list.length}`);
        return loadNftCardsByStoredRemote(
            collectionDataList,
            list.map((item) => item.token_id),
        );
    });
};

// 加载指定用户所拥有的 NFT, 使用 缓存 单个远程 全部远程
const getNftList = async (
    collectionDataList: UniqueCollectionData[],
    collectionIdList: string[],
    account: string,
): Promise<NftMetadata[]> => {
    const spend_owners = Spend.start(`profile token owners and metadata`, true);
    return Promise.all([
        ...collectionIdList.map((collection) =>
            getNftMetadataByOwner(collectionDataList, collection, account, 'remote'),
        ),
        getProxyNft(collectionDataList, account),
    ]).then((got_cards) => {
        spend_owners.mark(
            `metadata success:${got_cards.map((c) => c.length).reduce((a, b) => a + b, 0)}/${
                got_cards.length
            }`,
        );
        const cards = got_cards.flatMap(unchanging);
        // console.error('all cards', 'remote', cards);
        return cards;
    });
};

const loadNftList = async (
    collectionDataList: UniqueCollectionData[],
    collectionIdList: string[],
    account: string,
    setList: (list: NftMetadata[]) => void,
): Promise<NftMetadata[]> => {
    const all_cards: NftMetadata[] = [];
    const push_card = (cards: NftMetadata[]) => {
        all_cards.push(...cards);
        if (all_cards.length) setList(all_cards);
    };
    const spend_owners = Spend.start(`profile token owners and metadata`, true);
    return Promise.all([
        ...collectionIdList.map(
            (collection) =>
                new Promise<NftMetadata[]>((resolve) => {
                    getNftMetadataByOwner(
                        collectionDataList,
                        collection,
                        account,
                        'stored_remote',
                    ).then((cards) => {
                        push_card(cards);
                        resolve(cards);
                    });
                }),
        ),
        getProxyNft(collectionDataList, account),
    ]).then((got_cards) => {
        spend_owners.mark(
            `metadata success:${got_cards.map((c) => c.length).reduce((a, b) => a + b, 0)}/${
                got_cards.length
            }`,
        );
        const cards = got_cards.flatMap(unchanging);
        console.error('all cards', 'stored_remote', cards);
        setList(cards);
        return cards;
    });
};

function ProfileCollected({
    showed,
    principal,
    account,
    idList,
    collectionDataList,
}: {
    showed: boolean;
    principal: string | undefined;
    account: string;
    idList: string[];
    collectionDataList: UniqueCollectionData[];
}) {
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);

    // console.console.debug('profile collected', principal);
    // const [start] = useState(Date.now());

    // 获取到价格了,也许要重新排序
    const [resort, setResort] = useState(0);
    const doResort = useCallback(() => {
        setResort((resort) => resort + 1);
    }, [resort]);

    // =================== yumi 管理的 列表 ===================
    const [yumiLoading, setYumiLoading] = useState(false);
    const [yumiList, setYumiList] = useState<NftMetadata[] | undefined>(undefined); // 刚开始是 undefined
    const wrappedSetYumiList = (list: NftMetadata[]) => {
        list.forEach((l) => (l.listing = fetchMemoryNftListing(l.metadata.token_id)));
        setYumiList(list);
    };

    // 加载用户收藏的列表
    const loadYumi = () => {
        setYumiList(undefined);
        setYumiLoading(true);
        loadNftList(collectionDataList, idList, account, wrappedSetYumiList).finally(() => {
            setYumiLoading(false);
            getNftList(collectionDataList, idList, account).then(wrappedSetYumiList);
        });
    };
    const [once_load_yumi] = useState(new FirstRenderByData());
    useEffect(() => once_load_yumi.once([account, idList], loadYumi), [account, idList]);

    const silenceRefreshYumiList = useCallback(() => {
        if (!showed) return; // ? 不显示不更新
        getNftList(collectionDataList, idList, account).then(wrappedSetYumiList);
    }, [showed, account, idList, collectionDataList]);

    // 定时获取数据并比较更新
    useInterval(silenceRefreshYumiList, 15000);

    // =================== 黄金列表 ===================

    const [goldLoading, setGoldLoading] = useState(false);
    const [goldList, setGoldList] = useState<NftMetadata[] | undefined>(undefined); // 刚开始是 undefined
    const wrappedSetGoldList = (list: NftMetadata[]) => {
        list.forEach((l) => (l.listing = fetchMemoryNftListing(l.metadata.token_id)));
        setGoldList(list);
    };

    // 加载用户收藏的列表
    const loadGold = () => {
        setGoldList(undefined);
        setGoldLoading(true);
        queryUserGoldNft(principal ?? account)
            .then(wrappedSetGoldList)
            .finally(() => setGoldLoading(false));
    };
    const [once_load_gold] = useState(new FirstRenderByData());
    useEffect(() => once_load_gold.once([principal, account], loadGold), [principal, account]);

    const silenceRefreshGoldList = useCallback(() => {
        if (!showed) return; // ? 不显示不更新
        queryUserGoldNft(principal ?? account).then(wrappedSetGoldList); // 定时获取数据,并比较更新
    }, [showed, principal, account]);

    // 定时获取数据并比较更新
    useInterval(silenceRefreshGoldList, 15000);

    const silenceRefreshList = useCallback(() => {
        silenceRefreshYumiList();
        silenceRefreshGoldList();
    }, [silenceRefreshYumiList, silenceRefreshGoldList]);

    // 购物车更新
    const shoppingCartFlag = useIdentityStore((s) => s.shoppingCartFlag);
    useEffect(silenceRefreshList, [shoppingCartFlag]);

    const [wrappedLoading, setWrappedLoading] = useState(false);
    useEffect(() => {
        const wrappedLoading =
            yumiList === undefined ||
            goldList === undefined ||
            (yumiList.length === 0 && yumiLoading) ||
            (goldList.length === 0 && goldLoading);
        setWrappedLoading(wrappedLoading);
    }, [yumiList, goldList, yumiLoading, goldLoading]);

    const [wrappedList, setWrappedList] = useState<NftMetadata[] | undefined>(undefined);
    useEffect(() => {
        if (yumiList === undefined && goldList === undefined) return setWrappedList(undefined);
        let list = [...(yumiList ?? []), ...(goldList ?? [])];
        list = _.uniqBy(list, (card) => uniqueKey(card.owner.token_id));
        setWrappedList(list);
    }, [yumiList, goldList]);

    if (!wrappedLoading) {
        // console.debug('Profile Collected spend', `${Date.now() - start}ms`);
    }

    // 需要全部刷新上架信息，否则不好排序
    useReloadAllListingData(showed, doResort, wrappedList, [showed, yumiLoading, goldLoading]);

    const onCollectedRefresh = () => {
        if (wrappedLoading) return; // 正在刷新，就不给点击了
        // 1. 清空缓存数据
        collectionTokenOwnersStored.clean();
        collectionTokenMetadataStored.clean();
        collectionTokenScoresStored.clean();
        // 2. 刷新页面
        loadYumi();
        loadGold();
    };

    // 一些过滤问题
    const [openCollectionFilter, setOpenCollectionFilter] = useState(false);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<ProfileSortOption>('price_low_to_high');
    // 集合过滤
    const [collectionOptions, setCollectionOptions] = useState<FilterCollectionOption[]>([]);
    useEffect(() => {
        setCollectionOptionsByList(wrappedList, collectionDataList, setCollectionOptions);
    }, [wrappedList, collectionDataList]);
    const [collections, setCollections] = useState<FilterCollection[]>([]);
    // 在手机端，点开filter的时候，不让屏幕滑动
    useEffect(() => {
        if (isMobile) {
            if (openCollectionFilter) {
                document.body.style.setProperty('overflow', 'hidden');
            } else {
                document.body.style.removeProperty('overflow');
            }

            return () => {
                document.body.style.removeProperty('overflow');
            };
        }
    }, [openCollectionFilter]);

    const { icp_usd, ogy_usd } = useTokenRate();

    // 计算过滤后的列表
    const wrappedFilteredList = useMemo(
        () =>
            profileFilterList(
                wrappedList,
                openCollectionFilter,
                collectionOptions.filter((o) => collections.includes(o.collection)),
                search,
                sort,
                icp_usd,
                ogy_usd,
            ),
        [wrappedList, openCollectionFilter, collections, search, sort],
    );
    const batchSales = useIdentityStore((s) => s.batchSales);
    if (!showed) return <></>;
    return (
        <div className="">
            <div className="mb-[20px] mt-[20px] hidden md:flex">
                <FilterButton open={openCollectionFilter} setOpen={setOpenCollectionFilter} />
                <FilterSearch
                    className={'ml-[25px] mr-[25px] flex-1'}
                    search={search}
                    setSearch={setSearch}
                />
                <FilterSelect
                    className="mt-3 h-12"
                    defaultValue={sort}
                    options={PROFILE_SORT_OPTIONS}
                    setOption={setSort}
                />
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
                        open={openCollectionFilter}
                        setOpen={setOpenCollectionFilter}
                    />
                    <FilterSelect
                        className="h-[30px] w-[216px]"
                        defaultValue={sort}
                        options={PROFILE_SORT_OPTIONS}
                        setOption={setSort}
                    />
                </div>
            </div>
            <div className="mb-[15px] hidden items-center md:flex">
                {wrappedLoading && (
                    <div className="flex items-center font-inter-medium text-[16px] leading-none text-[#999]">
                        Loading Items
                        <div className="flex h-[15px] items-end">
                            <div className="ml-[3px] h-[3px] w-[3px] animate-bounce rounded-full bg-[#999]"></div>
                            <div className="ml-[3px] h-[3px] w-[3px] animate-bounce rounded-full bg-[#999]"></div>
                            <div className="ml-[3px] h-[3px] w-[3px] animate-bounce rounded-full bg-[#999]"></div>
                        </div>
                    </div>
                )}
                {!wrappedLoading && (
                    <>
                        <div className="font-inter-medium text-[16px] text-stress">
                            <div className="flex items-center leading-none">
                                <ShowNumber
                                    value={{
                                        value: wrappedFilteredList?.length.toString(),
                                        thousand: { symbol: ['M', 'K'] },
                                    }}
                                />
                                &nbsp;items&nbsp;
                                {yumiLoading || goldLoading ? (
                                    <div className="flex items-end leading-none">
                                        loading
                                        <div className="flex items-end">
                                            <div className="ml-[3px] h-[3px] w-[3px] animate-bounce rounded-full bg-[#999]"></div>
                                            <div className="ml-[3px] h-[3px] w-[3px] animate-bounce rounded-full bg-[#999]"></div>
                                            <div className="ml-[3px] h-[3px] w-[3px] animate-bounce rounded-full bg-[#999]"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <Refresh
                                        onClick={onCollectedRefresh}
                                        className={' ml-[10px] h-[15px] w-[15px]  cursor-pointer'}
                                        control={wrappedLoading}
                                    />
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
            {
                // 加载中...
                wrappedLoading && (
                    <PaginatedItems
                        className="mt-[65px]"
                        size={PROFILE_CARD_SIZE}
                        list={undefined}
                        Items={SlicedCardsByProfile}
                    />
                )
            }
            {
                // 初始化，无数据，不显示
                !wrappedLoading && wrappedList === undefined && <></>
            }
            {
                // 加载完成，展示数据
                !wrappedLoading && wrappedList !== undefined && wrappedList.length === 0 && (
                    <Empty />
                )
            }
            {
                // 加载完成，展示数据
                !wrappedLoading && wrappedList !== undefined && wrappedList.length !== 0 && (
                    <>
                        <div className="md:flex md:flex-row">
                            {openCollectionFilter && (
                                <div className="fixed left-0 top-[405px] z-40 w-full bg-white px-[15px] md:static md:mr-[12px]  md:w-[327px] md:px-0">
                                    <FilterCollections
                                        value={collections}
                                        options={collectionOptions}
                                        setOptions={setCollections}
                                        setOpen={setOpenCollectionFilter}
                                        loaded={!yumiLoading && !goldLoading}
                                    />
                                </div>
                            )}

                            <div className="w-full md:flex-1">
                                <PaginatedItems
                                    className="mt-[65px]"
                                    size={PROFILE_CARD_SIZE}
                                    list={wrappedFilteredList}
                                    Items={SlicedCardsByProfile}
                                    refreshList={silenceRefreshList}
                                    updateItem={doResort}
                                />
                            </div>
                        </div>
                    </>
                )
            }
            <BatchSalesList />
            {batchSales.length > 0 && <BatchBar list={wrappedFilteredList} />}
        </div>
    );
}

export default ProfileCollected;
