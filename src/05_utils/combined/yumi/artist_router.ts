import { ArtistCollectionData } from '@/01_types/yumi';
import {
    canisterQueryYumiArtistCollectionDataList,
    canisterQueryYumiArtistCollectionIdList,
} from '@/04_apis/canister-query/yumi/artist_router';
import {
    queryArtistCollectionDataListByBackend,
    queryArtistCollectionIdListByBackend,
} from '../../canisters/yumi/artist_router';

// 综合 canister-query 和 罐子的接口
export const combinedQueryArtistCollectionIdList = async (
    backend_canister_id: string,
): Promise<string[]> =>
    new Promise((resolve, reject) => {
        canisterQueryYumiArtistCollectionIdList(backend_canister_id)
            .then((d) => {
                if (d) return d;
                return queryArtistCollectionIdListByBackend(backend_canister_id);
            })
            .then(resolve)
            .catch(reject);
    });

// 综合 canister-query 和 罐子的接口
export const combinedQueryArtistCollectionDataList = async (
    backend_canister_id: string,
): Promise<ArtistCollectionData[]> =>
    new Promise((resolve, reject) => {
        canisterQueryYumiArtistCollectionDataList(backend_canister_id)
            .then((d) => {
                if (d) return d;
                return queryArtistCollectionDataListByBackend(backend_canister_id);
            })
            .then(resolve)
            .catch(reject);
    });
