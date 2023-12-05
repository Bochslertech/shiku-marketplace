import { CoreCollectionData } from '@/01_types/yumi';
import { YumiPlatformFee } from '@/03_canisters/yumi/yumi_core';
import { CANISTER_QUERY_HOST } from '../host';
import { canister_query } from '../query';

export const canisterQueryYumiCoreCollectionIdList = async (
    backend_canister_id: string,
): Promise<string[] | undefined> =>
    canister_query(`${CANISTER_QUERY_HOST}/yumi/core/${backend_canister_id}/collection_id`);

export const canisterQueryYumiCoreCollectionDataList = async (
    backend_canister_id: string,
): Promise<CoreCollectionData[] | undefined> =>
    canister_query(`${CANISTER_QUERY_HOST}/yumi/core/${backend_canister_id}/collection_data`);

export const canisterQueryYumiCorePlatformFee = async (
    backend_canister_id: string,
): Promise<YumiPlatformFee | undefined> =>
    canister_query(`${CANISTER_QUERY_HOST}/yumi/core/${backend_canister_id}/platform_fee`);
