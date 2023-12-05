import { OrigynArtCollectionData } from '@/03_canisters/yumi/yumi_origyn_art';
import { CANISTER_QUERY_HOST } from '../host';
import { canister_query } from '../query';

export const canisterQueryYumiOrigynArtCollectionIdList = async (
    backend_canister_id: string,
): Promise<string[] | undefined> =>
    canister_query(`${CANISTER_QUERY_HOST}/yumi/origyn-art/${backend_canister_id}/collection_id`);

export const canisterQueryYumiOrigynArtCollectionDataList = async (
    backend_canister_id: string,
): Promise<OrigynArtCollectionData[] | undefined> =>
    canister_query(`${CANISTER_QUERY_HOST}/yumi/origyn-art/${backend_canister_id}/collection_data`);
