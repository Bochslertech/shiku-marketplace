import { NftTokenMetadata, NftTokenScore } from '@/01_types/nft';
import { CANISTER_QUERY_HOST } from '../host';
import { canister_query } from '../query';

export const canisterQueryNftCollectionMetadata = async (
    collection: string,
): Promise<NftTokenMetadata[] | undefined> =>
    canister_query(`${CANISTER_QUERY_HOST}/nft/${collection}/metadata`);

export const canisterQueryNftCollectionScores = async (
    collection: string,
): Promise<NftTokenScore[] | undefined> =>
    canister_query(`${CANISTER_QUERY_HOST}/nft/${collection}/scores`);
