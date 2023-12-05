import { CoreCollectionData } from '@/01_types/yumi';
import { YumiPlatformFee } from '@/03_canisters/yumi/yumi_core';
import {
    canisterQueryYumiCoreCollectionDataList,
    canisterQueryYumiCoreCollectionIdList,
    canisterQueryYumiCorePlatformFee,
} from '@/04_apis/canister-query/yumi/core';
import {
    queryCoreCollectionDataListByBackend,
    queryCoreCollectionIdListByBackend,
    queryYumiPlatformFeeByBackend,
} from '../../canisters/yumi/core';
import { getYumiCoreCanisterId } from '../../canisters/yumi/special';

// 综合 canister-query 和 罐子的接口
export const combinedQueryCoreCollectionIdList = async (
    backend_canister_id: string,
): Promise<string[]> =>
    new Promise((resolve, reject) => {
        canisterQueryYumiCoreCollectionIdList(backend_canister_id)
            .then((d) => {
                if (d) return d;
                return queryCoreCollectionIdListByBackend(backend_canister_id);
            })
            .then(resolve)
            .catch(reject);
    });

// 综合 canister-query 和 罐子的接口
export const combinedQueryCoreCollectionDataList = async (
    backend_canister_id: string,
): Promise<CoreCollectionData[]> =>
    new Promise((resolve, reject) => {
        canisterQueryYumiCoreCollectionDataList(backend_canister_id)
            .then((d) => {
                if (d) return d;
                return queryCoreCollectionDataListByBackend(backend_canister_id);
            })
            .then(resolve)
            .catch(reject);
    });

// 综合 canister-query 和 罐子的接口
export const combinedQueryCorePlatformFee = async (): Promise<YumiPlatformFee> =>
    new Promise((resolve, reject) => {
        const backend_canister_id = getYumiCoreCanisterId();
        canisterQueryYumiCorePlatformFee(backend_canister_id)
            .then((d) => {
                if (d) return d;
                return queryYumiPlatformFeeByBackend(backend_canister_id);
            })
            .then(resolve)
            .catch(reject);
    });
