import { useEffect, useState } from 'react';
import _ from 'lodash';
import { ArtistCollectionData, CoreCollectionData, UniqueCollectionData } from '@/01_types/yumi';
import {
    getYumiArtistRouterCanisterId,
    getYumiCoreCanisterId,
    getYumiOrigynArtCanisterId,
} from '@/05_utils/canisters/yumi/special';
import { useCollectionStore } from '@/07_stores/collection';

// ============== Core 罐子的 id 列表 ==============

export const useCoreCollectionIdList = (): string[] | undefined => {
    const backend_canister_id_yumi_core = getYumiCoreCanisterId();
    const storedCoreCollectionIdList = useCollectionStore((s) => s.storedCoreCollectionIdList);

    const [list, setList] = useState<string[] | undefined>(undefined);
    useEffect(() => {
        setList(storedCoreCollectionIdList[backend_canister_id_yumi_core]);
    }, [storedCoreCollectionIdList]);

    return list;
};

// ============== ArtistRouter 罐子的 id 列表 ==============

export const useArtistCollectionIdList = (): string[] | undefined => {
    const backend_canister_id_yumi_artist_router = getYumiArtistRouterCanisterId();
    const storedArtistCollectionIdList = useCollectionStore((s) => s.storedArtistCollectionIdList);

    const [list, setList] = useState<string[] | undefined>(undefined);
    useEffect(() => {
        setList(storedArtistCollectionIdList[backend_canister_id_yumi_artist_router]);
    }, [storedArtistCollectionIdList]);

    return list;
};

// ============== OrigynArt 罐子的 id 列表 ==============

export const useOrigynArtCollectionIdList = (): string[] | undefined => {
    const backend_canister_id_yumi_origyn_art = getYumiOrigynArtCanisterId();
    const storedOrigynArtCollectionIdList = useCollectionStore(
        (s) => s.storedOrigynArtCollectionIdList,
    );

    const [list, setList] = useState<string[] | undefined>(undefined);
    useEffect(() => {
        setList(storedOrigynArtCollectionIdList[backend_canister_id_yumi_origyn_art]);
    }, [storedOrigynArtCollectionIdList]);

    return list;
};

// ============== Core 罐子的 data 列表 ==============

export const useCoreCollectionDataList = (): CoreCollectionData[] | undefined => {
    const backend_canister_id_yumi_core = getYumiCoreCanisterId();
    const storedCoreCollectionDataList = useCollectionStore((s) => s.storedCoreCollectionDataList);

    const [list, setList] = useState<CoreCollectionData[] | undefined>(undefined);
    useEffect(() => {
        setList(storedCoreCollectionDataList[backend_canister_id_yumi_core]);
    }, [storedCoreCollectionDataList]);

    return list;
};

// ============== ArtistRouter 罐子的 data 列表 ==============

export const useArtistCollectionDataList = (): ArtistCollectionData[] | undefined => {
    const backend_canister_id_yumi_artist_router = getYumiArtistRouterCanisterId();
    const storedArtistCollectionDataList = useCollectionStore(
        (s) => s.storedArtistCollectionDataList,
    );

    const [list, setList] = useState<CoreCollectionData[] | undefined>(undefined);
    useEffect(() => {
        setList(storedArtistCollectionDataList[backend_canister_id_yumi_artist_router]);
    }, [storedArtistCollectionDataList]);

    return list;
};

// ============== 合并 Core 和 ArtistRouter 罐子的 data 列表 ==============

export const useCollectionDataList = (): UniqueCollectionData[] => {
    const coreCollectionDataList = useCoreCollectionDataList();
    const artistCollectionDataList = useArtistCollectionDataList();

    const [list, setList] = useState<UniqueCollectionData[]>([]);
    useEffect(() => {
        let collectionDataList: UniqueCollectionData[] = [
            ...(coreCollectionDataList ?? []),
            ...(artistCollectionDataList ?? []),
        ];
        collectionDataList = _.uniqBy(collectionDataList, (item) => item.info.collection); // ! 存在重复可能
        setList(collectionDataList);
    }, [coreCollectionDataList, artistCollectionDataList]);

    return list;
};
