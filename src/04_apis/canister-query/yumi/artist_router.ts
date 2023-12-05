import { ArtistCollectionData } from '@/01_types/yumi';
import { CANISTER_QUERY_HOST } from '../host';
import { canister_query } from '../query';

export const canisterQueryYumiArtistCollectionIdList = async (
    backend_canister_id: string,
): Promise<string[] | undefined> =>
    canister_query(
        `${CANISTER_QUERY_HOST}/yumi/artist_router/${backend_canister_id}/collection_id`,
    );

export const canisterQueryYumiArtistCollectionDataList = async (
    backend_canister_id: string,
): Promise<ArtistCollectionData[] | undefined> =>
    canister_query(
        `${CANISTER_QUERY_HOST}/yumi/artist_router/${backend_canister_id}/collection_data`,
    );
