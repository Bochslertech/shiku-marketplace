import { OrigynArtCollectionData } from '@/03_canisters/yumi/yumi_origyn_art';
import {
    canisterQueryYumiOrigynArtCollectionDataList,
    canisterQueryYumiOrigynArtCollectionIdList,
} from '@/04_apis/canister-query/yumi/origyn-art';
import {
    queryOrigynArtMarketCollectionDataListByBackend,
    queryOrigynArtMarketCollectionIdListByBackend,
} from '../../canisters/yumi/origyn-art';

// 综合 canister-query 和 罐子的接口
export const combinedQueryOrigynArtCollectionIdList = async (
    backend_canister_id: string,
): Promise<string[]> =>
    new Promise((resolve, reject) => {
        canisterQueryYumiOrigynArtCollectionIdList(backend_canister_id)
            .then((d) => {
                if (d) return d;
                return queryOrigynArtMarketCollectionIdListByBackend(backend_canister_id);
            })
            .then(resolve)
            .catch(reject);
    });

// 综合 canister-query 和 罐子的接口
export const combinedQueryOrigynArtCollectionDataList = async (
    backend_canister_id: string,
): Promise<OrigynArtCollectionData[]> =>
    new Promise((resolve, reject) => {
        canisterQueryYumiOrigynArtCollectionDataList(backend_canister_id)
            .then((d) => {
                if (d) return d;
                return queryOrigynArtMarketCollectionDataListByBackend(backend_canister_id);
            })
            .then(resolve)
            .catch(reject);
    });
