import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ArtistCollectionData, CoreCollectionData } from '@/01_types/yumi';
import { isDevMode } from '@/05_utils/app/env';
import { queryCoreCollectionDataListByBackend } from '@/05_utils/canisters/yumi/core';
import {
    getYumiArtistRouterCanisterId,
    getYumiCoreCanisterId,
    getYumiOrigynArtCanisterId,
} from '@/05_utils/canisters/yumi/special';
import {
    combinedQueryArtistCollectionDataList,
    combinedQueryArtistCollectionIdList,
} from '@/05_utils/combined/yumi/artist_router';
import { combinedQueryCoreCollectionIdList } from '@/05_utils/combined/yumi/core';
import { combinedQueryOrigynArtCollectionIdList } from '@/05_utils/combined/yumi/origyn-art';

const isDev = isDevMode();

// =========================== 用到的集合信息 ===========================

interface CollectionState {
    // 缓存一些关于 Collection 的信息
    // 1. 关注的一些罐子的 id
    storedCoreCollectionIdList: Record<string, string[]>; // ! 不能直接使用,用 useCoreCollectionIdList
    reloadCoreCollectionIdList: () => Promise<string[]>;
    storedArtistCollectionIdList: Record<string, string[]>; // ! 不能直接使用,用 useArtistCollectionIdList
    reloadArtistCollectionIdList: () => Promise<string[]>;
    storedOrigynArtCollectionIdList: Record<string, string[]>; // ! 不能直接使用,用 useOrigynArtCollectionIdList
    reloadOrigynArtCollectionIdList: () => Promise<string[]>;
    // 2. 关注罐子的信息
    storedCoreCollectionDataList: Record<string, CoreCollectionData[]>; // ! 不能直接使用,用 useCoreCollectionDataList
    reloadCoreCollectionDataList: () => Promise<CoreCollectionData[]>;
    storedArtistCollectionDataList: Record<string, ArtistCollectionData[]>; // ! 不能直接使用,用 useArtistCollectionDataList
    reloadArtistCollectionDataList: () => Promise<ArtistCollectionData[]>;
    // // 3. 每个罐子的每个 token 的所有者 // ! 真正的数据从 collectionTokenOwnersStored 读取
    // collectionTokenOwnersFlag: number; // 每个想使用该数据的地方应当监听该数据,然后自己读取
    // noticeCollectionTokenOwnersFlag: () => void;
    // // 4. 每个罐子每个 token 的元数据信息 // ! 真正的数据从 collectionTokenMetadataStored 读取
    // collectionTokenMetadataFlag: number;
    // noticeCollectionTokenMetadataFlag: () => void;
    // // 5. 每个罐子每个 token 的评分排序 // ! 真正的数据从 collectionTokenScoresStored 读取
    // collectionTokenScoresFlag: number;
    // noticeCollectionTokenScoresFlag: () => void;
}

export const useCollectionStore = create<CollectionState>()(
    devtools(
        persist(
            (set, get) => ({
                // 缓存一些关于 Collection 的信息
                // 1. 关注的一些罐子的 id
                storedCoreCollectionIdList: {},
                reloadCoreCollectionIdList: async (): Promise<string[]> => {
                    const backend_canister_id_yumi_core = getYumiCoreCanisterId();
                    const list = await combinedQueryCoreCollectionIdList(
                        backend_canister_id_yumi_core,
                    );
                    set({
                        storedCoreCollectionIdList: {
                            ...get().storedCoreCollectionIdList,
                            [backend_canister_id_yumi_core]: list,
                        },
                    });
                    return list;
                },
                storedArtistCollectionIdList: {},
                reloadArtistCollectionIdList: async (): Promise<string[]> => {
                    const backend_canister_id_yumi_artist_router = getYumiArtistRouterCanisterId();
                    const list = await combinedQueryArtistCollectionIdList(
                        backend_canister_id_yumi_artist_router,
                    );
                    set({
                        storedArtistCollectionIdList: {
                            ...get().storedArtistCollectionIdList,
                            [backend_canister_id_yumi_artist_router]: list,
                        },
                    });
                    return list;
                },
                storedOrigynArtCollectionIdList: {},
                reloadOrigynArtCollectionIdList: async (): Promise<string[]> => {
                    const backend_canister_id_yumi_origyn_art = getYumiOrigynArtCanisterId();
                    const list = await combinedQueryOrigynArtCollectionIdList(
                        backend_canister_id_yumi_origyn_art,
                    );
                    set({
                        storedOrigynArtCollectionIdList: {
                            ...get().storedOrigynArtCollectionIdList,
                            [backend_canister_id_yumi_origyn_art]: list,
                        },
                    });
                    return list;
                },
                // 2. 关注罐子的信息
                storedCoreCollectionDataList: {},
                reloadCoreCollectionDataList: async (): Promise<CoreCollectionData[]> => {
                    const backend_canister_id_yumi_core = getYumiCoreCanisterId();
                    const list = await queryCoreCollectionDataListByBackend(
                        backend_canister_id_yumi_core,
                    );
                    set({
                        storedCoreCollectionDataList: {
                            ...get().storedCoreCollectionDataList,
                            [backend_canister_id_yumi_core]: list,
                        },
                    });
                    return list;
                },
                storedArtistCollectionDataList: {},
                reloadArtistCollectionDataList: async (): Promise<ArtistCollectionData[]> => {
                    const backend_canister_id_yumi_artist_router = getYumiArtistRouterCanisterId();
                    const list = await combinedQueryArtistCollectionDataList(
                        backend_canister_id_yumi_artist_router,
                    );
                    set({
                        storedArtistCollectionDataList: {
                            ...get().storedArtistCollectionDataList,
                            [backend_canister_id_yumi_artist_router]: list,
                        },
                    });
                    return list;
                },
                // // 3. 每个罐子的每个 token 的所有者
                // collectionTokenOwnersFlag: 0,
                // noticeCollectionTokenOwnersFlag: () =>
                //     set({ collectionTokenOwnersFlag: get().collectionTokenOwnersFlag + 1 }),
                // // 4. 每个罐子每个 token 的元数据信息
                // collectionTokenMetadataFlag: 0,
                // noticeCollectionTokenMetadataFlag: () =>
                //     set({ collectionTokenMetadataFlag: get().collectionTokenMetadataFlag + 1 }),
                // // 5. 每个罐子每个 token 的评分排序
                // collectionTokenScoresFlag: 0,
                // noticeCollectionTokenScoresFlag: () =>
                //     set({ collectionTokenScoresFlag: get().collectionTokenScoresFlag + 1 }),
            }),
            {
                name: '__yumi_collection__',
            },
        ),
        {
            enabled: isDev,
        },
    ),
);

isDev && mountStoreDevtool('CollectionStore', useCollectionStore);
